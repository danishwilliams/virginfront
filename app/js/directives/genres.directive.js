// Shows a list of genres, autofilled by whatever the user's profile is, and sends a change event every time a new one
// is selected

// Using the new component method in Angular 1.5, to prepare for Angular 2 upgrade

angular.module("app").directive("genres", genres);

function genres() {
  var directive = {
    templateUrl: 'genres.directive.html',
    restrict: 'E',
    controller: genresController,
    controllerAs: 'gvm',
    scope: {
      ngModel: '='
    },
    require: 'ngModel',
    link: link
  };
  return directive;

  function link(scope, element, attrs, ngModel) {
    scope.changed = function () {
      // This triggers the ng-change on the directive so the parent controller can get the value
      // Making a copy because ngModel doesn't perform a deep watch on objects, it only looks for a change of identity
      // @see https://docs.angularjs.org/api/ng/type/ngModel.NgModelController
      ngModel.$setViewValue(angular.copy(scope.gvm.selectedGenre));
    };
  }

}

genresController.$inject = ['Genres', 'Storage'];

function genresController(Genres, Storage) {
  var self = this;

 // Load up all genres
  Genres.loadGenres().then(function (data) {
    // Add an 'All genre'
    self.genres = [{Id: 'All', Name: 'All'}].concat(data);

    // Auto-select the user's saved genre from the last search
    var genre = Storage.getItem('genre');
    if (genre) {
      self.genres.forEach(function(val) {
        if (val.Id === genre) {
          self.selectedGenre = val;
        }
      });
    }
  });

  self.changed = function () {
    // Save the genre selection for later
    Storage.setItem('genre', self.selectedGenre.Id);
  };
}
