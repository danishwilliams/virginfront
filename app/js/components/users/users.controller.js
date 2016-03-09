angular.module("app.users", []).controller('UsersController', function (Users, spinnerService) {
  var self = this;
  self.status = '';
  self.query = '';

  Users.loadUsers().then(function (data) {
    self.users = data;
    spinnerService.hide('users');

    // Counts of each kind of user
    self.numActive = 0;
    self.numTechnical = 0;
    self.numDisabled = 0;

    // Hide non-instructor user types
    self.users.forEach(function(user) {
      var counted = false;
      if (user.Enabled) {
        user.Archived = false;
      }
      else {
        self.numDisabled++;
        counted = true;
        user.Archived = true;
      }

      // Set the user type. Onee of Registered, Technical, Invited
      user.Type = 'Registered';
      user.UserUserTypes.forEach(function (type) {
        switch (user.State) {
          case 'invite_emailed':
          case 'invite_email_failed':
          case 'onboarding_password':
          case 'onboarding_genre':
          case 'onboarding_clubs':
            user.Type = 'Invited';
            if (!counted) {
              self.numActive++;
              counted = true;
            }
            break;
          case 'registered':
            user.Type = 'Registered';
            if (!counted) {
              self.numActive++;
              counted = true;
            }
        }
        switch (type.UserType.Name) {
          case 'Admin':
          case 'API User':
          case 'Device':
          case 'Import':
            if (!counted) {
              self.numTechnical++;
              counted = true;
            }
            user.Type = 'Technical';
        }
        if (!counted) {
          self.numTechnical++;
          user.Type = 'Technical'; // So that if any users show up there we know something has screwed up
        }
      });
    });
  });

  self.userFilter = function(user) {
    self.query = self.query.toLowerCase();
    if (user.FirstName && user.FirstName.toLowerCase().indexOf(self.query) > -1) {
      return user;
    }
    else if (user.LastName && user.LastName.toLowerCase().indexOf(self.query) > -1) {
      return user;
    }
    else if (user.Email && user.Email.toLowerCase().indexOf(self.query) > -1) {
      return user;
    }
  };

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
