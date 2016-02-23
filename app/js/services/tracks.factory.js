/**
 * Created by rogersaner on 15/09/07.
 */
angular
  .module("app")
  .service('Tracks', TracksFactory);

TracksFactory.$inject = ['$rootScope', '$location', 'Restangular', 'Playlists', 'Storage'];

function TracksFactory($rootScope, $location, Restangular, Playlists, Storage) {
  var self = this;
  self.userGenresTracks = [];
  self.tracks = []; // A list of track objects

  var tracksFactory = {
    loadUserGenresTracks: loadUserGenresTracks,
    searchTracks: searchTracks,
    addTrack: addTrack,
    getTracks: getTracks,
    playTrack: playTrack,
    stopTrack: stopTrack,
    getTrackCurrentTime: getTrackCurrentTime,
    getCurrentlyPlayingTrack: getCurrentlyPlayingTrack,
    getSearchedTrack: getSearchedTrack,
    setSearchedTrack: setSearchedTrack,
    loadDownloadUrl: loadDownloadUrl,
    postTrackUsage: postTrackUsage
  };

  // Everything to do with audio

  self.audio = new Audio(); // An audio object for playing a track
  // Without these, Safari hates us
  self.audio.preload = "auto";
  self.audio.autoplay = "true";
  self.currentPlayingTrack = {}; // The track which is currently playing
  self.selectedSearchedTrack = {}; // A track which has been selected from a search

  // Fix for stupid iOS which otherwise doesn't believe that a click is a click
  window.addEventListener("click", twiddle);

  function twiddle() {
    console.log('twiddle!');
    self.audio.play();
    self.audio.pause();
    window.removeEventListener("click", twiddle);
  }

  self.audio.addEventListener('error', function(e) {
    console.error(e);
  });

  self.audio.addEventListener('play', function(e) {
    console.log('play!', e);
  });

  self.audio.addEventListener('playing', function(e) {
    console.log('playing!', e);
    window.removeEventListener("click",twiddle);
  });

  self.audio.addEventListener('canplay', function(e) {
    console.log('canplay!', e);
  });

  // When navigating away from any place where a track might be playing, stop it from playing
  $rootScope.$on('$locationChangeStart', function (event, next, prev) {
    stopTrack();
  });

  return tracksFactory;

  function loadUserGenresTracks(bpmLow, bpmHigh, genres) {
    if (genres) {
      return Restangular.one('music/genres').customPOST(genres, '', {
        bpmLow: bpmLow,
        bpmHigh: bpmHigh
      }).then(loadUserGenresTracksComplete);
    } else {
      return Restangular.all('music/usergenres').getList({
        bpmLow: bpmLow,
        bpmHigh: bpmHigh
      }).then(loadUserGenresTracksComplete);
    }

    function loadUserGenresTracksComplete(data, status, headers, config) {
      self.userGenresTracks = data;
      return self.userGenresTracks;
    }
  }

  function searchTracks(term) {
    return Restangular.one('music/search').get({
      searchText: term,
      resultCount: 25,
      page: 0
    }).then(searchTracksComplete);

    function searchTracksComplete(data, status, headers, config) {
      return data;
    }
  }

  function addTrack(track) {
    self.tracks.push(track);
  }

  function getTracks() {
    return self.tracks;
  }

  /**
   * Plays a track
   *
   * @param track
   *   The track object
   * @param sortOrder
   *   An integer (or null). The PlaylistGoal SortOrder. If it has a value, then after the
   *   track has finished playing, play the next one in the playlist
   */
  function playTrack(track, sortOrder) {
    // Is a track playing?
    if (self.currentPlayingTrack.MusicProviderTrackId) {
      // Is the track the user has just clicked on the currently playing track?
      if (self.currentPlayingTrack.MusicProviderTrackId === track.MusicProviderTrackId) {
        if (track.playing === true) {
          // User is pausing a playing track
          self.audio.pause();
          track.playing = false;

          // Store track duration played (and date) locally
          Storage.setItem('musicProviderTrackId', track.MusicProviderTrackId);
          Storage.setItem('durationSeconds', self.audio.currentTime);
          var d = new Date();
          Storage.setItem('date', d.toISOString());
        } else {
          // User is resuming a paused track
          track.playing = true;
          playAudio(track);
        }
        self.currentPlayingTrack = track;
      } else {
        // A track was playing, but the user is now playing a new track
        self.currentPlayingTrack.playing = false;
        var date = new Date();
        postTrackUsage(track.MusicProviderTrackId, parseInt(self.audio.currentTime), date.toISOString());
        playTrackWithSource(track, sortOrder);
      }
    } else {
      // Starting to play a track for the first time
      track.loading = true;
      playTrackWithSource(track, sortOrder);

      // If a track was paused in the last browser session, post a track usage count
      var musicProviderTrackId = Storage.getItem('musicProviderTrackId');
      if (musicProviderTrackId) {
        var duration = Storage.getItem('durationSeconds');
        var dateLocal = Storage.getItem('date');
        if (duration >= 1 && dateLocal) {
          postTrackUsage(musicProviderTrackId, parseInt(duration), dateLocal);
        }
      }
    }
  }

  // We don't store track Sources in the API (since Simfy tracks expire after 2 days) so if Source
  // doesn't exist, do an API call to find it
  function playTrackWithSource(track, sortOrder) {
    self.currentPlayingTrack = track;
    self.audio.addEventListener('loadstart', function(e) {
      if (self.currentPlayingTrack.Id === track.Id) {
        track.loading = true;
      }
    });
    self.audio.addEventListener('playing', function(e) {
      if (self.currentPlayingTrack.Id === track.Id) {
        track.loading = false;
        track.playing = true;
      }
    });

    if (track.Source) {
      self.audio.src = track.Source; // = "http://localhost:8000/moments.mp3";
      self.audio.onended = function () {
        playEnded(track, sortOrder);
      };
      playAudio(track);
    } else {
      loadDownloadUrl(track.Id).then(function (data) {
        self.audio.src = track.Source = data.Value; // = "http://localhost:8000/moments.mp3";
        self.audio.onended = function () {
          playEnded(track, sortOrder);
        };
        playAudio(track);
      });
    }
  }

  function playAudio(track) {
    // Update the timer
    self.audio.addEventListener("timeupdate", function() {
      if (self.currentPlayingTrack.Id === track.Id) {
        $rootScope.$apply(function () {
          track.currentTime = Math.round(self.audio.currentTime);
        });
      }
    });

    self.audio.play();
  }

  /**
   * Stops any track from playing, but if a specific track is specified and it's playing, then stop that.
   */
  function stopTrack(track) {
    if (self.currentPlayingTrack.playing === true) {
      if (track) {
        playTrack(track);
      } else {
        playTrack(self.currentPlayingTrack);
      }
    }
    self.currentPlayingTrack = {};
  }

  function playEnded(track, sortOrder) {
    track.playing = false;
    self.currentPlayingTrack = {};

    // Have to load up the DOM element and change it there, because can't do a $scope.apply() due to using Controller-As syntax
    // I feel very, very bad about having controller logic in a factory. I am ashamed.
    var trackElement = document.getElementById("track" + track.MusicProviderTrackId);
    angular.element(trackElement).scope().$apply();

    var duration = parseInt(self.audio.currentTime);
    if (duration >= 1) {
      var date = new Date();
      postTrackUsage(track.MusicProviderTrackId, duration, date.toISOString());
    }

    // If there's a PlaylistGoal SortOrder, then we're viewing a playlist and should play the next track
    if (sortOrder) {
      // Find the next track
      var playlist = Playlists.getPlaylist();
      if (playlist.PlaylistGoals[sortOrder]) {
        track = playlist.PlaylistGoals[sortOrder].PlaylistGoalTracks[0].Track;
        var newSortOrder = playlist.PlaylistGoals[sortOrder].SortOrder;
        // Play the next track
        playTrack(track, newSortOrder);
      }
    }
  }

  function getTrackCurrentTime() {
    return self.audio.currentTime;
  }

  function getCurrentlyPlayingTrack() {
    return self.currentPlayingTrack;
  }

  function getSearchedTrack() {
    return self.selectedSearchedTrack;
  }

  function setSearchedTrack(track) {
    self.selectedSearchedTrack = track;
  }

  /**
   * Gets a track download URL
   */
  function loadDownloadUrl(id) {
    return Restangular.one('music/track/downloadurl', id).get().then(loadDownloadUrlComplete);

    function loadDownloadUrlComplete(data, status, headers, config) {
      return data;
    }
  }

  /**
   * Post track usage data. There are 3 times when we want to report track plays:
   * 1. On track completion.
   * 2. On track skip (i.e. another track starts playing).
   * 3. When the user pauses playback, the current duration should be stored. When another track starts playing
   *    (even after the tab is closed and re-opened) then post the stored track's usage.
   */
  function postTrackUsage(id, durationSeconds, date) {
    var usage = [{
      MusicProviderTrackId: id.toString(),
      DurationSeconds: durationSeconds,
      PlayDateTime: date,
      TrackState: "stream"
    }];
    return Restangular.one('music/usage/track').customPOST(usage).then(postTrackUsageComplete);

    function postTrackUsageComplete(data, status, headers, config) {
      Storage.removeItem('musicProviderTrackId');
      Storage.removeItem('durationSeconds');
      Storage.removeItem('date');
      return data;
    }
  }
}
