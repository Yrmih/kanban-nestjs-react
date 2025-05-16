import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';
import tailwindcss from '@tailwindcss/vite'; // ✅ importa o plugin do Tailwind

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    tailwindcss(), // ✅ adiciona aqui
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
});
