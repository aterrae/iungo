import Handlebars from 'handlebars';
import { getBasenameWithoutExt, resolveGlob, readFile, registerDependency } from './tools.js';
import IungoError from './iungoError.js';

interface LoadedPartial {
  id: string;
  filepath: string;
  content: string;
}

type PartialsLoaderHook = (handlebars: typeof Handlebars, partials: LoadedPartial[]) => void;

function partialsLoader(
  partials: string[],
  fileDependencies?: string[],
  hook?: PartialsLoaderHook
): void {
  const loadedPartials: LoadedPartial[] = [];

  if (!partials) {
    return;
  }

  partials.forEach((partial) => {
    const partialsPaths = resolveGlob(`${partial}/**/*.{html,hbs,handlebars}`);
    partialsPaths.forEach((partialPath) => {
      try {
        loadedPartials.push({
          id: getBasenameWithoutExt(partialPath),
          filepath: partialPath,
          content: readFile(partialPath),
        });
      } catch (error: any) {
        throw new IungoError(error.message, partialPath, error.stack);
      }
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
