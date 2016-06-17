angular
  .module("app")
  .directive("cities", cities);

function cities() {
  var directive = {
    link: link,
    templateUrl: '../js/directives/cities/cities.directive.html',
    restrict: 'E',
    controller: citiesController,
    controllerAs: 'vm',
    scope: {
      ngModel: '='
    },
    require: '?ngModel'
  };

  return directive;

  function link(scope, element, attrs, ngModel) {
    // This is only pushed up if something is selected
    scope.selected = function (selected) {
      ngModel.$setViewValue(selected); // because ng-change isn't firing
    };
  }
}

citiesController.$inject = ['Locations', '$scope'];

function citiesController(Locations, $scope) {
  var self = this;
  var locations = [];
  var currentSelection = {};

  // Load up all cities for this territory
  Locations.loadLocations().then(function (data) {
    locations = data;

    // Set the initial value, if there is one
    if ($scope.ngModel) {
      data.forEach(function (val) {
        if (val.Id === $scope.ngModel.Id) {
          self.city = val.City;
          currentSelection = {
            value: val.City,
            City: val.City
          };
        }
      });
    }
  });

  function suggest_city(term) {
    var q = term.toLowerCase().trim();
    var results = [];

    // Find first 10 cities that start with `term`.
    for (var i = 0; i < locations.length && results.length < 10; i++) {
      var city = locations[i].City;
      if (city.toLowerCase().indexOf(q) === 0) {
        results.push({
          label: city,
          value: city,
          City: city,
          Id: locations[i].Id
        });
      }
    }

    return results;
  }

  self.autocomplete_options_location = {
    suggest: suggest_city,
    on_select: function (selected) {
      currentSelection = selected;
      self.city = selected.value; // Show the City name on the text input
      $scope.selected(selected);
    }
  };

  // When the user doesn't select any autocomplete options
  self.cityChanged = function () {
    if (!currentSelection.value) {
      // The user has started typing, but hasn't selected anything yet. We still need to tell the parent about it.
      setASelectedCity();
    } else if (self.city.toLowerCase() === currentSelection.value.toLowerCase()) {
      // The special case of the user removing one character off the end of the city, and then replacing it
      setASelectedCity();
    } else if (self.city.toLowerCase() !== currentSelection.value.toLowerCase()) {
      // When choosing a suggested value from the dropdown
      // The stupid autocomplete_options_location fires and cancels the ng-change, so this cityChanged() function is never called.
      setASelectedCity();
    }

    function setASelectedCity() {
      // This is probably a new city...
      var selected = {
        City: self.city,
        value: self.city
      };

      // Although there's still a chance a user typed it in and didn't select it from the autocomplete options

      // So - first check this city doesn't exist - and it if does, return that instead
      locations.forEach(function (val) {
        if (val.City.toLowerCase() === self.city.toLowerCase()) {
          selected = {
            City: val.City,
            Id: val.Id
          };
        }
      });

      // This is a new city - one which doesn't exist in autocomplete options
      //currentSelection = selected;
      $scope.selected(selected);
    }
  };

}
