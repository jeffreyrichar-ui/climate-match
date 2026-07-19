import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/climate-match/',
  plugins: [react()],
  server: { port: 5173 },
  build: {
    rollupOptions: {
      input: {
        // Existing climate-match app (unchanged entry).
        main: resolve(__dirname, 'index.html'),
        // New, self-contained Faith Match questionnaire.
        faith: resolve(__dirname, 'faith.html'),
      },
    },
  },
});
