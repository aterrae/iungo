import path from 'path';
import gutil from 'gulp-util';
import filesLoader from './filesLoader';

function dataLoader(data, paths) {
    let dataFiles = filesLoader(paths, '**/*.json');

    for (let i in dataFiles) {
        let name = path.basename(dataFiles[i]);
        let basename = path.basename(dataFiles[i], '.json');

        try {
            delete require.cache[require.resolve(dataFiles[i])];
            data[basename] = require(dataFiles[i]);
        } catch (error) {
            let errorData = {
                fileName: dataFiles[i],
                message: error.message
            }
            throw new gutil.PluginError('iungo', errorData);
        }
    }
}

export default dataLoader;
