import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/climate-match/',
  plugins: [react()],
  server: { port: 5173 },
});
