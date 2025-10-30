import Handlebars from 'handlebars';
import { getBasenameWithoutExt, resolveGlob, registerDependency } from './tools.js';
import IungoError from './iungoError.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

interface LoadedHelper {
  id: string;
  filepath: string;
  function: Handlebars.HelperDelegate;
}

type HelperSource = string | string[] | Handlebars.HelperDelegate;
type HelpersMap = Record<string, HelperSource>;
type HelpersLoaderHook = (handlebars: typeof Handlebars, helpers: LoadedHelper[]) => void;

function helpersLoader(
  helpers: HelpersMap,
  fileDependencies?: string[],
  hook?: HelpersLoaderHook
): void {
  const loadedHelpers: LoadedHelper[] = [];

  if (!helpers) {
    return;
  }

  Object.keys(helpers).forEach((helperKey) => {
    const helperValue = helpers[helperKey];

    if (typeof helperValue === 'string' || Array.isArray(helperValue)) {
      const helperPaths = Array.isArray(helperValue) ? helperValue : [helperValue];

      helperPaths.forEach((helperPath) => {
        const helpersPaths = resolveGlob(`${helperPath}/**/*.js`);
        helpersPaths.forEach((resolvedPath) => {
          try {
            delete require.cache[require.resolve(resolvedPath)];
            loadedHelpers.push({
              id: getBasenameWithoutExt(resolvedPath),
              filepath: resolvedPath,
              function: require(resolvedPath),
            });
          } catch (error: any) {
            throw new IungoError(error.message, resolvedPath, error.stack);
          }
        });
      });
    } else {
      loadedHelpers.push({
        id: helperKey,
        filepath: '',
        function: helperValue,
      });
    }
  });

  if (hook) {
    hook(Handlebars, loadedHelpers);
  }

  loadedHelpers.forEach((helper) => {
    if (Handlebars.helpers[helper.id]) {
      Handlebars.unregisterHelper(helper.id);
    }
    Handlebars.registerHelper(helper.id, helper.function);

    if (helper.filepath !== '' && fileDependencies) {
      registerDependency(helper.filepath, fileDependencies);
    }
  });
}

export default helpersLoader;
