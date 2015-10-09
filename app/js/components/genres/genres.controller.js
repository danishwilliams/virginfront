angular.module("app.genres", []).controller('GenresController', function ($routeParams, Genres) {
  var self = this;
  this.title = "Genres";
  this.id = $routeParams.id;

  // TODO: bug fix for "Controller loads twice" @see https://github.com/angular/router/issues/204
  if (!self.genres) {
	  Genres.loadGenres().then(function(data) {
	    self.genres = data;
	  });
	}
});
