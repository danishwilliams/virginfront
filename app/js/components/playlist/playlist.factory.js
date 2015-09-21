/**
 * Created by rogersaner on 15/09/21.
 */
angular
  .module("app")
  .factory('PlaylistFactory', PlaylistFactory);

PlaylistFactory.$inject = ['$http'];

function PlaylistFactory($http) {
  var playlist = [];
  var goals = [];
  var name = '';
  var currentgoal = {id: 0, bpm_low: 0, bpm_high: 0}; // The currently selected goal which tracks can be added to

  var goalsPlaylist = {
    setupEmptyPlaylist: setupEmptyPlaylist,
    addTrackToGoalPlaylist: addTrackToGoalPlaylist,
    removeTrackFromGoalPlaylist: removeTrackFromGoalPlaylist,
    trackDropped: trackDropped,
    loadPlaylist: loadPlaylist,
    getPlaylist: getPlaylist,
    getGoalPlaylist: getGoalPlaylist,
    loadGoals: loadGoals,
    getGoals: getGoals,
    setGoals: setGoals,
    getName: getName,
    setName: setName,
    getCurrentGoal: getCurrentGoal, // The currently selected goal which tracks can be added to
    setCurrentGoal: setCurrentGoal
  };

  return goalsPlaylist;

  function setupEmptyPlaylist (goals_data) {
    goals_data.forEach(function () {
      playlist.push([]);
    });
  }

  // Add a track to a playlist for a goal id
  function addTrackToGoalPlaylist(id, track) {
    // Replaces any existing track in the playlist
    playlist[id] = [];
    playlist[id].push(track);
  }

  // Removes a track from a playlist for a goal id
  function removeTrackFromGoalPlaylist(id, track) {
    playlist[id] = _.filter(playlist[id], function (val) {
      if (val.id === track.id) {
        return false;
      }
      return true;
    });
  }

  // Returns the playlist for a specific goal
  function getGoalPlaylist(id) {
    return playlist[id];
  }

  function loadPlaylist() {
      // Load a saved playlist
      return $http.get('/api/v1.0/playlists/0').then(getPlaylistComplete);

      function getPlaylistComplete(data, status, headers, config) {
        // Extract the track data
        data.data.goals.forEach(function (value) {
          addTrackToGoalPlaylist(value.id, value.track);
        });
        return data.data.goals;
      }
  }

  // Returns the entire playlist
  function getPlaylist() {
    return playlist;
  }

  function setPlaylist(value) {
    playlist = value;
  }

  function loadGoals() {
    // TODO: move the 0 into some kind of persistent state
    return $http.get('/api/v1.0/rides/0').then(loadGoalsComplete);

    function loadGoalsComplete(data, status, headers, config) {
      var goals = data.data.goals;
      // Set the first goal as selected
      _.mapObject(goals, function (val, key) {
        if (key === '0') {
          val.show = true;
          currentgoal = {id: val.id, bpm_low: val.bpm_low, bpm_high: val.bpm_high};
          return val;
        }
      });

      self.goals = goals;
      self.name = data.data.name;

      // Set up a placeholder playlist structure
      setupEmptyPlaylist(self.goals);

      return {
        goals: self.goals,
        name: self.name
      };
    }
  }

  function getGoals() {
    return self.goals;
  }

  function setGoals(value) {
    goals = value;
  }

  function getName() {
    return name;
  }

  function setName(value) {
    name = value;
  }

  function getCurrentGoal() {
    return currentgoal;
  }

  function setCurrentGoal(value) {
    currentgoal = value;
  }

  // A track has been added to a goal
  function trackDropped (goalid, track) {
    console.log('Track dropped!');
    // Update the playlist
    addTrackToGoalPlaylist(goalid, track);
  }
}
