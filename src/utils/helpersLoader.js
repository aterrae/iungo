import Handlebars from 'handlebars';
import { getBasenameWithoutExt, resolveGlob } from './tools';

function helpersLoader(helpers) {
  const loadedHelpers = [];

  if (!helpers) {
    return;
  }

  Object.keys(helpers).forEach((helperKey) => {
    if (typeof helpers[helperKey] === 'string') {
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
          throw new Error(error.message);
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

  loadedHelpers.forEach((helper) => {
    if (Handlebars.helpers[helper.id]) {
      Handlebars.unregisterHelper(helper.id);
    }
    Handlebars.registerHelper(helper.id, helper.function);
  });
}

export default helpersLoader;
