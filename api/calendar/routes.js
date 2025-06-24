// Calendar API Routes
const express = require('express');
const { DateTime } = require('luxon');
const CalendarService = require('./CalendarService');
const EmailService = require('./EmailService');
const calendarConfig = require('./config');

const router = express.Router();

// Initialize services (you'll need to set up credentials)
let calendarService;
let emailService;

// Initialize calendar service with stored credentials
async function initializeServices() {
  try {
    // TODO: Load credentials from your secure storage (database, env vars, etc.)
    const credentials = {
      access_token: process.env.GOOGLE_ACCESS_TOKEN,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      scope: 'https://www.googleapis.com/auth/calendar',
      token_type: 'Bearer'
    };

    calendarService = new CalendarService(credentials);
    emailService = new EmailService(); // Your email provider here
    
    console.log('✅ Calendar services initialized');
  } catch (error) {
    console.error('❌ Failed to initialize services:', error.message);
  }
}

// Initialize on startup
initializeServices();

/**
 * GET /api/calendar/auth
 * Get Google OAuth authorization URL
 */
router.get('/auth', (req, res) => {
  try {
    if (!calendarService) {
      calendarService = new CalendarService({});
    }
    
    const authUrl = calendarService.getAuthUrl();
    res.json({ 
      success: true, 
      authUrl,
      message: 'Visit this URL to authorize calendar access'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * GET /api/calendar/callback
 * Handle OAuth callback and exchange code for tokens
 */
router.get('/callback', async (req, res) => {
  try {
    const { code } = req.query;
    
    if (!code) {
      return res.status(400).json({ 
        success: false, 
        error: 'Authorization code required' 
      });
    }

    const tokens = await calendarService.exchangeCodeForTokens(code);
    
    // TODO: Store tokens securely in your database
    console.log('✅ Tokens received:', { 
      hasAccessToken: !!tokens.access_token,
      hasRefreshToken: !!tokens.refresh_token 
    });

    res.json({ 
      success: true, 
      message: 'Calendar access authorized successfully',
      tokens: {
        access_token: tokens.access_token?.substring(0, 10) + '...',
        expires_in: tokens.expiry_date
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * GET /api/calendar/availability
 * Get available time slots for booking
 */
router.get('/availability', async (req, res) => {
  try {
    if (!calendarService) {
      return res.status(500).json({ 
        success: false, 
        error: 'Calendar service not initialized' 
      });
    }

    const {
      startDate,
      endDate,
      meetingType = 'demo',
      timezone = 'America/New_York'
    } = req.query;

    const meetingConfig = calendarConfig.meetingTypes[meetingType];
    if (!meetingConfig) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid meeting type' 
      });
    }

    const options = {
      startDate: startDate ? DateTime.fromISO(startDate) : DateTime.now().plus({ days: 1 }),
      endDate: endDate ? DateTime.fromISO(endDate) : DateTime.now().plus({ days: 14 }),
      meetingDuration: meetingConfig.duration,
      timeZone: timezone
    };

    const availableSlots = await calendarService.getAvailableSlots(options);

    res.json({
      success: true,
      availableSlots,
      meetingType: meetingConfig,
      totalSlots: availableSlots.length,
      timezone: timezone
    });

  } catch (error) {
    console.error('❌ Error getting availability:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * POST /api/calendar/book
 * Book a meeting
 */
router.post('/book', async (req, res) => {
  try {
    if (!calendarService) {
      return res.status(500).json({ 
        success: false, 
        error: 'Calendar service not initialized' 
      });
    }

    const {
      slotId,
      startTime,
      endTime,
      meetingType = 'demo',
      customerName,
      customerEmail,
      customerPhone,
      customerWebsite,
      customerNotes,
      appName,
      appCategory
    } = req.body;

    // Validate required fields
    if (!startTime || !endTime || !customerName || !customerEmail) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: startTime, endTime, customerName, customerEmail' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid email format' 
      });
    }

    // Validate meeting type
    if (!calendarConfig.meetingTypes[meetingType]) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid meeting type' 
      });
    }

    // Book the meeting
    const bookingData = {
      slotId,
      startTime,
      endTime,
      meetingType,
      customerName,
      customerEmail,
      customerPhone: customerPhone || '',
      customerWebsite: customerWebsite || '',
      customerNotes: customerNotes || '',
      appName: appName || '',
      appCategory: appCategory || ''
    };

    const bookingResult = await calendarService.bookMeeting(bookingData);

    if (bookingResult.success) {
      // Send confirmation emails
      try {
        await emailService.sendBookingConfirmation({
          ...bookingData,
          meetUrl: bookingResult.meetUrl,
          eventUrl: bookingResult.eventUrl
        });

        await emailService.sendHostNotification({
          ...bookingData,
          meetUrl: bookingResult.meetUrl,
          eventUrl: bookingResult.eventUrl
        });

        // Schedule reminder
        await emailService.scheduleReminders({
          ...bookingData,
          meetUrl: bookingResult.meetUrl
        });

      } catch (emailError) {
        console.error('⚠️ Email sending failed:', emailError.message);
        // Don't fail the booking if email fails
      }

      res.json({
        success: true,
        booking: bookingResult.booking,
        message: 'Meeting booked successfully',
        eventId: bookingResult.eventId,
        meetUrl: bookingResult.meetUrl,
        confirmationNumber: bookingResult.booking.confirmationNumber
      });

    } else {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to book meeting' 
      });
    }

  } catch (error) {
    console.error('❌ Error booking meeting:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * PUT /api/calendar/reschedule/:eventId
 * Reschedule a meeting
 */
router.put('/reschedule/:eventId', async (req, res) => {
  try {
    if (!calendarService) {
      return res.status(500).json({ 
        success: false, 
        error: 'Calendar service not initialized' 
      });
    }

    const { eventId } = req.params;
    const { newStartTime, newEndTime } = req.body;

    if (!newStartTime || !newEndTime) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: newStartTime, newEndTime' 
      });
    }

    const result = await calendarService.rescheduleMeeting(
      eventId, 
      newStartTime, 
      newEndTime
    );

    res.json({
      success: true,
      message: 'Meeting rescheduled successfully',
      event: result.event
    });

  } catch (error) {
    console.error('❌ Error rescheduling meeting:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * DELETE /api/calendar/cancel/:eventId
 * Cancel a meeting
 */
router.delete('/cancel/:eventId', async (req, res) => {
  try {
    if (!calendarService) {
      return res.status(500).json({ 
        success: false, 
        error: 'Calendar service not initialized' 
      });
    }

    const { eventId } = req.params;
    const result = await calendarService.cancelMeeting(eventId);

    res.json({
      success: true,
      message: 'Meeting cancelled successfully'
    });

  } catch (error) {
    console.error('❌ Error cancelling meeting:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * GET /api/calendar/stats
 * Get meeting statistics
 */
router.get('/stats', async (req, res) => {
  try {
    if (!calendarService) {
      return res.status(500).json({ 
        success: false, 
        error: 'Calendar service not initialized' 
      });
    }

    const { days = 30 } = req.query;
    const stats = await calendarService.getMeetingStats('primary', parseInt(days));

    res.json({
      success: true,
      stats,
      period: `${days} days`
    });

  } catch (error) {
    console.error('❌ Error getting stats:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * GET /api/calendar/config
 * Get calendar configuration (for frontend)
 */
router.get('/config', (req, res) => {
  res.json({
    success: true,
    config: {
      meetingTypes: calendarConfig.meetingTypes,
      businessHours: calendarConfig.defaultSettings.businessHours,
      timeZone: calendarConfig.defaultSettings.timeZone,
      minAdvanceHours: calendarConfig.defaultSettings.minAdvanceHours,
      maxAdvanceBookingDays: calendarConfig.defaultSettings.advanceBookingDays
    }
  });
});

module.exports = router;