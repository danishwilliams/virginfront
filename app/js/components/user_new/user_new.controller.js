angular.module("app.user_new", []).controller('UserNewController', function (Users, UserTypes, Gyms, Restangular, $state) {
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

  self.createUser = function () {
    // Validation
    if (!self.newUser.FirstName || !self.newUser.LastName || !self.newUser.Email) {
      return;
    }

    self.saving = true;
    spinnerService.show('newUser');

    // Add the clubs
    self.newUser.UserGyms = [];
    self.gyms.forEach(function (val) {
      if (val.selected) {
        self.newUser.UserGyms.push({
          Gym: val,
          GymId: val.Id
        });
      }
    });

    // Add the user types:
    // If the user is an admin: which have been chosen in the UI
    // If the user is a manager: if the "Is Pack Instructor" has been checked in the UI
    self.newUser.UserUserTypes = [];
    self.userTypes.forEach(function (val) {
      var userType = angular.copy(val);
      if (val.selected || (self.packInstructor && val.Name === 'Pack Instructor')) {
        userType.UserTypeId = val.Id;
        userType.Id = undefined; // so we can insert a new record
        userType.UserType = {
          Name: val.Name,
          PublicRole: val.PublicRole
        };
        self.newUser.UserUserTypes.push(userType);
      }
    });

    // Save the new user
    self.newUser.Username = self.newUser.Email;
    Users.createNewUser(self.newUser).then(function () {
      self.saving = false;
      spinnerService.hide('newUser');
      $state.go('users-admin');
    }, function (res) {
      self.saving = false;
      spinnerService.hide('newUser');
      if (res.data.Message === 'Email address already exists') {
        res.data.Message = 'EMAIL_EXISTS';
      }
      self.serverError = {
        error: true,
        message: res.data.Message
      };
    });
  };
});
