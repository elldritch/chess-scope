const path = require('path');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: ['babel-polyfill', 'react-hot-loader/patch', './app/index'],
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
  },
  output: {
    path: path.join(__dirname, 'dist', 'app'),
    filename: 'index.js',
    publicPath: '/',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new ForkTsCheckerWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['react-hot-loader/webpack', 'babel-loader', { loader: 'ts-loader', options: { transpileOnly: true } }],
        include: [path.join(__dirname, 'app')],
      },
    ],
  },
};
