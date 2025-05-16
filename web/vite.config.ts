import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';  // <-- importa o plugin
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    svgr()  // <-- adiciona o plugin aqui
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src') // <-- seu alias "~" para "src"
    }
  }
});
