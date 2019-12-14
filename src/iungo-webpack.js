import Handlebars from 'handlebars';
import dataLoader from './utils/dataLoader';
import helpersLoader from './utils/helpersLoader';
import partialsLoader from './utils/partialsLoader';
import {
  getAbsolutePath,
  getBasename,
  getPathDiff,
  resolveGlob,
  readFile,
  registerDependency,
  getBasenameWithoutExt,
} from './utils/tools';
import IungoError from './utils/iungoError';

class IungoWebpackPlugin {
  constructor(options = {}) {
    this.options = Object.assign(
      {
        entry: null,
        output: null,
        data: [],
        helpers: {},
        partials: [],
        htmlWebpackPlugin: null,
        onBeforeInit: Function.prototype,
        onBeforeRegisterHelpers: Function.prototype,
        onBeforeRegisterPartials: Function.prototype,
        onBeforeCompile: Function.prototype,
        onBeforeRender: Function.prototype,
        onBeforeSave: Function.prototype,
        onDone: Function.prototype,
      },
      options,
    );

    this.options.entry = getAbsolutePath(this.options.entry);
    this.options.output = getAbsolutePath(this.options.output);

    this.options.onBeforeInit(Handlebars);
    this.data = {};
    this.fileDependencies = [];
    this.assetsGenerated = {};
    this.prevTimestamp = {};
    this.startTime = Date.now();
  }

  loadData() {
    dataLoader(this.options.data, this.data, this.fileDependencies);
  }

  loadHelpers() {
    helpersLoader(
      this.options.helpers,
      this.fileDependencies,
      this.options.onBeforeRegisterHelpers,
    );
  }

  loadPartials() {
    partialsLoader(
      this.options.partials,
      this.fileDependencies,
      this.options.onBeforeRegisterPartials,
    );
  }

  apply(compiler) {
    const compile = (compilation, callback) => {
      try {
        if (!this.dependenciesUpdated(compilation)) {
          callback();
          return;
        }

        this.loadData();
        this.loadHelpers();
        this.loadPartials();

        const paths = resolveGlob(`${this.options.entry}/**/*.html`);
        if (paths.length === 0) {
          callback();
          return;
        }
        paths.forEach((path) => {
          const content = readFile(path);
          this.compileFile(path, content, compilation);
        });
        callback();
      } catch (error) {
        compilation.errors.push(error);
        callback();
      }
    };

    const compileWithHtmlPlugin = (compilation, callback, data) => {
      try {
        if (!this.dependenciesUpdated(compilation)) {
          callback();
          return;
        }

        this.loadData();
        this.loadHelpers();
        this.loadPartials();

        let path = data.plugin.options.template.split('!').pop();
        let content = data.html;

        this.options.onBeforeSave = function(hb, hbTemplate) {
          data.html = hbTemplate;
        };

        this.compileFile(path, content, compilation);
        callback();
      } catch (error) {
        compilation.errors.push(error);
        callback();
      }
    };

    const registerDependencies = (compilation, callback) => {
      try {
        this.fileDependencies.forEach(
          compilation.fileDependencies.add,
          compilation.fileDependencies,
        );
        Object.keys(this.assetsGenerated).forEach((filename) => {
          compilation.assets[filename] = this.assetsGenerated[filename];
        });
        callback();
      } catch (error) {
        compilation.errors.push(
          new IungoError(`There was an error registering dependencies`),
        );
        callback();
      }
    };

    if (this.options.htmlWebpackPlugin) {
      compiler.hooks.compilation.tap('IungoWebpackPlugin', (compilation) => {
        this.options.htmlWebpackPlugin
          .getHooks(compilation)
          .afterTemplateExecution.tapAsync('IungoWebpackPlugin', (data, callback) => {
            compileWithHtmlPlugin(
              compilation,
              () => {
                registerDependencies(compilation, callback);
              },
              data,
            );
          });
      });
    } else {
      compiler.hooks.make.tapAsync('IungoWebpackPlugin', compile);
      compiler.hooks.emit.tapAsync('IungoWebpackPlugin', registerDependencies);
    }
  }

  dependenciesUpdated(compilation) {
    const timestampsSnapshot = compilation.fileTimestamps;
    const filePaths = Array.from(timestampsSnapshot.keys());

    const changedFiles = filePaths.filter((filePath) => {
      const prevTimestamp = this.prevTimestamp[filePath];
      const nextTimestamp = timestampsSnapshot.get(filePath);
      this.prevTimestamp[filePath] = nextTimestamp;

      return (prevTimestamp || this.startTime) < (nextTimestamp || Infinity);
    });

    if (changedFiles.length === 0) {
      return true;
    }

    for (let i = 0; i < changedFiles.length; i++) {
      if (this.fileDependencies.includes(changedFiles[i])) {
        return true;
      }
    }
    return false;
  }

  compileFile(path, content, compilation) {
    let targetPath;
    if (this.options.output) {
      targetPath = this.options.output.replace('[name]', getBasenameWithoutExt(path));
    } else {
      targetPath = `${compilation.compiler.outputPath}/${getBasename(path)}`;
    }

    const templateContent = this.options.onBeforeCompile(Handlebars, content) || content;
    const templateCompiled = Handlebars.compile(templateContent);
    const dataToRender = this.options.onBeforeRender(Handlebars, this.data) || this.data;
    let templateRendered = templateCompiled(dataToRender);
    templateRendered = this.options.onBeforeSave(Handlebars, templateRendered) || templateRendered;

    registerDependency(path, this.fileDependencies);

    if (!this.options.htmlWebpackPlugin) {
      if (targetPath.includes(compilation.compiler.outputPath)) {
        this.assetsGenerated[getPathDiff(targetPath, compilation.compiler.outputPath)] = {
          source: () => templateRendered,
          size: () => templateRendered.length,
        };
      } else {
        compilation.errors.push(
          new IungoError(`You can't set the output filepath outside the webpack dest folder`),
        );
      }
    }

    this.options.onDone(Handlebars, getPathDiff(targetPath, compilation.compiler.outputPath));
  }
}

export { IungoWebpackPlugin };
