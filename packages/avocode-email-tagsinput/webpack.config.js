const path = require('path')
const baseConfig = require('../../webpack.config.js')

module.exports = {
  ...baseConfig,
  entry: path.resolve(__dirname, 'lib', 'avocode-email-tagsinput.js'),
  output: {
    library: '@avocode/avocode-email-tagsinput',
    filename: 'avocode-email-tagsinput.js',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
  },
}
