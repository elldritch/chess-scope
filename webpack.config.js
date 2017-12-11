const path = require('path');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: './dist',
    hot: true,
  },
  entry: ['babel-polyfill', 'react-hot-loader/patch', /* 'webpack/hot/only-dev-server', */ './app/index'],
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
  },
  output: {
    path: path.join(__dirname, 'dist', 'app'),
    filename: 'index.js',
    publicPath: '/',
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // new ForkTsCheckerWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          // 'react-hot-loader/webpack',
          'babel-loader',
          { loader: 'ts-loader' /* , options: { transpileOnly: true } */ },
        ],
        include: [path.join(__dirname, 'app')],
      },
    ],
  },
};
