angular.module("app.locations", []).controller('LocationsController', function ($stateParams, Locations) {
  var self = this;
  this.title = "Locations";
  this.id = $stateParams.id;

  // TODO: bug fix for "Controller loads twice" @see https://github.com/angular/router/issues/204
  if (!self.locations) {
	  Locations.loadLocations().then(function(data) {
	    self.locations = data;
	  });  	
  }
});
