const path = require('path')
const baseConfig = require('../../webpack.config.js')

module.exports = {
  ...baseConfig,
  entry: path.resolve(__dirname, 'lib', 'styled-avocode-email-tagsinput.js'),
  output: {
    library: '@avocode/styled-avocode-email-tagsinput',
    filename: 'styled-avocode-email-tagsinput.js',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
  },
  externals: {
    'react': 'react',
    'react-dom': 'react-dom',
    'immutable': 'immutable',
  },
}
