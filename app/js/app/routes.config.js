angular.module("app").config(function ($stateProvider, $urlRouterProvider, $locationProvider, APP_PERMISSIONS) {
  // use the HTML5 History API
  $locationProvider.html5Mode(true);

  $urlRouterProvider.otherwise('/dashboard');

  $stateProvider.state('login', {
    url: '/login',
    templateUrl: '../js/components/login/login.html',
    controller: 'LoginController as login',
    resolve: {
      $title: function() { return 'Log in'; /* LOGIN */ }
    }
  })

  // Password reset
  .state('passwordreset', {
    url: '/passwordreset/:token',
    //templateUrl: '../js/components/password_reset/password_reset.html',
    //controller: 'PasswordResetController as vm',
    templateUrl: '../js/components/onboarding/password.html',
    controller: 'OnboardingController as vm',
    resolve: {
      $title: function() { return 'Password reset'; /* PASSWORD_RESET */ }
    }
  })

  /* A registered user, but has no roles */
  .state('registered', {
    'url': '/registered',
    templateUrl: '../js/components/registered/registered.html',
    controller: 'RegisteredController'
  })

  .state('admin', {
    url: '/admin',
    templateUrl: '../js/components/admin/admin.html',
    controller: 'AdminController as admin',
    resolve: {
      $title: function() { return 'Admin'; }
    },
    data: {
      permissions: [APP_PERMISSIONS.viewAdmin]
    }
  })

  // Beats
  .state('beats-admin', {
    url: '/admin/beats',
    templateUrl: '../js/components/beats/beats.html',
    controller: 'BeatsController as beats',
    resolve: {
      $title: function() { return 'Beats | Admin'; }
    },
    data: {
      permissions: [APP_PERMISSIONS.viewAdmin]
    }
  })

  // Recent classes
  .state('recent-classes', {
    url: '/classes',
    templateUrl: '../js/components/recent_classes/recent_classes.html',
    controller: 'Recent_classesController as classes',
    resolve: {
      $title: function() { return 'Recent classes'; /* RECENT_CLASSES */ }
    },
    data: {
      permissions: [APP_PERMISSIONS.viewContent]
    }
  })

  // Countries
  .state('countries-admin', {
    url: '/admin/countries',
    templateUrl: '../js/components/countries/countries.html',
    controller: 'CountriesController as countries',
    resolve: {
      $title: function() { return 'Countries | Admin'; }
    },
    data: {
      permissions: [APP_PERMISSIONS.viewAdmin]
    }
  })

  // Dashboard
  .state('dashboard', {
    url: '/dashboard',
    templateUrl: '../js/components/dashboard/dashboard.html',
    controller: 'DashboardController as dashboard',
    resolve: {
      $title: function() { return 'Dashboard'; /* DASHBOARD */ }
    },
    data: {
      permissions: [APP_PERMISSIONS.viewContent]
    }
  })

  // Devices
  .state('devices-admin', {
    url: '/admin/devices',
    templateUrl: '../js/components/devices/devices.html',
    controller: 'DevicesController as devices',
    resolve: {
      $title: function() { return 'Devices | Admin'; }
    },
    data: {
      permissions: [APP_PERMISSIONS.devices]
    }
  })

  .state('device', {
    url: '/admin/devices/:id',
    templateUrl: '../js/components/device/device.html',
    controller: 'DeviceController as device',
    resolve: {
      $title: function() { return 'Device | Admin'; }
    },
    data: {
      permissions: [APP_PERMISSIONS.devices]
    }
  })

  .state('device.playlists', {
    url: '/playlists',
    templateUrl: '../js/components/playlists/playlists.html',
    controller: 'DevicePlaylistsController as playlists',
    resolve: {
      $title: function() { return 'Device playlists | Admin'; }
    },
    data: {
      permissions: [APP_PERMISSIONS.viewAdmin]
    }
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
    controller: 'GenresController as genres',
    resolve: {
      $title: function() { return 'Genres | Admin'; }
    },
    data: {
      permissions: [APP_PERMISSIONS.viewAdmin]
    }
  })

  // Goals
  .state('goals-admin', {
    url: '/admin/goals',
    templateUrl: '../js/components/goals/goals.html',
    controller: 'GoalsController as goals',
    resolve: {
      $title: function() { return 'Goals | Admin'; }
    },
    data: {
      permissions: [APP_PERMISSIONS.viewAdmin]
    }
  })

  // Gyms
  .state('gyms-admin', {
    url: '/admin/gyms',
    templateUrl: '../js/components/gyms/gyms.html',
    controller: 'GymsController as gyms',
    resolve: {
      $title: function() { return 'Clubs | Admin'; }
    },
    data: {
      permissions: [APP_PERMISSIONS.gyms]
    }
  })

  // Locations
  .state('locations-admin', {
    url: '/admin/locations',
    templateUrl: '../js/components/locations/locations.html',
    controller: 'LocationsController as locations',
    resolve: {
      $title: function() { return 'Locations | Admin'; }
    },
    data: {
      permissions: [APP_PERMISSIONS.viewAdmin]
    }
  })

  // Music Providers
  .state('music-providers-admin', {
    url: '/admin/music-providers',
    templateUrl: '../js/components/music_providers/music_providers.html',
    controller: 'Music_providersController as music_providers',
    resolve: {
      $title: function() { return 'Music providers | Admin'; }
    },
    data: {
      permissions: [APP_PERMISSIONS.viewAdmin]
    }
  })

  // Onboarding - invite
  .state('onboarding', {
    url: '/onboarding/:token',
    templateUrl: '../js/components/onboarding/password.html',
    controller: 'OnboardingController as vm',
    resolve: {
      $title: function() { return 'Password | Onboarding'; /* OB_PASSWORD */ }
    }
  })

  .state('onboarding-gyms', {
    url: '/onboarding/:id/gyms',
    templateUrl: '../js/components/onboarding/gyms.html',
    controller: 'OnboardingController as onboarding',
    resolve: {
      $title: function() { return 'Clubs | Onboarding'; /* OB_CLUBS_TITLE */ }
    }
  })

  .state('onboarding-genres', {
    url: '/onboarding/:id/genres',
    templateUrl: '../js/components/onboarding/genres.html',
    controller: 'OnboardingController as onboarding',
    resolve: {
      $title: function() { return 'Genres | Onboarding'; /* OB_GENRES */ }
    }
  })

  .state('onboarding-get-started', {
    url: '/onboarding/:id/get-started',
    templateUrl: '../js/components/onboarding/get_started.html',
    controller: 'OnboardingController as onboarding',
    resolve: {
      $title: function() { return 'Get started | Onboarding'; /* OB_DONE */ }
    },
  })

  // Playlists
  .state('playlists', {
    url: '/playlists',
    templateUrl: '../js/components/playlists/playlists.html',
    controller: 'PlaylistsController as playlists',
    resolve: {
      $title: function() { return 'Rides'; /* RIDES */ }
    },
    data: {
      permissions: [APP_PERMISSIONS.viewContent]
    }
  })

  .state('playlists_admin', {
    url: '/admin/playlists',
    templateUrl: '../js/components/playlists_admin/playlists_admin.html',
    controller: 'PlaylistsAdminController as playlists',
    resolve: {
      $title: function() { return 'Rides | Admin'; }
    },
    data: {
      permissions: [APP_PERMISSIONS.viewAdmin]
    }
  })

  // Edit an existing playlist
  .state('playlist-edit', {
    url: '/playlists/:id/edit',
    templateUrl: '../js/components/playlist_edit/playlist_edit.html',
    controller: 'Playlist_editController as playlist_edit',
    resolve: {
      $title: function() { return 'Ride edit'; /* RIDE_EDIT_TITLE */ }
    },
    data: {
      permissions: [APP_PERMISSIONS.editPlaylist]
    }
  })

  .state('playlist-edit.tracks-search', {
    url: '/tracks',
    templateUrl: '../js/components/tracks_search/tracks_search.html',
    controller: 'Tracks_searchController as vm',
    resolve: {
      $title: function() { return 'Song search'; /* TRACKS_SEARCH */ }
    },
    data: {
      permissions: [APP_PERMISSIONS.createPlaylist]
    }
  })

  // Choose a template
  .state('playlist-new-template', {
    url: '/playlists/new',
    templateUrl: '../js/components/playlist_template/playlist_template.html',
    controller: 'Playlist_templateController as playlist_template',
    resolve: {
      $title: function() { return 'Create a ride'; /* CREATE_RIDE_MENU */ }
    },
    data: {
      permissions: [APP_PERMISSIONS.createPlaylist]
    }
  })

  // Choose a template time
  .state('playlist-new-time', {
    url: '/playlists/new/:id',
    templateUrl: '../js/components/playlist_time/playlist_time.html',
    controller: 'Playlist_timeController as playlist_time',
    resolve: {
      $title: function() { return 'Ride | Choose a time'; /* RIDE_TIME */ }
    },
    data: {
      permissions: [APP_PERMISSIONS.createPlaylist]
    }
  })

  // Add tracks to this new playlist
  .state('playlist-new-edit', {
    url: '/playlists/new/:id/edit',
    templateUrl: '../js/components/playlist_edit/playlist_edit.html',
    controller: 'Playlist_editController as playlist_edit',
    resolve: {
      $title: function() { return 'Create ride'; /* RIDE_CREATE_TITLE */ }
    },
    data: {
      permissions: [APP_PERMISSIONS.createPlaylist]
    }
  })

  .state('playlist-new-edit.tracks-search', {
    url: '/tracks',
    templateUrl: '../js/components/tracks_search/tracks_search.html',
    controller: 'Tracks_searchController as vm',
    resolve: {
      $title: function() { return 'Song search'; /* TRACKS_SEARCH */ }
    },
    data: {
      permissions: [APP_PERMISSIONS.createPlaylist]
    }
  })

  // View the new playlist
  .state('playlist-new-view', {
    url: '/playlists/new/:id/view',
    templateUrl: '../js/components/playlist_view/playlist_view.html',
    controller: 'Playlist_viewController as playlist_view',
    resolve: {
      $title: function() { return 'View ride'; /* RIDE_VIEW */ }
    },
    data: {
      permissions: [APP_PERMISSIONS.createPlaylist]
    }
  })

  // Choose which clubs to sync the new playlist to
  .state('playlist-new-sync', {
    url: '/playlists/new/:id/sync',
    templateUrl: '../js/components/playlist_sync/playlist_sync.html',
    controller: 'Playlist_syncController as playlist_sync',
    resolve: {
      $title: function() { return 'Sync ride'; /* RIDE_SYNC */ }
    },
    data: {
      permissions: [APP_PERMISSIONS.createPlaylist]
    }
  })

  // View an existing playlist
  .state('playlist-view', {
    url: '/playlists/:id',
    templateUrl: '../js/components/playlist_view/playlist_view.html',
    controller: 'Playlist_viewController as playlist_view',
    resolve: {
      $title: function() { return 'View ride'; /* RIDE_VIEW */ }
    },
    data: {
      permissions: [APP_PERMISSIONS.viewPlaylist]
    }
  })

  // Templates
  .state('templates-admin', {
    url: '/admin/templates',
    templateUrl: '../js/components/templates/templates.html',
    controller: 'TemplatesController as templates',
    resolve: {
      $title: function() { return 'Templates | Admin'; /* TEMPLATES_PAGE */ }
    },
    data: {
      permissions: [APP_PERMISSIONS.templates]
    }
  })

  .state('templategroup-new', {
    url: '/admin/templates/group/new',
    templateUrl: '../js/components/templategroup/templategroup_new.html',
    controller: 'Templategroup_viewController as vm',
    resolve: {
      $title: function() { return 'Create New Template | Admin'; /* TEMPLATE_NEW_PAGE */ }
    },
    data: {
      permissions: [APP_PERMISSIONS.templates]
    }
  })

  .state('templategroup', {
    url: '/admin/templates/group/:id?action',
    templateUrl: '../js/components/templategroup/templategroup.html',
    controller: 'Templategroup_viewController as vm',
    resolve: {
      $title: function() { return 'Template | Admin'; /* TEMPLATE_PAGE */ }
    },
    data: {
      permissions: [APP_PERMISSIONS.templates]
    }
  })

  // Tracks
  .state('tracks-admin', {
    url: '/admin/tracks',
    templateUrl: '../js/components/tracks/tracks.html',
    controller: 'TracksController as tracks',
    resolve: {
      $title: function() { return 'Tracks | Admin'; }
    },
    data: {
      permissions: [APP_PERMISSIONS.viewAdmin]
    }
  })

  // Users
  .state('users-admin', {
    url: '/admin/users',
    templateUrl: '../js/components/users/users.html',
    controller: 'UsersController as users',
    resolve: {
      $title: function() { return 'Users | Admin'; }
    },
    data: {
      permissions: [APP_PERMISSIONS.users]
    }
  })

  .state('user-new', {
    url: '/admin/users/new',
    templateUrl: '../js/components/user_new/user_new.html',
    controller: 'UserNewController as vm',
    resolve: {
      $title: function() { return 'Create new user'; /* CREATE_USER */ }
    },
    data: {
      permissions: [APP_PERMISSIONS.users]
    }
  })

  .state('user-invite', {
    url: '/admin/users/invite',
    templateUrl: '../js/components/user_invite/user_invite.html',
    controller: 'UserInviteController as vm',
    resolve: {
      $title: function() { return 'Invite'; /* INVITE */ }
    },
    data: {
      permissions: [APP_PERMISSIONS.users]
    }
  })

  .state('user', {
    url: '/user',
    templateUrl: '../js/components/user/user.html',
    controller: 'UserController as user',
    resolve: {
      $title: function() { return 'User profile'; /* PROFILE_PAGE */ }
    },
    data: {
      permissions: [APP_PERMISSIONS.user]
    }
  })

  .state('users', {
    url: '/users/:id',
    templateUrl: '../js/components/user/user.html',
    controller: 'UserController as user',
    resolve: {
      $title: function() { return 'User'; /* USER */ }
    }
  })

  // User types
  .state('usertypes-admin', {
    url: '/admin/users/types',
    templateUrl: '../js/components/usertypes/usertypes.html',
    controller: 'UsertypesController as usertypes',
    resolve: {
      $title: function() { return 'User types | Admin'; }
    },
    data: {
      permissions: [APP_PERMISSIONS.viewAdmin]
    }
  });

});
