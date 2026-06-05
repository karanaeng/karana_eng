import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { projects } from '../src/data/projects.ts';
import { services } from '../src/data/services.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const indexPath = path.join(distDir, 'index.html');

const routes = [
  'about',
  'buy',
  'checkout',
  'contact',
  'services',
  'works',
  ...projects.map((project) => `works/${project.slug}`),
  ...services.map((service) => `services/${service.slug}`),
];

if (!fs.existsSync(indexPath)) {
  throw new Error(`Frontend index.html not found at ${indexPath}. Run "npm run build:public" first.`);
}

for (const route of routes) {
  const routeDir = path.join(distDir, route);
  fs.mkdirSync(routeDir, { recursive: true });
  fs.copyFileSync(indexPath, path.join(routeDir, 'index.html'));
}

console.log(`Copied SPA fallback pages for ${routes.length} routes`);
