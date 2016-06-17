angular.module("app.gym_edit", []).controller('GymController', function ($stateParams, $state, Gyms, Locations, spinnerService, Alert) {
  var self = this;

  self.id = $stateParams.id;
  self.location = {};

  // We're editing a club
  if (self.id) {
    self.action = 'edit';
    Gyms.loadGym(self.id).then(function (data) {
      self.gym = data;
      self.location = self.gym.Location;
      self.snapshot = angular.copy(data);
      spinnerService.hide('gym');
    });
  } else {
    self.gym = {};
    self.action = 'add';
  }

  self.formSubmit = function () {
    self.alert = undefined;
    // Check if this location exists, or if it's a new city to be added
    if (self.location.Id) {
      // User chose an existing city
      //console.log('existing city!');
      self.gym.LocationId = self.location.Id;
      saveGym();
    } else {
      // This is a new city!
      //console.log('new city!');
      Locations.addCity(self.location.City).then(function (data) {
        self.gym.LocationId = data.Id;
        saveGym();
      }, function (e) {
        // show message: not able to save new city - please try again.
        self.cityError = true;
      });
    }
  };

  function saveGym() {
    if (self.action === 'add') {
      addGym();
    } else if (self.action === 'edit') {
      editGym();
    }
  }

  function addGym() {
    Gyms.addGym(self.gym).then(function () {
      //console.log('saved gym');
      self.action = 'added';
    }, function (e) {
      handleError(e);
    });
  }

  function editGym() {
    self.gym.put().then(function () {
      Alert.addAlert('success', 'GYM_SAVED');
      $state.go('gyms-admin');
    }, function (e) {
      handleError(e);
    });
  }

  function handleError(e) {
    // Gym name already exists
    console.log(e);
    if (e.data.Message === 'Gym name already exists') {
      self.gymNameExists = true;
    } else {
      self.alert = {
        type: 'warning',
        msg: 'GYMS_SAVE_ERROR'
      };
    }
  }

});
