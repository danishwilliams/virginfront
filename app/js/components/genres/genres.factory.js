angular
  .module("app")
  .factory('Genres', GenresFactory);

GenresFactory.$inject = ['Restangular'];

function GenresFactory(Restangular) {
  var self = this;
  var genres = [];

  var genresFactory = {
    loadGenres: loadGenres,
    getGenres: getGenres,
    loadUser: loadUser
  };

  return genresFactory;

  function loadGenres() {
    return Restangular.all('genres').getList().then(loadGenresComplete);

    function loadGenresComplete(data, status, headers, config) {
      self.genres = data;
      return self.genres;
    }
  }

  function getGenres() {
    return genres;
  }

  function loadUser(id) {
    return Restangular.one('genres', id).get().then(loadUserComplete);

    function loadUserComplete(data, status, headers, config) {
      return data;
    }
  }
}
