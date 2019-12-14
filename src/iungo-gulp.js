import Handlebars from 'handlebars';
import through from 'through2';
import ansiHTML from 'ansi-html';
import dataLoader from './utils/dataLoader';
import helpersLoader from './utils/helpersLoader';
import partialsLoader from './utils/partialsLoader';
import IungoError from './utils/iungoError';
import errorPartial from './partials/error-partial.hbs';

class IungoStream {
  constructor(options = {}) {
    this.options = Object.assign(
      {
        data: [],
        helpers: {},
        partials: [],
      },
      options,
    );

    this.data = {};

    ansiHTML.setColors({ reset: ['fff', '002e01'] });
  }

  render() {
    let stream = through.obj((chunk, encoding, callback) => {
      try {
        dataLoader(this.options.data, this.data);
        partialsLoader(this.options.partials);
        helpersLoader(this.options.helpers);

        try {
          let page = Handlebars.compile(chunk.contents.toString());
          chunk.contents = new Buffer.from(page(this.data));
        } catch (error) {
          throw new IungoError(error.message, chunk.history[0], error.stack);
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

const IungoGulpPlugin = (options) => {
  /* istanbul ignore next */
  if (!iungo) {
    iungo = new IungoStream(options);
  }
  /* istanbul ignore next */
  return iungo.render();
};

export { IungoStream, IungoGulpPlugin };
