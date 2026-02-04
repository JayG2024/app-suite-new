/**
 * Client-Ready Materials Content
 * Task 8.3: Client-ready materials for partner portal
 * 
 * This file contains client-ready materials including project proposal templates,
 * statement of work templates, technical requirement gathering forms, project timeline
 * templates, and maintenance agreement templates.
 */

export interface ClientReadyMaterial {
  id: string;
  title: string;
  category: 'proposal' | 'sow' | 'requirements' | 'timeline' | 'maintenance-agreement';
  summary: string;
  content: string;
  fillableFields: string[];
  brandingRequired: boolean;
  keyPoints: string[];
  relatedResources?: string[];
}

export interface ProposalTemplate {
  id: string;
  name: string;
  projectType: string;
  sections: {
    title: string;
    content: string;
    fillableFields: string[];
  }[];
}

export interface RequirementForm {
  id: string;
  name: string;
  projectType: string;
  sections: {
    title: string;
    questions: {
      question: string;
      type: 'text' | 'textarea' | 'select' | 'multiselect' | 'number' | 'date';
      options?: string[];
      required: boolean;
    }[];
  }[];
}

// Project Proposal Templates
export const proposalTemplates: ProposalTemplate[] = [
  {
    id: 'website-proposal',
    name: 'Website Development Proposal',
    projectType: 'website',
    sections: [
      {
        title: 'Executive Summary',
        content: `
# Website Development Proposal

**Prepared for:** [CLIENT_NAME]
**Prepared by:** [PARTNER_COMPANY]
**Date:** [PROPOSAL_DATE]
**Valid Until:** [EXPIRATION_DATE]

## Executive Summary

Thank you for the opportunity to present this proposal for your website development project. We understand that [CLIENT_NAME] is looking to [PROJECT_GOAL], and we're excited to help you achieve this objective.

This proposal outlines our approach to developing a modern, high-performance website that will:
- Enhance your online presence and brand image
- Improve user experience and engagement
- Drive conversions and business growth
- Provide a scalable foundation for future expansion

Our team specializes in building custom websites using cutting-edge technologies that deliver exceptional performance, security, and user experience.
        `,
        fillableFields: ['CLIENT_NAME', 'PARTNER_COMPANY', 'PROPOSAL_DATE', 'EXPIRATION_DATE', 'PROJECT_GOAL']
      },
      {
        title: 'Understanding Your Needs',
        content: `
## Understanding Your Needs

Based on our discussions, we understand that [CLIENT_NAME] requires:

### Business Objectives
- [BUSINESS_OBJECTIVE_1]
- [BUSINESS_OBJECTIVE_2]
- [BUSINESS_OBJECTIVE_3]

### Target Audience
[TARGET_AUDIENCE_DESCRIPTION]

### Key Features Required
- [FEATURE_1]
- [FEATURE_2]
- [FEATURE_3]
- [FEATURE_4]

### Success Metrics
- [SUCCESS_METRIC_1]
- [SUCCESS_METRIC_2]
- [SUCCESS_METRIC_3]
        `,
        fillableFields: ['CLIENT_NAME', 'BUSINESS_OBJECTIVE_1', 'BUSINESS_OBJECTIVE_2', 'BUSINESS_OBJECTIVE_3', 'TARGET_AUDIENCE_DESCRIPTION', 'FEATURE_1', 'FEATURE_2', 'FEATURE_3', 'FEATURE_4', 'SUCCESS_METRIC_1', 'SUCCESS_METRIC_2', 'SUCCESS_METRIC_3']
      },
      {
        title: 'Proposed Solution',
        content: `
## Proposed Solution

We propose to develop a custom website using modern web technologies that will deliver exceptional performance, security, and user experience.

### Technology Stack
- **Frontend:** React 18 with TypeScript for a fast, interactive user interface
- **Backend:** Supabase for secure data management and authentication
- **Hosting:** Enterprise-grade cloud hosting with 99.99% uptime guarantee
- **Performance:** Optimized for sub-2-second load times and 95+ Lighthouse scores

### Key Features
1. **Responsive Design:** Mobile-first approach ensuring perfect display on all devices
2. **Content Management:** Easy-to-use CMS for updating content without technical knowledge
3. **SEO Optimization:** Built-in SEO best practices for maximum search visibility
4. **Security:** Enterprise-grade security with SSL encryption and regular updates
5. **Performance:** Lightning-fast load times with global CDN delivery
6. **Analytics:** Integrated analytics to track visitor behavior and conversions

### Design Approach
- Custom design tailored to your brand identity
- User experience (UX) optimization for maximum engagement
- Accessibility compliance (WCAG 2.1 AA standards)
- Modern, professional aesthetic

### Development Process
1. **Discovery & Planning** (Week 1): Requirements finalization and project planning
2. **Design** (Weeks 2-3): Wireframes, mockups, and design approval
3. **Development** (Weeks 4-7): Frontend and backend development with weekly demos
4. **Testing** (Week 8): Comprehensive testing and quality assurance
5. **Launch** (Week 9): Deployment and go-live support
6. **Support** (Week 10+): 30-day post-launch support included
        `,
        fillableFields: []
      },
      {
        title: 'Project Timeline',
        content: `
## Project Timeline

**Total Duration:** [PROJECT_DURATION] weeks
**Estimated Start Date:** [START_DATE]
**Estimated Launch Date:** [LAUNCH_DATE]

### Phase 1: Discovery & Planning (Week 1)
- Kickoff meeting and requirements review
- Technical architecture planning
- Content strategy and sitemap
- Design direction and mood boards

### Phase 2: Design (Weeks 2-3)
- Wireframe development
- Visual design creation
- Design review and revisions
- Design approval and sign-off

### Phase 3: Development (Weeks 4-7)
- Frontend development
- Backend and database setup
- Feature implementation
- Content integration
- Weekly progress demos

### Phase 4: Testing & QA (Week 8)
- Cross-browser testing
- Mobile responsiveness verification
- Performance optimization
- Security audit
- User acceptance testing

### Phase 5: Launch (Week 9)
- Final client review
- Production deployment
- DNS and SSL configuration
- Go-live monitoring

### Phase 6: Post-Launch Support (Weeks 10-13)
- Bug fixes and adjustments
- Performance monitoring
- Training and documentation
- Ongoing support
        `,
        fillableFields: ['PROJECT_DURATION', 'START_DATE', 'LAUNCH_DATE']
      },
      {
        title: 'Investment & Payment Terms',
        content: `
## Investment

### Project Cost
**Total Investment:** $[TOTAL_COST]

This fixed-price quote includes:
- Custom website design and development
- [NUMBER_OF_PAGES] custom pages
- Content management system
- Mobile-responsive design
- SEO optimization
- Security implementation
- Performance optimization
- 30-day post-launch support
- Training and documentation

### Payment Schedule
- **Deposit (40%):** $[DEPOSIT_AMOUNT] - Due upon contract signing
- **Milestone 1 (30%):** $[MILESTONE_1_AMOUNT] - Due upon design approval
- **Final Payment (30%):** $[FINAL_AMOUNT] - Due upon project completion

### What's Included
✓ Custom design and development
✓ Mobile-responsive implementation
✓ Content management system
✓ SEO optimization
✓ Security features
✓ Performance optimization
✓ Cross-browser testing
✓ 30-day post-launch support
✓ Training and documentation
✓ Source code ownership

### Optional Add-Ons
- **Ongoing Maintenance:** $[MAINTENANCE_COST]/month
- **Content Updates:** $[CONTENT_COST]/hour
- **Additional Features:** Custom quote
- **Marketing Integration:** Custom quote
        `,
        fillableFields: ['TOTAL_COST', 'NUMBER_OF_PAGES', 'DEPOSIT_AMOUNT', 'MILESTONE_1_AMOUNT', 'FINAL_AMOUNT', 'MAINTENANCE_COST', 'CONTENT_COST']
      },
      {
        title: 'Why Choose Us',
        content: `
## Why Choose [PARTNER_COMPANY]

### Our Expertise
- [YEARS_EXPERIENCE]+ years of web development experience
- [NUMBER_PROJECTS]+ successful projects delivered
- Specialized in modern web technologies
- Proven track record of client satisfaction

### Our Approach
- **Transparent Communication:** Regular updates and open dialogue throughout the project
- **Quality Focus:** Rigorous testing and quality assurance processes
- **Modern Technology:** Cutting-edge tools and frameworks for future-proof solutions
- **Client-Centric:** Your success is our priority

### What Sets Us Apart
1. **Performance:** We consistently achieve 95+ Lighthouse scores
2. **Speed:** Faster delivery without compromising quality
3. **Value:** Enterprise-grade solutions at competitive prices
4. **Support:** Comprehensive post-launch support and maintenance
5. **Ownership:** You own all code and assets

### Client Success Stories
[CLIENT_TESTIMONIAL_1]

[CLIENT_TESTIMONIAL_2]
        `,
        fillableFields: ['PARTNER_COMPANY', 'YEARS_EXPERIENCE', 'NUMBER_PROJECTS', 'CLIENT_TESTIMONIAL_1', 'CLIENT_TESTIMONIAL_2']
      },
      {
        title: 'Next Steps',
        content: `
## Next Steps

We're excited about the opportunity to work with [CLIENT_NAME] on this project. Here's how we can move forward:

### 1. Review This Proposal
Take time to review this proposal and discuss it with your team. We're happy to answer any questions or clarify any points.

### 2. Schedule a Call
Let's schedule a call to discuss any questions and finalize project details.
- **Contact:** [PARTNER_CONTACT_NAME]
- **Email:** [PARTNER_EMAIL]
- **Phone:** [PARTNER_PHONE]

### 3. Contract & Kickoff
Once you're ready to proceed:
- We'll prepare a detailed contract
- Schedule the project kickoff meeting
- Begin the discovery phase

### 4. Project Launch
We'll work together to bring your vision to life and launch a website that exceeds your expectations.

## Questions?

Please don't hesitate to reach out with any questions or concerns. We're here to help and look forward to partnering with you on this exciting project.

**[PARTNER_CONTACT_NAME]**
[PARTNER_TITLE]
[PARTNER_COMPANY]
[PARTNER_EMAIL]
[PARTNER_PHONE]
[PARTNER_WEBSITE]

---

**Proposal Valid Until:** [EXPIRATION_DATE]

This proposal and pricing are valid for [VALIDITY_DAYS] days from the date above. After this period, pricing and availability may be subject to change.
        `,
        fillableFields: ['CLIENT_NAME', 'PARTNER_CONTACT_NAME', 'PARTNER_EMAIL', 'PARTNER_PHONE', 'PARTNER_TITLE', 'PARTNER_COMPANY', 'PARTNER_WEBSITE', 'EXPIRATION_DATE', 'VALIDITY_DAYS']
      }
    ]
  },
  {
    id: 'web-app-proposal',
    name: 'Web Application Development Proposal',
    projectType: 'web-application',
    sections: [
      {
        title: 'Executive Summary',
        content: `
# Web Application Development Proposal

**Prepared for:** [CLIENT_NAME]
**Prepared by:** [PARTNER_COMPANY]
**Date:** [PROPOSAL_DATE]
**Valid Until:** [EXPIRATION_DATE]

## Executive Summary

We're pleased to present this proposal for developing a custom web application for [CLIENT_NAME]. Based on our discussions, we understand you need a robust, scalable application that will [APPLICATION_PURPOSE].

This proposal outlines our approach to building a modern web application that will:
- Streamline your business operations
- Enhance user productivity and satisfaction
- Scale seamlessly as your business grows
- Provide real-time data and insights
- Integrate with your existing systems

Our team specializes in building enterprise-grade web applications using cutting-edge technologies that deliver exceptional performance, security, and user experience.
        `,
        fillableFields: ['CLIENT_NAME', 'PARTNER_COMPANY', 'PROPOSAL_DATE', 'EXPIRATION_DATE', 'APPLICATION_PURPOSE']
      },
      {
        title: 'Application Overview',
        content: `
## Application Overview

### Core Functionality
[APPLICATION_DESCRIPTION]

### User Roles & Permissions
- [USER_ROLE_1]: [ROLE_DESCRIPTION_1]
- [USER_ROLE_2]: [ROLE_DESCRIPTION_2]
- [USER_ROLE_3]: [ROLE_DESCRIPTION_3]

### Key Features
1. **User Authentication & Authorization**
   - Secure login with multi-factor authentication
   - Role-based access control
   - Session management

2. **Data Management**
   - [DATA_FEATURE_1]
   - [DATA_FEATURE_2]
   - [DATA_FEATURE_3]

3. **Real-Time Features**
   - [REALTIME_FEATURE_1]
   - [REALTIME_FEATURE_2]

4. **Integrations**
   - [INTEGRATION_1]
   - [INTEGRATION_2]
   - [INTEGRATION_3]

5. **Reporting & Analytics**
   - Custom dashboards
   - Exportable reports
   - Data visualization
        `,
        fillableFields: ['APPLICATION_DESCRIPTION', 'USER_ROLE_1', 'ROLE_DESCRIPTION_1', 'USER_ROLE_2', 'ROLE_DESCRIPTION_2', 'USER_ROLE_3', 'ROLE_DESCRIPTION_3', 'DATA_FEATURE_1', 'DATA_FEATURE_2', 'DATA_FEATURE_3', 'REALTIME_FEATURE_1', 'REALTIME_FEATURE_2', 'INTEGRATION_1', 'INTEGRATION_2', 'INTEGRATION_3']
      },
      {
        title: 'Technical Architecture',
        content: `
## Technical Architecture

### Technology Stack
- **Frontend:** React 18 with TypeScript for type-safe, maintainable code
- **Backend:** Supabase (PostgreSQL) for robust data management
- **Authentication:** Enterprise-grade authentication with MFA support
- **Real-Time:** WebSocket connections for live updates
- **Hosting:** Serverless architecture with automatic scaling
- **Security:** End-to-end encryption and OWASP compliance

### Scalability & Performance
- Serverless architecture scales automatically
- Global CDN for fast content delivery
- Database optimization for complex queries
- Caching strategies for optimal performance
- Load balancing and redundancy

### Security Measures
- SSL/TLS encryption for all data transmission
- Row-level security in database
- Regular security audits and updates
- GDPR and privacy compliance
- Automated backup and disaster recovery
        `,
        fillableFields: []
      }
    ]
  }
];

// Statement of Work Templates
export const sowTemplates: ClientReadyMaterial[] = [
  {
    id: 'website-sow',
    title: 'Website Development Statement of Work',
    category: 'sow',
    summary: 'Comprehensive statement of work template for website development projects with clear deliverables and responsibilities.',
    fillableFields: ['CLIENT_NAME', 'PARTNER_COMPANY', 'PROJECT_NAME', 'START_DATE', 'END_DATE', 'TOTAL_COST'],
    brandingRequired: true,
    keyPoints: [
      'Clear project scope and deliverables',
      'Defined timeline and milestones',
      'Payment terms and schedule',
      'Responsibilities of both parties',
      'Change management process',
      'Acceptance criteria'
    ],
    content: `
# Statement of Work
## Website Development Project

**Project Name:** [PROJECT_NAME]
**Client:** [CLIENT_NAME]
**Service Provider:** [PARTNER_COMPANY]
**Effective Date:** [START_DATE]
**Completion Date:** [END_DATE]

---

## 1. Project Overview

This Statement of Work ("SOW") describes the website development services to be provided by [PARTNER_COMPANY] ("Service Provider") to [CLIENT_NAME] ("Client") for the [PROJECT_NAME] project.

### 1.1 Project Objectives
- Develop a modern, responsive website
- Improve user experience and engagement
- Enhance online presence and brand image
- Implement content management capabilities
- Optimize for search engines and performance

### 1.2 Project Scope
The Service Provider will design, develop, test, and deploy a custom website according to the specifications outlined in this SOW.

---

## 2. Deliverables

### 2.1 Design Deliverables
- [ ] Wireframes for all major pages
- [ ] Visual design mockups (desktop and mobile)
- [ ] Design style guide
- [ ] Final design approval documentation

### 2.2 Development Deliverables
- [ ] Fully functional website with [NUMBER_PAGES] pages
- [ ] Content Management System (CMS)
- [ ] Mobile-responsive implementation
- [ ] Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] SEO optimization
- [ ] Performance optimization (95+ Lighthouse score)
- [ ] Security implementation (SSL, secure forms)

### 2.3 Content Deliverables
- [ ] Content migration (if applicable)
- [ ] Image optimization
- [ ] Content formatting and styling

### 2.4 Testing Deliverables
- [ ] Functional testing report
- [ ] Cross-browser testing report
- [ ] Mobile responsiveness testing report
- [ ] Performance testing report
- [ ] Security audit report

### 2.5 Deployment Deliverables
- [ ] Production environment setup
- [ ] Domain and DNS configuration
- [ ] SSL certificate installation
- [ ] Analytics integration
- [ ] Backup system configuration

### 2.6 Documentation Deliverables
- [ ] User documentation for CMS
- [ ] Technical documentation
- [ ] Training materials
- [ ] Maintenance guidelines

---

## 3. Project Timeline

### Phase 1: Discovery & Planning (Week 1)
**Duration:** 1 week
**Deliverables:** Project plan, sitemap, content strategy

**Activities:**
- Kickoff meeting
- Requirements gathering
- Content audit and strategy
- Technical architecture planning

### Phase 2: Design (Weeks 2-3)
**Duration:** 2 weeks
**Deliverables:** Wireframes, visual designs, style guide

**Activities:**
- Wireframe development
- Visual design creation
- Client review and feedback
- Design revisions and approval

### Phase 3: Development (Weeks 4-7)
**Duration:** 4 weeks
**Deliverables:** Functional website, CMS integration

**Activities:**
- Frontend development
- Backend development
- CMS implementation
- Content integration
- Weekly progress demos

### Phase 4: Testing & QA (Week 8)
**Duration:** 1 week
**Deliverables:** Testing reports, bug fixes

**Activities:**
- Functional testing
- Cross-browser testing
- Mobile testing
- Performance optimization
- Security testing

### Phase 5: Launch (Week 9)
**Duration:** 1 week
**Deliverables:** Live website, documentation

**Activities:**
- Final client review
- Production deployment
- DNS configuration
- Go-live monitoring
- Training session

### Phase 6: Post-Launch Support (Weeks 10-13)
**Duration:** 4 weeks
**Deliverables:** Bug fixes, support

**Activities:**
- Issue resolution
- Performance monitoring
- Minor adjustments
- Ongoing support

---

## 4. Client Responsibilities

The Client agrees to:

### 4.1 Content & Assets
- Provide all required content, images, and assets by [CONTENT_DEADLINE]
- Review and approve content before integration
- Ensure all content is properly licensed and approved for use

### 4.2 Feedback & Approvals
- Provide timely feedback on deliverables (within 3 business days)
- Attend scheduled meetings and demos
- Designate a primary point of contact
- Provide final approval at each project phase

### 4.3 Access & Information
- Provide access to existing systems (if applicable)
- Provide domain registrar access for DNS configuration
- Provide hosting credentials (if applicable)
- Share brand guidelines and assets

### 4.4 Testing & Acceptance
- Participate in user acceptance testing
- Report issues and bugs in a timely manner
- Provide final sign-off before launch

---

## 5. Service Provider Responsibilities

The Service Provider agrees to:

### 5.1 Project Management
- Assign a dedicated project manager
- Provide regular progress updates
- Maintain project timeline and milestones
- Communicate any risks or issues promptly

### 5.2 Development
- Follow industry best practices
- Write clean, maintainable code
- Implement security best practices
- Ensure cross-browser compatibility
- Optimize for performance

### 5.3 Quality Assurance
- Conduct thorough testing before delivery
- Fix bugs and issues identified during testing
- Ensure deliverables meet acceptance criteria

### 5.4 Documentation & Training
- Provide comprehensive documentation
- Conduct training session for CMS usage
- Offer post-launch support

---

## 6. Payment Terms

### 6.1 Total Project Cost
**Total Investment:** $[TOTAL_COST]

### 6.2 Payment Schedule
- **Deposit (40%):** $[DEPOSIT_AMOUNT] - Due upon SOW execution
- **Milestone Payment (30%):** $[MILESTONE_AMOUNT] - Due upon design approval
- **Final Payment (30%):** $[FINAL_AMOUNT] - Due upon project completion and launch

### 6.3 Payment Terms
- Payments are due within 7 days of invoice
- Late payments may incur a 1.5% monthly interest charge
- Work may be paused for payments overdue by more than 14 days

### 6.4 Additional Work
Any work outside the scope of this SOW will be quoted separately and requires written approval before commencement.

---

## 7. Change Management

### 7.1 Change Requests
- All change requests must be submitted in writing
- Service Provider will assess impact on timeline and cost
- Changes require written approval from both parties
- Approved changes will be documented in a Change Order

### 7.2 Minor Changes
Minor changes that don't affect timeline or cost may be accommodated at Service Provider's discretion.

### 7.3 Major Changes
Major changes may require SOW amendment and additional fees.

---

## 8. Acceptance Criteria

### 8.1 Design Acceptance
Design is accepted when:
- Visual designs match approved mockups
- Responsive design works on all specified devices
- Brand guidelines are properly implemented

### 8.2 Development Acceptance
Development is accepted when:
- All features function as specified
- Website passes all testing phases
- Performance meets specified criteria (95+ Lighthouse score)
- No critical or high-priority bugs remain

### 8.3 Final Acceptance
Final acceptance occurs when:
- Website is deployed to production
- All deliverables are provided
- Training is completed
- Client provides written acceptance

---

## 9. Intellectual Property

### 9.1 Ownership
Upon final payment, Client owns:
- All custom code developed for the project
- All design assets created for the project
- All content provided by Client

### 9.2 Third-Party Components
Third-party libraries and frameworks remain under their respective licenses.

### 9.3 Portfolio Rights
Service Provider may use project in portfolio and marketing materials unless otherwise agreed.

---

## 10. Warranties & Support

### 10.1 Warranty Period
Service Provider warrants that deliverables will be free from defects for 30 days post-launch.

### 10.2 Post-Launch Support
Included in project cost:
- 30 days of bug fixes and issue resolution
- Email support during business hours
- Minor adjustments and tweaks

### 10.3 Ongoing Maintenance
Optional maintenance packages available separately.

---

## 11. Confidentiality

Both parties agree to:
- Keep confidential information private
- Use confidential information only for project purposes
- Return or destroy confidential information upon request

---

## 12. Limitation of Liability

Service Provider's liability is limited to the total project cost. Service Provider is not liable for indirect, incidental, or consequential damages.

---

## 13. Termination

### 13.1 Termination for Convenience
Either party may terminate with 14 days written notice. Client pays for work completed to date.

### 13.2 Termination for Cause
Either party may terminate immediately for material breach if breach is not cured within 14 days of notice.

---

## 14. General Terms

### 14.1 Entire Agreement
This SOW constitutes the entire agreement between parties.

### 14.2 Amendments
Amendments must be in writing and signed by both parties.

### 14.3 Governing Law
This SOW is governed by the laws of [JURISDICTION].

---

## 15. Signatures

**CLIENT:**

Signature: _______________________
Name: [CLIENT_SIGNER_NAME]
Title: [CLIENT_SIGNER_TITLE]
Date: _______________________

**SERVICE PROVIDER:**

Signature: _______________________
Name: [PARTNER_SIGNER_NAME]
Title: [PARTNER_SIGNER_TITLE]
Date: _______________________
    `,
    relatedResources: ['proposal-template', 'requirements-form', 'timeline-template']
  },
  {
    id: 'maintenance-agreement',
    title: 'Website Maintenance Agreement',
    category: 'maintenance-agreement',
    summary: 'Comprehensive maintenance agreement template covering ongoing support, updates, and service level agreements.',
    fillableFields: ['CLIENT_NAME', 'PARTNER_COMPANY', 'MONTHLY_FEE', 'START_DATE'],
    brandingRequired: true,
    keyPoints: [
      'Clear service level agreements',
      'Defined maintenance scope',
      'Response time guarantees',
      'Monthly fee structure',
      'Renewal and termination terms',
      'Support hours and availability'
    ],
    content: `
# Website Maintenance Agreement

**Client:** [CLIENT_NAME]
**Service Provider:** [PARTNER_COMPANY]
**Effective Date:** [START_DATE]
**Monthly Fee:** $[MONTHLY_FEE]

---

## 1. Agreement Overview

This Website Maintenance Agreement ("Agreement") is entered into between [PARTNER_COMPANY] ("Service Provider") and [CLIENT_NAME] ("Client") for ongoing maintenance and support services for the Client's website.

---

## 2. Services Included

### 2.1 Technical Maintenance
- **Software Updates:** Regular updates to CMS, plugins, and dependencies
- **Security Patches:** Immediate application of critical security updates
- **Performance Monitoring:** Continuous monitoring of website performance
- **Uptime Monitoring:** 24/7 monitoring with 99.9% uptime guarantee
- **Backup Management:** Daily automated backups with 30-day retention
- **SSL Certificate Management:** Renewal and maintenance of SSL certificates

### 2.2 Content Updates
- **Text Updates:** Up to [CONTENT_HOURS] hours per month of content updates
- **Image Updates:** Image uploads, optimization, and replacement
- **Page Updates:** Minor page modifications and updates
- **Blog Posts:** Publishing of client-provided blog content

### 2.3 Security Services
- **Security Monitoring:** Continuous security threat monitoring
- **Malware Scanning:** Weekly malware and vulnerability scans
- **Firewall Management:** Web application firewall configuration
- **Security Audits:** Quarterly security audits
- **Incident Response:** Immediate response to security incidents

### 2.4 Performance Optimization
- **Speed Optimization:** Ongoing performance tuning
- **Image Optimization:** Automatic image compression and optimization
- **Cache Management:** Cache configuration and optimization
- **CDN Management:** Content delivery network optimization
- **Database Optimization:** Regular database maintenance and optimization

### 2.5 Support Services
- **Email Support:** Response within [RESPONSE_TIME] business hours
- **Bug Fixes:** Resolution of technical issues and bugs
- **Compatibility Updates:** Browser and device compatibility maintenance
- **Analytics Reporting:** Monthly performance and analytics reports
- **Consultation:** Up to [CONSULTATION_HOURS] hours per month of consultation

---

## 3. Service Level Agreement (SLA)

### 3.1 Uptime Guarantee
- **Target Uptime:** 99.9% monthly uptime
- **Monitoring:** 24/7 automated monitoring
- **Notification:** Immediate alert for downtime incidents
- **Resolution:** Best effort to restore service within 2 hours

### 3.2 Response Times
- **Critical Issues:** 2 hours (security breaches, site down)
- **High Priority:** 4 business hours (major functionality broken)
- **Medium Priority:** 1 business day (minor bugs, content updates)
- **Low Priority:** 3 business days (enhancement requests, questions)

### 3.3 Support Hours
- **Standard Support:** Monday-Friday, 9 AM - 5 PM [TIMEZONE]
- **Emergency Support:** 24/7 for critical issues
- **Holidays:** Limited support on major holidays

### 3.4 Exclusions
Services NOT included in this agreement:
- Major redesigns or feature additions
- Third-party service integration
- Custom development work
- Content creation or copywriting
- SEO or marketing services
- Domain or hosting fees (billed separately)

---

## 4. Client Responsibilities

### 4.1 Content Provision
- Provide content updates in editable format
- Ensure content is proofread and approved
- Provide necessary assets (images, documents)

### 4.2 Access & Credentials
- Maintain current contact information
- Provide timely access to required systems
- Notify Service Provider of any system changes

### 4.3 Backup Verification
- Periodically verify backup integrity
- Maintain local copies of critical content

### 4.4 Communication
- Respond to Service Provider inquiries promptly
- Report issues and concerns in a timely manner
- Designate primary point of contact

---

## 5. Fees & Payment

### 5.1 Monthly Fee
**Standard Maintenance:** $[MONTHLY_FEE] per month

### 5.2 Payment Terms
- Billed monthly in advance
- Payment due within 7 days of invoice
- Accepted payment methods: [PAYMENT_METHODS]
- Late payments subject to 1.5% monthly interest

### 5.3 Additional Services
Services beyond included hours billed at:
- **Development Work:** $[HOURLY_RATE]/hour
- **Content Updates:** $[CONTENT_RATE]/hour
- **Emergency Support:** $[EMERGENCY_RATE]/hour (outside business hours)

### 5.4 Fee Adjustments
- Annual fee review with 30 days notice of changes
- Fees may increase based on website complexity growth

---

## 6. Term & Renewal

### 6.1 Initial Term
This Agreement begins on [START_DATE] and continues month-to-month.

### 6.2 Renewal
Agreement automatically renews monthly unless terminated.

### 6.3 Termination
- Either party may terminate with 30 days written notice
- Client must pay for current month upon termination
- Final backup and documentation provided upon termination

### 6.4 Suspension of Services
Services may be suspended for non-payment after 14 days past due.

---

## 7. Warranties & Disclaimers

### 7.1 Service Provider Warranties
Service Provider warrants:
- Services performed in professional manner
- Compliance with industry best practices
- Qualified personnel assigned to account

### 7.2 Disclaimers
Service Provider does NOT warrant:
- Uninterrupted or error-free service
- Prevention of all security breaches
- Specific search engine rankings
- Specific traffic or conversion results

### 7.3 Third-Party Services
Service Provider not responsible for third-party service failures.

---

## 8. Limitation of Liability

### 8.1 Liability Cap
Service Provider's total liability limited to 3 months of fees paid.

### 8.2 Excluded Damages
Service Provider not liable for:
- Indirect or consequential damages
- Lost profits or revenue
- Data loss (beyond backup restoration)
- Third-party claims

---

## 9. Data & Backups

### 9.1 Backup Schedule
- **Frequency:** Daily automated backups
- **Retention:** 30 days of backup history
- **Storage:** Secure cloud storage
- **Testing:** Quarterly backup restoration tests

### 9.2 Data Security
- Encrypted data transmission
- Secure backup storage
- Access controls and authentication
- GDPR compliance measures

### 9.3 Data Ownership
Client retains ownership of all website data and content.

---

## 10. Confidentiality

Both parties agree to:
- Maintain confidentiality of sensitive information
- Use confidential information only for agreement purposes
- Implement reasonable security measures

---

## 11. Force Majeure

Neither party liable for delays due to circumstances beyond reasonable control (natural disasters, pandemics, etc.).

---

## 12. General Provisions

### 12.1 Entire Agreement
This Agreement constitutes the entire agreement between parties.

### 12.2 Amendments
Amendments must be in writing and signed by both parties.

### 12.3 Assignment
Neither party may assign this Agreement without written consent.

### 12.4 Governing Law
Governed by laws of [JURISDICTION].

### 12.5 Severability
If any provision is invalid, remaining provisions remain in effect.

---

## 13. Signatures

**CLIENT:**

Signature: _______________________
Name: [CLIENT_SIGNER_NAME]
Title: [CLIENT_SIGNER_TITLE]
Date: _______________________

**SERVICE PROVIDER:**

Signature: _______________________
Name: [PARTNER_SIGNER_NAME]
Title: [PARTNER_SIGNER_TITLE]
Date: _______________________

---

## Appendix A: Maintenance Checklist

### Daily Tasks
- [ ] Uptime monitoring
- [ ] Security monitoring
- [ ] Automated backups
- [ ] Performance monitoring

### Weekly Tasks
- [ ] Malware scanning
- [ ] Security updates check
- [ ] Performance review
- [ ] Backup verification

### Monthly Tasks
- [ ] Software updates
- [ ] Security audit
- [ ] Performance optimization
- [ ] Analytics report
- [ ] Client update meeting

### Quarterly Tasks
- [ ] Comprehensive security audit
- [ ] Backup restoration test
- [ ] Performance benchmark
- [ ] Technology review
    `,
    relatedResources: ['sow-template', 'support-policy', 'sla-details']
  }
];

// Technical Requirements Gathering Forms
export const requirementForms: RequirementForm[] = [
  {
    id: 'website-requirements',
    name: 'Website Development Requirements Form',
    projectType: 'website',
    sections: [
      {
        title: 'Project Overview',
        questions: [
          {
            question: 'What is the primary purpose of your website?',
            type: 'textarea',
            required: true
          },
          {
            question: 'What are your main business goals for this website?',
            type: 'multiselect',
            options: [
              'Generate leads',
              'Sell products/services online',
              'Provide information',
              'Build brand awareness',
              'Customer support',
              'Portfolio showcase',
              'Other'
            ],
            required: true
          },
          {
            question: 'Who is your target audience?',
            type: 'textarea',
            required: true
          },
          {
            question: 'What is your desired launch date?',
            type: 'date',
            required: true
          },
          {
            question: 'What is your budget range for this project?',
            type: 'select',
            options: [
              '$5,000 - $10,000',
              '$10,000 - $20,000',
              '$20,000 - $50,000',
              '$50,000+'
            ],
            required: true
          }
        ]
      },
      {
        title: 'Current Website',
        questions: [
          {
            question: 'Do you have an existing website?',
            type: 'select',
            options: ['Yes', 'No'],
            required: true
          },
          {
            question: 'If yes, what is the URL?',
            type: 'text',
            required: false
          },
          {
            question: 'What do you like about your current website?',
            type: 'textarea',
            required: false
          },
          {
            question: 'What do you dislike or want to improve?',
            type: 'textarea',
            required: false
          },
          {
            question: 'Will you need content migrated from your current site?',
            type: 'select',
            options: ['Yes', 'No', 'Partially'],
            required: false
          }
        ]
      },
      {
        title: 'Design Preferences',
        questions: [
          {
            question: 'Do you have existing brand guidelines?',
            type: 'select',
            options: ['Yes', 'No', 'In development'],
            required: true
          },
          {
            question: 'What websites do you admire? (Please provide 3-5 URLs)',
            type: 'textarea',
            required: true
          },
          {
            question: 'What design style do you prefer?',
            type: 'multiselect',
            options: [
              'Modern and minimal',
              'Bold and colorful',
              'Professional and corporate',
              'Creative and artistic',
              'Clean and simple',
              'Elegant and sophisticated'
            ],
            required: true
          },
          {
            question: 'Do you have a logo?',
            type: 'select',
            options: ['Yes', 'No', 'Needs update'],
            required: true
          },
          {
            question: 'What colors should be used? (If known)',
            type: 'text',
            required: false
          }
        ]
      },
      {
        title: 'Website Structure',
        questions: [
          {
            question: 'How many pages do you anticipate needing?',
            type: 'select',
            options: [
              '1-5 pages',
              '6-10 pages',
              '11-20 pages',
              '21-50 pages',
              '50+ pages'
            ],
            required: true
          },
          {
            question: 'What pages do you need? (Select all that apply)',
            type: 'multiselect',
            options: [
              'Home',
              'About Us',
              'Services/Products',
              'Portfolio/Gallery',
              'Blog',
              'Contact',
              'FAQ',
              'Testimonials',
              'Team',
              'Careers',
              'Other'
            ],
            required: true
          },
          {
            question: 'Will you need a blog?',
            type: 'select',
            options: ['Yes', 'No', 'Maybe later'],
            required: true
          },
          {
            question: 'Do you need multi-language support?',
            type: 'select',
            options: ['Yes', 'No'],
            required: true
          }
        ]
      },
      {
        title: 'Features & Functionality',
        questions: [
          {
            question: 'What features do you need? (Select all that apply)',
            type: 'multiselect',
            options: [
              'Contact form',
              'Newsletter signup',
              'Search functionality',
              'User accounts/login',
              'E-commerce/shopping cart',
              'Payment processing',
              'Booking/scheduling system',
              'Live chat',
              'Social media integration',
              'Google Maps integration',
              'Video integration',
              'Photo gallery',
              'Document downloads',
              'Email marketing integration',
              'CRM integration',
              'Analytics tracking'
            ],
            required: true
          },
          {
            question: 'Do you need a Content Management System (CMS)?',
            type: 'select',
            options: ['Yes', 'No', 'Not sure'],
            required: true
          },
          {
            question: 'Will you need to update content yourself?',
            type: 'select',
            options: ['Yes, frequently', 'Yes, occasionally', 'No, prefer managed updates'],
            required: true
          },
          {
            question: 'Do you need any third-party integrations?',
            type: 'textarea',
            required: false
          }
        ]
      },
      {
        title: 'Content',
        questions: [
          {
            question: 'Who will provide the website content?',
            type: 'select',
            options: [
              'We will provide all content',
              'We need help with content creation',
              'Mix of both'
            ],
            required: true
          },
          {
            question: 'Do you have professional photos/images?',
            type: 'select',
            options: ['Yes', 'No', 'Some'],
            required: true
          },
          {
            question: 'Will you need stock photos?',
            type: 'select',
            options: ['Yes', 'No', 'Not sure'],
            required: false
          },
          {
            question: 'Do you have video content?',
            type: 'select',
            options: ['Yes', 'No', 'Planning to create'],
            required: false
          }
        ]
      },
      {
        title: 'Technical Requirements',
        questions: [
          {
            question: 'Do you have a domain name?',
            type: 'select',
            options: ['Yes', 'No', 'Need to purchase'],
            required: true
          },
          {
            question: 'If yes, what is your domain name?',
            type: 'text',
            required: false
          },
          {
            question: 'Do you have hosting?',
            type: 'select',
            options: ['Yes', 'No', 'Need recommendations'],
            required: true
          },
          {
            question: 'Do you have email hosting?',
            type: 'select',
            options: ['Yes', 'No', 'Need setup'],
            required: true
          },
          {
            question: 'What is your expected traffic volume?',
            type: 'select',
            options: [
              'Less than 1,000 visitors/month',
              '1,000 - 10,000 visitors/month',
              '10,000 - 50,000 visitors/month',
              '50,000+ visitors/month'
            ],
            required: true
          }
        ]
      },
      {
        title: 'SEO & Marketing',
        questions: [
          {
            question: 'Is SEO important for this project?',
            type: 'select',
            options: ['Very important', 'Somewhat important', 'Not a priority'],
            required: true
          },
          {
            question: 'Do you have target keywords?',
            type: 'textarea',
            required: false
          },
          {
            question: 'Do you need Google Analytics setup?',
            type: 'select',
            options: ['Yes', 'No', 'Already have it'],
            required: true
          },
          {
            question: 'Do you need social media integration?',
            type: 'multiselect',
            options: [
              'Facebook',
              'Instagram',
              'Twitter/X',
              'LinkedIn',
              'YouTube',
              'TikTok',
              'Other'
            ],
            required: false
          }
        ]
      },
      {
        title: 'Maintenance & Support',
        questions: [
          {
            question: 'Will you need ongoing maintenance?',
            type: 'select',
            options: ['Yes', 'No', 'Not sure yet'],
            required: true
          },
          {
            question: 'What level of support do you anticipate needing?',
            type: 'select',
            options: [
              'Basic (security updates, backups)',
              'Standard (updates, backups, minor changes)',
              'Premium (full support, content updates, monitoring)',
              'Not sure'
            ],
            required: false
          },
          {
            question: 'Do you need training on how to use the CMS?',
            type: 'select',
            options: ['Yes', 'No'],
            required: true
          }
        ]
      },
      {
        title: 'Additional Information',
        questions: [
          {
            question: 'Are there any specific competitors we should be aware of?',
            type: 'textarea',
            required: false
          },
          {
            question: 'What makes your business unique?',
            type: 'textarea',
            required: true
          },
          {
            question: 'Are there any specific challenges or concerns?',
            type: 'textarea',
            required: false
          },
          {
            question: 'Is there anything else we should know about this project?',
            type: 'textarea',
            required: false
          }
        ]
      }
    ]
  },
  {
    id: 'web-app-requirements',
    name: 'Web Application Requirements Form',
    projectType: 'web-application',
    sections: [
      {
        title: 'Application Overview',
        questions: [
          {
            question: 'What problem does this application solve?',
            type: 'textarea',
            required: true
          },
          {
            question: 'Who are the primary users of this application?',
            type: 'textarea',
            required: true
          },
          {
            question: 'What is the expected number of users?',
            type: 'select',
            options: [
              'Less than 100',
              '100 - 1,000',
              '1,000 - 10,000',
              '10,000 - 100,000',
              '100,000+'
            ],
            required: true
          },
          {
            question: 'What is your target launch date?',
            type: 'date',
            required: true
          }
        ]
      },
      {
        title: 'User Roles & Permissions',
        questions: [
          {
            question: 'How many different user roles will you need?',
            type: 'number',
            required: true
          },
          {
            question: 'Please describe each user role and their permissions',
            type: 'textarea',
            required: true
          },
          {
            question: 'Will users need to register/create accounts?',
            type: 'select',
            options: ['Yes', 'No'],
            required: true
          },
          {
            question: 'What authentication methods do you need?',
            type: 'multiselect',
            options: [
              'Email/password',
              'Social login (Google, Facebook, etc.)',
              'Single Sign-On (SSO)',
              'Multi-factor authentication (MFA)',
              'Magic link'
            ],
            required: true
          }
        ]
      },
      {
        title: 'Core Features',
        questions: [
          {
            question: 'What are the core features of your application? (List in priority order)',
            type: 'textarea',
            required: true
          },
          {
            question: 'Do you need real-time features?',
            type: 'multiselect',
            options: [
              'Real-time notifications',
              'Live chat/messaging',
              'Collaborative editing',
              'Live data updates',
              'Presence indicators',
              'None needed'
            ],
            required: true
          },
          {
            question: 'What data will users create/manage?',
            type: 'textarea',
            required: true
          },
          {
            question: 'Do you need file upload capabilities?',
            type: 'select',
            options: ['Yes', 'No'],
            required: true
          }
        ]
      },
      {
        title: 'Integrations',
        questions: [
          {
            question: 'What third-party services need to be integrated?',
            type: 'textarea',
            required: false
          },
          {
            question: 'Do you need payment processing?',
            type: 'select',
            options: ['Yes', 'No', 'Maybe later'],
            required: true
          },
          {
            question: 'If yes, what payment methods?',
            type: 'multiselect',
            options: [
              'Credit/debit cards',
              'PayPal',
              'Stripe',
              'Bank transfer',
              'Cryptocurrency',
              'Other'
            ],
            required: false
          },
          {
            question: 'Do you need email notifications?',
            type: 'select',
            options: ['Yes', 'No'],
            required: true
          }
        ]
      },
      {
        title: 'Reporting & Analytics',
        questions: [
          {
            question: 'What reports or analytics do you need?',
            type: 'textarea',
            required: true
          },
          {
            question: 'Do you need data export capabilities?',
            type: 'multiselect',
            options: ['CSV', 'Excel', 'PDF', 'JSON', 'API access'],
            required: true
          },
          {
            question: 'Do you need custom dashboards?',
            type: 'select',
            options: ['Yes', 'No', 'Not sure'],
            required: true
          }
        ]
      },
      {
        title: 'Technical Requirements',
        questions: [
          {
            question: 'Do you have any specific technology requirements?',
            type: 'textarea',
            required: false
          },
          {
            question: 'Do you need mobile apps in addition to web?',
            type: 'select',
            options: ['Yes', 'No', 'Future phase'],
            required: true
          },
          {
            question: 'What is your expected data volume?',
            type: 'select',
            options: [
              'Small (< 10GB)',
              'Medium (10GB - 100GB)',
              'Large (100GB - 1TB)',
              'Very Large (> 1TB)'
            ],
            required: true
          },
          {
            question: 'Do you have any compliance requirements?',
            type: 'multiselect',
            options: [
              'GDPR',
              'HIPAA',
              'PCI DSS',
              'SOC 2',
              'ISO 27001',
              'None',
              'Other'
            ],
            required: true
          }
        ]
      }
    ]
  }
];

// Project Timeline Templates
export const timelineTemplates: ClientReadyMaterial[] = [
  {
    id: 'website-timeline',
    title: 'Website Development Project Timeline',
    category: 'timeline',
    summary: 'Detailed project timeline template for website development with phases, milestones, and deliverables.',
    fillableFields: ['PROJECT_NAME', 'CLIENT_NAME', 'START_DATE', 'DURATION_WEEKS'],
    brandingRequired: true,
    keyPoints: [
      'Clear phase breakdown',
      'Specific deliverables per phase',
      'Milestone dates and dependencies',
      'Client review points',
      'Buffer time for revisions',
      'Launch and post-launch activities'
    ],
    content: `
# Project Timeline
## [PROJECT_NAME]

**Client:** [CLIENT_NAME]
**Project Duration:** [DURATION_WEEKS] weeks
**Start Date:** [START_DATE]
**Estimated Launch:** [LAUNCH_DATE]

---

## Timeline Overview

\`\`\`
Week 1: Discovery & Planning
Week 2-3: Design
Week 4-7: Development
Week 8: Testing & QA
Week 9: Launch
Week 10-13: Post-Launch Support
\`\`\`

---

## Phase 1: Discovery & Planning
**Duration:** Week 1
**Status:** [STATUS]

### Activities
- [ ] Project kickoff meeting
- [ ] Requirements gathering and documentation
- [ ] Content audit and strategy
- [ ] Sitemap development
- [ ] Technical architecture planning
- [ ] Project plan finalization

### Deliverables
- Project plan document
- Sitemap
- Content strategy
- Technical specifications

### Client Actions Required
- Attend kickoff meeting
- Provide access to existing systems
- Share brand assets and guidelines
- Approve project plan

**Milestone:** Project Plan Approved
**Date:** [MILESTONE_1_DATE]

---

## Phase 2: Design
**Duration:** Weeks 2-3
**Status:** [STATUS]

### Week 2: Wireframes & UX
- [ ] Information architecture
- [ ] Wireframe development for key pages
- [ ] User flow mapping
- [ ] Client review and feedback

### Week 3: Visual Design
- [ ] Visual design concepts
- [ ] Design mockups (desktop & mobile)
- [ ] Style guide creation
- [ ] Design revisions
- [ ] Final design approval

### Deliverables
- Wireframes for all major pages
- Visual design mockups
- Design style guide
- Asset library

### Client Actions Required
- Review and provide feedback on wireframes (3 days)
- Review and approve visual designs (3 days)
- Provide any missing brand assets

**Milestone:** Design Approved
**Date:** [MILESTONE_2_DATE]

---

## Phase 3: Development
**Duration:** Weeks 4-7
**Status:** [STATUS]

### Week 4: Frontend Foundation
- [ ] Development environment setup
- [ ] Homepage development
- [ ] Navigation and header/footer
- [ ] Responsive framework implementation
- [ ] Weekly demo

### Week 5: Core Pages
- [ ] About page development
- [ ] Services/Products pages
- [ ] Contact page with form
- [ ] Additional key pages
- [ ] Weekly demo

### Week 6: Features & Functionality
- [ ] CMS integration
- [ ] Form functionality
- [ ] Search functionality (if applicable)
- [ ] Third-party integrations
- [ ] Weekly demo

### Week 7: Content & Polish
- [ ] Content integration
- [ ] Image optimization
- [ ] SEO implementation
- [ ] Final feature implementation
- [ ] Weekly demo

### Deliverables
- Functional website on staging server
- CMS setup and configuration
- Integrated content
- Weekly progress demos

### Client Actions Required
- Attend weekly demos
- Provide content and assets
- Test functionality on staging
- Report any issues or concerns

**Milestone:** Development Complete
**Date:** [MILESTONE_3_DATE]

---

## Phase 4: Testing & Quality Assurance
**Duration:** Week 8
**Status:** [STATUS]

### Activities
- [ ] Functional testing
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsiveness testing
- [ ] Performance optimization
- [ ] SEO audit
- [ ] Security testing
- [ ] Accessibility testing
- [ ] User acceptance testing (UAT)
- [ ] Bug fixes and adjustments

### Deliverables
- Testing reports
- Bug fix documentation
- Performance report
- Security audit report

### Client Actions Required
- Conduct user acceptance testing
- Report any issues
- Provide final content approvals
- Sign off on testing phase

**Milestone:** Testing Complete & Approved
**Date:** [MILESTONE_4_DATE]

---

## Phase 5: Launch
**Duration:** Week 9
**Status:** [STATUS]

### Pre-Launch (Days 1-3)
- [ ] Final client review
- [ ] Pre-launch checklist completion
- [ ] Backup current site (if applicable)
- [ ] DNS preparation
- [ ] SSL certificate setup

### Launch Day (Day 4)
- [ ] Deploy to production
- [ ] DNS cutover
- [ ] SSL verification
- [ ] Functionality verification
- [ ] Analytics verification
- [ ] Search engine submission

### Post-Launch (Days 5-7)
- [ ] Monitor performance
- [ ] Monitor for errors
- [ ] Address any immediate issues
- [ ] Client training session
- [ ] Documentation handoff

### Deliverables
- Live website
- Training documentation
- Technical documentation
- Maintenance guidelines
- Analytics access

### Client Actions Required
- Final approval for launch
- DNS access (if needed)
- Attend training session
- Provide launch announcement feedback

**Milestone:** Website Launched
**Date:** [MILESTONE_5_DATE]

---

## Phase 6: Post-Launch Support
**Duration:** Weeks 10-13
**Status:** [STATUS]

### Activities
- [ ] Monitor website performance
- [ ] Address any bugs or issues
- [ ] Minor adjustments and tweaks
- [ ] Performance optimization
- [ ] Security monitoring
- [ ] Analytics review
- [ ] Client support

### Deliverables
- Bug fixes and adjustments
- Performance reports
- Analytics reports
- Ongoing support

### Client Actions Required
- Report any issues promptly
- Review analytics
- Provide feedback

**Milestone:** Project Complete
**Date:** [MILESTONE_6_DATE]

---

## Key Dates Summary

| Milestone | Date | Status |
|-----------|------|--------|
| Project Kickoff | [KICKOFF_DATE] | [STATUS] |
| Project Plan Approved | [MILESTONE_1_DATE] | [STATUS] |
| Design Approved | [MILESTONE_2_DATE] | [STATUS] |
| Development Complete | [MILESTONE_3_DATE] | [STATUS] |
| Testing Complete | [MILESTONE_4_DATE] | [STATUS] |
| Website Launch | [MILESTONE_5_DATE] | [STATUS] |
| Project Complete | [MILESTONE_6_DATE] | [STATUS] |

---

## Dependencies & Risks

### Critical Dependencies
- Client content delivery by [CONTENT_DEADLINE]
- Design approval by [DESIGN_DEADLINE]
- Third-party API access (if applicable)
- Domain and hosting access

### Potential Risks
- Content delays may impact timeline
- Scope changes require timeline adjustment
- Third-party integration issues
- Browser compatibility challenges

### Mitigation Strategies
- Regular communication and status updates
- Buffer time built into schedule
- Early identification of technical challenges
- Change management process in place

---

## Communication Plan

### Weekly Status Updates
- Day: [MEETING_DAY]
- Time: [MEETING_TIME]
- Format: [VIDEO_CALL/EMAIL]

### Demo Sessions
- Frequency: Weekly during development
- Duration: 30 minutes
- Format: Screen share

### Issue Reporting
- Method: [EMAIL/PROJECT_MANAGEMENT_TOOL]
- Response Time: Within 1 business day

---

## Notes

[ADDITIONAL_NOTES]
    `,
    relatedResources: ['project-plan', 'milestone-checklist', 'launch-checklist']
  }
];

// Export all client-ready materials
export const clientReadyMaterials: ClientReadyMaterial[] = [
  ...sowTemplates,
  ...timelineTemplates
];

/**
 * Get materials by category
 */
export const getMaterialsByCategory = (category: ClientReadyMaterial['category']) => {
  return clientReadyMaterials.filter(material => material.category === category);
};

/**
 * Get material by ID
 */
export const getMaterialById = (id: string) => {
  return clientReadyMaterials.find(material => material.id === id);
};

/**
 * Get proposal template by ID
 */
export const getProposalTemplateById = (id: string) => {
  return proposalTemplates.find(template => template.id === id);
};

/**
 * Get requirement form by ID
 */
export const getRequirementFormById = (id: string) => {
  return requirementForms.find(form => form.id === id);
};

/**
 * Get all material categories
 */
export const getMaterialCategories = () => {
  return [
    { id: 'proposal', name: 'Project Proposals', count: proposalTemplates.length },
    { id: 'sow', name: 'Statements of Work', count: getMaterialsByCategory('sow').length },
    { id: 'requirements', name: 'Requirements Forms', count: requirementForms.length },
    { id: 'timeline', name: 'Project Timelines', count: getMaterialsByCategory('timeline').length },
    { id: 'maintenance-agreement', name: 'Maintenance Agreements', count: getMaterialsByCategory('maintenance-agreement').length }
  ];
};
