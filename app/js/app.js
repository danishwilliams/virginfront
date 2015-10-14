angular
  .module("app", [
    "ngResource", // TODO: probably not needed
    "ngSanitize",
    "ngNewRouter",
    "angularUUID2",
    "pascalprecht.translate",
    "restangular",
    "app.beats",
    "app.countries",
    "app.devices",
    "app.genres",
    "app.goals",
    "app.gyms",
    "app.locations",
    "app.login",
    "app.music_providers",
    "app.playlists",
    "app.playlist_template",
    "app.playlist_time",
    "app.playlist_edit",
    "app.playlist_view",
    "app.sync",
    "app.tracks",
    "app.users",
    "app.usertypes",
    "app.templates",
    "app.template_view"
  ])
  .controller("AppController", ['$router', 'Users', AppController])
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

function AppController($router, Users) {
  Users.loadCurrentUser();

  $router.config([{
    path: '/',
    redirectTo: '/login'
  }, {
    path: '/login',
    component: 'login'
  }, {
    path: '/admin/beats',
    component: 'beats'
  }, {
    path: '/admin/countries',
    component: 'countries'
  }, {
    path: '/admin/devices',
    component: 'devices'
  }, {
    path: '/devices/:id/playlists',
    component: 'devices'
  }, {
    path: '/devices/:id/playlists/queue',
    component: 'devices'
  }, {
    path: '/admin/genres',
    component: 'genres'
  }, {
    path: '/admin/goals',
    component: 'goals'
  }, {
    path: '/admin/gyms',
    component: 'gyms'
  }, {
    path: '/admin/locations',
    component: 'locations'
  }, {
    path: '/admin/music_providers',
    component: 'music_providers'
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
  }, {
    path: '/playlists/new/:id',
    component: 'playlist_time'
  }, {
    path: '/playlists/new/playlist/:id',
    component: 'playlist_edit'
  }, {
    path: '/admin/templates',
    component: 'templates'
  }, {
    path: '/admin/templates/:id',
    component: 'template_view'
  }, {
    path: '/admin/tracks',
    component: 'tracks'
  }, {
    path: '/admin/users',
    component: 'users'
  }, {
    path: '/admin/users/types',
    component: 'usertypes'
  }
  ]);
  // /playlists - list of my playlists
}
