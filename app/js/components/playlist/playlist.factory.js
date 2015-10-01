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
  // The currently selected goal which tracks can be added to
  var currentgoal = {
    Id: 0,
    Name: '',
    BpmLow: 0,
    BpmHigh: 0
  };

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

  function setupEmptyPlaylist(goals_data) {
    goals_data.forEach(function (goal) {
      playlist[goal.Id] = [];
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

  // A track has been added to a goal
  function trackDropped(goalid, track) {
    console.log('Track dropped! (' + track.name + ') on goal ' + goalid);
    // Update the playlist
    addTrackToGoalPlaylist(goalid, track);
  }

  // Returns the playlist for a specific goal
  function getGoalPlaylist(id) {
    return playlist[id];
  }

  function loadPlaylist() {
    // Load a saved playlist
    return $http.get('/api/1.0/playlists/0').then(getPlaylistComplete);

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
    // TODO: move this call into some kind of persistent state
    return $http.get('/api/1.0/rides/e3929bda-3587-4889-bfa8-60a28e9b03dc').then(loadGoalsComplete);

    function loadGoalsComplete(data, status, headers, config) {
      var goals = data.data.ResponseObject.Goals;
      // Set the first goal as selected
      var found = false;
      _.mapObject(goals, function (val, key) {
        if (!found && val.SortOrder === 1) {
          found = true; // Only find a goal once
          val.show = true;
          currentgoal = {
            Id: val.Id,
            Name: val.Name,
            BpmLow: val.BpmLow,
            BpmHigh: val.BpmHigh
          };
          return val;
        }
      });

      self.goals = goals;
      self.name = data.data.ResponseObject.Name;

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
}
