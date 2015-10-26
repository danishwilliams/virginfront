angular.module("app.user", []).controller('UserController', function($stateParams, Users, Genres) {
  var self = this;
  this.title = "User profile";
  this.id = $stateParams.id;

  if (this.id) {
    Users.loadUser(this.id).then(function(data) {
      self.user = data;
    });
  }

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
        case 'genres':
          self.genreEdit = false;
          break;
      }
    });
  };
});
