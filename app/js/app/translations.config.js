angular.module("app").config(function ($translateProvider, defaultI18n) {
  // http://angular-translate.github.io/docs/#/guide/19_security
  // The strongly recommended value is 'sanitize' but then ALL strings need to be added with the ng-bind-html
  // attribute which makes the html...pretty damn unreadable.
  // The risk is that javascript can be injected into the JSON files and voila, XSS, but if an attacker
  // has access to be able to modify the JS files then the user is screwed anyway.
  // @see http://odetocode.com/blogs/scott/archive/2014/09/10/a-journey-with-trusted-html-in-angularjs.aspx
  $translateProvider.useSanitizeValueStrategy(null);

  // Prevent FUOC (Flash of untranslated content) pre loading english translations
  // Adapted from https://github.com/angular-translate/angular-translate/issues/921
  $translateProvider.translations('en', defaultI18n.en);

  // Register a loader for the static files
  // So, the module will search missing translation tables under the specified urls.
  // Those urls are [prefix][langKey][suffix].
  $translateProvider.useStaticFilesLoader({
    prefix: 'l10n/',
    suffix: '.json'
  });

  // .co.za .co.uk .co.it .co.pt
  var language = 'en';
  switch (window.location) {
    case 'ride.virginactive.co.it':
      language = 'it';
      break;
    case 'ride.virginactive.co.pt':
      language = 'pt';
      break;
  }

  $translateProvider.preferredLanguage(language);

  // Tells angular-translate to use the English language if translations are not available in current selected language
  //$translateProvider.fallbackLanguage('en');
});