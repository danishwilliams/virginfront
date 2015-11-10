angular.module("app.users", []).controller('UsersController', function ($stateParams, Users, uuid2, Restangular, Locations) {
  var self = this;
  this.title = "Users";
  this.id = $stateParams.id;

  var locations = [];
  Locations.loadLocations().then(function(data) {
    locations = data;
  });

  function suggest_city(term) {
    var q = term.toLowerCase().trim();
    var results = [];

    // Find first 10 cities that start with `term`.
    for (var i = 0; i < locations.length && results.length < 10; i++) {
      var city = locations[i].City;
      if (city.toLowerCase().indexOf(q) === 0) {
        results.push({ label: city, value: city, locationId: locations[i].Id });
      }
    }

    return results;
  }

  this.autocomplete_options_location = {
    suggest: suggest_city,
    on_select: function(selected) {
      self.newUser.LocationId = selected.locationId;
    }
  };

  Users.loadUsers().then(function (data) {
    self.users = data;
  });

  this.update = function (user) {
    user.put();
  };

  this.create = function() {
    self.newUser.Username = self.newUser.Email;
    Restangular.one("users", self.newUser.Id).customPUT(self.newUser).then(function() {
      self.users.push(self.newUser);
      self.createBlankUser();
    });
  };

  this.createBlankUser = function() {
    self.newUser = {
      Id: uuid2.newuuid().toString()
    };
  };

  self.createBlankUser();
});
