angular
  .module("app")
  .directive("stickyHeader", stickyHeader);

stickyHeader.$inject = ['$window', '$compile'];

function stickyHeader($window, $compile) {
  var directive = {
    restrict: 'A',
    link: link
  };
  return directive;

  function link(scope, element, attrs) {
    var $win = angular.element($window);
    var rect = {};
    var offsetTop = 0; // get element's offset top relative to document
    var width = 0;
    var node = {};

    angular.element(document).ready(function () {
      rect = element[0].getBoundingClientRect();
      offsetTop = rect.top; // get element's offset top relative to document
      width = rect.width;
      height = rect.height;

      // The placeholder element which mimicks the height of the actual element
      node = document.createElement('div');
      node.style.height = height + 'px';
    });

    $win.on('scroll', function (e) {
      if ($win[0].scrollY >= offsetTop) {
        if (element.hasClass('fixed')) {
          return;
        }
        element.addClass('fixed');
        element.css({
          width: width + 'px',
        });
        element[0].parentNode.firstElementChild.appendChild(node, this.firstElementChild);
      } else {
        if (!element.hasClass('fixed')) {
          return;
        }
        element.removeClass('fixed');
        element[0].parentNode.firstElementChild.removeChild(node, this.firstElementChild);
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
