// @flow

declare var isMac: boolean
declare var isDevelopment: boolean
declare var browserOptions: Object

global.isMac = process.env.platform === 'darwin'
global.isDevelopment = process.env.NODE_ENV === 'development'
global.browserOptions = global.isDevelopment ?
{
  headless: false,
  slowMo: 50,
  devtools: true,
} : {
  args: [ '--no-sandbox' ],
}

