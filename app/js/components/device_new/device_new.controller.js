angular.module("app.device_new", []).controller('DeviceNewController', function (Gyms, Devices, spinnerService) {
  var self = this;

  // Load all gyms
  Gyms.loadGyms().then(function (data) {
    self.gyms = data;
  });

  // Once a gym has been selected, load all devices for it
  self.gymSelected = function() {
    spinnerService.show('gymDevices');
    self.devices = {data: []};
    // Load up the devices for this club
    Devices.loadDevicesForGym(self.selectedGym.Id).then(function (data) {
      self.devicesLoaded = true;
      spinnerService.hide('gymDevices');
      self.devices = data;
    });
  };

  self.provisionNewDevice = function () {
    self.saving = true;
    spinnerService.show('deviceNewSpinner');
    self.disableDevice = false;
    if (self.isPrimary) {
      // Make the current primary device a secondary, then provision the new device
      var processed = false;
      self.devices.data.forEach(function (val) {
        if (val.Primary) {
          val.Primary = false;
          val.route = "devices/";
          console.log('making this primary device a secondary!', val);
          val.put().then(function () {
            if (!processed) {
              processed = true;
              provisionDevice();
            }
          }, function () {
            self.saving = false;
            spinnerService.hide('deviceNewSpinner');
            self.alert = {
              type: 'warning',
              msg: 'DEVICE_PROVISION_NEW_ERROR'
            };
          });
        }
      });
    }
    else {
      provisionDevice();
    }
  };

  function provisionDevice() {
    // post DeviceName, GymId, isPrimary
    Devices.provisionDevice(self.deviceName, self.selectedGym.Id, self.isPrimary).then(function (data) {
      self.saving = false;
      spinnerService.hide('deviceNewSpinner');
      var code = data.ProvisionCode;

      // Put the provisioning code into an array so we can display each digit separately
      self.provisioningCode = [];
      for (var i = 0; i < code.length; i++) {
        self.provisioningCode.push(code.substring(i, i + 1));
      }
      self.disableDevice = false;
    }, function (err) {
      self.saving = false;
      spinnerService.hide('deviceNewSpinner');
      self.alert = {
        type: 'warning',
        msg: 'DEVICE_PROVISION_NEW_ERROR'
      };
    });
  }

  self.provisionAnother = function () {
    self.provisioningCode = undefined;
    self.selectedGym = undefined;
    self.deviceName = '';
    self.form.$setPristine();
    self.form.$setUntouched();
  };
});
