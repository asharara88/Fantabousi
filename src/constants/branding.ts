/**
 * Biowell Branding Constants
 * 
 * All brand assets stored in Supabase storage bucket 'biowelllogos'
 * Signed URLs are valid until the expiration date in the token
 */

export const BIOWELL_LOGOS = {
  // Light theme logo (shows in light mode)
  LIGHT_THEME: "https://gokabiyxdubdablehnpz.supabase.co/storage/v1/object/sign/logos/light%20theme%20logo.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hNzQ5MDc4Yi1iZTZjLTQ4NWUtODRlMC0zNjlhZWQyNDk3N2YiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJsb2dvcy9saWdodCB0aGVtZSBsb2dvLnN2ZyIsImlhdCI6MTc1NDUzMTIwNCwiZXhwIjoxNzg2MDY3MjA0fQ.jsNvoPte7e-QcOu7-TxpYSQF4RbmBWnTJjlw_9VQrxY",
  
  // Dark theme logo (shows in dark mode)
  DARK_THEME: "https://gokabiyxdubdablehnpz.supabase.co/storage/v1/object/sign/logos/dark%20theme%20logo.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hNzQ5MDc4Yi1iZTZjLTQ4NWUtODRlMC0zNjlhZWQyNDk3N2YiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJsb2dvcy9kYXJrIHRoZW1lIGxvZ28uc3ZnIiwiaWF0IjoxNzU0NTMxMTA3LCJleHAiOjE3ODYwNjcxMDd9.Kb2ZGPjnl4ce41j_H4aE_ux5rIt_0hVihhkTkBXIxn0"
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
export const getBiowellLogo = (actualTheme: 'light' | 'dark'): string => {
  return actualTheme === 'dark' ? BIOWELL_LOGOS.DARK_THEME : BIOWELL_LOGOS.LIGHT_THEME;
};
