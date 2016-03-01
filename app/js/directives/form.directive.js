angular.module("app").directive("form", form);

function form() {
  return {
    restrict: 'E',
    require:  'form',
    link: function(scope, elem, attrs, formCtrl) {

      scope.$watch(function() {
        return formCtrl.$submitted;
      }, function(submitted) {
        scope.$broadcast('$submitted');
      });
    }
  };
}

