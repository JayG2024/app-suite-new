// Main Calendar API Entry Point
const express = require('express');
const cors = require('cors');
const calendarRoutes = require('./calendar/routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/calendar', calendarRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'App Suite Calendar API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use((error, req, res, next) => {
  console.error('❌ API Error:', error.message);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint not found' 
  });
});

const PORT = process.env.CALENDAR_API_PORT || 3001;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`
🚀 App Suite Calendar API running on port ${PORT}

📋 Available endpoints:
   GET  /api/health                    - Health check
   GET  /api/calendar/auth             - Get OAuth URL
   GET  /api/calendar/callback         - OAuth callback
   GET  /api/calendar/availability     - Get available slots
   POST /api/calendar/book             - Book a meeting
   PUT  /api/calendar/reschedule/:id   - Reschedule meeting
   DELETE /api/calendar/cancel/:id     - Cancel meeting
   GET  /api/calendar/stats            - Meeting statistics
   GET  /api/calendar/config           - Get configuration

🔗 Next steps:
   1. Visit /api/calendar/auth to authorize Google Calendar
   2. Update your .env file with credentials
   3. Test with /api/calendar/availability

💡 Pro tip: Check the console for detailed logs
    `);
  });
}

module.exports = app;