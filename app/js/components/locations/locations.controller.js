angular.module("app.locations", []).controller('LocationsController', function (Locations) {
  var self = this;
  this.title = "Locations";

  // TODO: bug fix for "Controller loads twice" @see https://github.com/angular/router/issues/204
  if (!self.locations) {
	  Locations.loadLocations().then(function(data) {
	    self.locations = data;
	  });  	
  }

  this.update = function (location) {
    location.put();
  };
});
