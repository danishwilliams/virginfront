angular.module("app.playlist_sync", []).controller('Playlist_syncController', function ($stateParams, $state, Playlists, Users, Gyms, spinnerService) {
  var self = this;

  // TODO: do we want to sanitize this?
  this.id = $stateParams.id;

  Playlists.setStep(5);

  self.user = Users.getCurrentUser();
  if (!self.user) {
    Users.loadCurrentUser().then(function (data) {
      self.user = data;
      loadGyms();
    });
  }
  else {
    loadGyms();
  }

  this.playlistLimitPerGym = Playlists.getPlaylistLimitPerGym();

  function loadGyms() {
    // Load all gyms which have devices
    Gyms.loadAvailableGyms().then(function (data) {
      self.gyms = data;
      // Mark the user gyms which have been chosen
      _.mapObject(self.gyms, function (val, key) {
        if (key >= 0 && val.RegularGy && !val.LimitReached) {
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

});
