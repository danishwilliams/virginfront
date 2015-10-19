angular.module("app.countries", []).controller('CountriesController', function (Countries) {
  var self = this;
  this.title = "Countries";

  // TODO: bug fix for "Controller loads twice" @see https://github.com/angular/router/issues/204
  if (!self.countries) {
	  Countries.loadCountries().then(function(data) {
	    self.countries = data;
	  });  	
  }

  this.update = function (country) {
    country.put();
  };
});
