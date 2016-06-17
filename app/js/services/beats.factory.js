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
    return Restangular.all('beats').getList().then(function(data) {
      self.beats = data;
      return self.beats;
    });
  }

  function getBeats() {
    return beats;
  }

  function loadBeat(id) {
    return Restangular.one('beats', id).get();
  }
}
