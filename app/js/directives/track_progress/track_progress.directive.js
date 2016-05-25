angular
  .module("app")
  .directive("trackProgress", trackProgress);

trackProgress.$inject = ['Tracks'];

function trackProgress(Tracks) {
  var directive = {
    templateUrl: '../js/directives/track_progress/track_progress.directive.html',
    restrict: 'E',
    scope: {
      progress: '@',
      duration: '@'
    },
    link: link
  };
  return directive;

  function link(scope, element, attrs) {
    // this gives us the native JS object
    var el = element[0];

    el.addEventListener("click", function (event) {
      var newTime = scope.duration * clickPercent(event, element);
      Tracks.setTrackCurrentTime(newTime);
    }, false);
  }

  // returns click as decimal (.77) of the total progress element
  function clickPercent(e, element) {
    return (e.pageX - element[0].getBoundingClientRect().left) / element[0].children[0].clientWidth;
  }
}
