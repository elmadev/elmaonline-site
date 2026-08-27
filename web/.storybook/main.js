const path = require("path")

module.exports = {
  "webpackFinal": async (config) => {
    config.resolve.alias['#'] = path.resolve(__dirname, '../src')
    config.resolve.alias['#components'] = path.resolve(__dirname, '../src/components')
    return config
  }
}

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
    'storybook-addon-styled-component-theme/dist/preset',
  ],
  webpackFinal: async config => {
    config.resolve.alias['components'] = path.resolve(__dirname, '../src/components')
    config.resolve.alias['images'] = path.resolve(__dirname, '../src/images')
    config.resolve.alias['pages'] = path.resolve(__dirname, '../src/pages')
    config.resolve.alias['utils'] = path.resolve(__dirname, '../src/utils')
    config.resolve.alias['constants'] = path.resolve(__dirname, '../src/constants')
    config.resolve.alias['api'] = path.resolve(__dirname, '../src/api')
    config.resolve.alias['globalStyle'] = path.resolve(__dirname, '../src/globalStyle')
    config.resolve.alias['theme'] = path.resolve(__dirname, '../src/theme')
    config.resolve.alias['config'] = path.resolve(__dirname, '../src/config')
    config.resolve.alias['features'] = path.resolve(__dirname, '../src/features')
    return config
  }
};
