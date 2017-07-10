import Handlebars from 'handlebars';
import through from 'through2';
import gutil from 'gulp-util';
import ansiHTML from 'ansi-html';
import dataLoader from './dataLoader';
import partialsLoader from './partialsLoader';
import helpersLoader from './helpersLoader';
import errorPartial from './error-partial.hbs';

class Iungo {
    constructor(opt) {
        this.opt = opt;
        this.data = {};

        ansiHTML.setColors({ reset: ['fff', '002e01'] });
    }

    render() {
        var stream = through.obj((chunk, encoding, callback) => {
            try {
                dataLoader(this.data, this.opt.data || '!*');
                partialsLoader(this.opt.partials || '!*');
                helpersLoader(this.opt.helpers || '!*');

                try {
                    let page = Handlebars.compile(chunk.contents.toString());
                    chunk.contents = new Buffer(page(this.data));
                } catch (error) {
                    error.fileName = chunk.history[0];
                    throw new gutil.PluginError('iungo', error);
                }

                stream.push(chunk);
                callback();
            } catch (error) {
                this.data = {
                    error: {
                        fileName: error.fileName ? error.fileName : '',
                        message: error.message ? error.message : '',
                        codeError: error.codeFrame ? ansiHTML(error.codeFrame) : ''
                    }
                }
                let page = Handlebars.compile(errorPartial);
                chunk.contents = new Buffer(page(this.data));

                stream.push(chunk);
                callback(error);
                stream.emit('end');
            }
        });

        return stream;
    }
}

var iungo;

export default (opt) => {
    if (!iungo) {
        iungo = new Iungo(opt);
    }

    return iungo.render();
}
