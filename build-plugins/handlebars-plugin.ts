import { readFileSync } from 'fs';
import type { Plugin } from 'esbuild';

/**
 * esbuild plugin to import .hbs files as strings
 */
export const handlebarsPlugin = (): Plugin => ({
  name: 'handlebars',
  setup(build) {
    build.onLoad({ filter: /\.hbs$/ }, async (args) => {
      const contents = readFileSync(args.path, 'utf8');
      return {
        contents: `export default ${JSON.stringify(contents)}`,
        loader: 'js',
      };
    });
  },
});
