import Handlebars from 'handlebars';
import { getBasenameWithoutExt, resolveGlob, registerDependency } from './tools';
import IungoError from './iungoError';

function helpersLoader(helpers, fileDependencies, hook) {
  const loadedHelpers = [];

  if (!helpers) {
    return;
  }

  Object.keys(helpers).forEach((helperKey) => {
    if (typeof helpers[helperKey] === 'string' || Array.isArray(helpers[helperKey])) {
      helpers[helperKey] = Array.isArray(helpers[helperKey]) ? helpers[helperKey] : [helpers[helperKey]];

      const helpersPaths = resolveGlob(`${helpers[helperKey]}/**/*.js`);
      helpersPaths.forEach((helperPath) => {
        try {
          delete require.cache[require.resolve(helperPath)];
          loadedHelpers.push({
            id: getBasenameWithoutExt(helperPath),
            filepath: helperPath,
            function: require(helperPath),
          });
        } catch (error) {
          throw new IungoError(error.message, helperPath, error.stack);
        }
      });
    } else {
      loadedHelpers.push({
        id: helperKey,
        filepath: '',
        function: helpers[helperKey],
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

    if ((helper.filepath !== '') && fileDependencies) {
      registerDependency(helper.filepath, fileDependencies);
    }
  });
}

export default helpersLoader;
