angular.module("app").directive("circleProgress", function () {
  return {
    restrict: "E",
    templateUrl: '../js/directives/circle_progress/circle_progress.directive.html',
    link: link,
    scope: {
      percent: '@'
    }
  };

  function link(scope, element, attrs) {
    scope.radius = 25;
    var circumference = 2 * scope.radius * Math.PI;
    scope.stroke_dashoffset = '-' + (scope.percent * circumference/ 100);
    scope.stroke_dasharray = circumference;
  }
});
