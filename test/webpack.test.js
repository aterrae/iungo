import path from 'path';
import fs from 'fs';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { IungoWebpackPlugin } from '../src';

const FIXTURES = path.join(__dirname, 'fixtures/');

test('renders using custom output path correctly', (done) => {
  expect.assertions(1);

  webpack(
    {
      entry: FIXTURES + 'output-path/pages/index.js',
      mode: 'development',
      output: {
        path: FIXTURES + 'output-path/build',
        filename: 'bundle.js',
      },
      plugins: [
        new IungoWebpackPlugin({
          entry: FIXTURES + 'output-path/pages',
          output: FIXTURES + 'output-path/build/public/[name].html',
        }),
      ],
    },
    (err, stats) => {
      if (!err || !stats.hasErrors()) {
        let build = fs.readFileSync(FIXTURES + 'output-path/build/public/index.html').toString();
        expect(build).toMatchSnapshot();
        done();
      }
    },
  );
});

test('creates custom output path error correctly', (done) => {
  expect.assertions(1);

  webpack(
    {
      entry: FIXTURES + 'output-path/pages/index.js',
      mode: 'development',
      output: {
        path: FIXTURES + 'output-path/build',
        filename: 'bundle.js',
      },
      plugins: [
        new IungoWebpackPlugin({
          entry: FIXTURES + 'output-path/pages',
          output: FIXTURES + 'output-path/dist/public/[name].html',
        }),
      ],
    },
    (err, stats) => {
      if (err || stats.hasErrors()) {
        const jsonStats = stats.toJson('normal');
        const error = jsonStats.errors[0];
        expect(error).toMatchSnapshot();
        done();
      }
    },
  );
});

test('renders partial correctly', (done) => {
  expect.assertions(1);

  webpack(
    {
      entry: FIXTURES + 'partial/pages/index.js',
      mode: 'development',
      output: {
        path: FIXTURES + 'partial/build',
        filename: 'bundle.js',
      },
      plugins: [
        new IungoWebpackPlugin({
          entry: FIXTURES + 'partial/pages',
          partials: [FIXTURES + 'partial/partials'],
        }),
      ],
    },
    (err, stats) => {
      if (!err || !stats.hasErrors()) {
        let build = fs.readFileSync(FIXTURES + 'partial/build/index.html').toString();
        expect(build).toMatchSnapshot();
        done();
      }
    },
  );
});

test('renders partial with HtmlWebpackPlugin correctly', (done) => {
  expect.assertions(1);

  webpack(
    {
      entry: FIXTURES + 'partial/pages/index.js',
      mode: 'development',
      output: {
        path: FIXTURES + 'partial/build',
        filename: 'bundle.js',
      },
      plugins: [
        new HtmlWebpackPlugin({
          inject: true,
          template: FIXTURES + 'partial/pages/index.html',
        }),
        new IungoWebpackPlugin({
          htmlWebpackPlugin: HtmlWebpackPlugin,
          partials: [FIXTURES + 'partial/partials'],
        }),
      ],
    },
    (err, stats) => {
      if (!err || !stats.hasErrors()) {
        let build = fs.readFileSync(FIXTURES + 'partial/build/index.html').toString();
        expect(build).toMatchSnapshot();
        done();
      }
    },
  );
});

test('creates partial error with HtmlWebpackPlugin correctly', (done) => {
  expect.assertions(1);

  webpack(
    {
      entry: FIXTURES + 'partial-error/pages/index.js',
      mode: 'development',
      output: {
        path: FIXTURES + 'partial-error/build',
        filename: 'bundle.js',
      },
      plugins: [
        new HtmlWebpackPlugin({
          inject: true,
          template: FIXTURES + 'partial-error/pages/index.html',
        }),
        new IungoWebpackPlugin({
          htmlWebpackPlugin: HtmlWebpackPlugin,
          partials: [FIXTURES + 'partial-error/partials'],
        }),
      ],
    },
    (err, stats) => {
      if (err || stats.hasErrors()) {
        const jsonStats = stats.toJson('normal');
        const error = jsonStats.errors[0];
        expect(error).toMatchSnapshot();
        done();
      }
    },
  );
});

test('creates partial error correctly', (done) => {
  expect.assertions(1);

  webpack(
    {
      entry: FIXTURES + 'partial-error/pages/index.js',
      mode: 'development',
      output: {
        path: FIXTURES + 'partial-error/build',
        filename: 'bundle.js',
      },
      plugins: [
        new IungoWebpackPlugin({
          entry: FIXTURES + 'partial-error/pages',
          partials: [FIXTURES + 'partial-error/partials'],
        }),
      ],
    },
    (err, stats) => {
      if (err || stats.hasErrors()) {
        const jsonStats = stats.toJson('normal');
        const error = jsonStats.errors[0];
        expect(error).toMatchSnapshot();
        done();
      }
    },
  );
});

test('data is being passed correctly', (done) => {
  expect.assertions(1);

  webpack(
    {
      entry: FIXTURES + 'data/pages/index.js',
      mode: 'development',
      output: {
        path: FIXTURES + 'data/build',
        filename: 'bundle.js',
      },
      plugins: [
        new IungoWebpackPlugin({
          entry: FIXTURES + 'data/pages',
          data: [FIXTURES + 'data/data', { title: 'iungo', subtitle: 'testing' }],
        }),
      ],
    },
    (err, stats) => {
      if (!err || !stats.hasErrors()) {
        let build = fs.readFileSync(FIXTURES + 'data/build/index.html').toString();
        expect(build).toMatchSnapshot();
        done();
      }
    },
  );
});

test('creates data error correctly', (done) => {
  expect.assertions(1);

  webpack(
    {
      entry: FIXTURES + 'data-error/pages/index.js',
      mode: 'development',
      output: {
        path: FIXTURES + 'data-error/build',
        filename: 'bundle.js',
      },
      plugins: [
        new IungoWebpackPlugin({
          entry: FIXTURES + 'data-error/pages',
          data: [FIXTURES + 'data-error/data'],
        }),
      ],
    },
    (err, stats) => {
      if (err || stats.hasErrors()) {
        const jsonStats = stats.toJson('normal');
        const error = jsonStats.errors[0];
        const errorWithoutPath = error.split(': ')[2];
        expect(errorWithoutPath).toMatchSnapshot();
        done();
      }
    },
  );
});

test('uses helpers correctly', (done) => {
  expect.assertions(1);

  webpack(
    {
      entry: FIXTURES + 'helper/pages/index.js',
      mode: 'development',
      output: {
        path: FIXTURES + 'helper/build',
        filename: 'bundle.js',
      },
      plugins: [
        new IungoWebpackPlugin({
          entry: FIXTURES + 'helper/pages',
          helpers: {
            projectHelpers: FIXTURES + 'helper/helpers',
            testHelpers: () => {
              return 'test';
            },
          },
        }),
      ],
    },
    (err, stats) => {
      if (!err || !stats.hasErrors()) {
        let build = fs.readFileSync(FIXTURES + 'helper/build/index.html').toString();
        expect(build).toMatchSnapshot();
        done();
      }
    },
  );
});

test('creates helpers error correctly', (done) => {
  expect.assertions(1);

  webpack(
    {
      entry: FIXTURES + 'helper-error/pages/index.js',
      mode: 'development',
      output: {
        path: FIXTURES + 'helper-error/build',
        filename: 'bundle.js',
      },
      plugins: [
        new IungoWebpackPlugin({
          entry: FIXTURES + 'helper-error/pages',
          helpers: { projectHelpers: FIXTURES + 'helper-error/helpers' },
        }),
      ],
    },
    (err, stats) => {
      if (err || stats.hasErrors()) {
        const jsonStats = stats.toJson('normal');
        const error = jsonStats.errors[0];
        const errorWithoutPath = error.split(': ')[2];
        expect(errorWithoutPath).toMatchSnapshot();
        done();
      }
    },
  );
});

test('compile with strange configuration correctly', (done) => {
  expect.assertions(1);

  webpack(
    {
      entry: FIXTURES + 'helper-error/pages/index.js',
      mode: 'development',
      output: {
        path: FIXTURES + 'helper-error/build',
        filename: 'bundle.js',
      },
      plugins: [
        new IungoWebpackPlugin({
          entry: FIXTURES + 'helper-error/pages',
          data: null,
          helpers: null,
          partials: null,
        }),
        new IungoWebpackPlugin(),
      ],
    },
    (err, stats) => {
      expect(stats.hasErrors()).toBeFalsy();
      done();
    },
  );
});
