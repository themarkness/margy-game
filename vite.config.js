import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  publicDir: 'images',
  base: process.env.BASE_PATH || '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: './index.html',
        page2: './page-2.html',
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
