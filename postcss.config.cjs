/**
 * PostCSS configuration for Tailwind CSS.
 *
 * Vite reads this file using CommonJS, so we need to export via
 * `module.exports` instead of using ES module syntax. Using `export default`
 * here can result in PostCSS failing to load the Tailwind plugin, which
 * causes the generated CSS to be empty and the app to appear unstyled.
 */
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
