angular.module("app").config(['$translateProvider', function ($translateProvider) {
  // http://angular-translate.github.io/docs/#/guide/19_security
  // The strongly recommended value is 'sanitize' but then ALL strings need to be added with the ng-bind-html
  // attribute which makes the html...pretty damn unreadable.
  // The risk is that javascript can be injected into the JSON files and voila, XSS, but if an attacker
  // has access to be able to modify the JS files then the user is screwed anyway.
  // @see http://odetocode.com/blogs/scott/archive/2014/09/10/a-journey-with-trusted-html-in-angularjs.aspx
  $translateProvider.useSanitizeValueStrategy(null);

  // Register a loader for the static files
  // So, the module will search missing translation tables under the specified urls.
  // Those urls are [prefix][langKey][suffix].
  $translateProvider.useStaticFilesLoader({
    prefix: 'l10n/',
    suffix: '.json'
  });
 
  $translateProvider.preferredLanguage('en');
}]);