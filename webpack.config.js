const path = require('path');
const webpack = require('webpack');
// const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

const serverConfig = {
    mode: 'production',
    target: 'node',
    entry: './src/rapidomize.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'rapidomize.js',
        globalObject: 'this',
        library: {
            name: 'rapidomize',
            type: 'umd',
        },
    },
    plugins: [
        // new NodePolyfillPlugin(),
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        })
    ],
    resolve: {
        extensions: [ '.ts', '.js' ],
        fallback: {
          assert: false, //require.resolve('assert'),
          buffer: require.resolve('buffer'),
          console: require.resolve('console-browserify'),
          constants: false, //require.resolve('constants-browserify'),
          crypto: require.resolve('crypto-browserify'),
          domain: require.resolve('domain-browser'),
          events: require.resolve('events'),
          http: require.resolve('stream-http'),
          https: require.resolve('https-browserify'),
          os: false, //require.resolve('os-browserify/browser'),
          path: false, //require.resolve('path-browserify'),
          punycode: false, //require.resolve('punycode'),
          process: false, //require.resolve('process/browser'),
          querystring: require.resolve('querystring-es3'),
          stream: require.resolve('stream-browserify'),
          string_decoder: false, //require.resolve('string_decoder'),
          sys: false, //require.resolve('util'),
          timers: false, //require.resolve('timers-browserify'),
          tty: false, //require.resolve('tty-browserify'),
          url: require.resolve('url'),
          util: require.resolve('util'),
          vm: false, //require.resolve('vm-browserify'),
          zlib: require.resolve('browserify-zlib'),
        },
    }
};
  
const clientConfig = {
    mode: 'production',
    target: 'web', // <=== can be omitted as default is 'web'
    entry: './src/rapidomize.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'rapidomize-browser.js',
        globalObject: 'this',
        library: {
            name: 'rapidomize',
            type: 'umd',
        },
    },
    plugins: [
        // new NodePolyfillPlugin(),
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        }),
    ],
    resolve: {
        extensions: [ '.ts', '.js' ],
        fallback: {
          assert: false, //require.resolve('assert'),
          buffer: require.resolve('buffer'),
          console: require.resolve('console-browserify'),
          constants: false, //require.resolve('constants-browserify'),
          crypto: require.resolve('crypto-browserify'),
          domain: require.resolve('domain-browser'),
          events: require.resolve('events'),
          http: require.resolve('stream-http'),
          https: require.resolve('https-browserify'),
          os: false, //require.resolve('os-browserify/browser'),
          path: false, //require.resolve('path-browserify'),
          punycode: false, //require.resolve('punycode'),
          process: false, //require.resolve('process/browser'),
          querystring: require.resolve('querystring-es3'),
          stream: require.resolve('stream-browserify'),
          string_decoder: false, //require.resolve('string_decoder'),
          sys: false, //require.resolve('util'),
          timers: false, //require.resolve('timers-browserify'),
          tty: false, //require.resolve('tty-browserify'),
          url: require.resolve('url'),
          util: require.resolve('util'),
          vm: false, //require.resolve('vm-browserify'),
          zlib: require.resolve('browserify-zlib'),
        },
    }
};
  
// module.exports = [clientConfig];
module.exports = [serverConfig, clientConfig];