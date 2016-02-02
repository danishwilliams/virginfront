angular
  .module("app", [
    "ngSanitize",
    "ngMessages",
    "angularSpinners",
    "ui.router",
    "ui.router.title",
    "angularUUID2",
    "MassAutoComplete",
    "pascalprecht.translate",
    "mm.foundation",
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
    "app.playlists_admin",
    "app.playlist_template",
    "app.playlist_time",
    "app.playlist_edit",
    "app.playlist_sync",
    "app.playlist_view",
    "app.recent_classes",
    "app.sync",
    "app.tracks",
    "app.tracks_search",
    "app.user",
    "app.users",
    "app.usertypes",
    "app.templates",
    "app.templategroup_view"
  ])
  .constant('APP_PERMISSIONS', {
    viewAdmin: "viewAdmin",
    editAdmin: "editAdmin",
    devices: "devices",
    gyms: "gyms",
    viewContent: "viewContent",
    createPlaylist: "createPlaylist",
    viewPlaylist: "viewPlaylist",
    editPlaylist: "editPlaylist",
    editAnyPlaylist: "editAnyPlaylist",
    templates: "templates",
    user: "user",
    users: "users"
  })
  .constant('USER_ROLES', {
    user: "User",
    instructor: "Instructor",
    manager: "Manager",
    admin: "Admin"
  })
  .controller("AppController", AppController);

AppController.$inject = ['Users', 'spinnerService', '$rootScope', '$state', 'Authorizer'];

function AppController(Users, spinnerService, $rootScope, $state, Authorizer) {
  var self = this;
  self.ready = false;
  self.loggedIn = false;
  self.userName = {};

  self.logout = function () {
    Users.logout();
    self.loggedIn = false;
    $state.go('login');
  };

  $rootScope.$on("$stateChangeStart", function (event, next) {
    self.menu = false;
    var user = Users.getCurrentUser();
    self.userName = user.FirstName;
    if (!_.isEmpty(user)) {
      self.loggedIn = true;
    }

    if (!self.ready && next.name !== 'login') {
      // The app isn't ready yet, so load up a user and then check if they have permission to access the route
      Users.loadCurrentUser().then(function (data) {
        user = data;
        self.userName = user.FirstName;
        spinnerService.hide('bodySpinner');
        self.ready = true;
        self.loggedIn = true;
        hasAccessToRoute(user);
      }, function (response) {
        // Catastropic error!
        spinnerService.hide('bodySpinner');
        if (response.status === 401 || response.status === 403) {
          $state.go('login');
        } else {
          self.error = {
            error: true
          };
        }
      });
    } else if (!_.isEmpty(user)) {
      hasAccessToRoute(user);
    } else if (next.name === 'login') {
      self.ready = true;
      spinnerService.hide('bodySpinner');
    } else {
      throw "Expected a user but found none";
    }

    function hasAccessToRoute(user) {
      var authenticator, permissions;
      permissions = next && next.data ? next.data.permissions : null;
      /*
      if (permissions != null) {
        console.log(permissions + ' ' + Authorizer.canAccess(permissions, user));
      }
      */
      if ((permissions != null) && !Authorizer.canAccess(permissions, user)) {
        event.preventDefault();
        // If the user has navigated directly to this page by typing it in the address bar
        if (next.name === 'dashboard') {
          $state.go('login');
        } else if (!event.currentScope) {
          if (next.name === 'dashboard') {
            $state.go('login');
          } else {
            $state.go('dashboard');
          }
        }
        /*
        if (!user) {
          console.log('not authenticated');
          //return $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
        } else {
          console.log('not authorized');
          //return $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
        }
        */
      }
    }
  });
}
