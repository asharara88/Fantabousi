/**
 * Supplement Image Utility
 * Maps supplement names to local image files and provides fallback functionality
 */

import { SUPPLEMENTS_DATABASE } from '../data/supplementDatabase';

// Available supplement images mapped to local files
export const SUPPLEMENT_IMAGES: Record<string, string> = {
  'ashwagandha': '/supplements/ashwagandha.svg',
  'coq10': '/supplements/coq10.svg',
  'coenzyme-q10': '/supplements/coq10.svg',
  'creatine-monohydrate': '/supplements/creatine.svg',
  'creatine': '/supplements/creatine.svg',
  'curcumin': '/supplements/curcumin.svg',
  'turmeric': '/supplements/curcumin.svg',
  'iron-ferrous-bisglycinate': '/supplements/iron.svg',
  'iron': '/supplements/iron.svg',
  'magnesium-glycinate': '/supplements/magnesium-glycinate.svg',
  'magnesium': '/supplements/magnesium-glycinate.svg',
  'omega-3-epa-dha': '/supplements/omega-3.svg',
  'omega-3': '/supplements/omega-3.svg',
  'fish-oil': '/supplements/omega-3.svg',
  'probiotics': '/supplements/probiotics.svg',
  'probiotic': '/supplements/probiotics.svg',
  'vitamin-b12': '/supplements/vitamin-b12.svg',
  'b12': '/supplements/vitamin-b12.svg',
  'vitamin-c': '/supplements/vitamin-c.svg',
  'vitamin-d3': '/supplements/vitamin-d3.svg',
  'vitamin-d': '/supplements/vitamin-d3.svg',
  'zinc-picolinate': '/supplements/zinc.svg',
  'zinc': '/supplements/zinc.svg',
  'zinc-carnosine': '/supplements/zinc.svg',
  'multivitamin': '/supplements/vitamin-c.svg', // Use vitamin-c as generic
};

// Fallback image for supplements without specific images
const FALLBACK_IMAGE = '/supplements/vitamin-c.svg';

/**
 * Create normalized supplement ID from name for consistent matching
 */
export const createSupplementId = (name: string): string => {
  return name.toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with single
    .trim();
};

/**
 * Get the appropriate image URL for a supplement
 * @param supplementName - The name of the supplement
 * @param currentImageUrl - Current image URL (from database, optional)
 * @returns Local image path or fallback
 */
export function getSupplementImage(supplementName?: string, currentImageUrl?: string): string {
  // If there's already a valid local image URL, use it
  if (currentImageUrl && currentImageUrl.startsWith('/supplements/')) {
    return currentImageUrl;
  }

  // If no supplement name provided, use fallback
  if (!supplementName) {
    return FALLBACK_IMAGE;
  }

  // Normalize the supplement name for matching
  const normalizedName = createSupplementId(supplementName);
  
  // Check for exact matches first
  if (SUPPLEMENT_IMAGES[normalizedName]) {
    return SUPPLEMENT_IMAGES[normalizedName];
  }

  // Check for partial matches (supplement name contains key)
  for (const [key, imagePath] of Object.entries(SUPPLEMENT_IMAGES)) {
    if (normalizedName.includes(key) || key.includes(normalizedName.split('-')[0])) {
      return imagePath;
    }
  }

  // Return fallback if no match found
  return FALLBACK_IMAGE;
}

/**
 * Get supplement by name from database
 */
export const getSupplementByName = (name: string) => {
  const id = createSupplementId(name);
  return SUPPLEMENTS_DATABASE.find(supplement => supplement.id === id);
};

/**
 * Get all available supplement images
 * @returns Object mapping supplement names to image paths
 */
export function getAllSupplementImages(): Record<string, string> {
  return { ...SUPPLEMENT_IMAGES };
}

/**
 * Check if a supplement has a specific local image
 * @param supplementName - The name of the supplement
 * @returns boolean indicating if local image exists
 */
export function hasSupplementImage(supplementName?: string): boolean {
  if (!supplementName) return false;
  
  const normalizedName = createSupplementId(supplementName);
  return Object.keys(SUPPLEMENT_IMAGES).some(key => 
    normalizedName.includes(key) || key.includes(normalizedName)
  );
}

/**
 * Get random supplement image for fallback
 */
export const getRandomSupplementImage = (): string => {
  const images = Object.values(SUPPLEMENT_IMAGES);
  return images[Math.floor(Math.random() * images.length)];
};

/**
 * Validate and enhance supplement data with proper image URLs
 * @param supplements - Array of supplement objects
 * @returns Enhanced supplements with local image URLs
 */
export function enhanceSupplementsWithImages<T extends { name?: string; image_url?: string }>(
  supplements: T[]
): T[] {
  return supplements.map(supplement => ({
    ...supplement,
    image_url: getSupplementImage(supplement.name, supplement.image_url)
  }));
}
