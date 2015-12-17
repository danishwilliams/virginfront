angular
  .module("app")
  .factory('Gyms', GymsFactory);

GymsFactory.$inject = ['Restangular'];

function GymsFactory(Restangular) {
  var self = this;
  var gyms = [];
  var gymsAll = [];

  var gymsFactory = {
    loadGyms: loadGyms,
    loadAllGyms: loadAllGyms,
    loadAvailableGyms: loadAvailableGyms,
    getGyms: getGyms,
    loadGym: loadGym
  };

  return gymsFactory;

  function loadGyms() {
    return Restangular.all('gyms').getList({
      onlyActiveDevices: true
    });

    function loadGymsComplete(data, status, headers, config) {
      self.gyms = data;
      return self.gyms;
    }
  }

  function loadAllGyms() {
    return Restangular.all('gyms').getList({
      onlyActiveDevices: false
    }).then(loadGymsComplete);

    function loadAllGymsComplete(data, status, headers, config) {
      self.gymsAll = data;
      return self.gymsAll;
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
