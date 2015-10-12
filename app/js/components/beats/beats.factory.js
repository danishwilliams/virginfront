angular
  .module("app")
  .factory('Beats', BeatsFactory);

BeatsFactory.$inject = ['Restangular'];

function BeatsFactory(Restangular) {
  var self = this;
  var beats = [];

  var beatsFactory = {
    loadBeats: loadBeats,
    getBeats: getBeats,
    loadBeat: loadBeat
  };

  return beatsFactory;

  function loadBeats() {
    return Restangular.all('beats').getList().then(loadBeatsComplete);

    function loadBeatsComplete(data, status, headers, config) {
      self.beats = data;
      return self.beats;
    }
  }

  function getBeats() {
    return beats;
  }

  function loadBeat(id) {
    return Restangular.one('beats', id).get().then(loadBeatComplete);

    function loadBeatComplete(data, status, headers, config) {
      return data;
    }
  }
}
