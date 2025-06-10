import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc'; // Changed from @vitejs/plugin-react
import path from 'path'; // Added for alias
import { componentTagger } from 'lovable-tagger'; // Added for lovable-tagger

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({ // Changed to function to access mode
  server: { // Added server configuration
    host: '::', // Keep consistent with other configs
    port: 5173, // Set desired port
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(), // Added lovable-tagger conditionally
  ].filter(Boolean), // Filter out false values if not in development
  resolve: { // Added resolve alias
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'], // Kept this as it was present
  },
}));
