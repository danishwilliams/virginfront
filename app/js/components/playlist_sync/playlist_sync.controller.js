angular.module("app.playlist_sync", []).controller('Playlist_syncController', function ($stateParams, $state, Playlists, Users, Gyms, spinnerService) {
  var self = this;

  // TODO: do we want to sanitize this?
  this.id = $stateParams.id;

  //Playlists.setCreatingNewPlaylist(false);

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

      // Load up the playlists already synced at this gym, and see if the current playlist is one of them
      Playlists.loadGymsPlaylistSyncInfoDetailed().then(function (data) {
        data.forEach(function(val) {
          // Find out if our playlist has already been synced to a gym, and if so, set that gym.playlistAlreadySyncedToThisGym = true
          val.PlaylistSyncInfos.forEach(function(playlist) {
              // Find the gym
              self.gyms.forEach(function(gym) {
                if (gym.Gym.Id === val.Gym.Id) {
                  if (playlist.Playlist.Id === self.id) {
                    gym.PlaylistAlreadySyncedToThisGym = true;
                  }
                  gym.PlaylistSyncInfos = val.PlaylistSyncInfos;
                }
              });
          });
        });

        selectGymCheckboxes();
        self.ready = true;
        spinnerService.hide('playlistSyncSpinner');
      });
    });
  }

  /**
   * Sets gyms as selected on page load depending on various conditions
   */
  function selectGymCheckboxes() {
    _.mapObject(self.gyms, function (val, key) {
      if (key >= 0) {
        // If this is a new playlist...Mark the user's default gyms
        if (Playlists.getCreatingNewPlaylist()) {
          if (val.RegularGym && !val.LimitReached) {
            val.selected = true;
            return val;
          }
        }
        // This is an edited playlist
        else {
          if (val.PlaylistAlreadySyncedToThisGym) {
            val.selected = true;
            return val;
          }
        }
      }
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
      if (val.playlistToBeReplaced) {
        // Remove the playlist to be replaced from the gym
        Playlists.removePlaylistFromGym(val.playlistToBeReplaced, val.Gym.Id).then(function (data) {
        });
      }
    });
    publishPlaylists(gyms);
  };

  function publishPlaylists(gyms) {
    Playlists.addPlaylistToGyms(self.id, gyms).then(function (data) {
      Playlists.publishPlaylist(self.id).then(function (data) {
        $state.go('dashboard');
      });
      Playlists.publishPlaylistToMusicProvider(self.id).then(function (data) {
        console.log('successfully published playlist to music provider!');
      });
    });
  }

});
