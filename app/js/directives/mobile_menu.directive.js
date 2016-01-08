angular
  .module("app")
  .directive("mobileMenu", mobileMenu);

mobileMenu.$inject = ['$window'];

function mobileMenu($window) {
  var directive = {
    restrict: 'A',
    link: link
  };
  return directive;

  function link(scope, element, attrs) {
    var $win = angular.element($window);
    addClass($window, element);

    // When resizing the screen, if the element is already fixed, re-calculate its width
    $win.on('resize', function (e) {
      addClass($win[0], element);
    });
  }

  function addClass(win, element) {
    if (win.innerWidth < 641 ) {
      element.removeClass('move-right');
    }
    else if (!element.hasClass('move-right')) {
      element.addClass('move-right');
    }
  }
}
