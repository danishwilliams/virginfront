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

          if (!processed) {
            processed = true;
            val.put().then(function () {
              provisionDevice();
            }, function () {
              self.saving = false;
              spinnerService.hide('deviceNewSpinner');
              self.alert = {
                type: 'warning',
                msg: 'DEVICE_PROVISION_NEW_ERROR'
              };
            });
          }

        }
      });
      if (!processed) {
        processed = true;
        console.log('no primary device to disable');
        provisionDevice();
      }
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
      self.alert = {
        type: 'success',
        msg: 'DEVICE_CODE_SUCCESS'
      };

      var code = data.ProvisionCode;

      // Put the provisioning code into an array so we can display each digit separately
      self.provisioningCode = [];
      for (var i = 0; i < code.length; i++) {
        self.provisioningCode.push(code.substring(i, i + 1));
      }
      self.disableDevice = false;
    }, function (err) {
      self.saving = false;
      self.error = true;
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
    self.isPrimary = false;
    self.devices = [];
    self.deviceName = '';
    self.form.$setPristine();
    self.form.$setUntouched();
  };
});
