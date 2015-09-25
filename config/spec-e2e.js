exports.config = {
  directConnect: true,
  chromeDriver: '../node_modules/chromedriver/lib/chromedriver/chromedriver',

  specs: [
    '../spec-e2e/**/*spec.{js,coffee}'
  ],
  capabilities: {
    'browserName': 'chrome'
  },
  baseUrl: 'http://localhost:8000',
  jasmineNodeOpts: {
    isVerbose: true,
    showColors: true,
    defaultTimeoutInterval: 30000
  }
};
