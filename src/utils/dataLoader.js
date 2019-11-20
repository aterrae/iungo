import { getBasenameWithoutExt, resolveGlob, registerDependency } from './tools';

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
          throw new Error(`${dataPath}: ${error.message}`);
        }
      });
    } else {
      dataLoaded = Object.assign(dataLoaded, dataItem);
    }
  });
}

export default dataLoader;
