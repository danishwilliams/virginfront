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
    scope.selected = function (id) {
      ngModel.$setViewValue(id); // because ng-change isn't firing
    };
  }
}

citiesController.$inject = ['Locations', '$scope'];

function citiesController(Locations, $scope) {
  var locations = [];
  Locations.loadLocations().then(function(data) {
    locations = data;

    // Set the initial value, if there is one
    if ($scope.ngModel) {
      data.forEach(function(val) {
        if (val.Id === $scope.ngModel) {
          $scope.city = val.City;
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
        results.push({ label: city, value: city, locationId: locations[i].Id });
      }
    }

    return results;
  }

  this.autocomplete_options_location = {
    suggest: suggest_city,
    on_select: function(selected) {
      $scope.city = selected.value;
      $scope.selected(selected.locationId); // because ng-change isn't firing, because we're not using dot notation
    }
  };
}