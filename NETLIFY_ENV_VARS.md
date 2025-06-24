# Netlify Environment Variables

Add these environment variables to your Netlify site:

1. Go to: https://app.netlify.com/sites/app-suite-new/configuration/env
2. Click "Add a variable"
3. Add these variables:

## Required Variables:

### DATABASE_URL
```
postgresql://neondb_owner:npg_PNKhwVk18jzs@ep-morning-math-a46r9c11-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### VITE_SITE_URL
```
https://www.app-suite.io
```

## Optional Variables (for email functionality):

### EMAIL_FROM
```
noreply@app-suite.io
```

### SENDGRID_API_KEY
```
(your SendGrid API key if you want to enable email)
```

After adding these variables, redeploy your site or trigger a new build.