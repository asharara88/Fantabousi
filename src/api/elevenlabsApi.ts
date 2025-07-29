import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Voice {
  voice_id: string;
  name: string;
  preview_url: string;
  category: string;
}

export interface VoiceSettings {
  stability: number;
  similarity_boost: number;
}

export interface UserInfo {
  subscription: {
    tier: string;
    character_count: number;
    character_limit: number;
    next_character_reset_unix: number;
  };
}

// API functions
export const elevenlabsApi = {
  // Check if ElevenLabs is configured
  isConfigured: async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('elevenlabs-proxy/user');
      return !error && !!data;
    } catch (error) {
      console.error('Error checking ElevenLabs configuration:', error);
      return false;
    }
  },
  
  // Get available voices
  getVoices: async (): Promise<Voice[]> => {
    try {
      const { data, error } = await supabase.functions.invoke('elevenlabs-proxy/voices');
      
      if (error) throw error;
      return data.voices || [];
    } catch (error) {
      console.error('Error getting voices:', error);
      return [];
    }
  },
  
  // Get user info
  getUserInfo: async (): Promise<UserInfo | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('elevenlabs-proxy/user');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting user info:', error);
      return null;
    }
  },
  
  // Get voice settings
  getVoiceSettings: async (voiceId: string): Promise<VoiceSettings | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('elevenlabs-proxy/voice-settings', {
        body: { voiceId }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting voice settings:', error);
      return null;
    }
  },
  
  // Convert text to speech
  textToSpeech: async (
    text: string, 
    voiceId: string, 
    settings?: { stability?: number; similarity_boost?: number }
  ): Promise<ArrayBuffer | null> => {
    try {
      try {
        // First check if we have a cached version
        const cacheKey = `${voiceId}_${text}_${settings?.stability || 0.5}_${settings?.similarity_boost || 0.75}`;
        const { data: user } = await supabase.auth.getUser();
        
        if (!user.user) {
          console.warn('User not authenticated, skipping cache check');
        } else {
          // Try to get from cache
          const { data: cacheData, error: cacheError } = await supabase
            .from('audio_cache')
            .select('audio_data')
            .eq('cache_key', cacheKey)
            .eq('user_id', user.user.id)
            .single();
          
          if (!cacheError && cacheData?.audio_data) {
            console.log('Using cached audio response');
            // Convert base64 to ArrayBuffer
            const binaryString = atob(cacheData.audio_data);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes.buffer;
          }
        }
        
        // If not cached or error, make the API call
        console.log('Fetching new audio from ElevenLabs API');
        const response = await supabase.functions.invoke('elevenlabs-proxy/text-to-speech', {
          body: {
            text,
            voiceId,
            stability: settings?.stability,
            similarity_boost: settings?.similarity_boost
          },
          responseType: 'arraybuffer'
        });
        
        if (response.error) throw new Error(response.error.message);
        
        // Cache the result if user is authenticated
        const audioData = response.data;
        if (audioData && user.user) {
          try {
            // Convert ArrayBuffer to base64
            const bytes = new Uint8Array(audioData);
            let binary = '';
            for (let i = 0; i < bytes.byteLength; i++) {
              binary += String.fromCharCode(bytes[i]);
            }
            const base64 = btoa(binary);
            
            // Use upsert to handle both insert and update cases
            const { error: upsertError } = await supabase.from('audio_cache').upsert({
              user_id: user.user.id, 
              cache_key: cacheKey,
              audio_data: base64,
              expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
            });
            
            if (upsertError) {
              console.error('Error caching audio:', upsertError);
            } else {
              console.log('Audio cached successfully');
            }
          } catch (cacheError) {
            console.error('Error during audio caching:', cacheError);
            // Continue even if caching fails
          }
        }
        
        return audioData;
      } catch (innerError) {
        console.error('Error in text-to-speech processing:', innerError);
        throw innerError;
      }
    } catch (error) {
      console.error('Error converting text to speech:', error);
      return null;
    }
  }
};