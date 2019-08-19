module.exports = {
  'presets': [
    [
      '@babel/preset-env',
      {
        'targets': {
          'node': '10.15.0',
          'electron': '4.0.1',
          'browsers': [ 'Chrome >= 69', 'Firefox >= 63', 'Safari >= 11' ],
        }
      }
    ],
    '@babel/preset-react',
    '@babel/preset-flow',
  ],
    'plugins': [ '@babel/plugin-proposal-class-properties' ]
}

