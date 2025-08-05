/**
 * Biowell Branding Constants
 * 
 * All brand assets stored in Supabase storage bucket 'biowelllogos'
 * Signed URLs are valid until the expiration date in the token
 */

export const BIOWELL_LOGOS = {
  // Light theme logo (shows in light mode)
  LIGHT_THEME: "https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/biowelllogos/Biowell_logo_light_theme.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaW93ZWxsbG9nb3MvQmlvd2VsbF9sb2dvX2xpZ2h0X3RoZW1lLnN2ZyIsImlhdCI6MTc1MjY2MzQ0NiwiZXhwIjoxNzg0MTk5NDQ2fQ.gypGnDpYXvYFyGCKWfeyCrH4fYBGEcNOKurPfcbUcWY",
  
  // Dark theme logo (shows in dark mode)
  DARK_THEME: "https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/biowelllogos/Biowell_Logo_Dark_Theme.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaW93ZWxsbG9nb3MvQmlvd2VsbF9Mb2dvX0RhcmtfVGhlbWUuc3ZnIiwiaWF0IjoxNzUyNjYzNDE4LCJleHAiOjE3ODQxOTk0MTh9.itsGbwX4PiR9BYMO_jRyHY1KOGkDFiF-krdk2vW7cBE"
} as const;

/**
 * Brand Colors (extracted from your existing design)
 */
export const BIOWELL_COLORS = {
  PRIMARY: "rgb(var(--color-primary))",
  SECONDARY: "rgb(var(--color-secondary))", 
  TERTIARY: "rgb(var(--color-tertiary))",
  ACCENT: "rgb(var(--color-accent))"
} as const;

/**
 * Brand Typography
 */
export const BIOWELL_FONTS = {
  HEADING: "var(--font-heading)",
  BODY: "var(--font-body)"
} as const;

/**
 * Brand Messaging
 */
export const BIOWELL_COPY = {
  TAGLINE: "Your Personal Health Coach",
  SUBTITLE: "Optimize your everyday.",
  FOOTER: "© 2025 Biowell AI - Personal Digital Health Coach",
  DESCRIPTION: "AI-powered insights tailored to your unique health profile, genetic data, and lifestyle patterns for precision wellness."
} as const;

/**
 * Logo Component Helper
 * Returns the appropriate logo URL based on theme
 */
export const getBiowellLogo = (isDarkMode: boolean): string => {
  return isDarkMode ? BIOWELL_LOGOS.DARK_THEME : BIOWELL_LOGOS.LIGHT_THEME;
};
