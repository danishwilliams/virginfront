angular.module("app.gyms", []).controller('GymsController', function (Gyms) {
  var self = this;
  this.title = "Gyms";

  // TODO: bug fix for "Controller loads twice" @see https://github.com/angular/router/issues/204
  if (!self.gyms) {
	  Gyms.loadGyms().then(function(data) {
	    self.gyms = data;
	  });
	}

  this.update = function (gym) {
    gym.put();
  };
});
