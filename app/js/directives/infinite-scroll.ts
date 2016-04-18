// Note: This is a typescript file compiled to javascript. You should probably be editing the .ts file not the .js one

/**
 * Accomplishes infinite scrolling
 *
 * Normal Usage:
 *   Window scrolling. Add the following attribute to the element which has ng-repeat on it:
 *   - infinite-scroll="function-to-call()"
 *
 * Usage within a modal:
 *   Can't. Because the modal has a fixed position and so we can't listen to window scrolling.
 *   So here's how to do it.
 *   - Wrap the element which is the target of the infinite scrolling (probably the element with an ng-repeat on it)
 *     in a div and give it an id (e.g. 'tracks').
 *   - Add the following 2 attributes to the top modal element (i.e. the element on which scrolling actually takes place):
 *     infinite-scroll="function-to-call()" data-infinite-scroll-within-modal-repeater-element="tracks"
 */
angular.module('app').directive('infiniteScroll', ['$window',
  ($window) => {
    return {
      restrict: 'A',
      link: ($scope, element, attrs: any) => {
        var el = element[0];

        // We're scrolling within a modal
        if (attrs.infiniteScrollWithinModalRepeaterElement) {
        // Find the DOM element containing the ng-repeat (which is within a modal)

          angular.element(el).on('scroll', <any>_.throttle(() => {
            var contentElement = document.getElementById(attrs.infiniteScrollWithinModalRepeaterElement);
            contentElement = angular.element(contentElement);

            // The bottom of the bounding box of the ng-repeat element
            var elementBottom = contentElement[0].getBoundingClientRect().bottom;

            // The height of the element which the ng-repeat is housed within (and which has the infinite-scroll attribute on it)
            var containingElementHeight = angular.element(el)[0].getBoundingClientRect().height;

            // When the element comes into view, load more!
            if (elementBottom - containingElementHeight - 100 < 0) {
              $scope.$apply(attrs.infiniteScroll);
            }
          }, 500));
        }
        else {
          // The above code is unnecessary if all we're doing is doing an infinite scroll on a normal page
          angular.element($window).on('scroll', <any>_.throttle(() => {
            // When the element comes into view, load more!
            if (el.getBoundingClientRect().bottom - 100 < 0) {
              $scope.$apply(attrs.infiniteScroll);
            }
          }, 500));
        }
      }
    };
  }
]);
