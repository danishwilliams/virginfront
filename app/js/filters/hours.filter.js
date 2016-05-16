/*
angular
  .module("app")
  .filter('hours', SecondsToHoursFilter);

// Converts seconds to hours + minutes
function MinutesToHoursFilter() {
  return function (input) {
    function z(n) {
      return (n < 10 ? '0' : '') + n;
    }
    var minutes = input % 60;
    var hours = Math.floor(input / 60);
    return (z(hours) + ':' + z(minutes));
  };
}
*/