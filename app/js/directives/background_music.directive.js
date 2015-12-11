angular
  .module("app")
  .directive("backgroundMusic", backgroundMusic);

function backgroundMusic() {
  var directive = {
    templateUrl: 'background_music.directive.html',
    restrict: 'E',
    scope: {
      ngModel: '='
    },
    require: 'ngModel',
  };
  return directive;
}
