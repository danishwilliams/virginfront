angular
  .module("app")
  .factory('Gyms', GymsFactory);

GymsFactory.$inject = ['Restangular'];

function GymsFactory(Restangular) {
  var self = this;
  var gymsAll = [];

  var gymsFactory = {
    loadGyms: loadGyms,
    loadAllGyms: loadAllGyms,
    loadAvailableGyms: loadAvailableGyms,
    loadGym: loadGym
  };

  return gymsFactory;

  function loadGyms(onlyActiveDevices) {
    return Restangular.all('gyms').getList({
      onlyActiveDevices: onlyActiveDevices
    });
  }

  function loadAllGyms() {
    return Restangular.all('gyms').getList({
      onlyActiveDevices: false
    }).then(loadAllGymsComplete);

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

  function loadGym(id) {
    return Restangular.one('gyms', id).get().then(loadGymComplete);

    function loadGymComplete(data, status, headers, config) {
      return data;
    }
  }
}
