import { defineConfig } from 'tsup'

export default defineConfig({
  entryPoints: ['src/node.ts', 'src/browser.ts'],
  outDir: 'dist',
  format: ['esm'],
  tsconfig: './tsconfig.json',
  target: 'es2018',
  minify: false,
  minifySyntax: true,
  minifyWhitespace: false,
  minifyIdentifiers: true,
  clean: true,
  dts: true,
})
