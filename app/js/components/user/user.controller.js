angular.module("app.user", []).controller('UserController', function ($stateParams, UserTypes, Users, Genres, Gyms, spinnerService, $filter, Authorizer, $translate, Storage) {
  var self = this;
  this.id = $stateParams.id;

  if (!this.id) {
    this.viewingOwnUserProfile = true;
    this.id = Users.getCurrentUser().Id;
    self.langKey = Storage.getItem('language' + Users.getCurrentUser().Id);
  }

  if (this.id) {
    Users.loadUser(this.id).then(function (data) {
      self.user = data;
      self.employeeId = self.user.EmployeeId;
      self.telephone = self.user.Telephone;
      self.email = self.user.Email;
    });
  }

  this.saveContactDetails = function () {
    if (!self.email) {
      return;
    }
    self.error = {};
    self.user.EmployeeId = self.employeeId;
    self.user.Telephone = self.telephone;
    self.user.Email = self.email;
    // TODO: client side email address validation
    self.update(self.user, 'contact');
  };

  this.cancelContactDetails = function () {
    self.employeeId = self.user.EmployeeId;
    self.telephone = self.user.Telephone;
    self.email = self.user.Email;
    self.contactEdit = false;
  };

  // Load all userTypes
  this.loadUserTypes = function () {
    UserTypes.loadUserTypes().then(function (data) {
      self.userTypesEdit = true;
      self.userTypes = data;

      // Mark user's types as selected
      _.mapObject(self.userTypes, function (val, key) {
        if (key >= 0) {
          var item = _.find(self.user.UserUserTypes, function (item) {
            return item.UserType.Name === val.Name;
          });
          if (item) {
            val.selected = true;
          }
          return val;
        }
      });

      // Managers can only see certain user types
      if (Authorizer.canAccess('isManager', Users.getCurrentUser())) {
        self.userTypes.forEach(function (val) {
          if (val.Name === 'Pack Instructor' || val.Name === 'Manager') {
            val.show = true;
          } else {
            val.hide = true;
          }
        });
      }
    });
  };

  // Save userTypes
  this.saveUserTypes = function () {
    // We want all roles which are selected or not a public role
    var userUserTypes = angular.copy(self.user.UserUserTypes);
    self.user.UserUserTypes = [];

    // Find all non public user types which this user already belongs to
    userUserTypes.forEach(function (val) {
      if (val.UserType.PublicRole === false) {
        self.user.UserUserTypes.push(val);
      }
    });

    // Add the user types which have been chosen in the UI
    self.userTypes.forEach(function (val) {
      if (val.selected) {
        val.UserTypeId = val.Id;
        val.Id = undefined;
        val.UserType = {
          Name: val.Name,
          PublicRole: val.PublicRole
        };
        self.user.UserUserTypes.push(val);
      }
    });

    self.update(self.user, 'userTypes');
  };

  // Load all gyms
  this.loadGyms = function () {
    Gyms.loadGyms().then(function (data) {
      self.gymEdit = true;
      self.gyms = data;
      // Mark the user gyms which have been chosen
      _.mapObject(self.gyms, function (val, key) {
        if (key >= 0) {
          var item = _.find(self.user.UserGyms, function (item) {
            return item.Gym.Name === val.Name;
          });
          if (item) {
            val.selected = true;
          }
        }
        return val;
      });
    });
  };

  // Save gyms
  this.saveGyms = function () {
    // Replace the gyms in the user object for saving
    self.user.UserGyms = [];
    self.gyms.forEach(function (val) {
      if (val.selected) {
        self.user.UserGyms.push({
          Gym: val,
          GymId: val.Id
        });
      }
    });
    self.update(self.user, 'gyms');
  };

  // Load all genres
  this.loadGenres = function () {
    Genres.loadGenres().then(function (data) {
      self.genreEdit = true;
      self.genres = data;
      // Mark the user genres which have been chosen
      _.mapObject(self.genres, function (val, key) {
        if (key >= 0) {
          var item = _.find(self.user.UserGenres, function (item) {
            return item.Genre.Name === val.Name;
          });
          if (item) {
            val.selected = true;
          }
        }
        return val;
      });
    });
  };

  // Save genres
  this.saveGenres = function () {
    // Replace the genres in the userobject for saving
    self.user.UserGenres = [];
    self.genres.forEach(function (val) {
      if (val.selected) {
        self.user.UserGenres.push({
          Genre: val,
          GenreId: val.Id
        });
      }
    });
    self.update(self.user, 'genres');
  };

  // Save the user
  this.update = function (user, type) {
    self.messages = {};
    switch (type) {
      case 'contact':
        spinnerService.show('userContactSpinner');
        break;
      case 'userTypes':
        spinnerService.show('userTypesSpinner');
        break;
      case 'gyms':
        spinnerService.show('userGymsSpinner');
        break;
      case 'genres':
        spinnerService.show('userGenresSpinner');
        break;
    }
    user.put().then(function (data) {
      var message = '';
      switch (type) {
        case 'contact':
          self.contactEdit = false;
          message = 'CONTACTS_SAVED';
          spinnerService.hide('userContactSpinner');
          break;
        case 'userTypes':
          self.userTypesEdit = false;
          message = 'PERMISSIONS_SAVED';
          spinnerService.hide('userTypesSpinner');
          break;
        case 'gyms':
          self.gymEdit = false;
          message = 'CLUBS_SAVED';
          spinnerService.hide('userGymsSpinner');
          break;
        case 'genres':
          self.genreEdit = false;
          message = 'GENRES_SAVED';
          spinnerService.hide('userGenresSpinner');
          break;
      }
      self.messages = [{
        type: 'success',
        msg: message
      }];
    }, function (res) {
      spinnerService.hide('userContactSpinner');
      spinnerService.hide('userGenresSpinner');
      spinnerService.hide('userGymsSpinner');
      spinnerService.hide('userTypesSpinner');
      self.contactEdit = true;
      if (res.status === 500 && res.data.Message) {
        // Possible responses:
        // * Email address already exists
        self.error = {
          error: true,
          message: res.data.Message
        };
        if (res.data.Message === 'Email address already exists') {
          self.error = {
            error: false, // Workaround for showing errors at the top of the page too
            email: true,
            message: $filter('translate')('EMAIL_EXISTS')
          };
        }
      }
    });
  };

  self.changeLanguage = function (langKey) {
    Storage.setItem('language' + self.user.Id, langKey);
    $translate.use(langKey);
  };
});
