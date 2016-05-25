angular
  .module("app")
  .factory('Locations', LocationsFactory);

LocationsFactory.$inject = ['Restangular'];

function LocationsFactory(Restangular) {
  var self = this;
  var locations = [];

  var locationsFactory = {
    loadLocations: loadLocations,
    getLocations: getLocations,
    loadLocation: loadLocation
  };

  return locationsFactory;

  function loadLocations() {
    return Restangular.all('locations').getList().then(loadLocationsComplete);

    function loadLocationsComplete(data, status, headers, config) {
      self.locations = data;
      return self.locations;
    }
  }

  function getLocations() {
    return locations;
  }

  function loadLocation(id) {
    return Restangular.one('locations', id).get().then(loadLocationComplete);

    function loadLocationComplete(data, status, headers, config) {
      return data;
    }
  }
}
