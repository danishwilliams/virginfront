angular.module("app.genres", []).controller('GenresController', function (Genres) {
  var self = this;
  this.title = "Genres";

  // TODO: bug fix for "Controller loads twice" @see https://github.com/angular/router/issues/204
  if (!self.genres) {
	  Genres.loadGenres().then(function(data) {
	    self.genres = data;
	  });
	}

  this.update = function (genre) {
    genre.put();
  };
});
