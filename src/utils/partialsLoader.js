import Handlebars from 'handlebars';
import { getBasenameWithoutExt, resolveGlob, readFile, registerDependency } from './tools';

function partialsLoader(partials, fileDependencies, hook) {
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

  if (hook) {
    hook(Handlebars, loadedPartials);
  }

  loadedPartials.forEach((partial) => {
    if (Handlebars.partials[partial.id]) {
      Handlebars.unregisterPartial(partial.id);
    }
    Handlebars.registerPartial(partial.id, partial.content);

    if (fileDependencies) {
      registerDependency(partial.filepath, fileDependencies);
    }
  });
}

export default partialsLoader;
