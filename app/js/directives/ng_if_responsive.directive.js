/**
 * Basically a clone of ngIf which adds/removes an element from the DOM based on
 * the width of the viewport
 */

angular
  .module("app")
  .directive("ngIfResponsive", ngIfResponsive);

ngIfResponsive.$inject = ['$animate', '$window'];

function ngIfResponsive($animate, $window) {
  var directive = {
    multiElement: true,
    transclude: 'element',
    priority: 600,
    terminal: true,
    restrict: 'A',
    $$tlb: true,
    link: link
  };
  return directive;

  function link($scope, $element, $attr, ctrl, $transclude) {
    var block, childScope, previousElements;

    angular.element($window).on('resize', function (e) {
      main();      
    });

    $scope.$watch($attr.ngIfResponsive, function () {
      main();
    });

    function main() {
      value = $attr.ngIfResponsive;

      if (value) {
        if (!childScope && canView(value)) {
          $transclude(function (clone, newScope) {
            childScope = newScope;
            clone[clone.length++] = document.createComment(' end ngIfResponsive: ' + $attr.ngIfResponsive + ' ');
            // Note: We only need the first/last node of the cloned nodes.
            // However, we need to keep the reference to the jqlite wrapper as it might be changed later
            // by a directive with templateUrl when its template arrives.
            block = {
              clone: clone
            };
            $animate.enter(clone, $element.parent(), $element);
          });
        }
      } else {
        if (previousElements) {
          previousElements.remove();
          previousElements = null;
        }
        if (childScope) {
          childScope.$destroy();
          childScope = null;
        }
        if (block) {
          previousElements = getBlockNodes(block.clone);
          $animate.leave(previousElements).then(function () {
            previousElements = null;
          });
          block = null;
        }
      }
    }
  }

  function canView(value) {
    var width = 0;

    // Calculating width is hard because window.innerWidth is doubled on iOS thanks to retina.
    // The solution is to use screen.width on iOS (and any mobile browser)

    //alert('innerWidth: ' + $win[0].innerWidth + ' screen.width: ' + screen.width);
    // iOS simulator: 980, 375
    // Chrome iPhone 6 emulator: 375, 375
    // Chrome desktop external monitor: 1015, 1920
    // Chrome desktop on retina: 1317, 1680

    //alert(window.devicePixelRatio);
    // iOS simulator: 2
    // Chrome desktop: 1 on external monitor; 2 on retina display

    if (typeof window.orientation !== 'undefined') {
      width = screen.width;
    }
    else {
      width = angular.element($window)[0].innerWidth;
    }

    switch (value) {
      case 'mobile':
        if (width < 641) {
          return true;
        }
        break;
      case 'tablet-down':
        if (width < 1024) {
          return true;
        }
        break;
      case 'desktop':
        if (width > 1023) {
          return true;
        }
        break;
    }
    return false;
  }
}
