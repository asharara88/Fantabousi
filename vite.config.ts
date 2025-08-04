import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: '.',
  plugins: [
    react({
      fastRefresh: true,
    }),
  ],
  server: {
    port: 4000, // Run on port 4000
    hmr: {
      overlay: true,
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: true,
    // Increase the chunk size warning limit
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      input: 'index.html',
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-tabs'],
          'chart-vendor': ['chart.js', 'react-chartjs-2'],
          'supabase': ['@supabase/supabase-js', '@supabase/auth-helpers-react'],
          'supplements': ['./src/components/supplements/SupplementCard.tsx', './src/components/supplements/SupplementGrid.tsx'],
          'chat': ['./src/components/chat/AIHealthCoach.tsx', './src/components/chat/ChatMessage.tsx'],
        },
        // Optimize chunk names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: ({name}) => {
          if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/\.css$/.test(name ?? '')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react-router-dom', 'framer-motion', 'lucide-react', 'zustand']
  },
  // Add base URL for production
  base: '/',
  // Add performance optimizations
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    treeShaking: true,
  }
});