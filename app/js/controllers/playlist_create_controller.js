angular.module("app").controller('PlaylistCreateController', function ($scope, $location, AuthenticationService, SongsService, PlaylistService, $http) {
  $scope.title = "Add a Ride";
  $scope.goalid = 0; // The active goal playlist which songs can be added to
  $scope.songs = {};
  $scope.playing = false;

  // TODO: move the 0 into some kind of persistent state
  $http.get('/api/v1.0/rides/0').success(function (data) {
    $scope.goals = data.goals;
    $scope.name = data.name;

    // Set up a placeholder playlist structure
    PlaylistService.setupEmptyPlaylist(data.goals);

    $scope.playlist = PlaylistService.getPlaylist();
  });

  //$scope.songs = SongsService.getSongs();

  $scope.$on('tracksLoaded', function () {
    $scope.$apply(function () {
      $scope.songs = SongsService.getSongs();
    });
  });

  $scope.playSong = function (songid) {
    var playerTrack = SongsService.getPlayerTrack();
    if (songid === playerTrack[0]) {
      if ($scope.playing) {
        // Pause the currently playing song
        DZ.player.pause();
        $scope.playing = false;
      }
      else {
        DZ.player.play();
        $scope.playing = true;
      }
    }
    else {
      // Play a different song
      SongsService.setPlayerTrack(songid);
      DZ.player.playTracks([songid]);
      DZ.player.play();
      $scope.playing = true;
    }
  };

  // Add a song to a goal playlist
  $scope.addSong = function(song) {
    // If there are already songs don't add one
    var songs = PlaylistService.getGoalPlaylist($scope.goalid);
    if (songs.length > 0) {
      return;
    }

    PlaylistService.songDropped($scope.goalid, song);

    // A song was "dropped"
    var bin = document.getElementById("bin" + $scope.goalid);
    bin.classList.add('dropped');
    bin.removeAttribute('droppable');

    var songElement = document.getElementById("song" + song.id);
    songElement.classList.add('ng-hide');
  };

  // Remove a song from a goal playlist
  $scope.removeSong = function(goalid, song) {
    PlaylistService.removeSongFromGoalPlaylist(goalid, song);

    // The song isn't "dropped" any more
    var bin = document.getElementById("bin" + goalid);
    bin.classList.remove('dropped');
    bin.setAttribute('droppable', '');

    // Show the song in the song list
    var songElement = document.getElementById("song" + song.id);
    songElement.classList.remove('ng-hide');
  };

  var onLogoutSuccess = function (response) {
    $location.path('/login');
  };

  $scope.logout = function () {
    AuthenticationService.logout().success(onLogoutSuccess);
  };
});
