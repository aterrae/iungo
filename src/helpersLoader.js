import Handlebars from 'handlebars';
import path from 'path';
import gutil from 'gulp-util';
import filesLoader from './filesLoader';

function helpersLoader(paths) {
    let helperFiles = filesLoader(paths, '**/*.js');

    for (let i in helperFiles) {
        let basename = path.basename(helperFiles[i], '.js');

        try {
            if (Handlebars.helpers[basename]) {
                delete require.cache[require.resolve(helperFiles[i])];
                Handlebars.unregisterHelper(basename);
            }

            Handlebars.registerHelper(basename, require(helperFiles[i]));
        } catch (error) {
            error.fileName = helperFiles[i];
            throw new gutil.PluginError('iungo', error);
        }
    }
}

export default helpersLoader;
