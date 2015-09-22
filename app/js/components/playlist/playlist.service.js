/**
 * Created by rogersaner on 15/09/07.
 */
angular
  .module("app")
  .service('PlaylistService', PlaylistService);

PlaylistService.$inject = ['$http', 'PlaylistFactory'];

function PlaylistService($http, PlaylistFactory) {
  var self = this;

  // This sets up a new structure to track goals; no tracks added yet
  // TODO: this needs to be refactored to accept another argument, a goal id,
  // so that we can have multiple goal playlists, not just one
  this.setupEmptyPlaylist = function (goals_data) {
    goals_data.forEach(function () {
      PlaylistFactory.playlist.push([]);
    });
  };

  // Returns the playlist for a specific goal
  this.getGoalPlaylist = function (id) {
    return PlaylistFactory.playlist[id];
  };

  // Returns the entire playlist
  this.getPlaylist = function () {
    return PlaylistFactory.playlist;
  };

  this.getGoals = function () {
    return PlaylistFactory.goals;
  };

  this.getName = function () {
    return PlaylistFactory.name;
  };

  this.getCurrentGoal = function () {
    return PlaylistFactory.currentgoal;
  };

  // Add a track to a playlist for a goal id
  this.addTrackToGoalPlaylist = function (id, track) {
    // Replaces any existing track in the playlist
    PlaylistFactory.playlist[id] = [];
    PlaylistFactory.playlist[id].push(track);
  };

  // Removes a track from a playlist for a goal id
  this.removeTrackFromGoalPlaylist = function (id, track) {
    PlaylistFactory.playlist[id] = _.filter(PlaylistFactory.playlist[id], function (val) {
      if (val.id === track.id) {
        return false;
      }
      return true;
    });
  };

  // A track has been added to a goal
  this.trackDropped = function (goalid, track) {
    // Update the playlist
    this.addTrackToGoalPlaylist(goalid, track);
  };
}
