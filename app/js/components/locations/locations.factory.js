angular
  .module("app")
  .factory('Locations', LocationsFactory);

LocationsFactory.$inject = ['LoggedInRestangular'];

function LocationsFactory(LoggedInRestangular) {
  var self = this;
  var locations = [];

  var locationsFactory = {
    loadLocations: loadLocations,
    getLocations: getLocations,
    loadLocation: loadLocation
  };

  return locationsFactory;

  function loadLocations() {
    return LoggedInRestangular.all('locations').getList().then(loadLocationsComplete);

    function loadLocationsComplete(data, status, headers, config) {
      self.locations = data;
      return self.locations;
    }
  }

  function getLocations() {
    return locations;
  }

  function loadLocation(id) {
    return LoggedInRestangular.one('locations', id).get().then(loadLocationComplete);

    function loadLocationComplete(data, status, headers, config) {
      return data;
    }
  }
}
