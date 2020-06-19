const { babelConfig } = require('../packages/avocode-email-tagsinput-config')

module.exports = require('babel-jest').createTransformer(babelConfig)
