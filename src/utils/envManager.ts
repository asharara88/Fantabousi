// Environment validation and API configuration management
import { createClient } from '@supabase/supabase-js';

interface EnvironmentConfig {
  supabase: {
    url: string;
    anonKey: string;
    isConfigured: boolean;
  };
  apis: {
    openai: { key: string; isConfigured: boolean };
    elevenlabs: { key: string; isConfigured: boolean };
    rapidapi: { key: string; isConfigured: boolean };
    spoonacular: { key: string; isConfigured: boolean };
  };
  development: {
    demoMode: boolean;
    isDevelopment: boolean;
  };
}

export class EnvironmentManager {
  private static instance: EnvironmentManager;
  private config: EnvironmentConfig;

  private constructor() {
    this.config = this.validateEnvironment();
    this.logConfiguration();
  }

  static getInstance(): EnvironmentManager {
    if (!EnvironmentManager.instance) {
      EnvironmentManager.instance = new EnvironmentManager();
    }
    return EnvironmentManager.instance;
  }

  private validateEnvironment(): EnvironmentConfig {
    const getEnvVar = (key: string): string => import.meta.env[key] || '';
    
    const isPlaceholder = (value: string): boolean => {
      return !value || 
             value.includes('your-') || 
             value.includes('placeholder') || 
             value === '' ||
             value === 'undefined';
    };

    const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
    const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');
    const openaiKey = getEnvVar('VITE_OPENAI_API_KEY');
    const elevenlabsKey = getEnvVar('VITE_ELEVENLABS_API_KEY');
    const rapidapiKey = getEnvVar('VITE_RAPIDAPI_KEY');
    const spoonacularKey = getEnvVar('VITE_SPOONACULAR_API_KEY');
    const demoMode = getEnvVar('VITE_DEMO_MODE') === 'true';

    return {
      supabase: {
        url: supabaseUrl,
        anonKey: supabaseAnonKey,
        isConfigured: !isPlaceholder(supabaseUrl) && !isPlaceholder(supabaseAnonKey)
      },
      apis: {
        openai: { 
          key: openaiKey, 
          isConfigured: !isPlaceholder(openaiKey) 
        },
        elevenlabs: { 
          key: elevenlabsKey, 
          isConfigured: !isPlaceholder(elevenlabsKey) 
        },
        rapidapi: { 
          key: rapidapiKey, 
          isConfigured: !isPlaceholder(rapidapiKey) 
        },
        spoonacular: { 
          key: spoonacularKey, 
          isConfigured: !isPlaceholder(spoonacularKey) 
        }
      },
      development: {
        demoMode: demoMode || !this.hasAnyApiKeys(),
        isDevelopment: import.meta.env.DEV
      }
    };
  }

  private hasAnyApiKeys(): boolean {
    const { apis } = this.config;
    return Object.values(apis).some(api => api.isConfigured);
  }

  private logConfiguration(): void {
    const { supabase, apis, development } = this.config;
    
    console.group('🔧 Biowell API Configuration');
    
    // Supabase status
    if (supabase.isConfigured) {
      console.log('✅ Supabase: Configured');
    } else {
      console.warn('⚠️ Supabase: Using placeholder values - some features may not work');
    }

    // API status
    Object.entries(apis).forEach(([name, config]) => {
      if (config.isConfigured) {
        console.log(`✅ ${name.toUpperCase()}: Configured`);
      } else {
        console.log(`⚪ ${name.toUpperCase()}: Not configured (will use fallbacks)`);
      }
    });

    // Development mode
    if (development.demoMode) {
      console.log('🎭 Demo Mode: Active (using mock data)');
    }

    console.groupEnd();
  }

  getConfig(): EnvironmentConfig {
    return { ...this.config };
  }

  getSupabaseClient() {
    const { supabase } = this.config;
    
    if (!supabase.isConfigured) {
      console.warn('Supabase not configured, creating client with placeholders');
      return createClient(
        'https://placeholder.supabase.co',
        'placeholder-key'
      );
    }

    return createClient(supabase.url, supabase.anonKey);
  }

  isApiConfigured(apiName: keyof EnvironmentConfig['apis']): boolean {
    return this.config.apis[apiName].isConfigured;
  }

  isDemoMode(): boolean {
    return this.config.development.demoMode;
  }

  shouldUseFallback(apiName: keyof EnvironmentConfig['apis']): boolean {
    return !this.isApiConfigured(apiName) || this.isDemoMode();
  }
}

// Export singleton instance
export const envManager = EnvironmentManager.getInstance();

// Export configuration for easy access
export const config = envManager.getConfig();
export const supabase = envManager.getSupabaseClient();
