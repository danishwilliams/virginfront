angular.module("app.user_new", []).controller('UserNewController', function (Users, UserTypes, Gyms, Restangular, $state, spinnerService) {
  var self = this;

  self.newUser = {
    UserUserTypes: []
  };

  UserTypes.loadUserTypes().then(function (data) {
    self.userTypes = data;
    // Select the Instructor role by default
    self.userTypes.forEach(function (val) {
      if (val.Name === 'Instructor') {
        val.selected = true;
        self.newUser.sendInviteEmail = true;
      }
    });
  });

  Gyms.loadGyms().then(function (data) {
    self.gyms = data;
  });

  // TODO: a new user either needs at least one Gym, or a City
  // If City, use that for Location. If no City and a Gym, use the Gym's location

  self.createUser = function () {
    // Validation
    if (!self.newUser.FirstName || !self.newUser.LastName || !self.newUser.Email) {
      return;
    }

    // Add the user types:
    // If the user is an admin: which have been chosen in the UI
    // If the user is a manager: if the "Is Pack Instructor" has been checked in the UI
    self.newUser.UserUserTypes = [];
    self.userTypes.forEach(function (val) {
      if (val.selected || (self.packInstructor && val.Name === 'Pack Instructor')) {
        val.UserTypeId = val.Id;
        val.UserType = {
          Name: val.Name,
          PublicRole: val.PublicRole
        };
        self.newUser.UserUserTypes.push(val);
      }
    });

    spinnerService.show('creatingUser');
    self.saving = true;

    // Save the new user
    self.newUser.Username = self.newUser.Email;
    Users.createNewUser(self.newUser).then(function () {
      spinnerService.hide('creatingUser');
      self.saving = false;
      $state.go('users-admin');
    }, function (res) {
      spinnerService.hide('creatingUser');
      self.saving = false;
      self.serverError = {
        error: true,
        message: res.data.Message
      };
    });
  };
});
