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
      alias: {
        components: '/src/components',
        images: '/src/images',
        pages: '/src/pages',
        utils: '/src/utils',
        constants: '/src/constants',
        api: '/src/api',
        globalStyle: '/src/globalStyle',
        theme: '/src/theme',
        config: '/src/config',
        features: '/src/features',
      },
    },
    optimizeDeps: {
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
