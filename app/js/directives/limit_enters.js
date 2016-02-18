// @see http://codepen.io/TheLarkInn/post/angularjs-directive-labs-allowpattern-directive-more-fun-with-keycodes
// Limits the number of times "Enter" can be hit in a textarea
angular
  .module("app")
  .directive("limitEnters", limitEnters);

function limitEnters() {
  var directive = {
    compile: compile,
    restrict: 'A'
  };
  return directive;

  function compile(tElement, tAttrs) {
    return function (scope, element, attrs) {
      // I handle key events
      element.bind("keypress", function (event) {
        var keyCode = event.which || event.keyCode; // I safely get the keyCode pressed from the event.
        if (keyCode !== 13) {
          // Only handle Enters
          return;
        }

        // Count the number of Enters already present in the element and if it's 4, allow no more
        if (element[0].value) {
          var matches = element[0].value.match(/[\n\r]/g);
          if (matches && matches.length > 3) {
            event.preventDefault();
            return false;
          }
        }
      });
    };
  }
}

