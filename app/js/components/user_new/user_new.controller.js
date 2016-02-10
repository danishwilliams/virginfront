angular.module("app.user_new", []).controller('UserNewController', function (Users, UserTypes, Gyms, uuid2, Restangular) {
  var self = this;

  self.newUser = {
    Id: uuid2.newuuid().toString()
  };

  UserTypes.loadUserTypes().then(function (data) {
    self.userTypes = data;
    // Select the Instructor role by default
    self.userTypes.forEach(function (val) {
      if (val.Name === 'Instructor') {
        val.selected = true;
      }
    });
  });

  Gyms.loadGyms().then(function (data) {
    self.gyms = data;
  });

  // TODO: a new user either needs at least one Gym, or a City
  // If City, use that for Location. If no City and a Gym, use the Gym's location

  self.createUser = function () {
    console.log(self.newUser);
    // Validation
    if (!self.newUser.FirstName || !self.newUser.LastName || !self.newUser.email) {
      return;
    }

    // Check if there is a location
    if (!self.hasLocation()) {
      return;
    }

    // TODO: save the new user
    self.newUser.Username = self.newUser.Email;
    Restangular.one("users", self.newUser.Id).customPUT(self.newUser).then(function () {
      $state.go('users-admin');
    });
  };

  self.hasLocation = function() {
    console.log('has location called');
    // If no City has been chosen, determine a location a Gym    
    var found = false;
    if (!self.newUser.LocationId) {
      self.gyms.forEach(function (val) {
        if (!found && val.selected) {
          found = true;
          self.newUser.LocationId = val.LocationId;
        }
      });
    }
    else {
      found = true;
    }
    // If no location, show some error messaging
    if (!found) {
      self.error = {
        locationError: true
      };
      console.log('no location found');
      return false;
    }
    else {
      self.error = {};
      return true;
    }
  };
});
