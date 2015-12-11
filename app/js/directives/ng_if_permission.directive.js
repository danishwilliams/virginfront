angular
  .module("app")
  .directive("ngIfPermission", ngIfPermission);

ngIfPermission.$inject = ['$animate', 'Authorizer'];

function ngIfPermission($animate, Authorizer) {
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
    $scope.$watch($attr.ngIfPermission, function () {
      value = $attr.ngIfPermission;

      if (value) {
        if (!childScope && Authorizer.canAccess(value)) {
          $transclude(function (clone, newScope) {
            childScope = newScope;
            clone[clone.length++] = document.createComment(' end ngIfPermission: ' + $attr.ngIfPermission + ' ');
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
    });
  }
}
