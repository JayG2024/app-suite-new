import { supabase } from '@/lib/supabase';

// Session refresh utility
export const refreshSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    
    if (session) {
      // Refresh the session if it exists
      const { data: { session: refreshedSession }, error: refreshError } = 
        await supabase.auth.refreshSession();
      
      if (refreshError) {
        console.error('Error refreshing session:', refreshError);
        return null;
      }
      
      return refreshedSession;
    }
    
    return session;
  } catch (error) {
    console.error('Session refresh error:', error);
    return null;
  }
};

// Ensure session persists across page reloads
export const ensureSessionPersistence = () => {
  // Check session on page load
  window.addEventListener('load', async () => {
    await refreshSession();
  });
  
  // Check session on visibility change (tab becomes active)
  document.addEventListener('visibilitychange', async () => {
    if (!document.hidden) {
      await refreshSession();
    }
  });
  
  // Periodic session check (every 5 minutes)
  setInterval(async () => {
    await refreshSession();
  }, 5 * 60 * 1000);
};

// Form data persistence utilities
export const saveFormData = (formId: string, data: any) => {
  try {
    const key = `form_data_${formId}`;
    sessionStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error('Error saving form data:', error);
  }
};

export const loadFormData = (formId: string) => {
  try {
    const key = `form_data_${formId}`;
    const stored = sessionStorage.getItem(key);
    
    if (!stored) return null;
    
    const { data, timestamp } = JSON.parse(stored);
    
    // Clear data older than 1 hour
    if (Date.now() - timestamp > 60 * 60 * 1000) {
      sessionStorage.removeItem(key);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error loading form data:', error);
    return null;
  }
};

export const clearFormData = (formId: string) => {
  try {
    const key = `form_data_${formId}`;
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing form data:', error);
  }
};

// Utility to handle Supabase errors gracefully
export const handleSupabaseError = (error: any) => {
  if (error?.message?.includes('JWT')) {
    // Session expired, try to refresh
    refreshSession();
    return 'Session expired. Please try again.';
  }
  
  if (error?.message?.includes('Network')) {
    return 'Network error. Please check your connection.';
  }
  
  return error?.message || 'An unexpected error occurred.';
};