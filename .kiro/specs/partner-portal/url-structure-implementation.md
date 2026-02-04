# URL Structure and Domain Management Implementation

## Overview

This document describes the implementation of flexible URL structure and domain management for the partner portal, supporting three access methods:

1. **Standard Path**: `/partners/portal` on the main site
2. **Custom Subdomain**: `partner.app-suite.io`
3. **Custom Domain**: `portal.partnercompany.com`

All three methods provide consistent functionality with appropriate branding levels.

## Architecture

### Core Components

#### 1. Domain Detection (`src/lib/domainDetection.ts`)

Detects the current domain configuration and determines access method:

```typescript
interface DomainConfig {
  type: 'main-site' | 'partner-path' | 'partner-subdomain' | 'partner-custom-domain'
  partnerId?: string
  partnerDomain?: string
  isWhiteLabel: boolean
  brandingLevel?: 'co-branded' | 'partner-primary' | 'full-white-label'
}
```

**Key Functions:**
- `detectDomainConfig()`: Analyzes hostname and pathname to determine access method
- `getBaseUrl()`: Returns appropriate base URL for the current domain
- `getPortalUrl(path)`: Constructs portal URLs based on domain configuration
- `isWhiteLabelAccess()`: Checks if current access is via white-label domain
- `getBrandingLevel()`: Returns the branding level for current domain

#### 2. Partner Domain Service (`src/services/partnerDomainService.ts`)

Manages partner domain configurations in the database:

**Key Functions:**
- `getPartnerDomains(partnerId)`: Fetches all domains for a partner
- `findPartnerByDomain(domain)`: Looks up partner by their custom domain
- `createPartnerDomain()`: Creates new domain configuration
- `updatePartnerDomain()`: Updates domain status and configuration
- `validateDomain()`: Validates domain format and availability
- `getDomainSetupInstructions()`: Provides setup steps for domain configuration
- `checkDnsConfiguration()`: Verifies DNS records are configured correctly

#### 3. Domain Config Context (`src/contexts/DomainConfigContext.tsx`)

Provides domain configuration throughout the application:

```typescript
interface DomainConfigContextType {
  config: DomainConfig
  partnerId: string | null
  loading: boolean
  getUrl: (path: string) => string
  isWhiteLabel: boolean
  brandingLevel: 'co-branded' | 'partner-primary' | 'full-white-label' | null
}
```

#### 4. Partner URL Hook (`src/hooks/usePartnerUrl.ts`)

Custom hook for domain-aware navigation:

```typescript
const { getPortalUrl, navigateToPortal, getDashboardUrl, isCurrentPath } = usePartnerUrl()
```

#### 5. Partner Domain Manager (`src/components/PartnerDomainManager.tsx`)

UI component for partners to configure custom domains and subdomains.

## URL Mapping

### Standard Path Access
- Base: `https://app-suite.io/partners/portal`
- Dashboard: `/partners/portal`
- Pricing: `/partners/portal/pricing`
- Resources: `/partners/portal/resources`
- Quotes: `/partners/portal/quotes`
- Settings: `/partners/portal/settings`

### Subdomain Access
- Base: `https://acme.app-suite.io`
- Dashboard: `/`
- Pricing: `/pricing`
- Resources: `/resources`
- Quotes: `/quotes`
- Settings: `/settings`

### Custom Domain Access
- Base: `https://portal.acmecorp.com`
- Dashboard: `/`
- Pricing: `/pricing`
- Resources: `/resources`
- Quotes: `/quotes`
- Settings: `/settings`

## Branding Levels

### Co-Branded (Standard Path)
- Shows both App Suite and partner branding
- Standard navigation with `/partners/portal` prefix
- Partner logo and info displayed alongside App Suite branding

### Partner-Primary (Subdomain)
- Partner branding is primary
- App Suite branding is secondary or minimal
- Clean URLs without `/partners/portal` prefix
- Subdomain format: `partner.app-suite.io`

### Full White-Label (Custom Domain)
- Only partner branding visible
- No App Suite branding shown
- Complete brand replacement
- Partner's own domain: `portal.partner.com`

## Database Schema

### partner_domains Table

```sql
CREATE TABLE partner_domains (
  id UUID PRIMARY KEY,
  partner_id UUID REFERENCES partner_profiles(id),
  domain_type domain_type NOT NULL, -- 'subdomain' | 'custom-domain' | 'partner-path'
  domain_name TEXT,
  ssl_certificate_id TEXT,
  dns_configured BOOLEAN DEFAULT false,
  status domain_status DEFAULT 'pending', -- 'pending' | 'configuring' | 'active' | 'failed'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Domain Setup Process

### Subdomain Configuration

1. Partner requests subdomain (e.g., `acme.app-suite.io`)
2. Admin approves and configures subdomain
3. SSL certificate automatically generated
4. Status updated to 'active'
5. Partner can access portal via subdomain

**Estimated Time**: 5-10 minutes

### Custom Domain Configuration

1. Partner adds custom domain in settings
2. System provides DNS configuration instructions:
   - CNAME record pointing to `app-suite.io`
   - TXT record for SSL verification
3. Partner configures DNS at their registrar
4. DNS propagation (24-48 hours)
5. System verifies DNS configuration
6. SSL certificate automatically generated
7. Status updated to 'active'

**Estimated Time**: 24-48 hours (due to DNS propagation)

## Implementation Details

### Component Updates

All partner portal components have been updated to use domain-aware URLs:

1. **PartnerLayout**: Navigation links use `getPortalUrl()`
2. **PartnerDashboard**: Quick action links use `getPortalUrl()`
3. **QuoteManager**: "New Quote" buttons use `getPortalUrl()`
4. **PartnerSettings**: New page with domain management tab

### Context Provider Integration

The `DomainConfigProvider` wraps all partner routes in `App.tsx`:

```typescript
function PartnerRoute() {
  return (
    <DomainConfigProvider>
      <PartnerAuthProvider>
        <Outlet />
      </PartnerAuthProvider>
    </DomainConfigProvider>
  );
}
```

### URL Generation Pattern

All components follow this pattern:

```typescript
import { usePartnerUrl } from '@/hooks/usePartnerUrl'

function MyComponent() {
  const { getPortalUrl } = usePartnerUrl()
  
  return (
    <Link to={getPortalUrl('pricing')}>
      Go to Pricing
    </Link>
  )
}
```

## Testing

Comprehensive test suite in `src/lib/__tests__/domainDetection.test.ts`:

- ✅ Domain detection for all access methods
- ✅ Base URL generation
- ✅ Portal URL construction
- ✅ White-label access detection
- ✅ Branding level determination
- ✅ Consistent functionality across all access methods

**Test Results**: 26 tests passing

## Security Considerations

1. **Domain Validation**: All custom domains are validated before configuration
2. **DNS Verification**: DNS records are checked before activation
3. **SSL Certificates**: Automatically generated and managed
4. **Partner Isolation**: Each partner can only manage their own domains
5. **RLS Policies**: Database-level security for domain configurations

## Future Enhancements

1. **Automatic DNS Verification**: Periodic checks for DNS configuration
2. **SSL Certificate Renewal**: Automated renewal before expiration
3. **Domain Analytics**: Track usage by domain/subdomain
4. **Multi-Domain Support**: Allow partners to configure multiple domains
5. **Custom Branding Assets**: Upload custom CSS, fonts, and assets per domain

## Maintenance

### Adding New Portal Routes

When adding new routes to the partner portal:

1. Define the route path (without `/partners/portal` prefix)
2. Use `getPortalUrl(path)` for all navigation links
3. Update navigation in `PartnerLayout` if needed
4. Test with all three access methods

### Monitoring Domain Status

Admins can monitor domain configurations:

1. Check `partner_domains` table for status
2. Review DNS configuration status
3. Monitor SSL certificate expiration
4. Track domain activation timeline

## Support Documentation

Partners can access domain setup instructions in the Settings page:

1. Navigate to Settings → Domains tab
2. Select domain type (subdomain or custom domain)
3. Follow step-by-step instructions
4. Contact support if issues arise

## Conclusion

The URL structure and domain management system provides flexible access options while maintaining consistent functionality. Partners can choose the level of white-labeling that suits their needs, from simple co-branding to complete brand replacement with custom domains.
