import { copyFile } from 'node:fs/promises';

await copyFile(new URL('../dist/index.html', import.meta.url), new URL('../ada-entry.html', import.meta.url));
console.log('ADA runtime entry updated.');
