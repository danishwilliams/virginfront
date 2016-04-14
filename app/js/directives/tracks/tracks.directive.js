angular
  .module("app")
  .directive("tracks", tracks);

function tracks() {
  var directive = {
    templateUrl: '../js/directives/tracks/tracks.directive.html',
    restrict: 'E',
    controller: tracksController,
    controllerAs: 'vm',
    scope: {
      ngModel: '=',
      playlistPosition: '@',
      playlistGoalArrayId: '@'
    },
    //require: '?ngModel',
    require: 'ngModel',
  };
  return directive;
}

tracksController.$inject = ['$scope', 'Tracks'];

function tracksController($scope, Tracks) {
  var self = this;

  // Is this a background music track listing?
  if ($scope.playlistPosition) {
    self.backgroundMusic = true;
  }

  // Generate a unique bin id, either from the background music "before"/"after" or from a playlist Goal Array id
  self.binId = function() {
    if (self.backgroundMusic) {
      return $scope.playlistPosition;
    }
    else {
      return $scope.playlistGoalArrayId;
    }
  };

  // Return the number of tracks this goal/background music thingy holds
  self.numTracks = function () {
    return $scope.$parent.vm.numTracks();
  };

  // Show this track or not?
  self.showTrack = function (track) {
    if (!track) {
      return false;
    }
    // If this is background music, we want to only show tracks which match PlaylistPosition = "Before" or "After"
    if (self.backgroundMusic) {
      if (track.PlaylistPosition.toLowerCase() === $scope.playlistPosition) {
        return true;
      }
      return false;
    }
    return true;
  };

  self.playTrack = function (track) {
    Tracks.playTrack(track);
  };

  self.removeTrack = function(track) {
    $scope.$parent.vm.removeTrack(track);
  };
}
