/*!
 * angular-vertilize 1.0.0
 * Christopher Collins
 * https://github.com/Sixthdim/angular-vertilize.git
 * License: MIT
 *
 * Adapted by Roger Saner. Removed the dependency on jquery and using underscore to slow down the speed
 * at which we're watching elements, since they may be waiting for API calls to complete.
 */
(function () {
  "use strict";

  var module = angular.module('angular.vertilize', []);

  // Vertilize Container
  module.directive('vertilizeContainer', [
    function () {
      return {
        restrict: 'EA',
        controller: [
          '$scope', '$window',
          function ($scope, $window) {
            // Alias this
            var _this = this;

            // Array of children heights
            _this.childrenHeights = [];

            // API: Allocate child, return index for tracking.
            _this.allocateMe = function () {
              _this.childrenHeights.push(0);
              return (_this.childrenHeights.length - 1);
            };

            // API: Update a child's height
            _this.updateMyHeight = function (index, height) {
              _this.heightAdded = true;
              _this.childrenHeights[index] = height;
            };

            // API: Get tallest height
            _this.getTallestHeight = function () {
              var height = 0;
              for (var i = 0; i < _this.childrenHeights.length; i = i + 1) {
                height = Math.max(height, _this.childrenHeights[i]);
              }
              return height;
            };

            // Add window resize to digest cycle
            angular.element($window).bind('resize', function () {
              return $scope.$apply();
            });
          }
        ]
      };
    }
  ]);

  // Vertilize Item
  module.directive('vertilize', [
    function () {
      return {
        restrict: 'EA',
        require: '^vertilizeContainer',
        link: function (scope, element, attrs, parent) {
          // My index allocation
          var myIndex = parent.allocateMe();

          // Get my real height by cloning so my height is not affected.
          var getMyRealHeight = function () {
            return element[0].offsetHeight;
          };

          // Watch my height
          scope.$watch(getMyRealHeight, _.throttle(function (e) {
            parent.updateMyHeight(myIndex, element[0].offsetHeight);
          }, 1000));

          // Watch for tallest height change
          scope.$watch(parent.getTallestHeight, function (tallestHeight) {
            if (tallestHeight && element[0].getBoundingClientRect().height < tallestHeight) {
              element.css({'height': tallestHeight + 'px'});
            }
          });
        }
      };
    }
  ]);

}());
