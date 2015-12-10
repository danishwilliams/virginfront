angular
  .module("app", [
    "ngResource", // TODO: probably not needed
    "ngSanitize",
    "ngMessages",
    "angularSpinners",
    "ui.router",
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
    "app.playlist_template",
    "app.playlist_time",
    "app.playlist_edit",
    "app.playlist_sync",
    "app.playlist_view",
    "app.sync",
    "app.tracks",
    "app.tracks_search",
    "app.user",
    "app.users",
    "app.usertypes",
    "app.templates",
    "app.template_view"
  ])
  .constant('APP_PERMISSIONS', {
    viewAdmin: "viewAdmin",
    editAdmin: "editAdmin",
    viewContent: "viewContent",
    createPlaylist: "createPlaylist",
    viewPlaylist: "viewPlaylist",
    editPlaylist: "editPlaylist",
    editAnyPlaylist: "editAnyPlaylist",
    viewTemplates: "viewTemplates",
    editTemplates: "editTemplates",
    viewUser: "viewUser",
    editUser: "editUser",
    viewUsers: "viewUsers",
    editUsers: "editUsers"
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

  self.logout = function () {
    Users.logout();
    $state.go('login');
  };

  $rootScope.$on("$stateChangeStart", function (event, next) {
    var user = Users.getCurrentUser();

    if (!self.ready && next.name !== 'login') {
      Users.initAuthHeader();
      // The app isn't ready yet, so load up a user and then check if they have permission to access the route
      Users.loadCurrentUser().then(function (data) {
        user = data;
        spinnerService.hide('bodySpinner');
        self.ready = true;
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
      if (permissions != null) {
        console.log(permissions + ' ' + Authorizer.canAccess(permissions, user));
      }
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
