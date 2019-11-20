import Handlebars from 'handlebars';
import PluginError from 'plugin-error';
import through from 'through2';
import ansiHTML from 'ansi-html';
import dataLoader from './utils/dataLoader';
import helpersLoader from './utils/helpersLoader';
import partialsLoader from './utils/partialsLoader';
import errorPartial from './partials/error-partial.hbs';

class Iungo {
  constructor(opt) {
    this.opt = opt;
    this.data = {};

    ansiHTML.setColors({ reset: ['fff', '002e01'] });
  }

  render() {
    let stream = through.obj((chunk, encoding, callback) => {
      try {
        try {
          dataLoader(this.opt.data, this.data);
          partialsLoader(this.opt.partials);
          helpersLoader(this.opt.helpers);
        } catch (error) {
          throw new PluginError('iungo', error);
        }

        try {
          let page = Handlebars.compile(chunk.contents.toString());
          chunk.contents = new Buffer.from(page(this.data));
        } catch (error) {
          let errorData = {
            fileName: chunk.history[0],
            message: error.message,
          };
          throw new PluginError('iungo', errorData);
        }

        stream.push(chunk);
        callback();
      } catch (error) {
        this.data = {
          error: {
            fileName: error.fileName ? error.fileName : '',
            message: error.message ? error.message : '',
            codeError: error.stack ? ansiHTML(error.stack) : '',
          },
        };
        let page = Handlebars.compile(errorPartial);
        chunk.contents = new Buffer.from(page(this.data));

        stream.push(chunk);
        callback(error);
        stream.emit('end');
      }
    });

    return stream;
  }
}

let iungo;

export default (opt) => {
  /* istanbul ignore next */
  if (!iungo) {
    iungo = new Iungo(opt);
  }
  /* istanbul ignore next */
  return iungo.render();
};

export { Iungo };
