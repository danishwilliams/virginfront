exports.config = {
  /* Spinning up selenium each time */
  directConnect: true,
  chromeDriver: '../node_modules/chromedriver/lib/chromedriver/chromedriver',

  /* Keeping selenium running all the time with 'selenium-standalone start' */
  //seleniumAddress: 'http://127.0.0.1:4444/wd/hub',

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
