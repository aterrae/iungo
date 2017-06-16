import Handlebars from 'handlebars';
import through from 'through2';
import ansiHTML from 'ansi-html';
import dataLoader from './src/dataLoader';
import partialsLoader from './src/partialsLoader';
import helpersLoader from './src/helpersLoader';

class Iungo {
    constructor(opt) {
        this.opt = opt;
        this.data = {};

        ansiHTML.setColors({ reset: ['fff', '002e01'] });
    }

    errorHtml(filename, message, codeError) {
        return '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Iungo - Error</title><style> body { height: 100%; margin: 0; padding: 0; background-color: #59e0b3; } hgroup { font-family: Arial, sans-serif; margin: 0 auto; color: white; } hr { width: 80%; margin: 32px auto; border-top: 0; border-bottom: 2px dotted #ffffff; } .container { position: absolute; top: 50%; left: 50%; box-sizing: border-box; width: 100%; max-width: 768px; padding: 32px; transform: translate(-50%, -50%); text-align: center; } .title { font-size: 32px; font-weight: 900; margin: 24px 0 0 0; opacity: 1; text-shadow: 0 0 8px rgba(0,0,0,.3); } .filename { opacity: .8; } .message { margin: 0; color: #002e01; } .codeError { overflow: auto; box-sizing: border-box; max-width: 800px; max-height: 280px; margin: 32px auto 0 auto; padding: 20px 16px; text-align: left; border-radius: 8px; background: #002e01; } pre:empty { display: none; } pre::-webkit-scrollbar { width: 6px; height: 6px; } pre::-webkit-scrollbar-track { border-radius: 10px; background: rgba(0,0,0,.1); } pre::-webkit-scrollbar-thumb { border-radius: 10px; background: rgba(0,0,0,.2); } pre::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,.4); } pre::-webkit-scrollbar-thumb:active { background: rgba(0,0,0,.9); } </style></head><body><div class="container"><hgroup><h1 class="title">Iungo encountered an error!</h1><hr/><h2 class="filename">' + filename + '</h2><h3 class="message">' + message + '</h3><div><pre class="codeError">' + codeError + '</pre></div><p>It\'s funny to join your code with Iungo</p></hgroup></div></body></html>'
    }

    render() {
        var stream = through.obj((chunk, encoding, callback) => {
            try {
                dataLoader(this.data, this.opt.data || '!*');
                partialsLoader(this.opt.partials || '!*');
                helpersLoader(this.opt.helpers || '!*');

                let page = Handlebars.compile(chunk.contents.toString());
                chunk.contents = new Buffer(page(this.data));
                stream.push(chunk);
                callback();
            } catch (error) {
                let filename = error.filename ? error.filename : '';
                let message = error.message.slice(error.filename.length + 2, error.message.length);
                let codeError = error.codeFrame ? ansiHTML(error.codeFrame) : '';
                chunk.contents = new Buffer(this.errorHtml(filename, message, codeError));
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
