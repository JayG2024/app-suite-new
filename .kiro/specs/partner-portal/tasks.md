# Implementation Plan: Partner Portal

## Overview

This implementation plan creates a practical partner portal that extends the existing app-suite.io website with essential partner features. The approach focuses on simplicity and reuses existing components and patterns from the main website to minimize complexity while delivering core partner functionality.

## Tasks

- [x] 1. Set up partner portal foundation
  - Extend existing Supabase schema with partner tables
  - Create partner authentication middleware using existing auth patterns
  - Set up partner-specific routing in the existing React app
  - _Requirements: 1.1, 1.2, 1.3, 6.1, 6.2_

- [x] 1.1 Write property test for authentication state management
  - **Property 1: Authentication State Management**
  - **Validates: Requirements 1.1, 1.2, 1.3**

- [x] 2. Create partner dashboard and navigation
  - [x] 2.1 Build partner dashboard component using existing design system
    - Create dashboard layout with partner info display
    - Add navigation to pricing calculator and resources
    - Show partner discount tier and account status
    - _Requirements: 4.1, 4.2, 4.4, 5.1, 5.3_

  - [x] 2.2 Write property test for partner-specific content personalization
    - **Property 2: Partner-Specific Content Personalization**
    - **Validates: Requirements 1.5, 4.4, 5.1, 5.3, 5.5**

- [x] 3. Implement partner pricing calculator
  - [x] 3.1 Extend existing pricing calculator with partner discounts
    - Add partner discount logic to existing pricing functions
    - Create partner-specific pricing display (standard vs partner price)
    - Add AI website pricing ($2,500/$3,000 standard, $2,000/$2,500 partner)
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 3.2 Write property test for pricing calculation with discounts
    - **Property 3: Pricing Calculation with Discount Application**
    - **Validates: Requirements 2.2, 2.3**

- [x] 4. Build quote generation and management
  - [x] 4.1 Create quote generation system
    - Build quote creation from pricing calculations
    - Add basic PDF export using existing styling
    - Store quotes in Supabase with partner association
    - _Requirements: 2.5, 7.1, 7.4_

  - [x] 4.2 Add partner branding to quotes
    - Allow partners to add company logo and contact info
    - Apply partner branding to quote templates
    - _Requirements: 7.2, 7.5_

  - [x] 4.3 Write property test for quote lifecycle management
    - **Property 4: Quote Lifecycle Management**
    - **Validates: Requirements 2.5, 7.1, 7.2, 7.3, 7.4, 7.5**

- [-] 5. Checkpoint - Test core partner functionality
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Create simple resource library
  - [ ] 6.1 Build resource library interface
    - Create simple document listing with categories
    - Add download functionality for PDFs and documents
    - Include web/app specs, security info, and process docs
    - _Requirements: 3.1, 3.4_

  - [ ] 6.2 Add basic document customization
    - Allow partners to add their logo to select documents
    - Create simple white-label versions with partner info
    - _Requirements: 3.2, 3.3_

  - [ ] 6.3 Write property test for document customization
    - **Property 5: Document Customization and White-Labeling**
    - **Validates: Requirements 3.2, 3.3**

- [ ] 7. Implement URL scanner for website analysis
  - [ ] 7.1 Create website analysis interface
    - Build simple URL input form
    - Integrate with Fire Crawl API for basic site analysis
    - Display page count and basic site information
    - _Requirements: 9.1, 9.2_

  - [ ] 7.2 Add rebuild pricing suggestions
    - Calculate rebuild pricing based on page count
    - Suggest appropriate pricing tier based on site complexity
    - Allow quote generation from analysis results
    - _Requirements: 9.3, 9.4, 9.5_

  - [ ] 7.3 Write property test for website analysis
    - **Property 9: Website Analysis and Pricing Recommendations**
    - **Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5**

- [ ] 8. Build basic admin interface
  - [ ] 8.1 Create admin dashboard for partner management
    - Build simple admin interface for creating partners
    - Add partner discount tier configuration
    - Show basic partner activity and quote history
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

  - [ ] 8.2 Write property test for administrative partner management
    - **Property 10: Administrative Partner Management**
    - **Validates: Requirements 10.1, 10.2, 10.3, 10.4**

- [ ] 9. Add partner profile management
  - [ ] 9.1 Create partner profile editing
    - Allow partners to update company info and contact details
    - Add simple profile picture/logo upload
    - Show partner agreement and renewal information
    - _Requirements: 5.2, 5.4, 5.5_

  - [ ]* 9.2 Write property test for profile management consistency
    - **Property 7: Profile Management Consistency**
    - **Validates: Requirements 5.2**

- [ ] 10. Implement simple onboarding
  - [ ] 10.1 Create basic partner onboarding flow
    - Add simple welcome tour for new partners
    - Include basic help documentation
    - Add FAQ section with common questions
    - Track onboarding completion
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ]* 10.2 Write property test for onboarding progress tracking
    - **Property 11: Onboarding Progress Tracking**
    - **Validates: Requirements 8.5**

- [ ] 11. Add notification system
  - [ ] 11.1 Implement basic notifications
    - Add simple notification system for resource updates
    - Show new feature announcements on dashboard
    - _Requirements: 3.5, 4.5_

  - [ ]* 11.2 Write property tests for notification features
    - **Property 6: Resource Update Notification**
    - **Property 8: Feature Availability Notification**
    - **Validates: Requirements 3.5, 4.5**

- [ ] 12. Final integration and testing
  - [ ] 12.1 Wire all components together
    - Ensure smooth navigation between all portal sections
    - Test complete partner workflows from login to quote generation
    - Verify integration with existing app-suite.io website
    - _Requirements: All requirements integration_

  - [ ]* 12.2 Write integration tests
    - Test end-to-end partner workflows
    - Verify admin management flows
    - Test external API integrations

- [ ] 13. Final checkpoint - Complete system validation
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Implementation reuses existing app-suite.io components and styling for consistency
- Focus on essential functionality without over-engineering
- Each task builds incrementally on previous work
- Supabase integration leverages existing database patterns
- UI components follow existing design system for seamless integration