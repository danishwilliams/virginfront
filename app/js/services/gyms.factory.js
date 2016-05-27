angular
  .module("app")
  .factory('Gyms', GymsFactory);

GymsFactory.$inject = ['Restangular', 'uuid2'];

function GymsFactory(Restangular, uuid2) {
  var self = this;

  var gymsFactory = {
    loadGyms: loadGyms,
    loadArchivedGyms: loadArchivedGyms,
    loadAvailableGyms: loadAvailableGyms,
    loadGym: loadGym,
    addGym: addGym,
    disableGym: disableGym
  };

  return gymsFactory;

  function loadGyms(onlyActiveDevices) {
    return Restangular.all('gyms').getList({
      onlyActiveDevices: onlyActiveDevices
    });
  }

  function loadArchivedGyms() {
    return Restangular.all('gyms').getList({
      enabled: false
    });
  }

  function loadAvailableGyms() {
    return Restangular.all('gyms/syncinfo').getList();
  }

  function loadGym(id) {
    return Restangular.one('gyms', id).get();
  }

  function addGym(gym) {
    gym.Id = uuid2.newuuid().toString();
    gym.Enabled = true;
    return Restangular.one('gyms', gym.Id).customPUT(gym);
  }

  // Note: to re-enable a gym, just set gym.Enabled = true and put()
  function disableGym(id, disableDevices) {
    if (disableDevices === undefined) {
      disableDevices = false;
    }
    return Restangular.one('gyms/disable', id).post('', '', {disableDevices: disableDevices});
  }
}
