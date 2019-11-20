import Handlebars from 'handlebars';
import { getBasenameWithoutExt, resolveGlob, readFile } from './tools';

function partialsLoader(partials) {
  let loadedPartials = [];

  if (!partials) {
    return;
  }

  partials.forEach((partial) => {
    const partialsPaths = resolveGlob(`${partial}/**/*.{html,hbs,handlebars}`);
    partialsPaths.forEach((partialPath) => {
      loadedPartials.push({
        id: getBasenameWithoutExt(partialPath),
        filepath: partialPath,
        content: readFile(partialPath),
      });
    });
  });

  loadedPartials.forEach((partial) => {
    if (Handlebars.partials[partial.id]) {
      Handlebars.unregisterPartial(partial.id);
    }
    Handlebars.registerPartial(partial.id, partial.content);
  });
}

export default partialsLoader;
