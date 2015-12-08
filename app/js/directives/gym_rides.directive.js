angular
  .module("app")
  .directive("gymRides", gymRides);

function gymRides() {
  var directive = {
    templateUrl: 'gym_rides.directive.html',
    restrict: 'E',
    controller: gymRidesController,
    controllerAs: 'vm'
  };
  return directive;
}

gymRidesController.$inject = ['Playlists'];

function gymRidesController(Playlists) {
  var self = this;

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
