# Admin Dashboard Guide

## 🔐 Login URL
**Main Login**: `/admin`
- This is the single entry point for the dashboard
- Alternative URLs `/dashboard` and `/manage` redirect here

## 📍 Dashboard Section URLs

Once logged in, each section has its own unique URL:

### Main Sections
- **Overview**: `/admin` or `/admin/overview`
- **Gmail Inbox**: `/admin/gmail`
- **Clients**: `/admin/clients`
- **Projects**: `/admin/projects`
- **Tasks**: `/admin/tasks`
- **Sales Pipeline**: `/admin/sales`
- **Marketing Hub**: `/admin/marketing`
- **Finance**: `/admin/finance`
- **Analytics**: `/admin/analytics`
- **Team**: `/admin/team`
- **Email Templates**: `/admin/templates`

### Special Tools
- **ASC.AI Development**: `/admin/asc-ai`
- **Call Transcript Analyzer**: `/admin/call-analyzer`
- **Deployments**: `/admin/deployments` (optional - can be hidden)

## ✅ Fixed Issues

### 1. **Call Analyzer**
- Now uses enhanced AI analysis at `analyze-transcript-v2`
- Better error handling (no more white pages)
- Deep pain point analysis with emotional context
- Beautiful PDF export with colors

### 2. **Chatbot**
- Updated to use Anthropic Claude AI
- Endpoint: `/.netlify/functions/chatbot-ai`
- Trained on App Suite context
- No more generic responses

### 3. **Email Service (Resend)**
- Already configured at `/.netlify/functions/send-email-resend`
- Supports all email types (proposals, invoices, updates)
- Uses `RESEND_API_KEY` environment variable

## 🧪 Testing Checklist

### 1. Test Login
```
Go to: https://app-suite.io/admin
Login with your credentials
```

### 2. Test Navigation
- Click each menu item
- Verify URL changes to `/admin/[section]`
- Check that content loads properly

### 3. Test Call Analyzer
```
1. Go to: /admin/call-analyzer
2. Paste a call transcript
3. Click "Analyze Call"
4. Should see detailed analysis
5. Test PDF download
```

### 4. Test Chatbot
```
1. Click chatbot icon (bottom right)
2. Ask: "What does App Suite do?"
3. Should get intelligent, contextual response
4. Not generic hardcoded answers
```

### 5. Test Email
```
1. Go to: /admin/clients
2. Create/send a test proposal
3. Check email delivery
```

## 🚨 Known Issues & Solutions

### White Page Issues
If any section shows a white page:
1. Check browser console for errors
2. Check Netlify function logs
3. Verify all environment variables are set

### Marketing Page
The marketing hub component exists at:
`/src/components/MarketingHub.tsx`
If it's not loading, check for import errors.

### Deployment Page
If you don't need deployments right now, we can hide it from the menu.

## 🔧 Environment Variables Required

Make sure these are set in Netlify:
```
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
RESEND_API_KEY=re_xxxxx
```

## 📊 Monitoring

Check function logs at:
1. Netlify Dashboard → Functions
2. Look for:
   - `chatbot-ai` - For chatbot responses
   - `analyze-transcript-v2` - For call analysis
   - `send-email-resend` - For email sending
   - `asc-generate` - For ASC.AI code generation