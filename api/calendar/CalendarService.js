// Core Calendar Service - Reusable across all apps
const { google } = require('googleapis');
const { DateTime } = require('luxon');
const crypto = require('crypto');
const calendarConfig = require('./config');

class CalendarService {
  constructor(credentials) {
    this.credentials = credentials;
    this.calendar = null;
    this.auth = null;
    this.initialized = false;
  }

  /**
   * Initialize Google Calendar API with OAuth credentials
   */
  async initialize() {
    try {
      this.auth = new google.auth.OAuth2(
        calendarConfig.google.clientId,
        calendarConfig.google.clientSecret,
        calendarConfig.google.redirectUri
      );

      if (this.credentials.refresh_token) {
        this.auth.setCredentials(this.credentials);
        this.calendar = google.calendar({ version: 'v3', auth: this.auth });
        this.initialized = true;
        console.log('✅ Calendar service initialized successfully');
      } else {
        throw new Error('No refresh token available');
      }
    } catch (error) {
      console.error('❌ Failed to initialize calendar service:', error.message);
      throw error;
    }
  }

  /**
   * Get OAuth authorization URL for initial setup
   */
  getAuthUrl() {
    const auth = new google.auth.OAuth2(
      calendarConfig.google.clientId,
      calendarConfig.google.clientSecret,
      calendarConfig.google.redirectUri
    );

    return auth.generateAuthUrl({
      access_type: 'offline',
      scope: calendarConfig.google.scopes,
      prompt: 'consent'
    });
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForTokens(authCode) {
    const auth = new google.auth.OAuth2(
      calendarConfig.google.clientId,
      calendarConfig.google.clientSecret,
      calendarConfig.google.redirectUri
    );

    const { tokens } = await auth.getToken(authCode);
    return tokens;
  }

  /**
   * Get available time slots for booking
   */
  async getAvailableSlots(options = {}) {
    if (!this.initialized) await this.initialize();

    const {
      startDate = DateTime.now().plus({ days: 1 }),
      endDate = DateTime.now().plus({ days: 14 }),
      meetingDuration = calendarConfig.defaultSettings.defaultMeetingDuration,
      calendarId = 'primary',
      timeZone = calendarConfig.defaultSettings.timeZone
    } = options;

    try {
      // Get busy times from calendar
      const freebusy = await this.calendar.freebusy.query({
        requestBody: {
          timeMin: startDate.toISO(),
          timeMax: endDate.toISO(),
          timeZone: timeZone,
          items: [{ id: calendarId }]
        }
      });

      const busyTimes = freebusy.data.calendars[calendarId]?.busy || [];
      
      // Generate available slots
      const availableSlots = this.generateTimeSlots(
        startDate,
        endDate,
        busyTimes,
        meetingDuration,
        timeZone
      );

      return availableSlots;
    } catch (error) {
      console.error('❌ Error getting available slots:', error.message);
      throw new Error('Failed to get available time slots');
    }
  }

  /**
   * Generate time slots considering business hours and busy times
   */
  generateTimeSlots(startDate, endDate, busyTimes, duration, timeZone) {
    const slots = [];
    const settings = calendarConfig.defaultSettings;
    
    // Convert busy times to DateTime objects
    const busyPeriods = busyTimes.map(busy => ({
      start: DateTime.fromISO(busy.start).setZone(timeZone),
      end: DateTime.fromISO(busy.end).setZone(timeZone)
    }));

    // Iterate through each day
    let currentDate = startDate.setZone(timeZone).startOf('day');
    const endDateTime = endDate.setZone(timeZone);

    while (currentDate <= endDateTime) {
      const dayName = currentDate.toFormat('cccc').toLowerCase();
      const businessHours = settings.businessHours[dayName];

      // Skip if day is not enabled for business
      if (!businessHours?.enabled) {
        currentDate = currentDate.plus({ days: 1 });
        continue;
      }

      // Parse business hours for this day
      const dayStart = currentDate.set({
        hour: parseInt(businessHours.start.split(':')[0]),
        minute: parseInt(businessHours.start.split(':')[1]),
        second: 0
      });

      const dayEnd = currentDate.set({
        hour: parseInt(businessHours.end.split(':')[0]),
        minute: parseInt(businessHours.end.split(':')[1]),
        second: 0
      });

      // Generate slots for this day
      let slotStart = dayStart;
      while (slotStart.plus({ minutes: duration }) <= dayEnd) {
        const slotEnd = slotStart.plus({ minutes: duration });

        // Check if slot conflicts with busy times
        const isConflict = busyPeriods.some(busy => 
          (slotStart < busy.end && slotEnd > busy.start)
        );

        // Check minimum advance time
        const now = DateTime.now().setZone(timeZone);
        const isAdvanceTimeValid = slotStart >= now.plus({ hours: settings.minAdvanceHours });

        if (!isConflict && isAdvanceTimeValid) {
          slots.push({
            id: crypto.randomUUID(),
            startTime: slotStart.toISO(),
            endTime: slotEnd.toISO(),
            displayTime: slotStart.toFormat('cccc, MMMM d \'at\' h:mm a'),
            date: slotStart.toFormat('yyyy-MM-dd'),
            time: slotStart.toFormat('h:mm a'),
            duration: duration,
            available: true
          });
        }

        // Move to next slot (duration + buffer time)
        slotStart = slotStart.plus({ minutes: duration + settings.bufferTime });
      }

      currentDate = currentDate.plus({ days: 1 });
    }

    // Limit to reasonable number of slots
    return slots.slice(0, 20);
  }

  /**
   * Book a meeting in the calendar
   */
  async bookMeeting(bookingData) {
    if (!this.initialized) await this.initialize();

    const {
      slotId,
      startTime,
      endTime,
      meetingType = 'demo',
      customerName,
      customerEmail,
      customerPhone = '',
      customerWebsite = '',
      customerNotes = '',
      appName = '',
      appCategory = '',
      calendarId = 'primary'
    } = bookingData;

    try {
      const meetingConfig = calendarConfig.meetingTypes[meetingType];
      const eventId = `app-suite-${Date.now()}-${crypto.randomUUID().substring(0, 8)}`;

      // Create calendar event
      const event = {
        id: eventId,
        summary: `${meetingConfig.name} - ${customerName}`,
        description: this.buildEventDescription(bookingData),
        start: {
          dateTime: startTime,
          timeZone: calendarConfig.defaultSettings.timeZone
        },
        end: {
          dateTime: endTime,
          timeZone: calendarConfig.defaultSettings.timeZone
        },
        attendees: [
          { email: customerEmail, displayName: customerName }
        ],
        conferenceData: {
          createRequest: {
            requestId: crypto.randomUUID(),
            conferenceSolutionKey: { type: 'hangoutsMeet' }
          }
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 24 hours
            { method: 'email', minutes: 60 },      // 1 hour
            { method: 'popup', minutes: 10 }       // 10 minutes
          ]
        },
        colorId: this.getColorId(meetingType)
      };

      const response = await this.calendar.events.insert({
        calendarId: calendarId,
        conferenceDataVersion: 1,
        sendUpdates: 'all',
        requestBody: event
      });

      console.log('✅ Meeting booked successfully:', response.data.htmlLink);

      return {
        success: true,
        eventId: response.data.id,
        eventUrl: response.data.htmlLink,
        meetUrl: response.data.hangoutLink,
        booking: {
          ...bookingData,
          eventId: response.data.id,
          meetUrl: response.data.hangoutLink,
          confirmationNumber: eventId.split('-').pop()
        }
      };

    } catch (error) {
      console.error('❌ Error booking meeting:', error.message);
      throw new Error('Failed to book meeting: ' + error.message);
    }
  }

  /**
   * Cancel a meeting
   */
  async cancelMeeting(eventId, calendarId = 'primary') {
    if (!this.initialized) await this.initialize();

    try {
      await this.calendar.events.delete({
        calendarId: calendarId,
        eventId: eventId,
        sendUpdates: 'all'
      });

      console.log('✅ Meeting cancelled successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Error cancelling meeting:', error.message);
      throw new Error('Failed to cancel meeting');
    }
  }

  /**
   * Reschedule a meeting
   */
  async rescheduleMeeting(eventId, newStartTime, newEndTime, calendarId = 'primary') {
    if (!this.initialized) await this.initialize();

    try {
      // Get existing event
      const existingEvent = await this.calendar.events.get({
        calendarId: calendarId,
        eventId: eventId
      });

      // Update times
      const updatedEvent = {
        ...existingEvent.data,
        start: {
          dateTime: newStartTime,
          timeZone: calendarConfig.defaultSettings.timeZone
        },
        end: {
          dateTime: newEndTime,
          timeZone: calendarConfig.defaultSettings.timeZone
        }
      };

      const response = await this.calendar.events.update({
        calendarId: calendarId,
        eventId: eventId,
        sendUpdates: 'all',
        requestBody: updatedEvent
      });

      console.log('✅ Meeting rescheduled successfully');
      return { success: true, event: response.data };
    } catch (error) {
      console.error('❌ Error rescheduling meeting:', error.message);
      throw new Error('Failed to reschedule meeting');
    }
  }

  /**
   * Build event description with all customer details
   */
  buildEventDescription(bookingData) {
    const {
      customerName,
      customerEmail,
      customerPhone,
      customerWebsite,
      customerNotes,
      appName,
      appCategory,
      meetingType
    } = bookingData;

    const meetingConfig = calendarConfig.meetingTypes[meetingType];

    return `
${meetingConfig.description}

Customer Information:
• Name: ${customerName}
• Email: ${customerEmail}
• Phone: ${customerPhone || 'Not provided'}
• Website: ${customerWebsite || 'Not provided'}

Interest:
• App: ${appName}
• Category: ${appCategory}

Customer Notes:
${customerNotes || 'None provided'}

---
🤖 Booked via AI Assistant
📅 Managed by App Suite Calendar System
    `.trim();
  }

  /**
   * Get calendar color ID for meeting type
   */
  getColorId(meetingType) {
    const colorMap = {
      demo: '1',        // Blue
      consultation: '2', // Green  
      discovery: '5',   // Yellow
      followup: '11'    // Red
    };
    return colorMap[meetingType] || '1';
  }

  /**
   * Get meeting statistics
   */
  async getMeetingStats(calendarId = 'primary', days = 30) {
    if (!this.initialized) await this.initialize();

    try {
      const startDate = DateTime.now().minus({ days }).toISO();
      const endDate = DateTime.now().toISO();

      const events = await this.calendar.events.list({
        calendarId: calendarId,
        timeMin: startDate,
        timeMax: endDate,
        q: 'App Suite',
        singleEvents: true,
        orderBy: 'startTime'
      });

      const meetings = events.data.items || [];
      
      return {
        totalMeetings: meetings.length,
        upcomingMeetings: meetings.filter(event => 
          DateTime.fromISO(event.start.dateTime) > DateTime.now()
        ).length,
        completedMeetings: meetings.filter(event => 
          DateTime.fromISO(event.start.dateTime) < DateTime.now()
        ).length,
        meetingTypes: this.groupMeetingsByType(meetings)
      };
    } catch (error) {
      console.error('❌ Error getting meeting stats:', error.message);
      return null;
    }
  }

  /**
   * Group meetings by type for analytics
   */
  groupMeetingsByType(meetings) {
    const types = {};
    meetings.forEach(meeting => {
      const summary = meeting.summary || '';
      let type = 'other';
      
      if (summary.includes('Demo')) type = 'demo';
      else if (summary.includes('Consultation')) type = 'consultation';
      else if (summary.includes('Discovery')) type = 'discovery';
      else if (summary.includes('Follow-up')) type = 'followup';
      
      types[type] = (types[type] || 0) + 1;
    });
    return types;
  }
}

module.exports = CalendarService;