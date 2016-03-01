angular.module("app").directive('ngForm', function() {
  return {
    restrict: 'EA',
    require:  'form',
    link: function(scope, elem, attrs, formCtrl) {

      scope.$on('$submitted', function() {
        formCtrl.$setSubmitted();
      }); 
    }
  };
});