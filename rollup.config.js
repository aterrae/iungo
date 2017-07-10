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
        exclude: 'node_modules/**'
    })
];

export default {
    entry: './src/index.js',
    plugins: plugins,
    external: [
        'ansi-html',
        'glob',
        'gulp-util',
        'handlebars',
        'through2',
        'fs',
        'path'
    ],
    globals: {
        'ansi-html': 'ansiHTML',
        'glob': 'glob',
        'gulp-util': 'gutil',
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
    ]
};
