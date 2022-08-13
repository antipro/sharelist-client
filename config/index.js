
'use strict'
// Template version: 1.1.3
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')
try {
  var sharelistConfig = require('./sharelist-config.js')
} catch (error) {
  console.error('Please create config/sharelist-config.js file')
  console.error('Content like this:')
  console.error(`'use strict'
  module.exports = {
    CURRENT_VERSION: '"version-revision"',
    SERVER_URL: {
      dev: '"ip or domain of sharelist-server for development(with port)"',
      prod: '"ip or domain of sharelist-server for production(with port)"'
    }
  }`)
  throw error
}

module.exports = {
  base: {
    currentVersion: sharelistConfig.CURRENT_VERSION
  },
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report,
    serverAddress: sharelistConfig.SERVER_URL.prod
  },
  dev: {
    env: require('./dev.env'),
    port: process.env.PORT || 8080,
    autoOpenBrowser: false,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {},
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false,
    serverAddress: sharelistConfig.SERVER_URL.dev
  }
}
