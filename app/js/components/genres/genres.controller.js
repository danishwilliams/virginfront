angular.module("app.genres", []).controller('GenresController', function (Genres) {
  var self = this;

  Genres.loadGenres().then(function(data) {
    self.genres = data;
  });

  this.update = function (genre) {
    genre.put();
  };
});
