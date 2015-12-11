angular
  .module("app")
  .factory('TracksFactory', TracksComponentFactory);

TracksComponentFactory.$inject = ['Restangular'];

function TracksComponentFactory(Restangular) {
  var self = this;
  var tracks = [];

  var tracksFactory = {
    loadTracks: loadTracks,
    getTracks: getTracks
  };

  return tracksFactory;

  function loadTracks() {
    return Restangular.all('tracks').getList().then(loadTracksComplete);

    function loadTracksComplete(data, status, headers, config) {
      self.tracks = data;
      return self.tracks;
    }
  }

  function getTracks() {
    return tracks;
  }
}
