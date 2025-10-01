// Environment variable validation
interface EnvConfig {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
  VITE_SENTRY_DSN?: string;
  VITE_OPENAI_API_KEY?: string;
  VITE_APP_VERSION?: string;
}

export const validateEnv = (): EnvConfig => {
  const env: EnvConfig = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
    VITE_OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
    VITE_APP_VERSION: import.meta.env.VITE_APP_VERSION,
  };

  // Required environment variables
  const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'] as const;
  
  const missing = required.filter(key => !env[key]);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  // Optional but recommended
  const recommended = ['VITE_SENTRY_DSN'] as const;
  const missingRecommended = recommended.filter(key => !env[key]);
  
  if (missingRecommended.length > 0) {
    console.warn('Missing recommended environment variables:', missingRecommended);
  }

  return env;
};

export const getEnvConfig = (): EnvConfig => {
  try {
    return validateEnv();
  } catch (error) {
    console.error('Environment validation failed:', error);
    throw error;
  }
};