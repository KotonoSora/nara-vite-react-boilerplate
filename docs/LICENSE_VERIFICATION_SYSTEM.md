# License Verification System

## Overview

The NARA boilerplate license verification system ensures legitimate usage while providing a seamless experience for licensed customers. This system is designed to be developer-friendly and non-intrusive.

## License Key Format

### Structure
```
NARA-{TIER}-{YEAR}-{CHECKSUM}
```

### Components
- **NARA**: Product identifier
- **TIER**: License tier (IND/TSM/TMD/ENT/SRC)
- **YEAR**: Purchase year (4 digits)
- **CHECKSUM**: 8-character alphanumeric checksum

### Examples
```
NARA-IND-2024-A7B9C1D2
NARA-ENT-2024-M1N2O3P4
NARA-SRC-2024-Q5R6S7T8
```

## Verification Methods

### 1. Optional API Verification (Recommended)

#### Endpoint
```
POST https://api.nara-licenses.com/verify
```

#### Request
```json
{
  "license_key": "NARA-IND-2024-A7B9C1D2",
  "project_hash": "sha256_of_package_json_content",
  "usage_context": "development|production|testing"
}
```

#### Response - Valid License
```json
{
  "valid": true,
  "license": {
    "key": "NARA-IND-2024-A7B9C1D2",
    "tier": "individual",
    "customer": "John Doe",
    "expires": "2025-01-15",
    "features": ["commercial_use", "modifications", "support_6_months"],
    "restrictions": ["single_developer", "no_redistribution"]
  },
  "usage": {
    "projects_count": 3,
    "last_verified": "2024-01-15T10:30:00Z"
  }
}
```

#### Response - Invalid License
```json
{
  "valid": false,
  "error": "license_expired",
  "message": "License expired on 2023-12-31",
  "suggested_action": "upgrade_license"
}
```

### 2. Offline Verification (Fallback)

For customers who prefer not to use API verification:

#### License File Method
1. Include license file in project root: `.nara-license`
2. File contains signed license information
3. Verification happens locally without external calls

#### Example `.nara-license` file:
```json
{
  "license_key": "NARA-IND-2024-A7B9C1D2",
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "tier": "individual",
  "purchase_date": "2024-01-15",
  "expires": "2025-01-15",
  "signature": "digital_signature_here"
}
```

### 3. Honor System (No Verification)

For customers who prefer minimal interference:
- No technical verification required
- License terms enforced through legal agreement
- Periodic audit rights reserved

## Implementation Guide

### For Development (Optional)

#### Environment Variable
```bash
NARA_LICENSE_KEY=NARA-IND-2024-A7B9C1D2
```

#### Package.json Configuration
```json
{
  "nara": {
    "license_key": "NARA-IND-2024-A7B9C1D2",
    "verification": "api|offline|none"
  }
}
```

#### Verification Helper (Optional)
```typescript
// lib/license-verification.ts
import { verifyLicense } from '@nara/license-verifier';

export async function checkLicense() {
  const licenseKey = process.env.NARA_LICENSE_KEY;
  
  if (!licenseKey) {
    console.warn('NARA: No license key found. Please add NARA_LICENSE_KEY to your environment.');
    return;
  }
  
  try {
    const result = await verifyLicense(licenseKey);
    if (result.valid) {
      console.log(`NARA: License verified for ${result.license.customer}`);
    } else {
      console.warn(`NARA: License issue - ${result.message}`);
    }
  } catch (error) {
    console.warn('NARA: Could not verify license (offline mode)');
  }
}
```

### Production Deployment

#### Verification During Build (Optional)
```javascript
// vite.config.ts
import { verifyNaraLicense } from '@nara/vite-plugin';

export default defineConfig({
  plugins: [
    verifyNaraLicense({
      required: false, // Set to true for strict verification
      fallback: 'honor-system'
    })
  ]
});
```

#### Runtime Verification (Optional)
```typescript
// Only verify in development, not in production
if (process.env.NODE_ENV === 'development') {
  await checkLicense();
}
```

## Customer Experience

### Onboarding Flow
1. **Purchase**: Customer buys license via Gumroad/LemonSqueezy
2. **Email**: Automated email with license key and download link
3. **Download**: Access to private repository or ZIP file
4. **Setup**: Add license key to environment variables (optional)
5. **Verification**: Optional API call confirms license validity

### License Management Portal

#### Customer Dashboard
- View current licenses
- Download latest versions
- Access support resources
- Manage team members (team licenses)
- View usage statistics

#### Features
- **License Recovery**: Re-send license keys via email
- **Team Management**: Add/remove team members
- **Usage Tracking**: See projects using the license
- **Support Integration**: Direct access to support tickets

## Security Considerations

### License Key Security
- **No Secrets**: License keys are not secret, just identifiers
- **Public Safe**: Safe to include in public repositories
- **Rotation**: Can be rotated if compromised
- **Validation**: Server-side validation prevents tampering

### API Security
- **Rate Limiting**: Prevent abuse of verification API
- **Authentication**: Optional customer authentication
- **Encryption**: HTTPS for all communications
- **Monitoring**: Track verification patterns

### Privacy Protection
- **Minimal Data**: Only collect necessary information
- **No Source Code**: Never access customer source code
- **Optional Telemetry**: All telemetry is opt-in
- **Data Retention**: Clear data retention policies

## Error Handling

### Common Error Scenarios

#### License Not Found
```json
{
  "valid": false,
  "error": "license_not_found",
  "message": "License key not found in our system",
  "suggested_action": "check_key_format"
}
```

#### License Expired
```json
{
  "valid": false,
  "error": "license_expired",
  "message": "Support period expired on 2023-12-31",
  "suggested_action": "renew_support"
}
```

#### Usage Exceeded
```json
{
  "valid": false,
  "error": "usage_exceeded",
  "message": "Individual license used by multiple developers",
  "suggested_action": "upgrade_to_team_license"
}
```

#### API Unavailable
```json
{
  "valid": true,
  "fallback": true,
  "message": "Verification API unavailable, using offline mode"
}
```

### Graceful Degradation
1. **API Down**: Fall back to offline verification
2. **Network Issues**: Cache last verification result
3. **Invalid Response**: Assume valid and log warning
4. **Rate Limited**: Back off and retry later

## Analytics and Monitoring

### Usage Metrics
- **License Verifications**: Track verification frequency
- **Error Rates**: Monitor verification failures
- **Geographic Distribution**: Where licenses are used
- **Feature Usage**: Which features are most popular

### Customer Insights
- **Project Count**: How many projects per license
- **Team Growth**: When customers need upgrades
- **Support Patterns**: Common support requests
- **Renewal Timing**: When customers renew/upgrade

### Business Intelligence
- **Conversion Funnel**: From verification to upgrade
- **Churn Prediction**: Identify at-risk customers
- **Feature Demand**: What features drive upgrades
- **Market Segments**: Customer segmentation insights

## Implementation Timeline

### Phase 1: Basic System (Month 1)
- [ ] License key generation system
- [ ] Basic API verification endpoint
- [ ] Customer database setup
- [ ] Email delivery system

### Phase 2: Customer Portal (Month 2)
- [ ] Customer dashboard
- [ ] License management interface
- [ ] Usage analytics
- [ ] Support integration

### Phase 3: Advanced Features (Month 3)
- [ ] Team management
- [ ] Offline verification
- [ ] Advanced analytics
- [ ] API rate limiting

### Phase 4: Optimization (Month 4)
- [ ] Performance optimization
- [ ] Error handling improvements
- [ ] Customer feedback integration
- [ ] Automated renewal reminders

## Cost Considerations

### Infrastructure Costs
- **API Hosting**: ~$20/month (Cloudflare Workers)
- **Database**: ~$10/month (PlanetScale or similar)
- **Email Service**: ~$10/month (SendGrid)
- **Monitoring**: ~$15/month (Datadog or similar)

### Development Costs
- **Initial Setup**: 40-60 hours
- **Customer Portal**: 80-120 hours
- **Ongoing Maintenance**: 10-20 hours/month

### Expected ROI
- **Customer Satisfaction**: Easier license management
- **Support Reduction**: Automated license recovery
- **Upsell Opportunities**: Usage-based upgrade suggestions
- **Compliance**: Clear audit trail for enterprise customers

## Conclusion

This license verification system balances customer convenience with business protection. The optional nature ensures that customers can choose their preferred level of verification while providing valuable insights for business growth and customer success.