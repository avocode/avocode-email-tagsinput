/* Script that copies `package.json` files and replaces
 * "main" field with the one pointing to correct entry
 * javascript file
 */

const path = require('path')
const fs = require('fs')

const getPackageName = (argv) => {
  return argv.reduce((name, arg, index) => {
    if (!name && arg.includes('--package')) {
      return argv[index + 1] || ''
    }
    return name
  }, '')
}

module.exports = (cb) => {
  const packageName = getPackageName(process.argv)
  const pkgPath = path.join(
    __dirname,
    '..',
    'packages',
    packageName,
    'package.json'
  )

  const pkg = require(pkgPath)
  const distPkg = {
    ...pkg,
    main: `${packageName}.js`,
  }

  const distPkgPath = path.join(
    __dirname,
    '..',
    'packages',
    packageName,
    'dist',
    'package.json'
  )

  fs.writeFile(distPkgPath, JSON.stringify(distPkg), 'utf8', (err) => {
    if (err) {
      throw err
      return
    }
    cb()
  })
}
