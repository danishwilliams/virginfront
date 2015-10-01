angular.module("app.playlist", []).controller('PlaylistController', function ($location, AuthenticationService, TracksService, PlaylistFactory) {
  var self = this;
  var playing = false; // If music is playing or not

  this.title = "Add a Ride";
  this.playlist = PlaylistFactory.getPlaylist();
  this.tracks = TracksService.getTracks();
  this.goals = PlaylistFactory.getGoals();
  this.currentgoal = PlaylistFactory.getCurrentGoal();
  this.name = '';

  PlaylistFactory.loadGoals().then(function (data) {
    self.goals = data.goals;
    self.name = data.name;
    // TODO: this shouldn't be necessary: the data binding should recognise the change
    self.currentgoal = PlaylistFactory.getCurrentGoal();
  });

  /*
  PlaylistFactory.loadPlaylist().then(function (data) {
    data.forEach(function(value) {
      self.currentgoal.Id = value.id;
      self.addTrackSuccess(value.track);
    });
    self.currentgoal.Id = 0;
  });
*/

  this.playTrack = function (trackid) {
    var playertrack = TracksService.getPlayerTrack();
    if (trackid === playertrack[0]) {
      if (playing) {
        // Pause the currently playing track
        DZ.player.pause();
        DZ.player.pause();
        playing = false;
      }
      else {
        DZ.player.play();
        playing = true;
      }
    }
    else {
      // Play a different track
      TracksService.setPlayerTrack(trackid);
      DZ.player.playTracks([trackid]);
      DZ.player.play();
      playing = true;
    }
  };

  /**
   * The user has just clicked on a goal; potentially open/close it and make it active/inactive
   * @param goal
   */
  this.goalClicked = function (goal) {
    // User has clicked on an open, unselected goal, so don't collapse it
    if (goal.show) {

      // Collapse this open and selected goal
      if (self.currentgoal.Id === goal.Id) {
        goal.show = !goal.show;
      }
    }
    else {
      goal.show = !goal.show;
    }
    PlaylistFactory.setCurrentGoal({Id: goal.Id, Name: goal.Name, BpmLow: goal.BpmLow, BpmHigh: goal.BpmHigh});
    // TODO: why isn't this automatically happening due to setting this earlier? i.e. this isn't data bound...
    self.currentgoal = PlaylistFactory.getCurrentGoal();
  };

  /**
   * Is this an active goal?
   * @param goal
   * @returns {boolean}
   */
  this.isGoalActive = function (goal) {
    if (goal.show === true && self.currentgoal.Id === goal.Id) {
      return true;
    }
    return false;
  };

  // Add a track to a goal self. If it passes our checks, call addTrackSuccess
  this.addTrack = function (track) {
    if (track.bpm < self.currentgoal.BpmLow || track.bpm > self.currentgoal.BpmHigh) {
      // TODO: show some kind of helpful error message to the user
      return;
    }

    // If there are already tracks don't add one
    var tracks = PlaylistFactory.getGoalPlaylist(self.currentgoal.Id);
    if (tracks.length > 0) {
      return;
    }

    self.addTrackSuccess(track);
  };

  /**
   * A track has successfully been added, so do some DOM operations to show that
   * @param track
   */
  this.addTrackSuccess = function (track) {
    PlaylistFactory.trackDropped(self.currentgoal.Id, track);

    // A track was "dropped"
    // TODO: take this out once we're loading actual playlists
    //if (self.currentgoal.Id > 9) {
    //  return;
    //}

    var bin = document.getElementById("bin" + self.currentgoal.Id);
    if (bin) {
      bin.classList.add('dropped');
      bin.removeAttribute('droppable');
    }

    var trackElement = document.getElementById("track" + track.id);
    if (trackElement) {
      trackElement.classList.add('ng-hide');
    }
  };

  // Remove a track from a goal playlist
  this.removeTrack = function (goalid, track) {
    PlaylistFactory.removeTrackFromGoalPlaylist(goalid, track);

    // The track isn't "dropped" any more
    var bin = document.getElementById("bin" + goalid);
    if (bin) {
      bin.classList.remove('dropped');
      bin.setAttribute('droppable', '');
    }

    // Show the track in the track list
    var trackElement = document.getElementById("track" + track.id);
    if (trackElement) {
      trackElement.classList.remove('ng-hide');
    }
  };

  var onLogoutSuccess = function (response) {
    $location.path('/login');
  };

  this.logout = function () {
    AuthenticationService.logout().success(onLogoutSuccess);
  };
});
