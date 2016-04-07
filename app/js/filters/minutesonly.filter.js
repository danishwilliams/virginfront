angular
  .module("app")
  .filter('minutesonly', SecondsToHoursFilter);

// Converts seconds to minutes
function SecondsToHoursFilter() {
  return function (input) {
    function z(n) {
      return n;
    }
    var minutes = Math.floor(input / 60);
    return z(minutes);
  };
}
