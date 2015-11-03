/**
 * Created by rogersaner on 15/09/07.
 */
angular
  .module("app")
  .service('Tracks', TracksFactory);

TracksFactory.$inject = ['$rootScope', 'Restangular'];

function TracksFactory($rootScope, Restangular) {
  var self = this;
  self.userGenresTracks = [];
  self.tracks = []; // A list of track objects
  self.audio = new Audio(); // An audio object for playing a track
  self.currentPlayingTrack = {}; // The track which is currently playing

  var tracksFactory = {
    loadUserGenresTracks: loadUserGenresTracks,
    searchTracks: searchTracks,
    addTrack: addTrack,
    getTracks: getTracks,
    playTrack: playTrack,
    loadDownloadUrl: loadDownloadUrl,
    postTrackUsage: postTrackUsage
  };

  return tracksFactory;

  function loadUserGenresTracks() {
    return Restangular.all('music/usergenres').getList().then(loadUserGenresTracksComplete);

    function loadUserGenresTracksComplete(data, status, headers, config) {
      tracks = seedBpm(data);

      self.userGenresTracks = tracks;
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
      tracks = seedBpm(data);
      return tracks;
    }
  }

  /**
   * Give tracks some random BPM data
   */
  function seedBpm(tracks) {
    // TODO: remove this once BPM data is available
    _.mapObject(tracks, function (val, key) {
      if (key >= 0) {
        // Generate a fake BPM value
        val.Bpm = Math.floor(Math.random() * 100) + 80;
      }
      return val;
    });
    return tracks;
  }

  function addTrack(track) {
    self.tracks.push(track);
  }

  function getTracks() {
    return self.tracks;
  }

  function playTrack(track) {
    // Is a track playing?
    if (self.currentPlayingTrack.MusicProviderTrackId) {
      // Is the track the user has just clicked on the currently playing track?
      if (self.currentPlayingTrack.MusicProviderTrackId === track.MusicProviderTrackId) {
        if (track.playing === true) {
          // User is pausing a playing track
          self.audio.pause();
          track.playing = false;

          // Store track duration played (and date) locally
          localStorage.setItem('musicProviderTrackId', track.MusicProviderTrackId);
          localStorage.setItem('durationSeconds', self.audio.currentTime);
          var d = new Date();
          localStorage.setItem('date', d.toISOString());
        } else {
          // User is resuming a paused track
          self.audio.play();
          track.playing = true;
        }
        self.currentPlayingTrack = track;
      } else {
        // A track was playing, but the user is now playing a new track
        self.currentPlayingTrack.playing = false;
        var date = new Date();
        postTrackUsage(track.MusicProviderTrackId, parseInt(self.audio.currentTime), date.toISOString());
        playTrackWithSource(track);
      }
    } else {
      // Starting to play a track for the first time
      playTrackWithSource(track);

      // If a track was paused in the last browser session, post a track usage count
      var musicProviderTrackId = localStorage.getItem('musicProviderTrackId');
      if (musicProviderTrackId) {
        var duration = localStorage.getItem('durationSeconds');
        var dateLocal = localStorage.getItem('date');
        if (duration > 0 && dateLocal) {
          postTrackUsage(musicProviderTrackId, parseInt(duration), dateLocal);
        }

        localStorage.removeItem('musicProviderTrackId');
        localStorage.removeItem('durationSeconds');
        localStorage.removeItem('date');
      }
    }
  }

  // We don't store track Sources in the API (since Simfy tracks expire after 2 days) so if Source
  // doesn't exist, do an API call to find it
  function playTrackWithSource(track) {
    track.playing = true;
    self.currentPlayingTrack = track;
    if (track.Source) {
      self.audio.src = track.Source;
      self.audio.onended = function () {
        self.playEnded(track);
      };
      self.audio.play();
    } else {
      self.loadDownloadUrl(track.Id).then(function (data) {
        self.audio.src = track.Source = data.Value;
        self.audio.onended = function () {
          self.playEnded(track);
        };
        self.audio.play();
      });
    }
  }

  function playEnded(track) {
    track.playing = false;
    self.currentPlayingTrack = {};

    // Have to load up the DOM element and change it there, because can't do a $scope.apply() due to using Controller-As syntax
    // I feel very, very bad about having controller logic in a factory. I am ashamed.
    var trackElement = document.getElementById("track" + track.MusicProviderTrackId);
    angular.element(trackElement).scope().$apply();

    var duration = parseInt(self.audio.currentTime);
    if (duration > 0) {
      var date = new Date();
      postTrackUsage(track.MusicProviderTrackId, duration, date.toISOString());
    }
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
      return data;
    }
  }
}
