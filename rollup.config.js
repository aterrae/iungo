import commonjs from 'rollup-plugin-commonjs';
import { string } from 'rollup-plugin-string';
import babel from 'rollup-plugin-babel';

let pkg = require('./package.json');

let plugins = [
  commonjs({
    include: 'node_modules/**',
  }),
  string({ include: 'src/partials/*.hbs' }),
  babel({
    babelrc: false,
    exclude: 'node_modules/**',
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
        },
      ],
    ],
  }),
];

let globals = {
  'ansi-html': 'ansiHTML',
  glob: 'glob',
  handlebars: 'Handlebars',
  'plugin-error': 'PluginError',
  through2: 'through',
  fs: 'fs',
  path: 'path',
};

export default {
  input: './src/index.js',
  plugins: plugins,
  external: ['ansi-html', 'glob', 'handlebars', 'plugin-error', 'through2', 'fs', 'path'],
  output: [
    { file: pkg.main, format: 'cjs', globals: globals, exports: 'named', sourcemap: true },
    { file: pkg.module, format: 'es', globals: globals, exports: 'named', sourcemap: true },
  ],
};
