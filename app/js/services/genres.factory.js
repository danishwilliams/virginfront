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
    loadGenre: loadGenre
  };

  return genresFactory;

  function loadGenres() {
    return Restangular.all('genres').getList().then(function(data) {
      self.genres = data;
      return self.genres;
    });
  }

  function getGenres() {
    return genres;
  }

  function loadGenre(id) {
    return Restangular.one('genres', id).get();
  }
}
