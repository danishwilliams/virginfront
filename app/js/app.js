angular
  .module("app", [
    "ngResource", // TODO: probably not needed
    "ngSanitize",
    "ui.router",
    "angularUUID2",
    "MassAutoComplete",
    "pascalprecht.translate",
    "restangular",
    "app.admin",
    "app.beats",
    "app.countries",
    "app.dashboard",
    "app.devices",
    "app.device",
    "app.device_playlists",
    "app.genres",
    "app.goals",
    "app.gyms",
    "app.locations",
    "app.login",
    "app.music_providers",
    "app.onboarding",
    "app.playlists",
    "app.playlist_template",
    "app.playlist_time",
    "app.playlist_edit",
    "app.playlist_view",
    "app.sync",
    "app.tracks",
    "app.user",
    "app.users",
    "app.usertypes",
    "app.templates",
    "app.template_view"
  ])
  .controller("AppController", ['Users', AppController])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    // use the HTML5 History API
    $locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise('/login');

    $stateProvider.state('login', {
      url: '/login',
      templateUrl: '../js/components/login/login.html',
      controller: 'LoginController as login',
    })

    .state('admin', {
      url: '/admin',
      templateUrl: '../js/components/admin/admin.html',
      controller: 'AdminController as admin'
    })

    // Beats
    .state('beats-admin', {
      url: '/admin/beats',
      templateUrl: '../js/components/beats/beats.html',
      controller: 'BeatsController as beats'
    })

    // Countries
    .state('countries-admin', {
      url: '/admin/countries',
      templateUrl: '../js/components/countries/countries.html',
      controller: 'CountriesController as countries'
    })

    // Dashboard
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: '../js/components/dashboard/dashboard.html',
      controller: 'DashboardController as dashboard'
    })

    // Devices
    .state('devices-admin', {
      url: '/admin/devices',
      templateUrl: '../js/components/devices/devices.html',
      controller: 'DevicesController as devices'
    })

    .state('device', {
      url: '/admin/devices/:id',
      templateUrl: '../js/components/device/device.html',
      controller: 'DeviceController as device'
    })

    .state('device.playlists', {
      url: '/playlists',
      templateUrl: '../js/components/playlists/playlists.html',
      controller: 'DevicePlaylistsController as playlists'
    })

    /*
    .state('device-playlists-queue', {
      url: '/admin/devices/:id/playlists/queue',
      templateUrl: '../js/components/devices/devices.html',
      controller: 'DevicesController as devices'
    })

    */

    // Genres
    .state('genres-admin', {
      url: '/admin/genres',
      templateUrl: '../js/components/genres/genres.html',
      controller: 'GenresController as genres'
    })

    // Goals
    .state('goals-admin', {
      url: '/admin/goals',
      templateUrl: '../js/components/goals/goals.html',
      controller: 'GoalsController as goals'
    })

    // Gyms
    .state('gyms-admin', {
      url: '/admin/gyms',
      templateUrl: '../js/components/gyms/gyms.html',
      controller: 'GymsController as gyms'
    })

    // Locations
    .state('locations-admin', {
      url: '/admin/locations',
      templateUrl: '../js/components/locations/locations.html',
      controller: 'LocationsController as locations'
    })

    // Music Providers
    .state('music-providers-admin', {
      url: '/admin/music-providers',
      templateUrl: '../js/components/music_providers/music_providers.html',
      controller: 'Music_providersController as music_providers'
    })

    // Onboarding - invite
    .state('onboarding', {
      url: '/onboarding/:id',
      templateUrl: '../js/components/onboarding/invitation.html',
      controller: 'OnboardingController as onboarding'
    })

    .state('onboarding-password', {
      url: '/onboarding/:id/password',
      templateUrl: '../js/components/onboarding/password.html',
      controller: 'OnboardingController as onboarding'
    })

    .state('onboarding-gyms', {
      url: '/onboarding/:id/gyms',
      templateUrl: '../js/components/onboarding/gyms.html',
      controller: 'OnboardingController as onboarding'
    })

    .state('onboarding-genres', {
      url: '/onboarding/:id/genres',
      templateUrl: '../js/components/onboarding/genres.html',
      controller: 'OnboardingController as onboarding'
    })

    .state('onboarding-get-started', {
      url: '/onboarding/:id/get-started',
      templateUrl: '../js/components/onboarding/get_started.html',
      controller: 'OnboardingController as onboarding'
    })

    // Playlists
    .state('playlists', {
      url: '/admin/playlists',
      templateUrl: '../js/components/playlists/playlists.html',
      controller: 'PlaylistsController as playlists'
    })

    // Edit an existing playlist
    .state('playlist-edit', {
      url: '/playlists/:id/edit',
      templateUrl: '../js/components/playlist_edit/playlist_edit.html',
      controller: 'Playlist_editController as playlist_edit'
    })

    // Choose a template
    .state('playlist-new-template', {
      url: '/playlists/new',
      templateUrl: '../js/components/playlist_template/playlist_template.html',
      controller: 'Playlist_templateController as playlist_template'
    })

    // Choose a template time
    .state('playlist-new-time', {
      url: '/playlists/new/:id',
      templateUrl: '../js/components/playlist_time/playlist_time.html',
      controller: 'Playlist_timeController as playlist_time'
    })

    // Add tracks to this new playlist
    .state('playlist-new-edit', {
      url: '/playlists/new/:id/edit',
      templateUrl: '../js/components/playlist_edit/playlist_edit.html',
      controller: 'Playlist_editController as playlist_edit'
    })

    // View the new playlist
    .state('playlist-new-view', {
      url: '/playlists/new/:id/view',
      templateUrl: '../js/components/playlist_view/playlist_view.html',
      controller: 'Playlist_viewController as playlist_view'
    })

    // View an existing playlist
    .state('playlist-view', {
      url: '/playlists/:id',
      templateUrl: '../js/components/playlist_view/playlist_view.html',
      controller: 'Playlist_viewController as playlist_view'
    })

    // Templates
    .state('templates-admin', {
      url: '/admin/templates',
      templateUrl: '../js/components/templates/templates.html',
      controller: 'TemplatesController as templates'
    })

    .state('template', {
      url: '/admin/templates/:id',
      templateUrl: '../js/components/template_view/template_view.html',
      controller: 'Template_viewController as template_view'
    })

    // Tracks
    .state('tracks-admin', {
      url: '/admin/tracks',
      templateUrl: '../js/components/tracks/tracks.html',
      controller: 'TracksController as tracks'
    })

    // Users
    .state('users-admin', {
      url: '/admin/users',
      templateUrl: '../js/components/users/users.html',
      controller: 'UsersController as users'
    })

    .state('users', {
      url: '/user/:id',
      templateUrl: '../js/components/user/user.html',
      controller: 'UserController as user'
    })

    // User types
    .state('usertypes-admin', {
      url: '/admin/users/types',
      templateUrl: '../js/components/usertypes/usertypes.html',
      controller: 'UsertypesController as usertypes'
    });

  });

function AppController(Users) {
  Users.loadCurrentUser();
}
