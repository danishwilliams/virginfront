angular
  .module("app")
  .factory('Gyms', GymsFactory);

GymsFactory.$inject = ['LoggedInRestangular'];

function GymsFactory(LoggedInRestangular) {
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
    return LoggedInRestangular.all('gyms').getList({
      onlyActiveDevices: true
    });

    function loadGymsComplete(data, status, headers, config) {
      self.gyms = data;
      return self.gyms;
    }
  }

  function loadAllGyms() {
    return LoggedInRestangular.all('gyms').getList({
      onlyActiveDevices: false
    }).then(loadGymsComplete);

    function loadAllGymsComplete(data, status, headers, config) {
      self.gymsAll = data;
      return self.gymsAll;
    }
  }

  function loadAvailableGyms() {
    return LoggedInRestangular.all('gyms/syncinfo').getList().then(loadAvailableGymsComplete);

    function loadAvailableGymsComplete(data, status, headers, config) {
      return data;
    }
  }

  function getGyms() {
    return gyms;
  }

  function loadGym(id) {
    return LoggedInRestangular.one('gyms', id).get().then(loadGymComplete);

    function loadGymComplete(data, status, headers, config) {
      return data;
    }
  }
}
