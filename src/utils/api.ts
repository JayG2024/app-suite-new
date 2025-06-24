// Centralized API endpoints configuration
// All API calls go through Netlify Functions

const API_BASE = '/.netlify/functions';

export const API_ENDPOINTS = {
  // Auth
  auth: {
    login: `${API_BASE}/auth-login`,
    resetPassword: `${API_BASE}/auth-reset-password`,
  },
  
  // Core entities
  leads: `${API_BASE}/leads`,
  clients: `${API_BASE}/clients`,
  projects: `${API_BASE}/projects`,
  tasks: `${API_BASE}/tasks`,
  users: `${API_BASE}/users`,
  invoices: `${API_BASE}/invoices`,
  expenses: `${API_BASE}/expenses`,
  messages: `${API_BASE}/messages`,
  
  // Features
  documents: `${API_BASE}/documents`,
  emailTemplates: `${API_BASE}/email-templates`,
  campaigns: `${API_BASE}/campaigns`,
  activityLog: `${API_BASE}/activity-log`,
  
  // AI features
  ai: {
    generateContent: `${API_BASE}/ai-generate-content`,
    chatbot: `${API_BASE}/ai-chatbot`,
  },
  
  // Dashboard
  dashboard: {
    metrics: `${API_BASE}/dashboard-metrics`,
    analytics: `${API_BASE}/analytics`,
  },
  
  // Email
  email: {
    send: `${API_BASE}/send-email`,
    sendProposal: `${API_BASE}/send-proposal`,
    sendContact: `${API_BASE}/send-contact`,
  }
};

// Helper function to make API calls
export async function apiCall(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const token = localStorage.getItem('authToken');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}