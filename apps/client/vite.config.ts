import path from 'node:path';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
  ],
  resolve: {
    alias: {
      '@client': path.resolve(__dirname, './src'),
      '@server': path.resolve(__dirname, '../server/src'),
      '@shared': path.resolve(__dirname, '../shared/src'),
    },
  },
});
