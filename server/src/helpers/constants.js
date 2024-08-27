export const INCIDENT_CATEGORIES = [
  'Academic Issues',
  'Facilities Issues',
  'IT and Technical Support',
  'Health and Safety',
  'Behavioral Concerns',
  'Security Incidents',
  'Student Welfare',
  'Event-Related Incidents',
  'Administrative and Financial Issues',
  'Other',
];

export const INCIDENT_CATEGORIES_ENUM = Object.freeze({
  academicIssues: 'Academic Issues',
  facilitiesIssues: 'Facilities Issues',
  itAndTechinicalSupport: 'IT and Technical Support',
  healthAndSafety: 'Health and Safety',
  behavioralConcerns: 'Behavioral Concerns',
  securityIncidents: 'Security Incidents',
  studentWelfare: 'Student Welfare',
  eventRelatedIncidents: 'Event-Related Incidents',
  administrativeAndFinancialIssues: 'Administrative and Financial Issues',
  other: 'Other',
});

export const INCIDENT_STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

export const INCIDENT_STATUSES_ENUM = Object.freeze({
  open: 'OPEN',
  inProgress: 'IN_PROGRESS',
  resolved: 'RESOLVED',
  closed: 'CLOSED',
});

export const OPERATIONAL_ROLES = ['SUPPORT', 'ADMIN'];

export const ENUM_USER_ROLES = Object.freeze({
  STUDENT: 'STUDENT',
  SUPPORT: 'SUPPORT',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
});

export const SEVERITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical'];
