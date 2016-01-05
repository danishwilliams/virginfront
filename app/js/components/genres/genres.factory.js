angular
  .module("app")
  .factory('Genres', GenresFactory);

GenresFactory.$inject = ['LoggedInRestangular'];

function GenresFactory(LoggedInRestangular) {
  var self = this;
  var genres = [];

  var genresFactory = {
    loadGenres: loadGenres,
    getGenres: getGenres,
    loadGenre: loadGenre
  };

  return genresFactory;

  function loadGenres() {
    return LoggedInRestangular.all('genres').getList().then(loadGenresComplete);

    function loadGenresComplete(data, status, headers, config) {
      self.genres = data;
      return self.genres;
    }
  }

  function getGenres() {
    return genres;
  }

  function loadGenre(id) {
    return LoggedInRestangular.one('genres', id).get().then(loadGenreComplete);

    function loadGenreComplete(data, status, headers, config) {
      return data;
    }
  }
}
