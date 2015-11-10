angular
  .module("app")
  .directive("cities", cities);

function cities() {
  var directive = {
    templateUrl: 'cities.directive.html',
    restrict: 'E',
    controller: citiesController,
    controllerAs: 'vm',
    scope: {
      ngModel: '='
    },
    required: ['ngModel']
  };

  return directive;
}

citiesController.$inject = ['Locations', '$scope'];

function citiesController(Locations, $scope) {
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
      $scope.ngModel = selected.locationId;
    }
  };
}