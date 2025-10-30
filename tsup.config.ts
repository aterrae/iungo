import { defineConfig } from 'tsup';
import { handlebarsPlugin } from './build-plugins/handlebars-plugin';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  clean: true,
  splitting: false,
  sourcemap: true,
  treeshake: true,
  dts: true,
  esbuildPlugins: [handlebarsPlugin()],
});
