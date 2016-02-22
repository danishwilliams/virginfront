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
    var scrolled = false;

    $win.on('scroll', function (e) {
      if (!scrolled) {
        // Doing the position calculation here because another directive is loaded before this one,
        // and it's not rendered at the point we do a document.noready so the value returned by .top
        // exludes the <playlist-workflow> height. *sigh*
        rect = element[0].getBoundingClientRect();
        offsetTop = rect.top; // get element's offset top relative to document
        width = rect.width;
        height = rect.height;

        // Create the placeholder height node
        node = document.createElement('div');
        node.style.height = height + 'px';
        scrolled = true;
      }

      if ($win[0].pageYOffset >= offsetTop) {
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
