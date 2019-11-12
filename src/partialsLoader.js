import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import filesLoader from './filesLoader';

function partialsLoader(paths) {
  let partialFiles = filesLoader(paths, '**/*.{html,hbs,handlebars}');

  for (let i in partialFiles) {
    let extname = path.extname(partialFiles[i]);
    let basename = path.basename(partialFiles[i], extname);
    let partial = fs.readFileSync(partialFiles[i]);

    Handlebars.registerPartial(basename, partial.toString() + '\n');
  }
}

export default partialsLoader;
