import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'
import sitemap from 'vite-plugin-sitemap'
import { projects } from './src/data/projects'
import { services } from './src/data/services'

const projectRoutes = projects?.map(p => `/project/${p.slug}`) ?? [];
const serviceRoutes = services?.map(s => `/service/${s.slug}`) ?? [];

export default defineConfig({
  plugins: [
    react(),
    viteCompression(),
    sitemap({
      hostname: 'https://karanaagency.vercel.app',
      dynamicRoutes: [
        '/',
        '/about',
        '/services',
        '/works',
        '/contact',
        '/buy-products',
        ...projectRoutes,
        ...serviceRoutes,
      ],
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@react-three')) {
              return 'vendor-three';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-framer';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 800,
  }
})