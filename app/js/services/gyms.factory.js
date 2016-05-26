angular
  .module("app")
  .factory('Gyms', GymsFactory);

GymsFactory.$inject = ['Restangular', 'uuid2'];

function GymsFactory(Restangular, uuid2) {
  var self = this;
  var gymsAll = [];

  var gymsFactory = {
    loadGyms: loadGyms,
    loadAllGyms: loadAllGyms,
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

  function addGym(gym) {
    gym.Id = uuid2.newuuid().toString();
    gym.Enabled = true;
    return Restangular.one('gyms', gym.Id).customPUT(gym).then(function (data) {
      return data;
    });
  }

  // Note: to re-enable a gym, just set gym.Enabled = true and put()
  function disableGym(id) {
    return Restangular.one('gyms/disable', id).post().then(disableGymComplete);

    function disableGymComplete(data, status, headers, config) {
      return data;
    }
  }
}
