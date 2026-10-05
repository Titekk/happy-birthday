import { defineConfig } from 'vite';

export default defineConfig({
  // Caminhos relativos: o dist/ funciona em qualquer subcaminho (ex.: GitHub Pages /happy-birthday/)
  base: './',
  build: {
    target: 'es2020',
    assetsInlineLimit: 0,
    // o único chunk grande é o three.js, carregado sob demanda só em desktop
    chunkSizeWarningLimit: 600,
  },
});
