import path from 'path';
import { globSync } from 'glob';
import fs from 'fs';

export function getAbsolutePath(entryPath: string | null): string | null {
  if (!entryPath) {
    return null;
  }
  return path.resolve(process.cwd(), entryPath);
}

export function getBasename(entryPath: string): string {
  return path.basename(entryPath);
}

export function getBasenameWithoutExt(entryPath: string): string {
  return path.basename(entryPath, path.extname(entryPath));
}

export function getPathDiff(entryPath1: string, entryPath2: string): string {
  return entryPath1.replace(entryPath2, '').replace(/^\/*/, '');
}

export function resolveGlob(entryPath: string): string[] {
  const pattern = path.resolve(process.cwd(), entryPath);
  return globSync(pattern);
}

export function readFile(entryPath: string): string {
  return fs.readFileSync(entryPath, 'utf8');
}

export function registerDependency(entryPath: string, dependencies: string[]): void {
  if (entryPath && entryPath !== '' && dependencies && !dependencies.includes(entryPath)) {
    dependencies.push(entryPath);
  }
}
