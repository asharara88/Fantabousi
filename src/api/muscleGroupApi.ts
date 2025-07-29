import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface MuscleGroupImage {
  imageUrl?: string;
  muscleGroup: string;
  color?: string;
  transparent?: boolean;
}

export interface MuscleGroupVisualization {
  primary: MuscleGroupImage[];
  secondary: MuscleGroupImage[];
}

export interface RecoveryState {
  muscleGroup: string;
  readiness: 'excellent' | 'good' | 'moderate' | 'poor';
  color: string;
}

// API functions
export const muscleGroupApi = {
  // Get base muscle group image
  getBaseImage: async (transparentBackground: boolean = false): Promise<string | null> => {
    try {
      // Return fallback SVG placeholder
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgNTBWMzUwTTUwIDIwMEgzNTAiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3MjgwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiPk11c2NsZSBHcm91cCBJbWFnZTwvdGV4dD4KPHRleHQgeD0iMjAwIiB5PSIyMzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2QjcyODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+Tm90IEF2YWlsYWJsZTwvdGV4dD4KPC9zdmc+';
      const { data, error } = await supabase.functions.invoke('muscle-group-images', {
        body: {},
        method: 'GET'
      });
      
      const url = `${supabaseUrl}/functions/v1/muscle-group-images?endpoint=getBaseImage&transparentBackground=${transparentBackground ? 1 : 0}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to get base image');
      
      const result = await response.json();
      return result.imageUrl || null;
    } catch (error) {
      console.error('Error getting base muscle group image:', error);
      return null;
    }
  },

  // Get individual colored muscle group image
  getColoredMuscleImage: async (
    muscleGroup: string, 
    colorHex: string = '#FF0000', 
    transparentBackground: boolean = true
  ): Promise<string | null> => {
    try {
      const url = `${supabaseUrl}/functions/v1/muscle-group-images?endpoint=getIndividualColorImage&muscleGroup=${encodeURIComponent(muscleGroup)}&colorHex=${encodeURIComponent(colorHex)}&transparentBackground=${transparentBackground ? 1 : 0}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error(`Failed to get colored muscle image for ${muscleGroup}`);
      
      const result = await response.json();
      return result.imageUrl || null;
    } catch (error) {
      console.error(`Error getting colored muscle image for ${muscleGroup}:`, error);
     // Return fallback SVG placeholder with the requested color
     return `data:image/svg+xml;base64,${btoa(`<svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="400" height="400" fill="transparent"/>
<circle cx="200" cy="200" r="80" fill="${colorHex}" opacity="0.7"/>
<text x="200" y="210" text-anchor="middle" fill="#374151" font-family="Arial" font-size="12">${muscleGroup}</text>
</svg>`)}`;
    }
  },

  // Get dual color muscle group image
  getDualColorMuscleImage: async (
    muscleGroup: string,
    primaryColor: string = '#FF0000',
    secondaryColor: string = '#00FF00',
    transparentBackground: boolean = true
  ): Promise<string | null> => {
    try {
      const url = `${supabaseUrl}/functions/v1/muscle-group-images?endpoint=getDualColorImage&muscleGroup=${encodeURIComponent(muscleGroup)}&colorHex=${encodeURIComponent(primaryColor)}&colorHex2=${encodeURIComponent(secondaryColor)}&transparentBackground=${transparentBackground ? 1 : 0}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error(`Failed to get dual color muscle image for ${muscleGroup}`);
      
      const result = await response.json();
      return result.imageUrl || null;
    } catch (error) {
      console.error(`Error getting dual color muscle image for ${muscleGroup}:`, error);
      // Return fallback SVG placeholder with the requested color
      return `data:image/svg+xml;base64,${btoa(`<svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="400" height="400" fill="transparent"/>
<circle cx="200" cy="200" r="100" fill="${primaryColor}" opacity="0.7"/>
<text x="200" y="210" text-anchor="middle" fill="#374151" font-family="Arial" font-size="14">${muscleGroup}</text>
</svg>`)}`;
    }
  },

  // Get exercise muscle group visualization
  getExerciseMuscleVisualization: async (
    primaryMuscles: string[],
    secondaryMuscles: string[] = []
  ): Promise<MuscleGroupVisualization> => {
    try {
      const visualization: MuscleGroupVisualization = {
        primary: [],
        secondary: []
      };

      // Get primary muscle images (red)
      for (const muscle of primaryMuscles) {
        const imageUrl = await muscleGroupApi.getColoredMuscleImage(muscle, '#FF0000', true);
        if (imageUrl) {
          visualization.primary.push({
            muscleGroup: muscle,
            imageUrl,
            color: '#FF0000',
            transparent: true
          });
        } else {
          // Add fallback entry
          visualization.primary.push({
            muscleGroup: muscle,
            imageUrl: `data:image/svg+xml;base64,${btoa(`<svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="400" height="400" fill="transparent"/>
<circle cx="200" cy="200" r="80" fill="#ef4444" opacity="0.7"/>
<text x="200" y="210" text-anchor="middle" fill="#374151" font-family="Arial" font-size="12">${muscle}</text>
</svg>`)}`,
            color: '#ef4444'
          });
        }
      }

      // Get secondary muscle images (orange)
      for (const muscle of secondaryMuscles) {
        const imageUrl = await muscleGroupApi.getColoredMuscleImage(muscle, '#FFA500', true);
        if (imageUrl) {
          visualization.secondary.push({
            muscleGroup: muscle,
            imageUrl,
            color: '#FFA500',
            transparent: true
          });
        } else {
          // Add fallback entry
          visualization.secondary.push({
            muscleGroup: muscle,
            imageUrl: `data:image/svg+xml;base64,${btoa(`<svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="400" height="400" fill="transparent"/>
<circle cx="200" cy="200" r="60" fill="#f59e0b" opacity="0.7"/>
<text x="200" y="210" text-anchor="middle" fill="#374151" font-family="Arial" font-size="12">${muscle}</text>
</svg>`)}`,
            color: '#f59e0b'
          });
        }
      }

      return visualization;
    } catch (error) {
      console.error('Error getting exercise muscle visualization:', error);
      // Return fallback visualization
      return {
        primary: [],
        secondary: []
      };
    }
  },

  // Get recovery state visualization
  getRecoveryVisualization: async (recoveryStates: RecoveryState[]): Promise<MuscleGroupImage[]> => {
    try {
      const images: MuscleGroupImage[] = [];

      for (const state of recoveryStates) {
        const imageUrl = await muscleGroupApi.getColoredMuscleImage(
          state.muscleGroup, 
          state.color, 
          true
        );
        
        if (imageUrl) {
          images.push({
            muscleGroup: state.muscleGroup,
            imageUrl,
            color: state.color,
            transparent: true
          });
        } else {
          // Add fallback entry
          images.push({
            muscleGroup: state.muscleGroup,
            imageUrl: `data:image/svg+xml;base64,${btoa(`<svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="400" height="400" fill="transparent"/>
<circle cx="200" cy="200" r="80" fill="${state.color}" opacity="0.7"/>
<text x="200" y="210" text-anchor="middle" fill="#374151" font-family="Arial" font-size="12">${state.muscleGroup}</text>
</svg>`)}`,
            color: state.color
          });
        }
      }

      return images;
    } catch (error) {
      console.error('Error getting recovery visualization:', error);
      return [];
    }
  },

  // Helper function to get recovery color based on readiness
  getRecoveryColor: (readiness: RecoveryState['readiness']): string => {
    switch (readiness) {
      case 'excellent':
        return '#00FF00'; // Green
      case 'good':
        return '#90EE90'; // Light Green
      case 'moderate':
        return '#FFA500'; // Orange
      case 'poor':
        return '#FF0000'; // Red
      default:
        return '#808080'; // Gray
    }
  },

  // Common muscle groups mapping
  muscleGroups: {
    chest: ['chest', 'pectorals'],
    back: ['back', 'lats', 'rhomboids', 'traps'],
    shoulders: ['shoulders', 'deltoids'],
    arms: ['biceps', 'triceps', 'forearms'],
    core: ['abs', 'obliques', 'core'],
    legs: ['quads', 'hamstrings', 'glutes', 'calves'],
    fullBody: ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'abs', 'quads', 'hamstrings', 'glutes', 'calves']
  }
};