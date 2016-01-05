angular
  .module("app")
  .factory('Countries', CountriesFactory);

CountriesFactory.$inject = ['LoggedInRestangular'];

function CountriesFactory(LoggedInRestangular) {
  var self = this;
  var countries = [];

  var countriesFactory = {
    loadCountries: loadCountries,
    getCountries: getCountries,
    loadCountry: loadCountry
  };

  return countriesFactory;

  function loadCountries() {
    return LoggedInRestangular.all('countries').getList().then(loadCountriesComplete);

    function loadCountriesComplete(data, status, headers, config) {
      self.countries = data;
      return self.countries;
    }
  }

  function getCountries() {
    return countries;
  }

  function loadCountry(id) {
    return LoggedInRestangular.one('countries', id).get().then(loadCountryComplete);

    function loadCountryComplete(data, status, headers, config) {
      return data;
    }
  }

}
