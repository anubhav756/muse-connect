'use strict'

const webpack = require('webpack');
const path = require('path');
let loaders = require('./webpack.loaders');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const autoprefixer = require('autoprefixer');

const styleLoaders = [
  {
    test: /\.css$/,
    use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader?sourceMap&modules&importLoaders=1&localIdentName=[local]!postcss-loader!sass-loader?sourceMap' }),
    include: /flexboxgrid/
  },
  {
    test: /\.scss$/,
    use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader?sourceMap&modules&importLoaders=1&localIdentName=[local]!postcss-loader!sass-loader?sourceMap' }),
    exclude: /node_modules/
  },
]

loaders = loaders.concat(styleLoaders)

module.exports = {
  entry: [
    'babel-polyfill',
    'react-hot-loader/patch',
    './src/index.jsx',
  ],
  output: {
    publicPath: '/',
    path: path.join(__dirname, 'build'),
    filename: '[chunkhash].js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    loaders
  },
  plugins: [
    new WebpackCleanupPlugin(),
    new CopyWebpackPlugin([
      { from: 'src/public' }
    ]),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        drop_console: true,
        drop_debugger: true
      }
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new ExtractTextPlugin({
      filename: 'style.css',
      allChunks: true
    }),
    new HtmlWebpackPlugin({
      template: './src/template.html',
      files: {
        css: ['style.css'],
        js: ['bundle.js'],
      }
    })
  ]
};
