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
    var $win = angular.element($window);

    $win.on('resize', function (e) {
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
    var $win = angular.element($window);

    switch (value) {
      case 'mobile':
        if ($win[0].innerWidth < 641) {
          return true;
        }
        break;
      case 'tablet-down':
        if ($win[0].innerWidth < 1024) {
          return true;
        }
        break;
      case 'desktop':
        if ($win[0].innerWidth > 1023) {
          return true;
        }
        break;
    }
    return false;
  }
}
