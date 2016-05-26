angular.module("app.gyms", []).controller('GymsController', function (Gyms, spinnerService, Alert) {
  var self = this;
  self.alert = Alert.popAlert();

  Gyms.loadGyms().then(function(data) {
    self.gyms = data;
    spinnerService.hide('gyms');

    // Work out the number of active and archived gyms
    self.numActive = 0;
    self.numInactive = 0;
    data.forEach(function(val) {
      if (val.Enabled) {
        self.numActive++;
      }
      else {
        self.numInactive++;
      }
    });
  });
});
