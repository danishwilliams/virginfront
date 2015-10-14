/**
 * Created by rogersaner on 15/09/21.
 */
angular
  .module("app")
  .factory('PlaylistEdit', PlaylistEditFactory);

PlaylistEditFactory.$inject = ['Restangular', 'Playlists', 'uuid2', 'Users'];

function PlaylistEditFactory(Restangular, Playlists, uuid2, Users) {
  var self = this;
  var steps = initSteps(); // The full steps array
  var currentStep = 0; // Which step we're currently on
  var playlist = [];
  var goals = [];
  // The currently selected goal which tracks can be added to
  var currentgoal = {
    ArrayId: 0, // Maintains a mapping between the array id of the playlist goal, and the playlist goal UUID
    PlaylistGoalId: 'uuid',
    Name: '',
    BpmLow: 0,
    BpmHigh: 0
  };

  var playlistFactory = {
    createNewPlaylistFromTemplate: createNewPlaylistFromTemplate,
    addTrackToGoalPlaylist: addTrackToGoalPlaylist,
    removeTrackFromGoalPlaylist: removeTrackFromGoalPlaylist,
    trackDropped: trackDropped,
    loadPlaylist: loadPlaylist,
    getPlaylist: getPlaylist,
    getGoalPlaylist: getGoalPlaylist,
    getPlaylistGoalTracks: getPlaylistGoalTracks,
    loadGoals: loadGoals,
    getGoals: getGoals,
    setGoals: setGoals,
    getName: getName,
    setName: setName,
    getSteps: getSteps,
    getCurrentStep: getCurrentStep,
    setStep: setStep,
    getCurrentGoal: getCurrentGoal,
    setCurrentGoal: setCurrentGoal
  };

  return playlistFactory;

  /**
   * Load up a template structure, create a blank playlist structure from it
   */
  function createNewPlaylistFromTemplate(template) {
    var playlistId = uuid2.newuuid().toString();
    playlist = Restangular.one('playlists', playlistId);
    playlist.PlaylistGoalId = playlistId;
    playlist.Name = '';
    playlist.TemplateId = template.Id;
    playlist.TemplateName = template.TemplateGroup.Name;
    playlist.Shared = false;
    playlist.ClassLengthMinutes = template.ClassLengthMinutes;
    playlist.UserId = Users.getCurrentUser().Id;
    playlist.PlaylistGoals = [];
    playlist.BackgroundTracks = [];

    // for each template goal: set up a new playlist goal
    var playlistGoal = {};
    var i = 0;
    template.Goals.forEach(function (goal) {
      playlistGoal = {
        Id: uuid2.newuuid().toString(),
        GoalId: goal.Id,
        SortOrder: goal.SortOrder
      };
      if (goal.SortOrder === 1) {
        playlistGoal.show = true;
        goal.ArrayId = i;
        setCurrentGoal({
          ArrayId: i,
          Id: playlistGoal.Id,
          Goal: goal
        });
      }
      playlistGoal.Goal = goal;
      playlistGoal.ArrayId = i;
      playlistGoal.PlaylistGoalTracks = [];
      playlistGoal.PlaylistGoalNotes = [];
      playlist.PlaylistGoals.push(playlistGoal);
      i++;
    });

    return playlist;
  }

  // Add a track to a playlist for a goal id
  function addTrackToGoalPlaylist(playlistGoalArrayId, track) {
    // Replaces any existing track in the playlist
    // TODO: temporarily hard-coding a Genre ID because we don't have Genre mapping working yet
    track.GenreId = '6c8d4779-33c4-4614-858d-a880d6450f59';
    playlist.PlaylistGoals[playlistGoalArrayId].PlaylistGoalTracks = [{
      Track: track,
      SortOrder: 0
    }];
  }

  // Removes a track from a playlist for a goal id
  function removeTrackFromGoalPlaylist(playlistGoalArrayId, track) {
    playlist.PlaylistGoals[playlistGoalArrayId].PlaylistGoalTracks = [];
    // TODO: use _.mapObject to remove the track from the list and rework the sort order, when we have multiple tracks
  }

  // A track has been added to a goal
  function trackDropped(playlistGoalArrayId, track) {
    console.log('Track dropped! (' + track.Name + ') on goal ' + playlistGoalArrayId);
    // Update the playlist
    addTrackToGoalPlaylist(playlistGoalArrayId, track);
  }

  // Returns the playlist for a specific goal
  function getGoalPlaylist(id) {
    return playlist[id];
  }

  function loadPlaylist(id) {
    return Playlists.loadPlaylist(id).then(loadPlaylistComplete);

    function loadPlaylistComplete(data) {
      playlist = data;

      var found = false;
      _.mapObject(playlist.PlaylistGoals, function (val, key) {
        val.ArrayId = key;
        if (!found && val.SortOrder === 1) {
          found = true; // Only find a goal once
          val.show = true;
          setCurrentGoal(val);
        }
        return val;
      });
    }
  }

  // Returns the entire playlist
  function getPlaylist() {
    return playlist;
  }

  /**
   * Returns the tracks within a playlistGoal
   */
  function getPlaylistGoalTracks(ArrayId) {
    return playlist.PlaylistGoals[ArrayId];
  }

  function loadGoals() {
    // TODO: this entire function is irrelevant. Should be something like loadTemplate(id) - and if we're not using that call here,
    // then remove the Restangular injection. Something like Templates.getTemplate(id).then(loadTemplateComplete);
    // TODO: move this call into some kind of persistent state
    //var id = "170c717b-0fee-425f-8861-f1a5ca419900";
    var id = "e3929bda-3587-4889-bfa8-60a28e9b03dc";
    return Restangular.one('templates', id).get({
      includeGoals: true
    }).then(loadGoalsComplete);

    //return $http.get('/api/1.0/templates/' + id).then(loadGoalsComplete); // When using local API

    function loadGoalsComplete(data, status, headers, config) {
      //data = data.data; // When using local API
      var goals = data.Goals;
      // Set the first goal as selected
      var found = false;
      _.mapObject(goals, function (val, key) {
        if (!found && val.SortOrder === 1) {
          found = true; // Only find a goal once
          val.show = true;
          var goal = val;
          goal.ArrayId = key;
          setCurrentGoal(goal);
          return val;
        }
      });

      self.goals = goals;
      self.name = data.Name;

      data.Goals = self.goals;

      // Set up a placeholder playlist structure
      setupEmptyPlaylist(self.goals);

      return data;
    }
  }

  function getGoals() {
    return self.goals;
  }

  function setGoals(value) {
    goals = value;
  }

  function getName() {
    return playlist.Name;
  }

  function setName(value) {
    playlist.Name = value;
  }

  function initSteps() {
    return [{
      id: 0,
      name: 'Choose Ride Template',
      completed: false,
    }, {
      id: 1,
      name: 'Choose Time',
      completed: false,
    }, {
      id: 2,
      name: 'Create/edit playlist',
      completed: false,
    }, {
      id: 3,
      name: 'Review',
      completed: false,
    }];
  }

  function getSteps() {
    return steps;
  }

  function getCurrentStep() {
    return currentStep;
  }

  /**
   * Complete/uncomplete a step
   *
   * @param id integer
   * @param status boolean
   */
  function setStep(id) {
    step = id;
    for (var i = 0; i < steps.length; i++) {
      if (i <= id) {
        steps[i].completed = true;
      } else {
        steps[i].completed = false;
      }
    }
  }

  function getCurrentGoal() {
    return currentgoal;
  }

  function setCurrentGoal(playlistGoal) {
    currentgoal = {
      ArrayId: playlistGoal.ArrayId,
      PlaylistGoalId: playlistGoal.Id,
      Name: playlistGoal.Goal.Name,
      BpmLow: playlistGoal.Goal.BpmLow,
      BpmHigh: playlistGoal.Goal.BpmHigh
    };
  }
}
