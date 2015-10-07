angular
  .module("app", [
    "ngResource",
    "ngSanitize",
    "ngNewRouter",
    "angularUUID2",
    "app.login",
    "app.goals",
    "app.playlists",
    "app.playlist_template",
    "app.playlist_edit",
    "app.playlist_view",
    "app.templates",
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
    path: '/admin/templates',
    component: 'templates'
  }, {
    path: '/admin/playlists',
    component: 'playlists'
  }, {
    path: '/playlists/:id',
    component: 'playlist_view'
  }, {
    path: '/playlists/:id/edit',
    component: 'playlist_edit'
  }, {
    path: '/playlists/new',
    component: 'playlist_template'
  }
  ]);
  // /playlists - list of my playlists
}
