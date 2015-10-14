angular
  .module("app")
  .factory('Gyms', GymsFactory);

GymsFactory.$inject = ['Restangular'];

function GymsFactory(Restangular) {
  var self = this;
  var gyms = [];

  var gymsFactory = {
    loadGyms: loadGyms,
    getGyms: getGyms,
    loadGym: loadGym
  };

  return gymsFactory;

  function loadGyms() {
    return Restangular.all('gyms').getList().then(loadGymsComplete);

    function loadGymsComplete(data, status, headers, config) {
      self.gyms = data;
      return self.gyms;
    }
  }

  function getGyms() {
    return gyms;
  }

  function loadGym(id) {
    return Restangular.one('gyms', id).get().then(loadGymComplete);

    function loadGymComplete(data, status, headers, config) {
      return data;
    }
  }
}
