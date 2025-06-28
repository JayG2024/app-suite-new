# DNS Configuration for App Suite

## Current Issues
- A records pointing to Netlify IPs can become outdated
- Mixed A + CNAME records can cause routing conflicts
- This setup is causing the redirect/white screen issues

## Recommended Cloudflare DNS Setup

### Delete these records:
```
A    app-suite.io    75.2.60.5    (DELETE)
A    app-suite.io    75.2.70.5    (DELETE)
```

### Add this record instead:
```
CNAME    @    app-suite-new.netlify.app    DNS only    Auto
```

### Keep these records:
```
CNAME    www             app-suite-new.netlify.app    DNS only    Auto
MX       send            feedback-smtp.us-east-1.amazonses.com    10    DNS only    1 hr
TXT      resend._domainkey    [keep existing value]    DNS only    1 hr
TXT      send            "v=spf1 include:amazonses.com -all"    DNS only    1 hr
```

## Why This Works Better

1. **CNAME flattening**: Cloudflare automatically handles root domain CNAMEs
2. **Auto-updates**: If Netlify changes IPs, you don't need to update
3. **Single source**: Netlify controls all redirects and routing
4. **No conflicts**: Eliminates the A record vs CNAME conflicts

## After Making Changes

1. Wait 5-10 minutes for DNS propagation
2. Clear browser cache completely
3. Test both URLs:
   - https://app-suite.io (should work)
   - https://www.app-suite.io (should redirect to non-www)

## Important Settings in Cloudflare

1. **SSL/TLS**: Set to "Flexible" or "Full"
2. **Page Rules**: Delete any redirect rules for app-suite.io
3. **Proxy Status**: Keep as "DNS only" (gray cloud)
4. **Caching**: Under Caching → Configuration → Purge Everything

## Verify in Netlify

1. Go to Domain settings
2. Ensure primary domain is set to `app-suite.io`
3. `www.app-suite.io` should be listed as a domain alias
4. Both should show "Netlify DNS" or "External DNS" with green checkmarks