import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@app': path.resolve(__dirname, './src/app'),
      '@modules': path.resolve(__dirname, './src/modules'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@central-pet/ui/tokens.css': path.resolve(
        __dirname,
        '../../packages/ui/src/tokens/tokens.css',
      ),
      '@central-pet/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@central-pet/shared': path.resolve(__dirname, '../../packages/shared/src'),
      '@central-pet/domain': path.resolve(__dirname, '../../packages/domain/src'),
      '@central-pet/application': path.resolve(__dirname, '../../packages/application/src'),
      '@central-pet/infrastructure': path.resolve(
        __dirname,
        '../../packages/infrastructure/src',
      ),
    },
  },
  server: {
    port: 5174,
    host: true,
  },
});
