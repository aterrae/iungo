class IungoError extends Error {
  fileName: string;
  line: string;
  column: string;
  stack: string;

  constructor(message: string, fileName: string, stack?: string) {
    super(message);

    const processPath = process.cwd();
    const excludeNodeModules = `(?!node_modules\\/)`;
    const remainingPath = `([\\/\\w-_\\.]+\\.(?:js|json))`;
    const matchLine = `(\\d*)`;
    const matchColumn = `(\\d*)`;

    const errorRegex = new RegExp(
      `${processPath}\\/${excludeNodeModules}${remainingPath}:${matchLine}:${matchColumn}`
    );
    const results = stack ? stack.match(errorRegex) : null;

    this.fileName = results ? results[0] : fileName;
    this.line = results ? results[1] : '';
    this.column = results ? results[2] : '';
    this.stack = stack || '';
  }
}

export default IungoError;
