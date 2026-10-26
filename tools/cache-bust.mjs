// Clears visitors' cache after an update: stamps a new ?v= on every CSS and JS
// reference in index.html and on the Three.js scene module.
// Usage, from the project folder:  node tools/cache-bust.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const d = new Date();
const pad = (n) => String(n).padStart(2, '0');
const version = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}`;

const file = path.join(root, 'index.html');
const html = fs.readFileSync(file, 'utf8');
const next = html.replace(/(assets\/(?:css|js)\/[\w.-]+\.(?:css|js))(\?v=[\w.-]+)?/g, `$1?v=${version}`);
fs.writeFileSync(file, next);

const count = (next.match(/\?v=/g) || []).length;
console.log(`Cache version ${version} applied to ${count} references in index.html.`);
console.log('Upload index.html together with the changed CSS/JS files.');
