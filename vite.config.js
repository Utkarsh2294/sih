import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { bhashiniProxy } from './server/bhashiniProxy.js';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt'],
      manifest: {
        name: 'VittSetu — वित्त-सेतु',
        short_name: 'VittSetu',
        description:
          'Citizen-facing platform for NSFDC Scheduled Caste concessional-credit ecosystem',
        theme_color: '#0f766e',
        background_color: '#f8fafc',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff2}'],
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'document' || request.destination === 'script' || request.destination === 'style',
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'vittsetu-app-shell' },
          },
          {
            urlPattern: ({ url }) => url.pathname.includes('schemes.config') || url.pathname.includes('SchemeRecommender') || url.pathname.includes('Calculator'),
            handler: 'CacheFirst',
            options: { cacheName: 'vittsetu-offline-flows' },
          },
        ],
      },
    }),
    {
      name: 'bhashini-server-proxy',
      configureServer(server) {
        server.middlewares.use('/api/bhashini', bhashiniProxy);
      },
    },
  ],
});
