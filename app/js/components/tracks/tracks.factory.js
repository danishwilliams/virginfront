angular
  .module("app")
  .factory('Tracks', TracksFactory);

TracksFactory.$inject = ['Restangular'];

function TracksFactory(Restangular) {
  var self = this;
  var tracks = [];

  var tracksFactory = {
    loadTracks: loadTracks,
    getTracks: getTracks,
    loadUser: loadUser
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

  function loadUser(id) {
    return Restangular.one('tracks', id).get().then(loadUserComplete);

    function loadUserComplete(data, status, headers, config) {
      return data;
    }
  }
}
