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
  }
}

gymRidesController.$inject = ['Playlists'];

function gymRidesController(Playlists) {
  var self = this;

  // Adds a ride to the gym
  self.addRide = function () {
    var playlist = {
      Playlist: self.playlist,
      DevicePlaylistSyncs: [{SyncSuccess: false, SecondsLeft: 3600}]
    };
    self.gym.PlaylistSyncInfos.push(playlist);
  };

  self.remove = function(playlist, gymId) {
    playlist.removed = true;
    Playlists.removePlaylistFromGym(playlist.Playlist.Id, gymId).then(function(data) {
      // It worked!
    }, function(response) {
      // There was some error
      console.log("Error with status code", response.status);
      playlist.removed = false;
    });
  };

  self.undoRemove = function (playlist, gymId) {
    playlist.removed = false;
    Playlists.addPlaylistToGym(playlist.Playlist.Id, gymId).then(function(data) {
      // It worked!
    }, function(response) {
      // There was some error
      console.log("Error with status code", response.status);
      playlist.removed = true;
    });
  };
}
