angular.module("app.playlist", []).controller('PlaylistController', function ($location, AuthenticationService, TracksService, PlaylistService, $http) {
  var self = this;
  var currentgoal = {id: 0, bpm_low: 0, bpm_high: 0}; // The currently selected goal which tracks can be added to

  this.title = "Add a Ride";
  this.goals = [];
  this.name = '';
  this.playlist = [];

  this.tracks = TracksService.getTracks();

  // TODO: move the 0 into some kind of persistent state
  $http.get('/api/v1.0/rides/0').success(function (data) {
    // Set the first goal as selected
    _.mapObject(data.goals, function(val, key) {
      if (key === '0') {
        val.show = true;
        currentgoal = {id: val.id, bpm_low: val.bpm_low, bpm_high: val.bpm_high};
        return val;
      }
    });

    self.goals = data.goals;
    self.name = data.name;

    // Set up a placeholder playlist structure
    PlaylistService.setupEmptyPlaylist(data.goals);

    self.playlist = PlaylistService.getPlaylist();
  });

  /*
  // Load a saved playlist
  $http.get('/api/v1.0/playlists/0').success(function (data) {
    // Extract the track data
    data.goals.forEach(function(value) {
      currentgoal.id = value.id;
      self.addTrackSuccess(value.track);
      PlaylistService.addTrackToGoalPlaylist(value.id, value.track);
    });
    self.playlist = PlaylistService.getPlaylist();
  });
  */

  /**
   * The user has just clicked on a goal; potentially open/close it and make it active/inactive
   * @param goal
   */
  this.goalClicked = function (goal) {
    // User has clicked on an open, unselected goal, so don't collapse it
    if (goal.show) {

      // Collapse this open and selected goal
      if (currentgoal.id === goal.id) {
        goal.show = !goal.show;
      }
    }
    else {
      goal.show = !goal.show;
    }
    currentgoal.id = goal.id;
    currentgoal.bpm_low = goal.bpm_low;
    currentgoal.bpm_high = goal.bpm_high;
  };

  /**
   * Is this an active goal?
   * @param goal
   * @returns {boolean}
   */
  this.isGoalActive = function(goal) {
    if (goal.show === true && currentgoal.id === goal.id) {
      return true;
    }
  };

  // Add a track to a goal self. If it passes our checks, call addTrackSuccess
  this.addTrack = function(track) {
    if (track.bpm < currentgoal.bpm_low || track.bpm > currentgoal.bpm_high) {
      // TODO: show some kind of helpful error message to the user
      return;
    }

    // If there are already tracks don't add one
    var tracks = PlaylistService.getGoalPlaylist(currentgoal.id);
    if (tracks.length > 0) { return; }

    self.addTrackSuccess(track);
  };

  /**
   * A track has successfully been added, so do some DOM operations to show that
   * @param track
   */
  this.addTrackSuccess = function (track) {
    PlaylistService.trackDropped(currentgoal.id, track);

    // A track was "dropped"
    console.log(currentgoal.id);
    if (currentgoal.id > 9) {return;}
    var bin = document.getElementById("bin" + currentgoal.id);
    console.log(bin);
    if (bin) {
      bin.classList.add('dropped');
      bin.removeAttribute('droppable');
    }

    var trackElement = document.getElementById("track" + track.id);
    trackElement.classList.add('ng-hide');
  };

  // Remove a track from a goal playlist
  this.removeTrack = function(goalid, track) {
    PlaylistService.removeTrackFromGoalPlaylist(goalid, track);

    // The track isn't "dropped" any more
    var bin = document.getElementById("bin" + goalid);
    bin.classList.remove('dropped');
    bin.setAttribute('droppable', '');

    // Show the track in the track list
    var trackElement = document.getElementById("track" + track.id);
    trackElement.classList.remove('ng-hide');
  };

  var onLogoutSuccess = function (response) {
    $location.path('/login');
  };

  this.logout = function () {
    AuthenticationService.logout().success(onLogoutSuccess);
  };
});
