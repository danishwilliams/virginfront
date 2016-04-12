angular.module("app.device_new", []).controller('DeviceNewController', function (Gyms, Devices, $q) {
  var self = this;
  self.step = 0;

  // Load all gyms
  Gyms.loadGyms().then(function (data) {
    self.gyms = data;
  });

  self.provisionNewDevice = function () {
    if (self.form.$invalid) {
      return;
    }
    self.saving = true;
    self.disableDevice = false;
    provisionDevice();
  };

  self.disableActiveDeviceAndProvisionNewDevice = function () {
    self.saving = true;
    disableAllDevices();
  };

  function disableAllDevices() {
    var defer = $q.defer();
    var promises = [];

    self.gymDevicesToBeDeleted.forEach(function (device) {
      promises.push(Devices.disableDevice(device.Id));
    });

    $q.all(promises).then(function () {
      provisionDevice();
    });

    return defer.promise;
  }

  function provisionDevice() {
    // post DeviceName, GymId
    Devices.provisionDevice(self.deviceName, self.selectedGym.Id).then(function (data) {
      self.saving = false;
      self.code = data.ProvisionCode;

      // Put the provisioning code into an array so we can display each digit separately
      self.provisioningCode = [];
      for (var i = 0; i < self.code.length; i++) {
        self.provisioningCode.push(self.code.substring(i, i + 1));
      }
      self.disableDevice = false;
      self.step = 1;
    }, function (err) {
      console.log(err);
      self.saving = false;
      if (err.status === 500) {
        self.maxDevices = err.data.MaxDevices;
        self.gymDevicesToBeDeleted = err.data.GymDevices;
        self.step = 2;
      }
    });
  }

  self.provisionAnother = function () {
    self.step = 0;
    self.form.$setPristine();
    self.selectedGym = undefined;
    self.deviceName = '';
  };
});
