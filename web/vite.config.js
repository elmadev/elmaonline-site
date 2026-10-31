import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';

import rollupNodePolyFill from 'rollup-plugin-polyfill-node';

export default defineConfig(() => {
  return {
    server: {
      port: 3000,
      open: true,
    },
    build: {
      outDir: 'build',
      sourcemap: true,
      rollupOptions: {
        plugins: [rollupNodePolyFill()],
      },
    },
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: ['@emotion/babel-plugin'],
        },
      }),
      {
        name: 'leaflet-css-fix',
        enforce: 'pre',
        transform(code, id) {
          // Fix Leaflet CSS image paths
          if (id.includes('node_modules/leaflet/dist/leaflet.css')) {
            return code
              .replace(/url\(images\//g, 'url(/leaflet/images/')
              .replace(/url\("images\//g, 'url("/leaflet/images/')
              .replace(/url\('images\//g, "url('/leaflet/images/");
          }
        },
      },
    ],
    resolve: {
      alias: [
        { find: 'components', replacement: '/src/components' },
        { find: 'images', replacement: '/src/images' },
        { find: 'pages', replacement: '/src/pages' },
        { find: 'utils', replacement: '/src/utils' },
        { find: 'constants', replacement: '/src/constants' },
        { find: 'api', replacement: '/src/api' },
        { find: 'globalStyle', replacement: '/src/globalStyle' },
        { find: 'theme', replacement: '/src/theme' },
        { find: 'config', replacement: '/src/config' },
        { find: 'features', replacement: '/src/features' },
        { find: 'types', replacement: '/src/types' },
        { find: 'fs', replacement: '/src/shims/fs.js' },
        // Deep @mui/icons-material and @mui/system imports resolve to CJS files that require @mui/material,
        // which breaks prebundled @mui/material (styled is undefined in Slider etc.)
        {
          find: /^@mui\/(icons-material|system)\/(?!esm\/)(.+)$/,
          replacement: '@mui/$1/esm/$2',
        },
      ],
    },
    optimizeDeps: {
      exclude: ['@elmadev/react-rec-viewer'],
      esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
          global: 'globalThis',
        },
        // Enable esbuild polyfill plugins
        plugins: [
          NodeGlobalsPolyfillPlugin({
            buffer: true,
          }),
          NodeModulesPolyfillPlugin(),
        ],
      },
    },
  };
});
