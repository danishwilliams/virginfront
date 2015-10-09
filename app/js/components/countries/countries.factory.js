angular
  .module("app")
  .factory('Countries', CountriesFactory);

CountriesFactory.$inject = ['Restangular'];

function CountriesFactory(Restangular) {
  var self = this;
  var countries = [];

  var countriesFactory = {
    loadCountries: loadCountries,
    getCountries: getCountries,
    loadUser: loadUser
  };

  return countriesFactory;

  function loadCountries() {
    return Restangular.all('countries').getList().then(loadCountriesComplete);

    function loadCountriesComplete(data, status, headers, config) {
      self.countries = data;
      return self.countries;
    }
  }

  function getCountries() {
    return countries;
  }

  function loadUser(id) {
    return Restangular.one('countries', id).get().then(loadUserComplete);

    function loadUserComplete(data, status, headers, config) {
      return data;
    }
  }
}
