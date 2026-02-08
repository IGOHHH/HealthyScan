
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Manual definition of process.env.API_KEY and loadEnv call removed to fix process.cwd() error 
  // and follow Gemini API guidelines to assume API_KEY is pre-configured.
});
