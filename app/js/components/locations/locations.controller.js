angular.module("app.locations", []).controller('LocationsController', function (Locations, Restangular, uuid2) {
  var self = this;
  this.title = "Locations";

  Locations.loadLocations().then(function (data) {
    self.locations = data;
  });

  this.update = function (location) {
    location.put();
  };

  this.create = function () {
    Restangular.one("locations", self.newLocation.Id).customPUT(self.newLocation).then(function () {
      self.locations.push(self.newLocation);
      self.createBlankLocation();
    });
  };

  this.createBlankLocation = function () {
    self.newLocation = {
      Id: uuid2.newuuid().toString()
    };
  };

  self.createBlankLocation();
});