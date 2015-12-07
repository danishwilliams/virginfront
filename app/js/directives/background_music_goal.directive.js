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

backgroundMusicGoalController.$inject = ['$scope', '$state', 'Playlists'];

function backgroundMusicGoalController($scope, $state, Playlists) {
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

  self.numTracks = function() {
    if (!$scope.ngModel) {
      return 0;
    }
    var i = 0;
    $scope.ngModel.forEach(function(val) {
      if (val.PlaylistPosition.toLowerCase() === $scope.playlistPosition) {
        i++;
      }
    });
    return i;
  };

  self.canAddTracks = function () {
    if (!$scope.ngModel) {
      return false;
    }
    // count number of tracks for a specific position
    if (self.numTracks() < 3) {
      return true;
    }
    return false;
  };

  self.goalClicked = function () {
    if (self.canAddTracks()) {
      Playlists.setCurrentBackgroundSection($scope.playlistPosition);
      if (Playlists.getCreatingNewPlaylist() || $state.current.name === 'playlist-new-edit') {
        $state.go('playlist-new-edit.tracks-search');
      } else {
        $state.go('playlist-edit.tracks-search');
      }
    }
  };

  self.removeTrack = function(track) {
    self.removeBackgroundTrack($scope.playlistPosition, track);
  };

  self.removeBackgroundTrack = function (position, track) {
    Playlists.removeBackgroundTrack(position, track);
  };

}
