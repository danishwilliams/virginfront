angular.module("app.genres", []).controller('GenresController', function (Genres) {
  var self = this;
  this.title = "Genres";

  Genres.loadGenres().then(function(data) {
    self.genres = data;
  });

  this.update = function (genre) {
    genre.put();
  };
});
