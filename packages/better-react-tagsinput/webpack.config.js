const path = require('path')
const baseConfig = require('@avocode/avocode-email-tagsinput-webpack-config')

module.exports = {
  ...baseConfig,
  entry: path.resolve(__dirname, 'lib', 'better-react-tagsinput.js'),
  output: {
    library: '@avocode/better-react-tagsinput',
    filename: 'better-react-tagsinput.js',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
  },
  externals: {
    'react': 'react',
    'react-dom': 'react-dom',
    'immutable': 'immutable',
  },
}
