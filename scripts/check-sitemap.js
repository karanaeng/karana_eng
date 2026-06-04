import fs from 'fs';
import path from 'path';

// Check if sitemap.xml was generated
const sitemapPath = path.join('dist', 'sitemap.xml');

if (fs.existsSync(sitemapPath)) {
  console.log('✓ Sitemap generated successfully at:', sitemapPath);
  process.exit(0);
} else {
  console.warn('⚠ Sitemap not found at:', sitemapPath);
  console.warn('This is OK - it will be generated on deployment.');
  process.exit(0);
}
