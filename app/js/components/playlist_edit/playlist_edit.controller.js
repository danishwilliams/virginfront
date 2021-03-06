angular.module("app.playlist_edit", []).controller('Playlist_editController', function ($stateParams, $scope, $state, $rootScope, $document, Tracks, Playlists, Templates, spinnerService, uuid2, $location) {
  var self = this;
  var playing = false; // If music is playing or not

  // TODO: do we want to sanitize this?
  self.id = $stateParams.id;
  self.title = 'RIDE_EDIT';

  if (Playlists.getCreatingNewPlaylist() || $state.current.name === 'playlist-new-edit') {
    // We're creating a new playlist!
    Playlists.setCreatingNewPlaylist(true);
    self.newPlaylist = true;
    self.title = 'RIDE_CREATE';
    self.playlistTracksLength = 0;
  }

  self.playlist = {};
  self.currentgoal = Playlists.getCurrentGoal();

  Playlists.setStep(2);

  $rootScope.$on('$stateChangeSuccess', function () {
    if ($state.current.name === 'playlist-edit' || $state.current.name === 'playlist-new-edit') {
      // User has just selected a track from track search to add to a goal
      var track = Tracks.getSearchedTrack();
      if (!_.isEmpty(track)) {
        var currentgoal = Playlists.getCurrentGoal();
        if (currentgoal.BackgroundSection) {
          // Add a background track
          Playlists.addBackgroundTrack(currentgoal.BackgroundSection, track);
          Tracks.setSearchedTrack({});
          $rootScope.$broadcast('add.track');
        } else {
          // Add a track to a goal
          Playlists.trackDropped(currentgoal.ArrayId, track);
          $rootScope.$broadcast('add.track');
          Tracks.setSearchedTrack({});
        }
      }
      angular.element($document[0].body).removeClass('noscroll');
    }
  });

  // Urgh. Had to use $scope here because the controller isn't available in the $stateChangeSuccess event, so can't
  // update variables.
  $scope.$on('add.track', function () {
    console.log('attempt to set form to not be pristine');
    if (self.form) {
      self.form.$setDirty(); // Manually set the form to be not pristine any more
    }
    else {
      console.log('[Warning] No playlist edit form found, but one was expected');
    }
    self.updatePlaylistLength();
    self.updateCurrentGoal();
    self.checkAllGoalsHaveTracks();
  });

  // Create new playlist
  if (self.newPlaylist) {
    Templates.loadTemplate(self.id).then(function (data) {
      self.playlist = Playlists.createNewPlaylistFromTemplate(data);
      self.currentgoal = Playlists.getCurrentGoal();
      self.initFreestyleGoals();
      spinnerService.hide('playlistEditSpinner');
    });
  } else if (self.id) {
    // Load an existing playlist so we can edit it
    Playlists.loadPlaylist(self.id).then(function () {
      self.playlist = Playlists.getPlaylist();
      if (!self.playlist.IsSyncedToGyms) {
        self.newPlaylist = true;
      }
      self.playlistTracksLength = Playlists.getPlaylistLength();
      self.currentgoal = Playlists.getCurrentGoal();
      if (self.checkPlaylistLength() === false) {
        self.newPlaylist = true;
      }
      self.initFreestyleGoals();
      spinnerService.hide('playlistEditSpinner');
    });
  }

  // This is a Freestyle playlist, so create a list of freestyle goals which can then be added
  self.initFreestyleGoals = function () {
    if (self.playlist.TemplateType !== 'freestyle') {
      return;
    }
    self.freestyleTemplate = true;
    self.freestyleGoals = [];

    if (!self.playlist.MaxFreestyleGoals) {
      // MaxFreestyleGoals hasn't been set because we're editing a freestyle playlist

      // Figure out what MaxFreestyleGoals should be for this playlist
      self.playlist.MaxFreestyleGoals = Templates.numGoalsInClass(self.playlist.ClassLengthMinutes);

      // Subtract the number of existing goals from MaxFreestyleGoals
      self.playlist.MaxFreestyleGoals = self.playlist.MaxFreestyleGoals - self.playlist.PlaylistGoals.length;
    }

    for (var i = 0; i < self.playlist.MaxFreestyleGoals - 1; i++) {
      self.freestyleGoals[i] = {
        show: true
      };
    }
  };

  // Rules for adding a new freestyle goal
  self.canAddNewFreestyleGoal = function () {
    if (!self.playlist.PlaylistGoals) {
      return;
    }
    var numGoals = self.playlist.PlaylistGoals.length;
    if (numGoals < self.playlist.MaxFreestyleGoals) {
      return true;
    }
    return false;
  };

  self.addFreestyleGoal = function (goal) {
    goal.show = false;
    // Find the current ArrayId and SortOrder from the last item in the PlaylistGoals array
    var i = self.playlist.PlaylistGoals.length;
    // .copy because otherwise we change the model within the <freestyle-goals> directive
    var freestyleGoal = angular.copy(self.freestyleGoal);
    // Remove a goal from freestyle goals, so that we can tell the <freestyle-goals> directive
    self.freestyleGoals.splice(0, 1);
    // Setting Id allows the API to save a new playlist goal
    freestyleGoal.Id = uuid2.newuuid().toString();
    freestyleGoal.ArrayId = i;
    freestyleGoal.SortOrder = i + 1;
    self.playlist.PlaylistGoals.push(freestyleGoal);
  };

  /* Changes a Freestyle goal to another one */
  self.changeFreestyleGoal = function (playlistGoal) {
    var sortOrder = playlistGoal.SortOrder;
    var tracks = playlistGoal.PlaylistGoalTracks;
    var goalOptions = playlistGoal.Goal.GoalOptions;

    // Following 7 lines trigger a $digest which refreshes the data in the view
    playlistGoal.Goal.Name = self.freestyleGoal.Goal.Name;
    playlistGoal.Goal.Id = self.freestyleGoal.Goal.Id;
    playlistGoal.Goal.GoalOptions = self.freestyleGoal.Goal.GoalOptions;
    playlistGoal.Goal.GoalChallengeId = self.freestyleGoal.Goal.GoalChallengeId;
    playlistGoal.Goal.BpmLow = self.freestyleGoal.Goal.BpmLow;
    playlistGoal.Goal.BpmHigh = self.freestyleGoal.Goal.BpmHigh;
    playlistGoal.editFreeStyleGoal = false;
    // Remove any existing tracks
    playlistGoal.PlaylistGoalTracks = [];

    // Maintain effort percentage, at least for the first goal option
    var i = 0;
    self.freestyleGoal.Goal.GoalOptions.forEach(function (val) {
      if (goalOptions[i]) {
        playlistGoal.Goal.GoalOptions[i].Effort = goalOptions[i].Effort;
        playlistGoal.Goal.GoalOptions[i].EffortHigh = goalOptions[i].EffortHigh;
      }
      i++;
    });

    playlistGoal = self.freestyleGoal;
    playlistGoal.editFreeStyleGoal = false;
    playlistGoal.SortOrder = sortOrder;
    self.freestyleGoal = {};
  };

  self.playTrack = function (track) {
    Tracks.playTrack(track);
  };

  /**
   * The user has just clicked on a goal; potentially open/close it and make it active/inactive
   * @param goal
   */
  self.goalClicked = function (playlistGoal) {
    if (playlistGoal.cancelEditFreeStyleGoal || playlistGoal.editFreeStyleGoal) {
      // We're currently selecting a different freestyle goal, so don't do anything else
      if (playlistGoal.cancelEditFreeStyleGoal) {
        // Needed this piece so that we can click the Cancel button
        playlistGoal.cancelEditFreeStyleGoal = false;
        playlistGoal.editFreeStyleGoal = false;
      }
      return;
    }
    if (playlistGoal.show) {
      // User has clicked on an open goal

      if (playlistGoal.PlaylistGoalTracks.length > 0) {
        // Collapse this open goal
        playlistGoal.show = !playlistGoal.show;
      }
    } else {
      playlistGoal.show = !playlistGoal.show;
    }

    Playlists.setCurrentGoal(playlistGoal);
    // Why isn't this automatically happening due to setting this earlier? i.e. this isn't data bound...
    self.currentgoal = Playlists.getCurrentGoal();

    // If there aren't any tracks, find some!
    if (playlistGoal.PlaylistGoalTracks.length === 0) {
      angular.element($document[0].body).addClass('noscroll');
      if ($state.current.name === 'playlist-new-edit') {
        $state.go('playlist-new-edit.tracks-search', {
          id: self.id
        });
      } else {
        $state.go('playlist-edit.tracks-search', {
          id: self.id
        });
      }
    }
  };

  /**
   * Is this an active goal?
   * @param goal
   * @returns {boolean}
   */
  self.isGoalActive = function (playlistGoal) {
    if (self.currentgoal.PlaylistGoalId === playlistGoal.Id) {
      return true;
    }
    return false;
  };

  // Remove a track from a goal playlist
  self.removeTrack = function (playlistGoalArrayId, track) {
    Playlists.removeTrackFromGoalPlaylist(playlistGoalArrayId, track);
    self.playlistTracksLength = Playlists.getPlaylistLength();
    self.checkAllGoalsHaveTracks();
    Tracks.stopTrack(track.Track);
    if (self.form) {
      self.form.$setDirty(); // Manually set the form to be not pristine any more
    }

    // The track isn't "dropped" any more
    var bin = document.getElementById("bin" + playlistGoalArrayId);
    if (bin) {
      bin.classList.remove('dropped');
      bin.setAttribute('droppable', '');
    }
  };

  // If the playlist goal note doesn't exist, create it
  self.playlistGoalNoteCreate = function (playlistGoalArrayId, trackIndex) {
    if (!self.playlist.PlaylistGoals[playlistGoalArrayId].PlaylistGoalNotes[trackIndex].Id) {
      var noteText = self.playlist.PlaylistGoals[playlistGoalArrayId].PlaylistGoalNotes[trackIndex].NoteText;
      var trackId = self.playlist.PlaylistGoals[playlistGoalArrayId].PlaylistGoalTracks[trackIndex].TrackId;
      self.playlist.PlaylistGoals[playlistGoalArrayId].PlaylistGoalNotes[trackIndex] = Playlists.createPlaylistGoalNote(noteText, trackId);
    }
  };

  // Save the playlist to the API
  self.savePlaylist = function () {
    var error = false;
    if (!self.playlist.Name || self.playlist.Name.length < 1) {
      error = true;
      self.required = {
        error: true
      };
      // Shift focus to the form and input box
      document.getElementById('class_name').focus();
    }
    else if (self.playlist.Name.length > 40) {
      error = true;
      // Shift focus to the form and input box
      document.getElementById('class_name').focus();
    }
    else if (self.required) {
      self.required.error = undefined;
    }

    // If this is a freestyle playlist, all effort ranges must have a value
    if (self.playlist.TemplateType === 'freestyle' && !checkEffortRanges()) {
      error = true;
      self.error = {
        effortRanges: true
      };
      document.getElementById('class_name').focus();
      return;
    }
    else if (self.error) {
      self.error.effortRanges = undefined;
    }

    if (error) {
      return;
    }

    if (!self.newPlaylist && !self.checkAllGoalsHaveTracks()) {
      // Probably hit 'enter' in the ride name inputbox
      return;
    }

    // Check if the playlist can be marked as 'complete'
    if (self.checkHasPreRideBackgroundTracks() && self.checkHasPostRideBackgroundTracks() && self.checkPlaylistLength() && self.checkAllGoalsHaveTracks()) {
      self.playlist.Complete = true;
    } else {
      self.playlist.Complete = false;
    }

    Playlists.setCreatingNewPlaylist(false);
    self.saving = true;
    spinnerService.show('playlistEditSaveSpinner');

    self.playlist.put({
      syncPlaylist: false
    }).then(function () {
      if (!self.playlist.Complete) {
        $state.go('dashboard');
      } else if (self.newPlaylist) {
        // Publish the playlist to the Music Provider
        Playlists.publishPlaylistToMusicProvider(self.playlist.Id).then(function (data) {
          console.log('successfully published playlist to music provider!');
        }, function(e) {
          console.log('music provider playlist publishing failed', e);
        });

        // New playlist view
        $state.go('playlist-new-view', {
          id: self.playlist.Id
        });
      } else {
        // Publish the completed, edited playlist then view it
        Playlists.publishPlaylist(self.playlist.Id).then(function (data) {
          // Publish the playlist to the Music Provider
          Playlists.publishPlaylistToMusicProvider(self.playlist.Id).then(function (data) {
            console.log('successfully published playlist to music provider!');
          }, function(e) {
            console.log('music provider playlist publishing failed', e);
          });

          $state.go('playlist-view', {
            id: self.playlist.Id
          });
        });
      }
    }, function (response) {
      console.log("Error with status code", response.status);
      spinnerService.hide('playlistEditSaveSpinner');
      self.saving = false;
      if (response.data.Message === 'Playlist name already exists.') {
        self.error = {
          nameError: true
        };
      }
      else {
        self.error = {
          error: true
        };
      }
    });
  };

  // In it's own function because 'self' isn't accessible from the rootScope $stateChangeSuccess
  self.updatePlaylistLength = function () {
    self.playlistTracksLength = Playlists.getPlaylistLength();
  };

  // In it's own function because 'self' isn't accessible from the rootScope $stateChangeSuccess
  self.updateCurrentGoal = function () {
    self.currentgoal = Playlists.getCurrentGoal();
  };

  /**
   * Does every effort range have at least one entry? (In the case of IsCustomRpm = true and )
   *
   * @param return
   *   True, if there are no errors
   *   False, if at least one effort range doesn't have a value
   */
  function checkEffortRanges() {
    // Load up all Goal Options and iterate through them
    var error = false;
    self.playlist.PlaylistGoals.forEach(function(val) {
      val.Goal.GoalOptions.forEach(function(goaloptions) {
        if (goaloptions.Effort > 0) {
          // Yay
        }
        else {
          //console.log(val);
          val.show = true;
          error = true;
        }
      });
    });
    return !error;
  }

  /**
   * Does every goal have a track?
   */
  self.checkAllGoalsHaveTracks = function () {
    return Playlists.checkAllGoalsHaveTracks();
  };

  self.checkHasPreRideBackgroundTracks = function () {
    var found = false;
    if (!self.playlist.BackgroundTracks) {
      return;
    }
    self.playlist.BackgroundTracks.forEach(function (val) {
      if (val.PlaylistPosition.toLowerCase() === 'before') {
        found = true;
      }
    });
    return found;
  };

  self.checkHasPostRideBackgroundTracks = function () {
    if (!self.playlist.BackgroundTracks) {
      return false;
    }
    var found = false;
    self.playlist.BackgroundTracks.forEach(function (val) {
      if (val.PlaylistPosition.toLowerCase() === 'after') {
        found = true;
      }
    });
    return found;
  };

  self.checkPlaylistLength = function () {
    return Playlists.checkPlaylistLength();
  };

  self.checkWhenEditingEveryGoalHasATrack = function () {
    if (!self.newPlaylist) {
      if (!self.checkAllGoalsHaveTracks()) {
        return false;
      }
    }
    return true;
  };

  // Cases in which the submit button should be disabled
  self.disableSubmitButton = function () {
    if (!self.playlist.Name) {
      //console.log('no playlist name!');
      return true;
    }
    if (self.form && self.form.$pristine) {
      //console.log('form not pristine!');
      return true;
    }
    if (self.saving) {
      //console.log('saving!');
      return true;
    }
    if (self.playlist.Complete) {
      if (!self.checkHasPreRideBackgroundTracks() || !self.checkHasPostRideBackgroundTracks() || !self.checkPlaylistLength() || !self.checkAllGoalsHaveTracks()) {
        //console.log('editing a complete playlist which is now incomplete');
        return true;
      }
    }
    return false;
  };

  self.submitButtonText = function () {
    if (!self.checkHasPreRideBackgroundTracks() || !self.checkHasPostRideBackgroundTracks() || !self.checkPlaylistLength() || !self.checkAllGoalsHaveTracks()) {
      return 'SAVE_CONTINUE_LATER';
    }
    else if (!self.newPlaylist && !self.checkAllGoalsHaveTracks()) {
      // Editing a playlist but not all tracks have goals
      return 'UPDATE';
    }
    if (self.newPlaylist) {
      return 'NEXT_PREVIEW';
    }
    return 'UPDATE';
  };

});
