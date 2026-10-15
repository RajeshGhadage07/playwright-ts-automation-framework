import fs from 'fs';
import path from 'path';

/** Reads a JSON file from the /test-data folder (external test data for data-driven tests). */
export function loadJson<T>(fileName: string): T {
  const filePath = path.resolve(__dirname, '../../test-data', fileName);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
}
