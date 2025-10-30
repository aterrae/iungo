import { getBasenameWithoutExt, resolveGlob, registerDependency } from './tools.js';
import IungoError from './iungoError.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

type DataSource = string | Record<string, any>;

function dataLoader(
  data: DataSource[],
  dataLoaded: Record<string, any>,
  fileDependencies?: string[]
): void {
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
        } catch (error: any) {
          throw new IungoError(error.message, dataPath, error.stack);
        }
      });
    } else {
      Object.assign(dataLoaded, dataItem);
    }
  });
}

export default dataLoader;
