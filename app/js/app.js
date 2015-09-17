function AppController($router) {
  console.log('AppController instantiated');
  $router.config([
    { path: '/', redirectTo: '/login' },
    { path: '/login', component: 'login' }
  ]);
}

angular
  .module("app", ["ngResource", "ngNewRouter", "app.login"])
  .controller("AppController", ['$router', AppController])
  .config(function ($componentLoaderProvider) {
    /*
     * overriding the template mapping of the new router to make it
     * compatible with grunt-angular-templates
     */
    $componentLoaderProvider.setTemplateMapping(function (name) {
      var dashName = dashCase(name);
      console.log(dashName);
      return '../js/components/' + dashName + '/' + dashName + '.html';
    });
  });

/*
AppController.$inject = [
  '$router'
];
*/
