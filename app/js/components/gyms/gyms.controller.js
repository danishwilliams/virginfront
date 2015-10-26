angular.module("app.gyms", []).controller('GymsController', function (Gyms) {
  var self = this;
  this.title = "Gyms";

  Gyms.loadGyms().then(function(data) {
    self.gyms = data;
  });

  this.update = function (gym) {
    gym.put();
  };
});
