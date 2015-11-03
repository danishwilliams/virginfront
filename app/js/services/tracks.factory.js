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
  self.playerTrack = []; // The track loaded to the player

  var tracksFactory = {
    loadUserGenresTracks: loadUserGenresTracks,
    searchTracks: searchTracks,
    addTrack: addTrack,
    getTracks: getTracks,
    getPlayerTrack: getPlayerTrack,
    setPlayerTrack: setPlayerTrack,
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

  function getPlayerTrack() {
    return self.playerTrack;
  }

  function setPlayerTrack(track) {
    self.playerTrack = [track];
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
