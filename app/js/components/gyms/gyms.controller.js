angular.module("app.gyms", []).controller('GymsController', function (Gyms, spinnerService, Alert) {
  var self = this;
  self.alert = Alert.popAlert();

  Gyms.loadGyms().then(function(data) {
    self.gyms = data;
    spinnerService.hide('gyms');
  });

  Gyms.loadArchivedGyms().then(function(data) {
    self.archivedGyms = data;
  });
});
