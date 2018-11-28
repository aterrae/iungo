import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import string from 'rollup-plugin-string';
import babel from 'rollup-plugin-babel';

let pkg = require('./package.json');

let plugins = [
    resolve(),
    commonjs({
        include: 'node_modules/**'
    }),
    string({ include: 'src/*.hbs' }),
    babel({
        babelrc: false,
        exclude: 'node_modules/**',
        presets: [
            ["latest", {
                "es2015": {
                    "modules": false
                }
            }]
        ],
        plugins: ["external-helpers"]
    })
];

export default {
    entry: './src/index.js',
    plugins: plugins,
    external: [
        'ansi-html',
        'glob',
        'plugin-error',
        'handlebars',
        'through2',
        'fs',
        'path'
    ],
    globals: {
        'ansi-html': 'ansiHTML',
        'glob': 'glob',
        'plugin-error': 'PluginError',
        'handlebars': 'Handlebars',
        'through2': 'through',
        'fs': 'fs',
        'path': 'path'
    },
    targets: [
        {
            dest: pkg.main,
            format: 'cjs',
            sourceMap: true
        },
        {
            dest: pkg.module,
            format: 'es',
            sourceMap: true
        }
    ],
    exports: 'named'
};
