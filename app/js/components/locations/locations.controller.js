angular.module("app.locations", []).controller('LocationsController', function (Locations) {
  var self = this;
  this.title = "Locations";

  Locations.loadLocations().then(function (data) {
    self.locations = data;
  });

  this.update = function (location) {
    location.put();
  };
});
