// Google Calendar API Configuration
require('dotenv').config();

const calendarConfig = {
  // Google API Settings
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/calendar/callback',
    scopes: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ]
  },

  // Default Business Settings (can be overridden per client)
  defaultSettings: {
    timeZone: 'America/New_York',
    businessHours: {
      monday: { start: '09:00', end: '17:00', enabled: true },
      tuesday: { start: '09:00', end: '17:00', enabled: true },
      wednesday: { start: '09:00', end: '17:00', enabled: true },
      thursday: { start: '09:00', end: '17:00', enabled: true },
      friday: { start: '09:00', end: '17:00', enabled: true },
      saturday: { start: '10:00', end: '14:00', enabled: false },
      sunday: { start: '10:00', end: '14:00', enabled: false }
    },
    bufferTime: 15, // minutes between meetings
    defaultMeetingDuration: 30, // minutes
    advanceBookingDays: 60, // how far in advance can people book
    minAdvanceHours: 2, // minimum hours in advance for booking
    maxDailyMeetings: 8
  },

  // Meeting Types
  meetingTypes: {
    demo: {
      id: 'demo',
      name: 'Product Demo',
      duration: 30,
      description: 'See how our AI-powered solutions work',
      color: '#4285F4'
    },
    consultation: {
      id: 'consultation',
      name: 'Strategy Consultation',
      duration: 60,
      description: 'Discuss your custom application needs',
      color: '#0F9D58'
    },
    discovery: {
      id: 'discovery',
      name: 'Discovery Call',
      duration: 45,
      description: 'Initial project scoping and requirements',
      color: '#F4B400'
    },
    followup: {
      id: 'followup',
      name: 'Follow-up Meeting',
      duration: 30,
      description: 'Review progress and next steps',
      color: '#DB4437'
    }
  },

  // Email Templates
  emailTemplates: {
    confirmation: {
      subject: 'Meeting Confirmed: {{meetingType}} on {{date}}',
      template: `
Hi {{customerName}},

Your {{meetingType}} is confirmed for {{date}} at {{time}}.

Meeting Details:
• Topic: {{meetingType}}
• Duration: {{duration}} minutes
• Join URL: {{meetUrl}}

What to Expect:
{{meetingDescription}}

If you need to reschedule or have questions, reply to this email or call us.

Best regards,
{{hostName}}
App Suite Team

---
🤖 This meeting was scheduled with our AI assistant
      `
    },
    reminder: {
      subject: 'Reminder: {{meetingType}} tomorrow at {{time}}',
      template: `
Hi {{customerName}},

Just a friendly reminder about your {{meetingType}} tomorrow:

📅 {{date}} at {{time}}
🔗 Join here: {{meetUrl}}
⏱️ Duration: {{duration}} minutes

We're looking forward to speaking with you!

Best regards,
{{hostName}}
      `
    },
    hostNotification: {
      subject: 'New Meeting Booked: {{customerName}} - {{meetingType}}',
      template: `
New meeting booked via AI chatbot:

Customer: {{customerName}}
Email: {{customerEmail}}
Phone: {{customerPhone}}
Website: {{customerWebsite}}

Meeting Details:
• Type: {{meetingType}}
• Date/Time: {{date}} at {{time}}
• Duration: {{duration}} minutes
• Calendar: {{calendarUrl}}

Customer Notes:
{{customerNotes}}

App Interest: {{appName}} ({{appCategory}})
      `
    }
  }
};

module.exports = calendarConfig;