angular
  .module("app")
  .factory('Beats', BeatsFactory);

BeatsFactory.$inject = ['LoggedInRestangular'];

function BeatsFactory(LoggedInRestangular) {
  var self = this;
  var beats = [];

  var beatsFactory = {
    loadBeats: loadBeats,
    getBeats: getBeats,
    loadBeat: loadBeat
  };

  return beatsFactory;

  function loadBeats() {
    return LoggedInRestangular.all('beats').getList().then(loadBeatsComplete);

    function loadBeatsComplete(data, status, headers, config) {
      self.beats = data;
      return self.beats;
    }
  }

  function getBeats() {
    return beats;
  }

  function loadBeat(id) {
    return LoggedInRestangular.one('beats', id).get().then(loadBeatComplete);

    function loadBeatComplete(data, status, headers, config) {
      return data;
    }
  }
}
