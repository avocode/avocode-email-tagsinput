const { series } = require('gulp')
const copyPackageJson = require('./copy-package-json.gulp')

module.exports.default = series(copyPackageJson)
