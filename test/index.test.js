import path from 'path';
import fs from 'fs';
import vfs from 'vinyl-fs';
import { Iungo } from '../src';

const FIXTURES = path.join(__dirname, 'fixtures/');

test('renders partial correctly', done => {
    expect.assertions(1);

    let i = new Iungo({
        partials: FIXTURES + 'partial/partials'
    });

    vfs.src(FIXTURES + 'partial/pages/index.html')
        .pipe(i.render())
        .pipe(vfs.dest(FIXTURES + 'partial/build'))
        .on('finish', () => {
            let build = fs.readFileSync(FIXTURES + 'partial/build/index.html').toString();
            expect(build).toMatchSnapshot();
            done();
        });
});

test('creates partial error correctly', done => {
    expect.assertions(1);

    let i = new Iungo({
        partials: FIXTURES + 'partial-error/partials'
    });

    vfs.src(FIXTURES + 'partial-error/pages/index.html')
        .pipe(i.render())
        .on('error', (error) => {
            expect(error.message).toMatchSnapshot();
            done();
        });
});

test('data is being passed correctly', done => {
    expect.assertions(2);

    let i = new Iungo({
        data: FIXTURES + 'data/data'
    });

    vfs.src(FIXTURES + 'data/pages/index.html')
        .pipe(i.render())
        .pipe(vfs.dest(FIXTURES + 'data/build'))
        .on('finish', () => {
            expect(i.data).toEqual({
                strings: {
                    name: "Aterrae",
                    location: "Rubano"
                }
            });
            let build = fs.readFileSync(FIXTURES + 'data/build/index.html').toString();
            expect(build).toMatchSnapshot();
            done();
        });
});

test('creates data error correctly', done => {
    expect.assertions(1);

    let i = new Iungo({
        data: FIXTURES + 'data-error/data'
    });

    vfs.src(FIXTURES + 'data-error/pages/index.html')
        .pipe(i.render())
        .on('error', (error) => {
            expect(error.message).toMatchSnapshot();
            done();
        });
});

test('uses helpers correctly', done => {
    expect.assertions(1);

    let i = new Iungo({
        helpers: FIXTURES + 'helper/helpers'
    });

    vfs.src(FIXTURES + 'helper/pages/index.html')
        .pipe(i.render())
        .pipe(vfs.dest(FIXTURES + 'helper/build'))
        .on('finish', () => {
            let build = fs.readFileSync(FIXTURES + 'helper/build/index.html').toString();
            expect(build).toMatchSnapshot();
            done();
        });
});

test('creates helpers error correctly', done => {
    expect.assertions(1);

    let i = new Iungo({
        helpers: FIXTURES + 'helper-error/helpers'
    });

    vfs.src(FIXTURES + 'helper-error/pages/index.html')
        .pipe(i.render())
        .on('error', (error) => {
            expect(error.message).toMatchSnapshot();
            done();
        });
});
