angular
  .module("app", [
    "ngSanitize",
    "ngMessages",
    "angularSpinners",
    "angular.vertilize",
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
    "app.device_new",
    "app.device_error_log",
    //"app.device_playlists",
    "app.emails",
    "app.genres",
    "app.goals",
    "app.gyms",
    "app.locations",
    "app.login",
    "app.music_providers",
    "app.onboarding",
    "app.playlists_admin",
    "app.playlist_template",
    "app.playlist_time",
    "app.playlist_edit",
    "app.playlist_sync",
    "app.playlist_view",
    "app.registered",
    "app.sync",
    "app.tracks",
    "app.tracks_search",
    "app.user",
    "app.user_invite",
    "app.user_new",
    "app.users",
    "app.usertypes",
    "app.templates",
    "app.templategroup_view"
  ])
  .constant('APP_PERMISSIONS', {
    viewAdmin: "viewAdmin",
    editAdmin: "editAdmin",
    isManager: "isManager",
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
    techManager: "Technical Manager",
    admin: "Admin"
  })
  .constant('USER_STATES', {
    invite_emailed: "invite_emailed",
    invite_email_failed: "invite_email_failed",
    onboarding_genres: "onboarding_genres",
    onboarding_clubs: "onboarding_clubs",
    registered: "registered",
  })
  .controller("AppController", AppController);

AppController.$inject = ['Users', 'spinnerService', '$rootScope', '$state', 'Authorizer', '$window', '$scope', '$filter', '$translate', 'Storage'];

function AppController(Users, spinnerService, $rootScope, $state, Authorizer, $window, $scope, $filter, $translate, Storage) {
  var self = this;
  self.ready = false;
  self.loggedIn = false;
  self.userName = {};
  self.menu = false;

  self.logout = function () {
    Users.logout();
    self.loggedIn = false;
    $state.go('login');
  };

  self.menuClicked = function() {
    self.menu = !self.menu;
  };

  var currentWidth = screen.width;

  // When resizing the window
  angular.element($window).on('resize', function(e) {
    // Check window width has actually changed and it's not just iOS triggering a resize event on scroll
    //console.log('resized!');
    var width = 0;
    if (typeof window.orientation !== 'undefined') {
      width = screen.width;
    }
    else {
      width = angular.element($window)[0].innerWidth;
    }

    if (currentWidth !== width) {
      currentWidth = width;
      // Without this angular doesn't know the variable has changed. Why? Mysteries of $digest.
      $scope.$apply(function() {
        self.menu = false;
      });
    }
  });

  $rootScope.$on("$stateChangeStart", function (event, next) {
    self.menu = false;

    // Skip login check for:
    // - onboarding
    // - password reset
    if (next.name === 'passwordreset' || next.name === 'onboarding') {
      // The first onboarding page skips login check
      spinnerService.hide('bodySpinner');
      self.ready = true;
      return;
    }

    var user = Users.getCurrentUser();
    self.userName = user.FirstName;
    if (self.userName && self.userName.length > 9) {
      self.userName = $filter('translate')('PROFILE');
    }
    if (!_.isEmpty(user) && !Storage.getItem('onboarding' + user.Id)) {
      self.loggedIn = true;
    }

    if (!self.ready && next.name !== 'login') {
      // The app isn't ready yet, so load up a user and then check if they have permission to access the route
      Users.loadCurrentUser().then(function (data) {
        user = data;
        self.userName = user.FirstName;
        if (self.userName && self.userName.length > 9) {
          self.userName = $filter('translate')('PROFILE');
        }
        spinnerService.hide('bodySpinner');
        self.ready = true;

        // Is the user in the onboarding process?
        if (!Storage.getItem('onboarding' + user.Id)) {
          self.loggedIn = true;
        }

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
