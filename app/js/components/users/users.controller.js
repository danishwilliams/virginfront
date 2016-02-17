angular.module("app.users", []).controller('UsersController', function (Users, spinnerService) {
  var self = this;

  Users.loadUsers().then(function (data) {
    self.users = data;
    spinnerService.hide('users');

    // Hide non-instructor user types
    self.users.forEach(function(user) {
      // If at least one user is not enabled, show this in the view
      if (!user.Enabled) {
        self.hasArchived = true;
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

  self.update = function (user) {
    user.put();
  };

  self.sendInvite = function (id) {
    Users.sendInvite(id).then(function() {});
  };
});
