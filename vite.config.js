// vite.config.js
import { defineConfig } from 'vite';
import { createVuePlugin } from 'vite-plugin-vue2';
import path from 'path';

export default defineConfig({
  plugins: [createVuePlugin()],
  server: {
    port: 5173,
    open: true
  },
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, './src')
    }
  }
});