angular.module("app.genres", []).controller('GenresController', function ($state, Genres) {
  var self = this;
  this.title = "Genres";
  this.id = $state.id;

  // TODO: bug fix for "Controller loads twice" @see https://github.com/angular/router/issues/204
  if (!self.genres) {
	  Genres.loadGenres().then(function(data) {
	    self.genres = data;
	  });
	}
});
