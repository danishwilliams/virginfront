angular
  .module("app")
  .factory('Gyms', GymsFactory);

GymsFactory.$inject = ['Restangular'];

function GymsFactory(Restangular) {
  var self = this;
  var gyms = [];

  var gymsFactory = {
    loadGyms: loadGyms,
    loadAvailableGyms: loadAvailableGyms,
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

  function loadAvailableGyms() {
    return Restangular.all('gyms/syncinfo').getList().then(loadAvailableGymsComplete);

    function loadAvailableGymsComplete(data, status, headers, config) {
      return data;
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
