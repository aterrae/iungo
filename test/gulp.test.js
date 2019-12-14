import path from 'path';
import fs from 'fs';
import vfs from 'vinyl-fs';
import { IungoStream } from '../src';

const FIXTURES = path.join(__dirname, 'fixtures/');

test('renders partial correctly', (done) => {
  expect.assertions(1);

  let i = new IungoStream({
    partials: [FIXTURES + 'partial/partials'],
  });

  vfs
    .src(FIXTURES + 'partial/pages/index.html')
    .pipe(i.render())
    .pipe(vfs.dest(FIXTURES + 'partial/build'))
    .on('finish', () => {
      let build = fs.readFileSync(FIXTURES + 'partial/build/index.html').toString();
      expect(build).toMatchSnapshot();
      done();
    });
});

test('creates partial error correctly', (done) => {
  expect.assertions(1);

  let i = new IungoStream({
    partials: [FIXTURES + 'partial-error/partials'],
  });

  vfs
    .src(FIXTURES + 'partial-error/pages/index.html')
    .pipe(i.render())
    .on('error', (error) => {
      expect(error.message).toMatchSnapshot();
      done();
    });
});

test('data is being passed correctly', (done) => {
  expect.assertions(2);

  let i = new IungoStream({
    data: [
      FIXTURES + 'data/data',
      {
        name: 'Iungo',
      },
    ],
  });

  vfs
    .src(FIXTURES + 'data/pages/index.html')
    .pipe(i.render())
    .pipe(vfs.dest(FIXTURES + 'data/build'))
    .on('finish', () => {
      expect(i.data).toEqual({
        strings: {
          title: 'Aterrae',
          location: 'Sarmeola di Rubano (PD), Italy',
        },
        name: 'Iungo',
      });
      let build = fs.readFileSync(FIXTURES + 'data/build/index.html').toString();
      expect(build).toMatchSnapshot();
      done();
    });
});

test('creates data error correctly', (done) => {
  expect.assertions(1);

  let i = new IungoStream({
    data: [
      FIXTURES + 'data-error/data',
      {
        title: 'Iungo',
        subtitle: 'Testing',
      },
    ],
  });

  vfs
    .src(FIXTURES + 'data-error/pages/index.html')
    .pipe(i.render())
    .on('error', (error) => {
      const errorWithoutPath = error.message.split(': ')[1];
      expect(errorWithoutPath).toMatchSnapshot();
      done();
    });
});

test('uses helpers correctly', (done) => {
  expect.assertions(1);

  let i = new IungoStream({
    helpers: {
      projectHelpers: FIXTURES + 'helper/helpers',
      testHelpers: () => {
        return 'test';
      },
    },
  });

  vfs
    .src(FIXTURES + 'helper/pages/index.html')
    .pipe(i.render())
    .pipe(vfs.dest(FIXTURES + 'helper/build'))
    .on('finish', () => {
      let build = fs.readFileSync(FIXTURES + 'helper/build/index.html').toString();
      expect(build).toMatchSnapshot();
      done();
    });
});

test('creates helpers error correctly', (done) => {
  expect.assertions(1);

  let i = new IungoStream({
    helpers: {
      projectHelpers: FIXTURES + 'helper-error/helpers',
      testHelpers: () => {
        return 'test';
      },
    },
  });

  vfs
    .src(FIXTURES + 'helper-error/pages/index.html')
    .pipe(i.render())
    .on('error', (error) => {
      const errorWithoutPath = error.message.split(': ')[1];
      expect(errorWithoutPath).toMatchSnapshot();
      done();
    });
});
