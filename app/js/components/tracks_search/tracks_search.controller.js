angular.module("app.tracks_search", []).controller('Tracks_searchController', function ($scope, $modalInstance, goal, Tracks, Playlists) {
  var self = this;
  //$scope.track = track;
  self.items = ['item1', 'item2', 'item3'];

  self.currentgoal = goal;
  this.tracks = Tracks.getTracks();

  /*
  this.selected = {
    item: self.items[0]
  };
  */

  //this.currentgoal = Playlists.getCurrentGoal();

  // Load tracks from the user's default genre selection
  Tracks.loadUserGenresTracks().then(function (data) {
    self.tracks = data;
  });

  this.ok = function () {
    var track = {id: 'soemthing', value: 'some value'};
    //$modalInstance.close(self.selected.item);
    $modalInstance.close(track);
  };

  this.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  this.trackSearch = function () {
    Tracks.searchTracks(self.search).then(function (data) {
      self.tracks = data;
    });
  };

  this.playTrack = function (track) {
    Tracks.playTrack(track);
  };

  // Add a track to a goal self. If it passes our checks, call addTrackSuccess
  this.addTrack = function (track) {
    if (track.Bpm < self.currentgoal.BpmLow || track.Bpm > self.currentgoal.BpmHigh) {
      // TODO: show some kind of helpful error message to the user
      return;
    }

    // If there are already tracks don't add one
    var tracks = Playlists.getPlaylistGoalTracks(self.currentgoal.ArrayId);
    if (tracks.length > 0) {
      return;
    }

    // Close the modal, and send the chosen track back to the playlist_edit controller
    $modalInstance.close(track);
  };

});