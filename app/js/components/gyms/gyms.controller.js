angular.module("app.gyms", []).controller('GymsController', function (Gyms) {
  var self = this;

  Gyms.loadGyms(true).then(function(data) {
    self.gyms = data;
  });

  Gyms.loadGyms(false).then(function(data) {
    self.gymsNoActiveDevices = data;
  });

  this.update = function (gym) {
    gym.put();
  };
});
