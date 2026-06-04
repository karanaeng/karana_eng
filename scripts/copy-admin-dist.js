import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const adminDistDir = path.join(rootDir, 'admin', 'dist');
const serverAdminDir = path.join(rootDir, 'server', 'public', 'admin');

if (!fs.existsSync(adminDistDir)) {
  throw new Error(`Admin build output not found at ${adminDistDir}. Run "npm run build:admin" first.`);
}

fs.rmSync(serverAdminDir, { recursive: true, force: true });
fs.mkdirSync(serverAdminDir, { recursive: true });
fs.cpSync(adminDistDir, serverAdminDir, { recursive: true });

console.log(`Copied admin dashboard build to ${serverAdminDir}`);
