angular.module("app.countries", []).controller('CountriesController', function (Countries) {
  var self = this;
  this.title = "Countries";

  Countries.loadCountries().then(function (data) {
    self.countries = data;
  });

  this.update = function (country) {
    country.put();
  };
});
