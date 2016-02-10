angular.module("app.gyms", []).controller('GymsController', function (Gyms) {
  var self = this;

  Gyms.loadGyms().then(function(data) {
    self.gyms = data;
  });

  this.update = function (gym) {
    gym.put();
  };
});
