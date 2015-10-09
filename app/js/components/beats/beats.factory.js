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
    loadUser: loadUser
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

  function loadUser(id) {
    return Restangular.one('beats', id).get().then(loadUserComplete);

    function loadUserComplete(data, status, headers, config) {
      return data;
    }
  }
}
