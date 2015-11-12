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
    var width = rect.width;

    $win.on('scroll', function (e) {
      if ($win[0].scrollY >= offsetTop) {
        element.addClass('fixed');
        element.css({
          width: width + 'px'
        });
      } else {
        element.removeClass('fixed');
        element.css({
          width: 'inherit'
        });
      }
    });

    // When resizing the screen, if the element is already fixed, re-calculate its width
    $win.on('resize', function (e) {
      if (element.hasClass('fixed')) {
        var parent = element.parent();
        rect = parent[0].getBoundingClientRect();
        width = rect.width;
        element.css({
          width: width + 'px'
        });
      }
      else {
        rect = element[0].getBoundingClientRect();
        offsetTop = rect.top; // get element's offset top relative to document
        width = rect.width;
      }
    });
  }
}
