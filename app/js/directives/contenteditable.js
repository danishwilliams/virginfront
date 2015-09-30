angular.module("app").directive("contenteditable", function () {
  return {
    restrict: "A",
    require: "ngModel",
    link: function (scope, element, attrs, ngModel) {

      function read() {
        ngModel.$setViewValue(element.html());
      }

      ngModel.$render = function () {
        element.html(ngModel.$viewValue || "");
      };

      element.bind("blur keyup change", function () {
        scope.$apply(read);
      });
    }
  };
});

/*
angular.module("app").directive('contenteditable', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
        // view -> model
        elm.bind('blur', function () {
          scope.$apply(function () {
            ctrl.$setViewValue(elm.html());
          });
        });

        // model -> view
        ctrl.render = function (value) {
          elm.html(value);
        };

        elm.bind('keydown', function (event) {
          console.log("keydown " + event.which);
          var esc = event.which === 27,
            el = event.target;

          if (esc) {
            console.log("esc");
            ctrl.$setViewValue(elm.html());
            el.blur();
            event.preventDefault();
          }

        });
    }
  };
});
*/
