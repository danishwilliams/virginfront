angular.module("app.device_edit", []).controller('DeviceEditController', function ($state, $stateParams, Devices, spinnerService) {
  var self = this;
  self.id = $stateParams.id;
  self.state = $state.current.name; // device-edit or device-disable

  Devices.loadDevice(self.id).then(function (data) {
    self.device = data;
    self.snapshot = angular.copy(data);
    loadDevicesForGym();
  });

  function loadDevicesForGym() {
    // Load up the devices for this club
    Devices.loadDevicesForGym(self.device.Gym.Id, self.device.Id).then(function (data) {
      self.loaded = true;
      spinnerService.hide('device');
      self.gyms = data;
    });
  }

  self.disableDevice = function () {
    self.action = 'disable';
    self.device.Enabled = self.device.Primary = false;
    self.saving = true;
    spinnerService.show('saveDeviceSpinner');
    Devices.disableDevice(self.device.Id).then(function(data) {
      saveDevice(self.newPrimary);
    }, function(err) {
      self.saved = true;
      self.saving = false;

      spinnerService.hide('saveDeviceSpinner');

      self.alert = {
        type: 'warning',
        msg: 'DEVICE_DISABLE_FAILED'
      };

      // Either a generic error or a Music Provider error
      if (err.data.Message.startsWith('Error while cancelling device music provider account')) {
        msg = 'MUSIC_PROVIDER_CANCELLING_ERROR';
      }
    });
  };

  this.saveDevice = function () {
    self.action = 'edit';
    spinnerService.show('saveDeviceSpinner');
    self.saving = true;

    // Made this primary device a secondary: make the chosen secondary device a primary
    if (self.snapshot.Primary && !self.device.Primary && self.newPrimary) {
      console.log('Made this primary device a secondary: make the chosen secondary device a primary', self.newPrimary);
      saveDevice(self.newPrimary);
    }

    // Made this secondary device a primary: make the existing primary device a secondary
    else if (!self.snapshot.Primary && self.device.Primary && self.gyms.HasPrimary) {
      console.log('Made this secondary device a primary: make the existing primary device a secondary');
      var processed = false;
      self.gyms.data.forEach(function (val) {
        if (val.Primary) {
          val.Primary = false;
          val.route = "devices/";
          console.log('making this primary device a secondary!', val);
          val.put().then(function () {
            if (!processed) {
              processed = true;
              saveDevice();
            }
          }, function () {
            saveError();
          });
        }
      });
    }

    else {
      saveDevice();
    }
  };

  function saveDevice(newPrimary) {
    self.device.put().then(function () {
      if (newPrimary) {
        newPrimary.Primary = true;
        newPrimary.route = 'devices/';
        newPrimary.put().then(function () {
          saveComplete();
        }, function() {
          saveError();
        });
      } else {
        saveComplete();
      }
    }, function() {
      saveError();
    });
  }

  function saveComplete() {
    spinnerService.hide('saveDeviceSpinner');
    self.snapshot.Name = self.device.Name;
    self.snapshot.Primary = self.device.Primary;
    self.saved = true;
    self.saving = false;
    self.alert = {
      type: 'success',
      msg: 'DEVICE_SAVED'
    };
    if (self.action === 'disable') {
      alert.msg = 'DEVICE_DISABLE_SUCCESS';
    }
  }

  function saveError() {
    self.saved = true;
    self.saving = false;
    self.alert = {
      type: 'warning',
      msg: 'DEVICE_SAVE_ERROR'
    };
    if (self.action === 'disable') {
      alert.msg = 'DEVICE_DISABLE_FAILED';
    }
  }
});
