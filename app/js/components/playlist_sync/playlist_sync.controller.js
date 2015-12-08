angular.module("app.playlist_sync", []).controller('Playlist_syncController', function ($stateParams, $location, $state, AuthenticationService, Playlists, Users, Gyms, spinnerService) {
  var self = this;

  // TODO: do we want to sanitize this?
  this.id = $stateParams.id;

  this.title = "Sync a Ride";
  Playlists.setStep(5);

  Users.loadCurrentUser().then(function (data) {
    self.user = data;
    loadGyms();
  });

  function loadGyms() {
    // Load all gyms which have devices
    Gyms.loadAvailableGyms().then(function (data) {
      self.gyms = data;
      // Mark the user gyms which have been chosen
      _.mapObject(self.gyms, function (val, key) {
        if (key >= 0 && val.RegularGym) {
          val.selected = true;
          return val;
        }
      });
      spinnerService.hide('playlistSyncSpinner');
    });
  }

  self.publishPlaylist = function () {
    // Check that at least one checkbox is selected
    var selected = false;
    self.gyms.forEach(function (val) {
      if (val.selected === true) {
        selected = true;
      }
    });
    if (!selected) {
      self.error = {
        required: true
      };
      return;
    } else {
      self.error = {
        required: false
      };
    }

    spinnerService.show('playlistSyncSpinner');

    var gyms = [];
    self.gyms.forEach(function (val) {
      if (val.selected) {
        gyms.push(val.Gym.Id);
      }
    });
    Playlists.addPlaylistToGyms(self.id, gyms).then(function (data) {
      Playlists.publishPlaylist(self.id).then(function (data) {
        $state.go('dashboard');
      });
      Playlists.publishPlaylistToMusicProvider(self.id).then(function (data) {
        console.log('successfully published playlist to music provider!');
      });
    });
  };

  var onLogoutSuccess = function (response) {
    $location.path('/login');
  };

  this.logout = function () {
    AuthenticationService.logout().success(onLogoutSuccess);
  };
});
