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

    self.users.forEach(function(user) {
      if (!user.Enabled) {
        self.numDisabled++;
      }
      else {
        switch (user.Type) {
          case 'Invited':
          case 'Registered':
            self.numActive++;
            break;
          case 'Technical':
            self.numTechnical++;
            break;
          default:
            self.numTechnical++;
        }
      }
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
    else if (self.query.indexOf(' ') > -1) {
      var firstName = self.query.substring(0, self.query.indexOf(' '));
      var lastName = self.query.substring(self.query.indexOf(' '));
      if (user.FirstName && user.FirstName.toLowerCase().indexOf(firstName) > -1) {
        return user;
      }
      else if (user.LastName && user.LastName.toLowerCase().indexOf(lastName) > -1) {
        return user;
      }
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
