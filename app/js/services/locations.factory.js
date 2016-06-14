angular
  .module("app")
  .factory('Locations', LocationsFactory);

LocationsFactory.$inject = ['Restangular', 'uuid2'];

function LocationsFactory(Restangular, uuid2) {
  var self = this;
  var locations = [];

  var locationsFactory = {
    loadLocations: loadLocations,
    getLocations: getLocations,
    loadLocation: loadLocation,
    addCity: addCity
  };

  return locationsFactory;

  function loadLocations() {
    return Restangular.all('locations').getList().then(function(data) {
      self.locations = data;
      return self.locations;
    });
  }

  function getLocations() {
    return locations;
  }

  function loadLocation(id) {
    return Restangular.one('locations', id).get();
  }

  function addCity(city) {
    var location = {
      Id: uuid2.newuuid().toString(),
      City: city
    };
    return Restangular.one('locations', location.Id).customPUT(location);
  }
}
