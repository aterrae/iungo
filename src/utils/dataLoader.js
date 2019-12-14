import { getBasenameWithoutExt, resolveGlob, registerDependency } from './tools';
import IungoError from './iungoError';

function dataLoader(data, dataLoaded, fileDependencies) {
  if (!data) {
    return;
  }

  data.forEach((dataItem) => {
    if (typeof dataItem === 'string') {
      const dataPaths = resolveGlob(`${dataItem}/**/*.json`);
      dataPaths.forEach((dataPath) => {
        try {
          delete require.cache[require.resolve(dataPath)];
          dataLoaded[getBasenameWithoutExt(dataPath)] = require(dataPath);

          if (fileDependencies) {
            registerDependency(dataPath, fileDependencies);
          }
        } catch (error) {
          throw new IungoError(error.message, dataPath, error.stack);
        }
      });
    } else {
      dataLoaded = Object.assign(dataLoaded, dataItem);
    }
  });
}

export default dataLoader;
