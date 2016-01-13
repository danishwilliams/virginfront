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
      ngModel.$setViewValue(angular.copy(scope.gvm.genres));
    };
  }

}

genresController.$inject = ['Users', 'Genres'];

function genresController(Users, Genres) {
  var self = this;

 // Load up all genres
  Genres.loadGenres().then(function (data) {
    self.genres = data;
    // Auto-select the user's genres
    data = Users.getCurrentUser();
      _.mapObject(self.genres, function (val, key) {
        if (key >= 0) {
          data.UserGenres.forEach(function (genre) {
            if (genre.GenreId === val.Id) {
              val.selected = true;
              return val;
            }
          });
        }
      });
  });
}
