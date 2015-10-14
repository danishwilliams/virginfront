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
    addTrack: addTrack,
    getTracks: getTracks,
    getPlayerTrack: getPlayerTrack,
    setPlayerTrack: setPlayerTrack,
  };

  return tracksFactory;

  function loadUserGenresTracks() {
    return Restangular.all('music/usergenres').getList().then(loadUserGenresTracksComplete);

    function loadUserGenresTracksComplete(data, status, headers, config) {
      // TODO: remove this once BPM data is available
      _.mapObject(data, function (val, key) {
        if (key >= 0) {
          // Generate a fake BPM value
          val.Bpm = Math.floor(Math.random() * 100) + 80;
        }
        return val;
      });

      self.userGenresTracks = data;
      return self.userGenresTracks;
    }
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
}
