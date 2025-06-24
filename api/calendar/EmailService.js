// Email Service for Calendar Notifications
const calendarConfig = require('./config');

class EmailService {
  constructor(emailProvider) {
    this.emailProvider = emailProvider; // Will integrate with your existing email service
  }

  /**
   * Send booking confirmation to customer
   */
  async sendBookingConfirmation(bookingData) {
    try {
      const template = calendarConfig.emailTemplates.confirmation;
      const meetingConfig = calendarConfig.meetingTypes[bookingData.meetingType];
      
      const emailData = {
        to: bookingData.customerEmail,
        subject: this.processTemplate(template.subject, {
          meetingType: meetingConfig.name,
          date: this.formatDate(bookingData.startTime)
        }),
        html: this.processTemplate(template.template, {
          customerName: bookingData.customerName,
          meetingType: meetingConfig.name,
          date: this.formatDate(bookingData.startTime),
          time: this.formatTime(bookingData.startTime),
          duration: meetingConfig.duration,
          meetUrl: bookingData.meetUrl,
          meetingDescription: meetingConfig.description,
          hostName: 'Jason Gordon'
        })
      };

      // Here you'd integrate with your email service (SendGrid, Resend, etc.)
      console.log('📧 Sending confirmation email to:', bookingData.customerEmail);
      
      // Placeholder for actual email sending
      // await this.emailProvider.send(emailData);
      
      return { success: true, emailData };
    } catch (error) {
      console.error('❌ Error sending confirmation email:', error.message);
      throw error;
    }
  }

  /**
   * Send notification to host about new booking
   */
  async sendHostNotification(bookingData) {
    try {
      const template = calendarConfig.emailTemplates.hostNotification;
      const meetingConfig = calendarConfig.meetingTypes[bookingData.meetingType];
      
      const emailData = {
        to: 'jason@jaydus.ai', // Your email
        subject: this.processTemplate(template.subject, {
          customerName: bookingData.customerName,
          meetingType: meetingConfig.name
        }),
        html: this.processTemplate(template.template, {
          customerName: bookingData.customerName,
          customerEmail: bookingData.customerEmail,
          customerPhone: bookingData.customerPhone || 'Not provided',
          customerWebsite: bookingData.customerWebsite || 'Not provided',
          meetingType: meetingConfig.name,
          date: this.formatDate(bookingData.startTime),
          time: this.formatTime(bookingData.startTime),
          duration: meetingConfig.duration,
          calendarUrl: bookingData.eventUrl,
          customerNotes: bookingData.customerNotes || 'None provided',
          appName: bookingData.appName,
          appCategory: bookingData.appCategory
        })
      };

      console.log('📧 Sending host notification');
      
      // Placeholder for actual email sending
      // await this.emailProvider.send(emailData);
      
      return { success: true, emailData };
    } catch (error) {
      console.error('❌ Error sending host notification:', error.message);
      throw error;
    }
  }

  /**
   * Send reminder email 24 hours before meeting
   */
  async sendReminder(bookingData) {
    try {
      const template = calendarConfig.emailTemplates.reminder;
      const meetingConfig = calendarConfig.meetingTypes[bookingData.meetingType];
      
      const emailData = {
        to: bookingData.customerEmail,
        subject: this.processTemplate(template.subject, {
          meetingType: meetingConfig.name,
          time: this.formatTime(bookingData.startTime)
        }),
        html: this.processTemplate(template.template, {
          customerName: bookingData.customerName,
          meetingType: meetingConfig.name,
          date: this.formatDate(bookingData.startTime),
          time: this.formatTime(bookingData.startTime),
          duration: meetingConfig.duration,
          meetUrl: bookingData.meetUrl,
          hostName: 'Jason Gordon'
        })
      };

      console.log('📧 Sending reminder email');
      
      // Placeholder for actual email sending
      // await this.emailProvider.send(emailData);
      
      return { success: true, emailData };
    } catch (error) {
      console.error('❌ Error sending reminder email:', error.message);
      throw error;
    }
  }

  /**
   * Process email template with variables
   */
  processTemplate(template, variables) {
    let processed = template;
    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processed = processed.replace(regex, variables[key] || '');
    });
    return processed;
  }

  /**
   * Format date for email templates
   */
  formatDate(isoString) {
    const { DateTime } = require('luxon');
    return DateTime.fromISO(isoString)
      .setZone(calendarConfig.defaultSettings.timeZone)
      .toFormat('EEEE, MMMM d, yyyy');
  }

  /**
   * Format time for email templates
   */
  formatTime(isoString) {
    const { DateTime } = require('luxon');
    return DateTime.fromISO(isoString)
      .setZone(calendarConfig.defaultSettings.timeZone)
      .toFormat('h:mm a ZZZZ');
  }

  /**
   * Schedule reminder emails (would integrate with job queue)
   */
  async scheduleReminders(bookingData) {
    const { DateTime } = require('luxon');
    const meetingTime = DateTime.fromISO(bookingData.startTime);
    const reminderTime = meetingTime.minus({ hours: 24 });

    // Here you'd schedule the reminder with a job queue (Bull, Agenda, etc.)
    console.log(`📅 Reminder scheduled for: ${reminderTime.toISO()}`);
    
    return {
      reminderScheduled: true,
      reminderTime: reminderTime.toISO()
    };
  }
}

module.exports = EmailService;