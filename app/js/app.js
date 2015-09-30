angular
  .module("app", [
    "ngResource",
    "ngSanitize",
    "ngNewRouter",
    "angularUUID2",
    "app.login",
    "app.goals",
    "app.playlist",
    "pascalprecht.translate",
    "restangular"
  ])
  .controller("AppController", ['$router', AppController])
  .config(function ($componentLoaderProvider) {
    /*
     * overriding the template mapping of the new router to make it
     * compatible with grunt-angular-templates
     */
    $componentLoaderProvider.setTemplateMapping(function (name) {
      var dashName = dashCase(name);
      return '../js/components/' + dashName + '/' + dashName + '.html';
    });
  });

function AppController($router) {
  $router.config([{
    path: '/',
    redirectTo: '/login'
  }, {
    path: '/login',
    component: 'login'
  }, {
    path: '/admin/goals',
    component: 'goals'
  }, {
    path: '/playlist-create',
    component: 'playlist'
  }, ]);
}
