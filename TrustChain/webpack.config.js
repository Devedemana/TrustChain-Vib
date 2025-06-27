const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

// Load environment variables from .env file
require('dotenv').config();

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
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
              '@babel/preset-env',
              '@babel/preset-react',
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
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript'
            ],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.DFX_NETWORK': JSON.stringify(process.env.DFX_NETWORK || 'local'),
      'process.env.CANISTER_ID_INTERNET_IDENTITY': JSON.stringify(process.env.CANISTER_ID_INTERNET_IDENTITY || 'rdmx6-jaaaa-aaaah-qacaa-cai'),
      'process.env.CANISTER_ID_TRUSTCHAIN_BACKEND': JSON.stringify(process.env.CANISTER_ID_TRUSTCHAIN_BACKEND || 'uxrrr-q7777-77774-qaaaq-cai'),
      'process.env.REACT_APP_ENV': JSON.stringify(process.env.REACT_APP_ENV || 'development'),
      'process.env.REACT_APP_USE_MOCK_DATA': JSON.stringify(process.env.REACT_APP_USE_MOCK_DATA || 'true'),
      'process.env.REACT_APP_IC_HOST': JSON.stringify(process.env.REACT_APP_IC_HOST || 'http://127.0.0.1:4943'),
      'process.env.REACT_APP_IC_HOST_PROD': JSON.stringify(process.env.REACT_APP_IC_HOST_PROD || 'https://ic0.app'),
      'process.env.REACT_APP_NAME': JSON.stringify(process.env.REACT_APP_NAME || 'TrustChain'),
      'process.env.REACT_APP_VERSION': JSON.stringify(process.env.REACT_APP_VERSION || '1.0.0'),
    }),
  ],
  devServer: {
    static: './dist',
    hot: true,
    port: 3000,
  },
};
