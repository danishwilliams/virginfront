angular
  .module("app")
  .directive("playlistGoal", playlistGoal);

function playlistGoal() {
  // TODO: use this directive in the playlist edit template
  var directive = {
    templateUrl: 'playlist_goal.directive.html',
    restrict: 'E',
    controller: playlistGoalController,
    controllerAs: 'vm',
    scope: {
      ngModel: '=',
      playlistPosition: '@',
      playlistGoalArrayId: '@'
    },
    require: 'ngModel',
  };
  return directive;
}

playlistGoalController.$inject = ['$scope', 'Playlists'];

function playlistGoalController($scope, Playlists) {
  var self = this;

  self.removeTrack = function(track) {
    self.removeTrackFromPlaylist($scope.playlistGoalArrayId, track);
  };

  // Remove a track from a goal playlist
  self.removeTrackFromPlaylist = function (playlistGoalArrayId, track) {
    Playlists.removeTrackFromGoalPlaylist(playlistGoalArrayId, track);
    this.playlistTracksLength = Playlists.getPlaylistLength();
    self.checkAllGoalsHaveTracks();
    Tracks.stopTrack(track.Track);

    // The track isn't "dropped" any more
    // TODO: refactor this so we're not manipulating the DOM from a controller
    var bin = document.getElementById("bin" + playlistGoalArrayId);
    if (bin) {
      bin.classList.remove('dropped');
      bin.setAttribute('droppable', '');
    }
  };
}
