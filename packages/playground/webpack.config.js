const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { webpackConfig } = require('@avocode/avocode-email-tagsinput-config')

const isProduction = process.argv.includes('--mode=production')

module.exports = {
  ...webpackConfig,
  mode: isProduction ? 'production' : 'development',
  entry: path.resolve(__dirname, 'index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    minimize: false,
  },
  plugins: webpackConfig.plugins.concat([
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'),
    }),
  ]),
  devServer: {
    port: 8080,
  },
}

