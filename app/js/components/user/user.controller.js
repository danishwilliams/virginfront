angular.module("app.user", []).controller('UserController', function ($stateParams, $location, $uiViewScroll, UserTypes, Users, Genres, Gyms, Playlists, spinnerService, $filter, Authorizer, $translate, Storage) {
  var self = this;
  this.id = $stateParams.id;

  if (!this.id) {
    this.viewingOwnUserProfile = true;
    this.id = Users.getCurrentUser().Id;
    self.langKey = Storage.getItem('language' + Users.getCurrentUser().Id);
  }

  Users.loadUser(this.id).then(function (data) {
    // Test the user's music provider account i.e. see if their username and password works
    if (data.UserMusicProvider) {
      Users.testUserMusicProviderAccount(self.id).then(function (data) {
        self.musicProviderAccount = data.Success;
        self.musicProviderAccountLoaded = true;
      });
    }

    // Scroll to the recent rides section
    // Yeah, this isn't the best place to do this, but I couldn't get similar logic working anywhere else: not in
    // $rootScope.$on('$stateChangeSuccess') in app.run() or in a directive. Urgh.
    var scrollTo = $location.search().scrollTo;
    if (scrollTo) {
      var el = angular.element(document.getElementById(scrollTo));
      $uiViewScroll(el);
    }

    spinnerService.hide('userProfileSpinner');
    self.user = data;
    self.employeeId = self.user.EmployeeId;
    self.telephone = self.user.Telephone;
    self.email = self.user.Email;
  });

  if (Authorizer.canAccess('users')) {
    // Load up the rides loaded to this gym
    Playlists.loadGymsPlaylistSyncInfoDetailed(self.id).then(function (data) {
      spinnerService.hide('userGyms');
      self.gyms = data;
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
        self.userContactSaving = true;
        break;
      case 'userTypes':
        self.userTypesSaving = true;
        break;
      case 'gyms':
        self.userGymsSaving = true;
        break;
      case 'genres':
        self.userGenresSaving = true;
        break;
    }
    user.put().then(function (data) {
      var message = '';
      switch (type) {
        case 'contact':
          self.contactEdit = false;
          message = 'CONTACTS_SAVED';
          self.userContactSaving = false;
          break;
        case 'userTypes':
          self.userTypesEdit = false;
          message = 'PERMISSIONS_SAVED';
          self.userTypesSaving = false;
          break;
        case 'gyms':
          self.gymEdit = false;
          message = 'CLUBS_SAVED';
          self.userGymsSaving = false;
          break;
        case 'genres':
          self.genreEdit = false;
          message = 'GENRES_SAVED';
          self.userGenresSaving = false;
          break;
      }
      self.messages = [{
        type: 'success',
        msg: message
      }];
    }, function (res) {
      self.userContactSaving = false;
      self.userTypesSaving = false;
      self.userGymsSaving = false;
      self.userGenresSaving = false;
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
            message: $filter('translate')('INSTRUCTOR_EXISTS')
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
