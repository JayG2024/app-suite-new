export interface TroubleshootingGuide {
  id: string;
  category: string;
  title: string;
  description: string;
  symptoms: string[];
  solutions: string[];
  prevention: string[];
  relatedTopics: string[];
}

export const troubleshootingGuides: TroubleshootingGuide[] = [
  // Project Management Issues
  {
    id: "communication-delays",
    category: "Project Management",
    title: "Communication Delays or Misunderstandings",
    description: "Issues with project communication, unclear requirements, or delayed responses affecting project timeline.",
    symptoms: [
      "Delayed responses to project updates",
      "Confusion about project requirements",
      "Missed deadlines due to communication gaps",
      "Unclear feedback on deliverables"
    ],
    solutions: [
      "Establish clear communication schedules and preferred channels",
      "Schedule weekly check-in calls at consistent times",
      "Use project management tools for tracking progress and feedback",
      "Document all requirements and changes in writing",
      "Set up dedicated Slack channel or email thread for project communication",
      "Assign a single point of contact from your team"
    ],
    prevention: [
      "Define communication protocols during project kickoff",
      "Set realistic expectations for response times",
      "Use collaborative tools like shared documents for requirements",
      "Schedule regular milestone reviews"
    ],
    relatedTopics: ["project-timeline", "requirements-gathering", "stakeholder-management"]
  },
  {
    id: "scope-creep",
    category: "Project Management",
    title: "Project Scope Changes",
    description: "Managing additional requirements or changes that arise during development.",
    symptoms: [
      "New features requested during development",
      "Changes to original requirements",
      "Concerns about timeline impact",
      "Uncertainty about additional costs"
    ],
    solutions: [
      "Document all new requirements clearly",
      "Assess impact on timeline and budget",
      "Provide written change request with cost/time implications",
      "Prioritize changes based on business value",
      "Consider implementing changes in future phases",
      "Update project documentation to reflect approved changes"
    ],
    prevention: [
      "Conduct thorough requirements gathering upfront",
      "Create detailed project scope documentation",
      "Establish change request process",
      "Plan for future enhancement phases"
    ],
    relatedTopics: ["requirements-gathering", "project-planning", "budget-management"]
  },

  // Technical Issues
  {
    id: "integration-challenges",
    category: "Technical",
    title: "Third-Party Integration Issues",
    description: "Difficulties connecting your custom application with existing business systems.",
    symptoms: [
      "API connection failures",
      "Data sync inconsistencies",
      "Authentication problems with third-party services",
      "Slow performance due to external API calls"
    ],
    solutions: [
      "Verify API credentials and permissions",
      "Check third-party service status and documentation",
      "Implement retry logic for failed API calls",
      "Set up data validation and error handling",
      "Consider caching strategies for frequently accessed data",
      "Contact third-party support if service issues persist"
    ],
    prevention: [
      "Test integrations thoroughly in development environment",
      "Maintain backup data sources when possible",
      "Monitor third-party service health",
      "Keep API documentation and credentials updated"
    ],
    relatedTopics: ["api-management", "data-sync", "system-architecture"]
  },
  {
    id: "performance-issues",
    category: "Technical",
    title: "Application Performance Problems",
    description: "Slow loading times, timeouts, or poor responsiveness in your custom application.",
    symptoms: [
      "Slow page loading times",
      "Database query timeouts",
      "Unresponsive user interface",
      "High server resource usage"
    ],
    solutions: [
      "Optimize database queries and indexes",
      "Implement caching for frequently accessed data",
      "Compress images and optimize file sizes",
      "Review and optimize critical user workflows",
      "Monitor server resources and scale if needed",
      "Clear browser cache and cookies"
    ],
    prevention: [
      "Regular performance monitoring and testing",
      "Database maintenance and optimization",
      "Implement proper caching strategies",
      "Plan for traffic growth and scaling"
    ],
    relatedTopics: ["database-optimization", "caching", "server-scaling"]
  },

  // Data Management
  {
    id: "data-migration-issues",
    category: "Data Management",
    title: "Data Import/Migration Problems",
    description: "Issues with transferring data from legacy systems or importing existing data.",
    symptoms: [
      "Data formatting errors during import",
      "Missing or corrupted data after migration",
      "Duplicate records in the new system",
      "Validation errors preventing data import"
    ],
    solutions: [
      "Validate data format before migration",
      "Clean and standardize data in source system",
      "Use data mapping tools to match fields correctly",
      "Run test migrations with sample data first",
      "Implement data validation rules in target system",
      "Create backup of original data before migration"
    ],
    prevention: [
      "Conduct data audit before migration planning",
      "Establish data quality standards",
      "Plan migration in phases with validation checkpoints",
      "Train team on data entry best practices"
    ],
    relatedTopics: ["data-quality", "data-validation", "backup-strategies"]
  },
  {
    id: "backup-recovery",
    category: "Data Management",
    title: "Data Backup and Recovery",
    description: "Issues with data backup systems or need for data recovery.",
    symptoms: [
      "Failed backup processes",
      "Accidental data deletion",
      "Corrupted database files",
      "Need to restore previous version of data"
    ],
    solutions: [
      "Immediately stop using the system to prevent data overwriting",
      "Contact support team for emergency recovery assistance",
      "Check recent backup status and integrity",
      "Use database transaction logs for point-in-time recovery",
      "Implement application-level data recovery tools",
      "Document the incident for future prevention"
    ],
    prevention: [
      "Regular automated backup testing",
      "Multiple backup storage locations",
      "User training on data handling procedures",
      "Implement soft delete for critical data"
    ],
    relatedTopics: ["backup-testing", "disaster-recovery", "data-security"]
  },

  // User Management
  {
    id: "access-permissions",
    category: "User Management",
    title: "User Access and Permission Issues",
    description: "Problems with user authentication, authorization, or access control.",
    symptoms: [
      "Users cannot log in to the application",
      "Access denied errors for legitimate users",
      "Users seeing data they shouldn't have access to",
      "Password reset issues"
    ],
    solutions: [
      "Verify user account status and permissions",
      "Check role assignments and access rules",
      "Reset user passwords through admin panel",
      "Review and update security group memberships",
      "Clear browser cache and try incognito mode",
      "Contact administrator to verify account setup"
    ],
    prevention: [
      "Regular user access reviews and audits",
      "Clear documentation of roles and permissions",
      "User training on account security best practices",
      "Implement proper user onboarding procedures"
    ],
    relatedTopics: ["user-roles", "security-policies", "account-management"]
  },

  // Training and Adoption
  {
    id: "user-adoption",
    category: "Training & Adoption",
    title: "Low User Adoption or Resistance",
    description: "Users not utilizing the new application or preferring old systems.",
    symptoms: [
      "Low application usage metrics",
      "Users reverting to old processes",
      "Complaints about application complexity",
      "Incomplete data entry or workflow completion"
    ],
    solutions: [
      "Conduct additional user training sessions",
      "Create simplified quick-start guides",
      "Identify and address specific user pain points",
      "Implement gradual rollout with pilot groups",
      "Provide hands-on support during transition period",
      "Gather user feedback and implement improvements"
    ],
    prevention: [
      "Involve users in design and testing phases",
      "Provide comprehensive training before go-live",
      "Create user champions within each department",
      "Plan change management strategy"
    ],
    relatedTopics: ["change-management", "user-training", "feedback-collection"]
  },

  // Maintenance and Updates
  {
    id: "update-issues",
    category: "Maintenance",
    title: "Application Update and Maintenance Problems",
    description: "Issues arising from system updates, patches, or routine maintenance.",
    symptoms: [
      "Application errors after updates",
      "New features not working as expected",
      "Lost customizations after updates",
      "Compatibility issues with other systems"
    ],
    solutions: [
      "Roll back to previous version if critical issues occur",
      "Test all critical workflows after updates",
      "Review update changelog for breaking changes",
      "Update browser and clear cache after application updates",
      "Verify third-party integrations still function",
      "Contact support team for update-related issues"
    ],
    prevention: [
      "Test updates in staging environment first",
      "Schedule updates during low-usage periods",
      "Maintain documentation of customizations",
      "Plan rollback procedures before updates"
    ],
    relatedTopics: ["update-management", "testing-procedures", "rollback-plans"]
  },

  // Security Issues
  {
    id: "security-concerns",
    category: "Security",
    title: "Security and Compliance Issues",
    description: "Security breaches, compliance violations, or suspicious activity.",
    symptoms: [
      "Unusual login activity or failed login attempts",
      "Unauthorized access to sensitive data",
      "Compliance audit findings",
      "Suspicious system behavior or performance"
    ],
    solutions: [
      "Immediately change passwords for affected accounts",
      "Review user access logs for unauthorized activity",
      "Enable additional security measures (2FA, IP restrictions)",
      "Conduct security audit of user permissions",
      "Update security policies and procedures",
      "Contact security team or IT support immediately"
    ],
    prevention: [
      "Regular security training for all users",
      "Implement strong password policies",
      "Regular security audits and penetration testing",
      "Keep security documentation updated"
    ],
    relatedTopics: ["security-policies", "compliance-management", "incident-response"]
  }
];

export const troubleshootingCategories = [
  "All",
  "Project Management",
  "Technical",
  "Data Management", 
  "User Management",
  "Training & Adoption",
  "Maintenance",
  "Security"
];

export function searchTroubleshootingGuides(query: string, category: string = "All"): TroubleshootingGuide[] {
  let filteredGuides = troubleshootingGuides;
  
  if (category !== "All") {
    filteredGuides = filteredGuides.filter(guide => guide.category === category);
  }
  
  if (query.trim()) {
    const searchTerm = query.toLowerCase();
    filteredGuides = filteredGuides.filter(guide => 
      guide.title.toLowerCase().includes(searchTerm) ||
      guide.description.toLowerCase().includes(searchTerm) ||
      guide.symptoms.some(symptom => symptom.toLowerCase().includes(searchTerm)) ||
      guide.solutions.some(solution => solution.toLowerCase().includes(searchTerm)) ||
      guide.relatedTopics.some(topic => topic.toLowerCase().includes(searchTerm))
    );
  }
  
  return filteredGuides;
}