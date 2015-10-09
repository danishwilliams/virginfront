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
    loadUser: loadUser
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

  function loadUser(id) {
    return Restangular.one('gyms', id).get().then(loadUserComplete);

    function loadUserComplete(data, status, headers, config) {
      return data;
    }
  }
}
