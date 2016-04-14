angular
  .module("app")
  .directive("backgroundMusicGoal", backgroundMusicGoal);

function backgroundMusicGoal() {
  var directive = {
    templateUrl: '../js/directives/background_music_goal/background_music_goal.directive.html',
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

backgroundMusicGoalController.$inject = ['$scope', '$state', '$document', 'Playlists'];

function backgroundMusicGoalController($scope, $state, $document, Playlists) {
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

  // Counts the number of tracks in one of the background sections
  self.numTracks = function () {
    if (!$scope.ngModel) {
      return 0;
    }
    var i = 0;
    $scope.ngModel.forEach(function (val) {
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
    if (self.numTracks() < 3) {
      return true;
    }
    return false;
  };

  self.goalClicked = function () {

    if (self.canAddTracks()) {
      Playlists.setCurrentGoal({
        Goal: {
          Name: 'Background music',
          BpmLow: 0,
          BpmHigh: 200
        },
        BackgroundSection: $scope.playlistPosition
      });
      angular.element($document[0].body).addClass('noscroll');
      if (Playlists.getCreatingNewPlaylist() || $state.current.name === 'playlist-new-edit') {
        $state.go('playlist-new-edit.tracks-search');
      } else {
        $state.go('playlist-edit.tracks-search');
      }
    }
  };

  self.removeTrack = function (track) {
    self.removeBackgroundTrack($scope.playlistPosition, track);
  };

  self.removeBackgroundTrack = function (position, track) {
    Playlists.removeBackgroundTrack(position, track);
  };

}
