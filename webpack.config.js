// NOTE: This config file is used to create distribution packages only

const path = require('path')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  devtool: 'source-map',
  optimization: {
    minimize: false,
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            configFile: path.join(__dirname, 'babel.config.js')
          },
        }
      },
      {
        test: /\.css$/i,
        use: [
          { loader: MiniCSSExtractPlugin.loader },
          { loader: 'css-loader' },
        ],
      },
    ]
  },
  plugins: [
    new MiniCSSExtractPlugin(),
  ],
}
