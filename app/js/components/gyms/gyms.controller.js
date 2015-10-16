angular.module("app.gyms", []).controller('GymsController', function ($stateParams, Gyms) {
  var self = this;
  this.title = "Gyms";
  this.id = $stateParams.id;

  // TODO: bug fix for "Controller loads twice" @see https://github.com/angular/router/issues/204
  if (!self.gyms) {
	  Gyms.loadGyms().then(function(data) {
	    self.gyms = data;
	  });
	}
});
