global.isMac = process.env.platform === 'darwin'
global.isDevelopment = process.env.NODE_ENV === 'development'
global.browserOptions = global.isDevelopment ?
{
  headless: false,
  slowMo: 50,
  devtools: true,
} : {
  args: [ '--no-sandbox', '--window-size=1024,768' ],
}

