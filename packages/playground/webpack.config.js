const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseConfig = require('@avocode/avocode-email-tagsinput-webpack-config')

const isProduction = process.argv.includes('--mode=production')

module.exports = {
  ...baseConfig,
  mode: isProduction ? 'production' : 'development',
  entry: path.resolve(__dirname, 'index.js'),
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    minimize: false,
  },
  plugins: baseConfig.plugins.concat([
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'),
    }),
  ]),
  devServer: {
    port: 8080,
  },
}

