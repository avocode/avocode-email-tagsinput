const path = require('path')

const MiniCSSExtractPlugin = require('mini-css-extract-plugin')

const isDevelopment = process.env.NODE_ENV === 'development'

module.exports = {
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            configFile: path.join(__dirname, '..', 'node_modules', '@avocode', 'avocode-email-tagsinput-babel-config'),
          },
        },
      },
      {
        test: /\.css$/i,
        use: [
          { loader: MiniCSSExtractPlugin.loader },
          { loader: 'css-loader' },
        ],
      },
    ],
  },
  plugins: [
    new MiniCSSExtractPlugin(),
  ],
}
