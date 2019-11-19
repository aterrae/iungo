import path from 'path';
import glob from 'glob';
import fs from 'fs';

function getAbsolutePath(entryPath) {
  if (!entryPath) {
    return null;
  }
  return path.resolve(process.cwd(), entryPath);
}

function getBasename(entryPath) {
  return path.basename(entryPath);
}

function getBasenameWithoutExt(entryPath) {
  return path.basename(entryPath, path.extname(entryPath));
}

function getPathDiff(entryPath1, entryPath2) {
  return entryPath1.replace(entryPath2, '').replace(/^\/*/, '');
}

function resolveGlob(entryPath) {
  const pattern = path.resolve(process.cwd(), entryPath);
  return glob.sync(pattern);
}

function readFile(entryPath) {
  return fs.readFileSync(entryPath, 'utf8');
}

function registerDependency(entryPath, dependencies) {
  if (entryPath && entryPath !== '' && dependencies && !dependencies.includes(entryPath)) {
    dependencies.push(entryPath);
  }
}

export {
  getAbsolutePath,
  getBasename,
  getBasenameWithoutExt,
  getPathDiff,
  resolveGlob,
  readFile,
  registerDependency,
};
