import { defineConfig } from 'vite'

export default defineConfig({
  root: 'docs',
  base: '/conway/',
  build:{
    outDir: 'dist',
    emptyOutDir: true,
  }
})
