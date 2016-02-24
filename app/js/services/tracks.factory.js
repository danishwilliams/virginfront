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

  /**
   * Everything to do with audio
   *
   * @author Roger Saner
   * @date 2016.02.24
   *
   * Audio playback uses the javascript Audio object (which uses the functionality of the <audio> tag).
   * This was chosen because of solid cross-browser support and simplicity of implementation. Boy, was I in for a surprise.
   * There are no dependencies on jQuery or any other javascript library.
   *
   * Music sources:
   * - There are currently 2 music providers: Simfy in South Africa, and OpenEar in the UK.
   *
   * Testing:
   * - A basic audio test file is available at /audio-test.html (although you'll need to edit it and add 2 mp3 files of your choice,
   *   since I haven't added those 2 files to the codebase) which test audio playback through both the <audio> tag and Audio object.
   * - To remove the dependency on a music provider, search this file for moments.mp3 and uncomment that code, which will set all
   *   track sources to be that mp3.
   *
   * Functionality:
   * - Multiple tracks can be played, all through the same Audio object, one at a time.
   * - Audio tracks are streamed as data is available, rather than downloaded.
   * - Track played duration is reported back to the music provider so they know about track usage.
   * - Current playback time is displayed.
   * - A loading animation is displayed while the track is loaded.
   * - A playing animation is displayed when the track is playing.
   *
   * Some gotchas:
   * - iOS playback won't work on clicking the "play" button due to (probably) iOS not recognising ng-click as an onclick
   *   on the play button, and it has a rule that audio can only be played on a user interaction. The twiddle function
   *   gets called on the first play button click which plays and pauses audio so audio can play again.
   * - All mobile devices should allow audio playback due to the above fix.
   * - Audio will play in all major browsers, except Opera mini (which doesn't support the audio tag).
   * - IE11 playback was initially screwed - sounded like it was playing back in a tunnel at a 10/th of the speed. We
   *   couldn't re-create this bug in SA, on the UK people could, and it was probably because I was using an angular
   *   $interval to poll the currenttime of the playing track every 100 milliseconds. Converting this logic to listening
   *   to the audio 'timeupdate' event instead fixed this.
   *
   * @see
   * - Overcoming iOS HTML5 audio limitations http://www.ibm.com/developerworks/library/wa-ioshtml5/
   * - https://developer.mozilla.org/en/docs/Web/HTML/Element/audio
   * - Native Audio with HTML5 https://msdn.microsoft.com/en-us/magazine/hh527168.aspx
   * - Using Media Events to Add a Progress Bar https://msdn.microsoft.com/en-us/library/gg589528(v=vs.85).aspx
   */

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

  /*
  // Debugging
  self.audio.addEventListener('error', function(e) {
    console.error(e);
  });

  self.audio.addEventListener('play', function(e) {
    console.log('play!', e);
  });

  self.audio.addEventListener('playing', function(e) {
    console.log('playing!', e);
  });

  self.audio.addEventListener('canplay', function(e) {
    console.log('canplay!', e);
  });
  */

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
    if (track.loading) {
      return;
    }

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
        self.currentPlayingTrack.loading = false;
        var date = new Date();
        postTrackUsage(track.MusicProviderTrackId, parseInt(self.audio.currentTime), date.toISOString());
        track.loading = true;
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
