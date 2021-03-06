/**
 * Created by rogersaner on 15/09/21.
 */
angular
  .module("app")
  .factory('Playlists', PlaylistsFactory);

PlaylistsFactory.$inject = ['Restangular', 'uuid2', 'Users', '$rootScope'];

function PlaylistsFactory(Restangular, uuid2, Users, $rootScope) {
  var self = this;
  var steps = initSteps(); // The full steps array
  var currentStep = 0; // Which step we're currently on
  var playlist = [];
  var playlists = [];
  var playlistLimitPerGym = 5;
  playlist.creatingNewPlaylist = false;
  var isCustomRpm = false; // The isCustomRpm value for a playlist

  // The currently selected goal which tracks can be added to
  var currentgoal = {
    ArrayId: 0, // Maintains a mapping between the array id of the playlist goal, and the playlist goal UUID
    PlaylistGoalId: 'uuid',
    Name: '',
    BpmLow: -1,
    BpmHigh: -1,
    BackgroundSection: '' // The currently selected background section which a track can be added to. One of 'before' or 'after'
  };

  var playlistFactory = {
    createNewPlaylistFromTemplate: createNewPlaylistFromTemplate,
    addTrackToGoalPlaylist: addTrackToGoalPlaylist,
    removeTrackFromGoalPlaylist: removeTrackFromGoalPlaylist,
    addBackgroundTrack: addBackgroundTrack,
    removeBackgroundTrack: removeBackgroundTrack,
    trackDropped: trackDropped,
    getCreatingNewPlaylist: getCreatingNewPlaylist,
    setCreatingNewPlaylist: setCreatingNewPlaylist,
    loadPlaylists: loadPlaylists,
    getPlaylists: getPlaylists,
    loadPlaylist: loadPlaylist,
    getPlaylist: getPlaylist,
    setPlaylist: setPlaylist,
    getPlaylistCustomRpm: getPlaylistCustomRpm,
    //loadGymsPlaylistSyncInfo: loadGymsPlaylistSyncInfo,
    loadGymsPlaylistSyncInfoDetailed: loadGymsPlaylistSyncInfoDetailed,
    loadGymsDevicePlaylistSyncInfo: loadGymsDevicePlaylistSyncInfo,
    loadGymsPlaylists: loadGymsPlaylists,
    loadPlaylistsNotInGym: loadPlaylistsNotInGym,
    addPlaylistToGym: addPlaylistToGym,
    addPlaylistToGyms: addPlaylistToGyms,
    removePlaylistFromGym: removePlaylistFromGym,
    getPlaylistLimitPerGym: getPlaylistLimitPerGym,
    publishPlaylist: publishPlaylist,
    publishPlaylistToMusicProvider: publishPlaylistToMusicProvider,
    getGoalPlaylist: getGoalPlaylist,
    getPlaylistGoalTracks: getPlaylistGoalTracks,
    createPlaylistGoalNote: createPlaylistGoalNote,
    getPlaylistLength: getPlaylistLength,
    checkPlaylistLength: checkPlaylistLength,
    checkAllGoalsHaveTracks: checkAllGoalsHaveTracks,
    getName: getName,
    setName: setName,
    getSteps: getSteps,
    getCurrentStep: getCurrentStep,
    setStep: setStep,
    getCurrentGoal: getCurrentGoal,
    setCurrentGoal: setCurrentGoal,
    loadRecentClasses: loadRecentClasses
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
    playlist.TemplateIconFileName = template.TemplateGroup.IconFileName;
    playlist.TemplateType = template.TemplateGroup.Type;
    playlist.IsCustomRpm = isCustomRpm = template.TemplateGroup.IsCustomRpm;
    playlist.Shared = false;
    playlist.ClassLengthMinutes = template.ClassLengthMinutes;
    playlist.UserId = Users.getCurrentUser().Id;
    if (!playlist.UserId) {
      Users.loadCurrentUser().then(function (user) {
        playlist.UserId = user.Id;
      });
    }
    playlist.PlaylistGoals = [];
    playlist.BackgroundTracks = [];
    if (template.TemplateGroup.Type === 'freestyle') {
      playlist.MaxFreestyleGoals = template.MaxFreestyleGoals;
    }

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
      if (goal.Aim) {
        playlistGoal.PlaylistGoalNotes.push(createPlaylistGoalNote(goal.Aim));
      }
      playlist.PlaylistGoals.push(playlistGoal);
      i++;
    });

    return playlist;
  }

  // Add a track to a playlist for a goal id
  function addTrackToGoalPlaylist(playlistGoalArrayId, track) {
    // Replaces any existing track in the playlist
    playlist.PlaylistGoals[playlistGoalArrayId].PlaylistGoalTracks = [{
      Track: track,
      SortOrder: 0
    }];
  }

  // Removes a track from a playlist for a goal id
  function removeTrackFromGoalPlaylist(playlistGoalArrayId, track) {
    playlist.PlaylistGoals[playlistGoalArrayId].PlaylistGoalTracks = [];
    track.removed = true;
    // TODO: use _.mapObject to remove the track from the list and rework the sort order, when we have multiple tracks
  }

  function addBackgroundTrack(position, track) {
    // calculate the new SortOrder
    var i = 0;
    playlist.BackgroundTracks.forEach(function (val) {
      if (val.PlaylistPosition.toLowerCase() === position) {
        i++;
      }
    });

    var newTrack = {
      PlaylistPosition: position,
      SortOrder: i,
      Track: track
    };
    playlist.BackgroundTracks.push(newTrack);
  }

  // Removes a track from background music
  function removeBackgroundTrack(position, track) {
    var removed = false;
    for (var i = 0; i < playlist.BackgroundTracks.length; i++) {
      if (!removed) {
        if (playlist.BackgroundTracks[i].PlaylistPosition.toLowerCase() === position) {
          if (playlist.BackgroundTracks[i].TrackId === track.TrackId) {
            playlist.BackgroundTracks.splice(i, 1);
            removed = true;
          }
        }
      }
    }
    if (removed) {
      // Rework the sort order
      var k = 1;
      for (i = 0; i < playlist.BackgroundTracks.length; i++) {
        if (playlist.BackgroundTracks[i].PlaylistPosition.toLowerCase() === position) {
          playlist.BackgroundTracks[i].SortOrder = k;
          k++;
        }
      }

      // Tell the playlist edit controller to set the form to be dirty
      // Yeah, this is ugly. It _should_ work by adding an ng-change to the <background-music> directive,
      // since it already has an ng-model on it, but that didn't work. Maybe it's because the service
      // holds the model, and so any change isn't propogated up from the directive -> the playlist_edit
      // controller. This could perhaps be refactored.
      $rootScope.$broadcast('add.track');
    }
  }

  // A track has been added to a goal
  function trackDropped(playlistGoalArrayId, track) {
    console.log('Track dropped! (' + track.Name + ') on goal ' + playlistGoalArrayId);
    // Update the playlist
    addTrackToGoalPlaylist(playlistGoalArrayId, track);
  }

  function setCreatingNewPlaylist(value) {
    playlist.creatingNewPlaylist = value;
  }

  function getCreatingNewPlaylist() {
    return playlist.creatingNewPlaylist;
  }

  // Returns the playlist for a specific goal
  function getGoalPlaylist(id) {
    return playlist[id];
  }

  /**
   * Returns all playlists for the current user, or for the userId (if provided)
   *
   * @param resultCount
   *   Number of playlists to return
   * @param userId
   *   Optional. The Id of the user we want the playlists for.
   */
  function loadPlaylists(resultCount, userId, complete) {
    var params = {
      resultCount: resultCount,
      includeGoals: false
    };
    if (userId) {
      params.UserId = userId;
    }
    if (complete !== undefined) {
      params.complete = complete;
    }
    return Restangular.one('playlists').get(params).then(loadPlaylistsComplete);

    function loadPlaylistsComplete(data, status, headers, config) {
      data = _convertDates(data);
      self.playlists = data;
      return self.playlists;
    }
  }

  function getPlaylists() {
    return playlists;
  }

  function loadPlaylist(id) {
    return Restangular.one('playlists', id).get({
      includeGoals: true
    }).then(loadPlaylistComplete);

    function loadPlaylistComplete(data) {
      data = _convertDates(data);
      playlist = data;
      isCustomRpm = data.IsCustomRpm;

      // Assign random values to tracks so they're loading or playing, to test the load/play animations
      /*
      playlist.PlaylistGoals.forEach(function(val) {
        var i = Math.random();
        if (i > 0.7) {
          val.PlaylistGoalTracks[0].Track.loading = true;
        }
        else if (i > 0.3) {
        }
        else {
          val.PlaylistGoalTracks[0].Track.playing = true;
        }
      });
      */

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

  function setPlaylist(value) {
    playlist = value;
  }

  function getPlaylistCustomRpm() {
    return isCustomRpm;
  }

  /*
  function loadGymsPlaylistSyncInfo() {
    return Restangular.one('gyms/syncinfo').get().then(loadGymsPlaylistSyncInfoComplete);

    function loadGymsPlaylistSyncInfoComplete(data, status, headers, config) {
      return data;
    }
  }
  */

  function loadGymsPlaylistSyncInfoDetailed(userId) {
    return Restangular.one('gyms/syncinfo/detailed').get({userId: userId}).then(loadGymsPlaylistSyncInfoDetailedComplete);

    function loadGymsPlaylistSyncInfoDetailedComplete(data, status, headers, config) {
      // Check if this user has any gyms, or any playlists synced to any gyms
      var hasGyms = false;
      data.forEach(function(val) {
        if (val.RegularGym || val.PlaylistSyncCount > 0) {
          hasGyms = true;
        }
      });

      return {
        data: data,
        hasGyms: hasGyms
      };
    }
  }

  function loadGymsDevicePlaylistSyncInfo(gymId, playlistId) {
    return Restangular.one('gyms/syncinfo/deviceplaylistsync').get({gymId: gymId, playlistId: playlistId}).then(loadGymsDevicePlaylistSyncInfoComplete);

    function loadGymsDevicePlaylistSyncInfoComplete(data, status, headers, config) {
      // This only returns the primary device (although there's a rule in effect where only one device is ever
      // allowed to be primary at any particular point.
      return data[0];
    }
  }

  // Gets all Gyms with their playlists
  function loadGymsPlaylists() {
    return Restangular.one('playlists/gyms').get();
  }

  // Gets all complete playlists not in a particular gym
  function loadPlaylistsNotInGym(id) {
    return Restangular.one('gyms/' + id + '/playlistsnotpublished').get().then(function(data) {
      data = _convertDates(data);
      return data;
    });
  }

  function addPlaylistToGym(playlistId, gymId) {
    return Restangular.one('playlists/gym/' + playlistId, gymId).post();
  }

  function addPlaylistToGyms(playlistId, gyms) {
    return Restangular.all('playlists/gym/' + playlistId).post(gyms);
  }

  function removePlaylistFromGym(playlistId, gymId) {
    return Restangular.one('playlists/gym/' + playlistId, gymId).remove();
  }

  function getPlaylistLimitPerGym() {
    return playlistLimitPerGym;
  }

  /**
   * Publishes a playlist to all gyms (if no Gym Id is provided) or to a specific gym
   *
   * @param playlistId
   * @param gymId
   *   Optional
   */
  function publishPlaylist(playlistId, gymId) {
    if (gymId) {
      return Restangular.one('playlists/sync', playlistId).customPOST({}, '', {gymId: gymId});
    }
    else {
      return Restangular.one('playlists/sync', playlistId).post();
    }
  }

  /**
   * Publishes a playlist to a Music Provider i.e. creates/edits a playlist on Simfy
   */
  function publishPlaylistToMusicProvider(id) {
    return Restangular.one('music/playlist', id).post().then(publishPlaylistToMusicProviderComplete);

    function publishPlaylistToMusicProviderComplete(data, status, headers, config) {
      // TODO: build in error handling here if this fails
      return data;
    }
  }

  /**
   * Returns the tracks within a playlistGoal
   */
  function getPlaylistGoalTracks(ArrayId) {
    return playlist.PlaylistGoals[ArrayId];
  }

  /**
   * Create a new playlist goal note
   *
   * @param noteText
   *   The note's text
   * @param trackId (optional)
   *   The track id which this note belongs to.
   *
   * @return
   *   A playlist goal note object
   */
  function createPlaylistGoalNote(noteText, trackId) {
    var note = {
      NoteText: noteText,
      Id: uuid2.newuuid().toString(),
      SortOrder: 1
    };

    if (trackId) {
      note.TrackId = trackId;
    }

    return note;
  }

  function getPlaylistLength() {
    if (!playlist.PlaylistGoals) {
      return 0;
    }
    var length = 0;
    playlist.PlaylistGoals.forEach(function (playlistGoals) {
      playlistGoals.PlaylistGoalTracks.forEach(function (track) {
        length += track.Track.DurationSeconds;
      });
    });
    return length;
  }

  /**
   * Checks if the playlist length is within certain bounds.
   *
   * @return
   *   true, if playlist length is ok, else
   *   false
   */
  function checkPlaylistLength() {
    // Check that the total track length is acceptable
    var variance = 5 * 60;
    var classLengthSeconds = playlist.ClassLengthMinutes * 60;
    var playlistTracksLength = getPlaylistLength();

    // Track length is too short or too long
    if ((playlistTracksLength < classLengthSeconds - variance) || (playlistTracksLength > classLengthSeconds + variance)) {
      return false;
    }
    return true;
  }

  /**
   * Checks that every goal has a track. If they do, then return true. Else return false.
   */
  function checkAllGoalsHaveTracks() {
    if (!playlist.PlaylistGoals) {
      return false;
    }

    // If this is a freestyle playlist, check that the number of goals equals the number of MaxFreestyleGoals
    if (playlist.MaxFreestyleGoals > 0) {
      if (playlist.PlaylistGoals.length < playlist.MaxFreestyleGoals) {
        return false;
      }
    }

    var containsNoTrack = false;
    playlist.PlaylistGoals.forEach(function (playlistGoals) {
      var hasTrack = false;
      if (playlistGoals.PlaylistGoalTracks.length === 0) {
        containsNoTrack = true;
      }
    });
    return !containsNoTrack;
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
    }, {
      id: 4,
      name: 'Send to club',
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
      Name: playlistGoal.Goal.Name,
      BpmLow: playlistGoal.Goal.BpmLow,
      BpmHigh: playlistGoal.Goal.BpmHigh
    };
    if (playlistGoal.Goal.GoalOptions) {
      currentgoal.GoalOptionCount = playlistGoal.Goal.GoalOptions.length;
    }

    if (playlistGoal.BackgroundSection) {
      currentgoal.BackgroundSection = playlistGoal.BackgroundSection;
    }
    else {
      currentgoal.ArrayId = playlistGoal.ArrayId;
      currentgoal.PlaylistGoalId = playlistGoal.Id;
    }
  }


  /**
   * Returns the recent classes for current user, or for the userId (if provided)
   *
   * @param resultCount
   *   Number of recent classes to return
   * @param userId
   *   Optional. The Id of the user we want the recent classes for.
   */
  function loadRecentClasses(resultCount, userId) {
    var params = {
      resultCount: resultCount
    };
    if (userId) {
      params.UserId = userId;
    }
    return Restangular.one('playlists/recentclasses').get(params).then(loadRecentClassesComplete);

    function loadRecentClassesComplete(data, status, headers, config) {
      data.forEach(function(val) {
        if (val.ClassTaughtDate) { val.ClassTaughtDate = new Date(val.ClassTaughtDate);}
      });
      return data;
    }
  }

  function _convertDates(data) {
    if (_.isArray(data)) {
      data.forEach(function(val) {
        if (val.CreateDate) { val.CreateDate = new Date(val.CreateDate);}
      });

      return data;
    }

    // Convert UTC dates to javascript date objects
    if (data.CreateDate) { data.CreateDate = new Date(data.CreateDate);}

    return data;
  }
}
