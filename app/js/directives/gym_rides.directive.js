angular
  .module("app")
  .directive("gymRides", gymRides);

function gymRides() {
  var directive = {
    link: link,
    templateUrl: 'gym_rides.directive.html',
    restrict: 'E',
    controller: gymRidesController,
    controllerAs: 'vm'
  };
  return directive;

  function link(scope) {
    scope.vm.gym = scope.$parent.gym;
    scope.vm.playlistCount = 0;
    if (scope.vm.gym.PlaylistSyncInfos) {
      scope.vm.playlistCount = scope.vm.gym.PlaylistSyncInfos.length;
    }
  }
}

gymRidesController.$inject = ['Playlists', '$scope', '$interval'];

function gymRidesController(Playlists, $scope, $interval) {
  var self = this;
  var intervalPromise = {};
  self.playlistLimitPerGym = Playlists.getPlaylistLimitPerGym();

  // If playlist at the gym's device hasn't been synced, set up a timer
  if ($scope.$parent.gym.PlaylistSyncInfos) {
    $scope.$parent.gym.PlaylistSyncInfos.forEach(function (val) {
      if (!val.DevicePlaylistSyncs[0].SyncSuccess) {

        // Refresh the syncing details for this playlist
        intervalPromise = $interval(function () {
          Playlists.loadGymsDevicePlaylistSyncInfo($scope.$parent.gym.Gym.Id, val.DevicePlaylistSyncs[0].PlaylistId).then(function (data) {
            console.log('calling interval!');
            val.DevicePlaylistSyncs[0].PercentDone = data.PercentDone;
            val.DevicePlaylistSyncs[0].SecondsLeft = data.SecondsLeft;
            val.DevicePlaylistSyncs[0].SyncError = data.SyncError;
            val.DevicePlaylistSyncs[0].SyncStarted = data.SyncStarted;
            val.DevicePlaylistSyncs[0].SyncSuccess = data.SyncSuccess;

            if (data.SyncSuccess) {
              $interval.cancel(intervalPromise);
            }
          });
        }, 5000);

      }
    });
  }

  // Cancel the interval when navigating away from the page
  // @see http://stackoverflow.com/questions/21364480/in-angular-how-to-use-cancel-an-interval-on-user-events-like-page-change
  $scope.$on('$destroy', function () {
    $interval.cancel(intervalPromise);
  });

  // Adds a ride to the gym
  self.addRide = function () {
    var playlist = {
      Playlist: self.playlist,
      DevicePlaylistSyncs: [{
        SyncSuccess: false,
        SecondsLeft: 3600
      }]
    };
    if (!self.gym.PlaylistSyncInfos) {
      // Because sometimes PlaylistSyncInfos doesn't exist i.e. when there are 0 playlists
      self.gym.PlaylistSyncInfos = [];
    }
    self.gym.PlaylistSyncInfos.push(playlist);
    self.playlistCount++;
    if (self.gym.PlaylistSyncInfos.length === self.playlistLimitPerGym) {
      self.gym.LimitReached = true;
    }

    // Start the interval timer

    var i = self.gym.PlaylistSyncInfos.length - 1;
    var val = self.gym.PlaylistSyncInfos[i];
    console.log(playlist);
    console.log(self.gym.PlaylistSyncInfos);
    console.log(val);

    // Refresh the syncing details for this playlist
    intervalPromise = $interval(function () {
      Playlists.loadGymsDevicePlaylistSyncInfo(self.gym.Gym.Id, playlist.Playlist.Id).then(function (data) {
        //console.log('calling add interval!');
        val.DevicePlaylistSyncs[0].PercentDone = data.PercentDone;
        val.DevicePlaylistSyncs[0].SecondsLeft = data.SecondsLeft;
        val.DevicePlaylistSyncs[0].SyncError = data.SyncError;
        val.DevicePlaylistSyncs[0].SyncStarted = data.SyncStarted;
        val.DevicePlaylistSyncs[0].SyncSuccess = data.SyncSuccess;

        if (data.SyncSuccess) {
          $interval.cancel(intervalPromise);
        }
      });
    }, 5000);
  };

  self.remove = function (playlist, gymId) {
    playlist.removed = true;
    self.playlistCount--;
    Playlists.removePlaylistFromGym(playlist.Playlist.Id, gymId).then(function (data) {
      // It worked!
      $interval.cancel(intervalPromise);
    }, function (response) {
      // There was some error
      console.log("Error with status code", response.status);
      playlist.removed = false;
      self.playlistCount++;
    });
  };

  self.undoRemove = function (playlist, gymId) {
    playlist.removed = false;
    self.playlistCount++;

    Playlists.addPlaylistToGym(playlist.Playlist.Id, gymId).then(function (data) {
      // It worked!

      // Refresh the syncing details for this playlist
      intervalPromise = $interval(function () {
        Playlists.loadGymsDevicePlaylistSyncInfo(gymId, playlist.Playlist.Id).then(function (data) {
          //console.log('calling interval for an undoRemoved playlist!');
          playlist.DevicePlaylistSyncs[0].PercentDone = data.PercentDone;
          playlist.DevicePlaylistSyncs[0].SecondsLeft = data.SecondsLeft;
          playlist.DevicePlaylistSyncs[0].SyncError = data.SyncError;
          playlist.DevicePlaylistSyncs[0].SyncStarted = data.SyncStarted;
          playlist.DevicePlaylistSyncs[0].SyncSuccess = data.SyncSuccess;

          if (data.SyncSuccess) {
            $interval.cancel(intervalPromise);
          }
        });
      }, 5000);

    }, function (response) {
      // There was some error
      console.log("Error with status code", response.status);
      playlist.removed = true;
      self.playlistCount--;
    });
  };
}
