angular
  .module("app")
  .directive("backgroundMusicGoal", backgroundMusicGoal);

function backgroundMusicGoal() {
  var directive = {
    templateUrl: 'background_music_goal.directive.html',
    restrict: 'E',
    controller: backgroundMusicGoalController,
    controllerAs: 'vm',
    scope: {
      ngModel: '=',
      playlistPosition: '@'
    },
    require: 'ngModel',
  };
  return directive;
}

backgroundMusicGoalController.$inject = ['$scope', 'Playlists'];

function backgroundMusicGoalController($scope, Playlists) {
  var self = this;

  self.goal = {};
  switch ($scope.playlistPosition) {
    case 'before':
      self.goal.Name = 'Pre-ride';
      break;
    case 'after':
      self.goal.Name = 'Post-ride';
      break;
  }

  self.canAddTracks = function () {
    if (!$scope.ngModel) {
      return false;
    }
    // count number of tracks for a specific position
    var i = 0;
    $scope.ngModel.forEach(function(val) {
      if (val.PlaylistPosition.toLowerCase() === $scope.playlistPosition) {
        i++;
      }
    });
    if (i < 3) {
      return true;
    }
    return false;
  };

  self.removeTrack = function(track) {
    self.removeBackgroundTrack($scope.playlistPosition, track);
  };

  self.removeBackgroundTrack = function (position, track) {
    Playlists.removeBackgroundTrack(position, track);
  };

}
