angular
  .module("app")
  .directive("stickyHeader", stickyHeader);

stickyHeader.$inject = ['$window'];

function stickyHeader($window) {
  var directive = {
    restrict: 'A',
    link: link
  };
  return directive;

  function link(scope, element, attrs) {
    var $win = angular.element($window);
    var rect = element[0].getBoundingClientRect();
    var offsetTop = rect.top; // get element's offset top relative to document
    var width = rect.width + 2;

    $win.on('resize', function (e) {
      rect = element[0].getBoundingClientRect();
      width = rect.width + 2;
    });

    $win.on('scroll', function (e) {
      if ($win[0].scrollY >= offsetTop) {
        element.addClass('fixed');
        element.css({
          width: width + 'px'
        });
      } else {
        element.removeClass('fixed');
        element.css({
          width: '100%'
        });
      }
    });
  }
}
