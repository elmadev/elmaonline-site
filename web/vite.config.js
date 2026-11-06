import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';

import rollupNodePolyFill from 'rollup-plugin-polyfill-node';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

// require instead of imports so the emoji json is only loaded when it's used
const require = createRequire(import.meta.url);

const emojibaseVersion = require('emojibase-data/package.json').version;
const emojibaseFiles = ['data', 'messages'];
const emojibasePath = `emojibase-data/${emojibaseVersion}/en`;

// shortcode/emoji pairs for :name: suggestions
const shortcodesId = 'virtual:emoji-shortcodes';
const buildShortcodes = () => {
  const data = require('emojibase-data/en/data.json');
  const codes = require('emojibase-data/en/shortcodes/github.json');
  return data.flatMap(({ hexcode, emoji }) => {
    const names = codes[hexcode];
    if (!names) {
      return [];
    }
    return (Array.isArray(names) ? names : [names]).map(name => [name, emoji]);
  });
};

const emojibasePlugin = () => ({
  name: 'emojibase-data',
  resolveId(id) {
    return id === shortcodesId ? `\0${shortcodesId}` : null;
  },
  load(id) {
    return id === `\0${shortcodesId}`
      ? `export default ${JSON.stringify(buildShortcodes())};`
      : null;
  },
  config: () => ({
    define: {
      'import.meta.env.VITE_EMOJIBASE_URL': JSON.stringify(
        `/emojibase-data/${emojibaseVersion}`,
      ),
    },
  }),
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const file = emojibaseFiles.find(
        f => req.url === `/${emojibasePath}/${f}.json`,
      );
      if (!file) {
        next();
        return;
      }
      res.setHeader('Content-Type', 'application/json');
      res.end(readFileSync(require.resolve(`emojibase-data/en/${file}.json`)));
    });
  },
  generateBundle() {
    emojibaseFiles.forEach(file => {
      this.emitFile({
        type: 'asset',
        fileName: `${emojibasePath}/${file}.json`,
        source: readFileSync(require.resolve(`emojibase-data/en/${file}.json`)),
      });
    });
  },
});

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
      emojibasePlugin(),
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
        // @mui/system, @mui/utils and @mui/icons-material ship CJS at the package
        // root and ESM in esm/. Deep imports otherwise resolve to CJS, which makes
        // esbuild's dep prebundling leave MUI's `styled` uninitialized in dev.
        {
          find: /^@mui\/(system|utils|icons-material)\/(?!esm\/)(.+)$/,
          replacement: '@mui/$1/esm/$2',
        },
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
