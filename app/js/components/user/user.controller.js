angular.module("app.user", []).controller('UserController', function($stateParams, UserTypes, Users, Genres, Gyms) {
  var self = this;
  this.title = "User profile";
  this.id = $stateParams.id;

  if (this.id) {
    Users.loadUser(this.id).then(function(data) {
      self.user = data;
    });
  }

  // Load all userTypes
  this.loadUserTypes = function() {
    UserTypes.loadUserTypes().then(function(data) {
      self.userTypesEdit = true;
      self.userTypes = data;

      // Mark the user gyms which have been chosen
      _.mapObject(self.userTypes, function(val, key) {
        if (key >= 0) {
          if (self.user.UserType.Id === val.Id) {
            val.selected = true;
          }
        }
        return val;
      });
    });
  };

  // Save userTypes
  this.saveUserTypes = function() {
    // Find the right user type
    self.user.UserType = _.find(self.userTypes, function(item) {
      return item.Id === self.user.UserTypeId;
    });
    self.update(self.user, 'userTypes');
  };

  // Load all gyms
  this.loadGyms = function() {
    Gyms.loadGyms().then(function(data) {
      self.gymEdit = true;
      self.gyms = data;
      // Mark the user gyms which have been chosen
      _.mapObject(self.gyms, function(val, key) {
        if (key >= 0) {
          var item = _.find(self.user.UserGyms, function(item) {
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
  this.saveGyms = function() {
    // Replace the gyms in the userobject for saving
    self.user.UserGyms = [];
    self.gyms.forEach(function(val) {
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
  this.loadGenres = function() {
    Genres.loadGenres().then(function(data) {
      self.genreEdit = true;
      self.genres = data;
      // Mark the user genres which have been chosen
      _.mapObject(self.genres, function(val, key) {
        if (key >= 0) {
          var item = _.find(self.user.UserGenres, function(item) {
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
  this.saveGenres = function() {
    // Replace the genres in the userobject for saving
    self.user.UserGenres = [];
    self.genres.forEach(function(val) {
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
  this.update = function(user, type) {
    user.put().then(function(data) {
      switch (type) {
        case 'userTypes':
          self.userTypesEdit = false;
          break;
        case 'gyms':
          self.gymEdit = false;
          break;
        case 'genres':
          self.genreEdit = false;
          break;
      }
    });
  };
});
