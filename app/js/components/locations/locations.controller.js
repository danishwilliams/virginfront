angular.module("app.locations", []).controller('LocationsController', function ($routeParams, Locations) {
  var self = this;
  this.title = "Locations";
  this.id = $routeParams.id;

  // TODO: bug fix for "Controller loads twice" @see https://github.com/angular/router/issues/204
  if (!self.locations) {
	  Locations.loadLocations().then(function(data) {
	    self.locations = data;
	  });  	
  }
});
