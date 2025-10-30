import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@fsm/config': path.resolve(__dirname, '../../packages/config/src'),
      '@fsm/types': path.resolve(__dirname, '../../packages/types/src'),
      '@fsm/core': path.resolve(__dirname, '../../packages/core/src'),
      '@fsm/ui-web': path.resolve(__dirname, '../../packages/ui-web/src')
    }
  },
  server: {
    port: 5173,
    open: false
  }
});