const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

// Load environment variables from .env file
require('dotenv').config();

module.exports = {
  mode: 'development',
  entry: ['./src/polyfills.js', './src/index.tsx'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true,
    publicPath: '/',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    fallback: {
      "buffer": require.resolve("buffer"),
      "process": require.resolve("process/browser"),
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "util": require.resolve("util/"),
      "path": require.resolve("path-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "fs": false,
      "net": false,
      "tls": false,
      "child_process": false,
      "dns": false,
      "dgram": false,
      "http2": false,
      "cluster": false,
      "module": false,
      "timers": false,
      "console": false,
      "sys": false,
      "worker_threads": false,
      "perf_hooks": false,
      "inspector": false,
      "async_hooks": false,
      "zlib": false,
      "constants": false,
      "domain": false,
      "events": false,
      "http": false,
      "https": false,
      "punycode": false,
      "querystring": false,
      "readline": false,
      "repl": false,
      "string_decoder": false,
      "tty": false,
      "url": false,
      "v8": false,
      "vm": false
    }
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: "defaults" }],
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript'
            ],
          },
        },
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: "defaults" }],
              ['@babel/preset-react', { runtime: 'automatic' }]
            ],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env.DFX_NETWORK': JSON.stringify(process.env.DFX_NETWORK || 'local'),
      'process.env.CANISTER_ID_INTERNET_IDENTITY': JSON.stringify(process.env.CANISTER_ID_INTERNET_IDENTITY || 'rdmx6-jaaaa-aaaah-qacaa-cai'),
      'process.env.CANISTER_ID_TRUSTCHAIN_BACKEND': JSON.stringify(process.env.CANISTER_ID_TRUSTCHAIN_BACKEND || 'emnyw-syaaa-aaaaa-qajoq-cai'),
      'process.env.REACT_APP_ENV': JSON.stringify('development'),
      'process.env.REACT_APP_USE_MOCK_DATA': JSON.stringify('true'),
      'process.env.REACT_APP_IC_HOST': JSON.stringify('http://127.0.0.1:4943'),
      'process.env.REACT_APP_IC_HOST_PROD': JSON.stringify('https://ic0.app'),
      'process.env.REACT_APP_NAME': JSON.stringify('TrustChain'),
      'process.env.REACT_APP_VERSION': JSON.stringify('1.0.0'),
      global: 'globalThis',
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^electron$/,
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    hot: true,
    port: 8080,
    historyApiFallback: true,
    open: true,
    compress: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
  devtool: 'eval-source-map',
};
