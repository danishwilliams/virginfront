angular
  .module("app")
  .filter('minutes', SecondsToMinutesFilter);

// Converts seconds to minutes + seconds
function SecondsToMinutesFilter() {
  return function (input) {
    if (!input) {
      return '00:00';
    }
    function z(n) {
      return (n < 10 ? '0' : '') + n;
    }
    var seconds = input % 60;
    var minutes = Math.floor(input % 3600 / 60);
    return (z(minutes) + ':' + z(seconds));
  };
}
