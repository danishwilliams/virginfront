/**
 * This directive sets the position of an element to be fixed, but also keeps it in the desired position on the page.
 * (Because once an element is 'fixed' it defaults to left and top = 0, which takes it out of the desired position).
 */
angular
  .module("app")
  .directive("fixedPosition", fixedPosition);

fixedPosition.$inject = ['$window'];

function fixedPosition($window) {
  var directive = {
    restrict: 'A',
    link: link
  };
  return directive;

  function link(scope, element, attrs) {
    var $win = angular.element($window);
    var rect = element[0].getBoundingClientRect();

    element[0].style.position = 'fixed';
    element[0].style.width = rect.width + 'px';
    element[0].style.left = rect.left + 'px';

    // We want to spoof the height of the element in the document by adding a placeholder element
    // But this didn't work. Keeping the code around in case this needs to be returned to
    //var node = document.createElement('div');
    //node.style.height = rect.height + 'px';
    //element[0].parentNode.firstElementChild.appendChild(node, this.firstElementChild);

    /*
    // This piece didn't work either. There's no easy way to calculate the width again: the idea is to
    // insert a dummy element in, which will resize correctly as the screen is resized, and grab the
    // new dimensions from that element

    // When resizing the screen, if the element is already fixed, re-calculate its width and left position
    $win.on('resize', _.throttle(function (e) {
      //console.log(element);
      // This works for the track search header
      var parent = element.parent();
      rect = parent[0].getBoundingClientRect();
      if (attrs.fixedPositionRecalculateWidthOnResize) {
        //element[0].style.width = rect.width + 'px';
      }
      element[0].style.left = rect.left + 'px';
    }, 200));
    */
  }
}
