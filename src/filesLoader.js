import path from 'path';
import glob from 'glob';

function filesLoader(paths, pattern) {
    let files = [];

    paths = paths instanceof Array ? paths : [paths];

    for (let i in paths) {
        let fullPath = path.join(process.cwd(), paths[i], pattern);
        files = files.concat(glob.sync(fullPath));
    }

    return files;
}

export default filesLoader;
