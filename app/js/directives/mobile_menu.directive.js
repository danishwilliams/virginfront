angular
  .module("app")
  .directive("mobileMenu", mobileMenu);

mobileMenu.$inject = ['$window'];

function mobileMenu($window) {
  var currentWidth = screen.width;
  var directive = {
    restrict: 'A',
    link: link
  };
  return directive;


  function link(scope, element, attrs) {
    sidebarVisible(element);

    angular.element($window).on('resize', function (e) {
      sidebarVisible(element);
    });
  }

  /**
   * If the screen has been resized and the viewport is now mobile, hide the sidebar.
   * If the screen is currently larger than mobile, show sidebar
   */
  function sidebarVisible(element) {
    // Check window width has actually changed and it's not just iOS triggering a resize event on scroll
    var width = 0;

    // Detect mobile/tablet device
    if (typeof window.orientation !== 'undefined') {
      width = screen.width;
    }
    else {
      width = angular.element($window)[0].innerWidth;
    }

    if (currentWidth !== width) {
      currentWidth = width;
      if (width < 641 ) {
        element.removeClass('move-right');
      }
    }
    if (width > 640 && !element.hasClass('move-right')) {
      // Show the sidebar on tablet and desktop
      element.addClass('move-right');
    }
  }
}
