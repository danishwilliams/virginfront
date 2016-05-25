angular
  .module("app")
  .directive("country", country);

function country() {
  var directive = {
    templateUrl: '../js/directives/country/country.directive.html',
    restrict: 'E',
    controller: countryController,
    controllerAs: 'vm',
    scope: {
      ngModel: '='
    },
    required: ['ngModel']
  };
  return directive;
}

countryController.$inject = ['Countries'];

function countryController(Countries) {
  var self = this;
  Countries.loadCountries().then(function (data) {
    self.countries = data;
  });
}