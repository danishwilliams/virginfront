angular.module("app.users", []).controller('UsersController', function (Users, spinnerService) {
  var self = this;
  self.status = '';

  Users.loadUsers().then(function (data) {
    self.users = data;
    spinnerService.hide('users');

    // Hide non-instructor user types
    self.users.forEach(function(user) {
      if (user.Enabled) {
        user.Archived = false;
      }
      else {
        user.Archived = true;
      }

      // Set the user type. Onee of Registered, Technical, Invited
      user.Type = 'Registered';
      user.UserUserTypes.forEach(function (type) {
        user.Type = 'Technical'; // So that if any users show up there we know something has screwed up
        switch (type.UserType.Name) {
          case 'Admin':
          case 'API User':
          case 'Device':
          case 'Import':
            user.Type = 'Technical';
        }
        switch (user.State) {
          case 'invite_emailed':
          case 'invite_email_failed':
          case 'onboarding_password':
          case 'onboarding_genre':
          case 'onboarding_clubs':
            user.Type = 'Invited';
            break;
          case 'registered':
            user.Type = 'Registered';
        }
      });
    });
  });

  self.filterInstructors = function(user) {
    if (self.status.length > 0) {
      return user.Type === self.status;
    }
    return true;
  };

  self.update = function (user) {
    user.put();
  };

});
