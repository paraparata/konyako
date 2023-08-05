import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: '@assets',
        replacement: path.resolve(__dirname, 'src/assets'),
      },
      {
        find: '@components',
        replacement: path.resolve(__dirname, 'src/components'),
      },
      {
        find: '@libs',
        replacement: path.resolve(__dirname, 'src/libs'),
      },
      {
        find: '@views',
        replacement: path.resolve(__dirname, 'src/views'),
      },
      {
        find: '@assets',
        replacement: path.resolve(__dirname, 'src/assets'),
      },
    ],
  },
});
