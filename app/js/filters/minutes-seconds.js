angular
  .module("app")
  .filter('minutesSeconds', SecondsToSecondsOrMinutesFilter);

SecondsToSecondsOrMinutesFilter.$inject = ['$filter'];

// Converts seconds to either minutes + seconds, or just seconds
function SecondsToSecondsOrMinutesFilter($filter) {
  return function (input) {
    if (!input) {
      return '';
    }
    function z(n) {
      return (n < 10 ? '0' : '') + n;
    }
    var seconds = input % 60;
    var minutes = Math.floor(input / 60);
    var output = seconds + ' ' + $filter('translate')('SECONDS');
    if (minutes) {
      output = minutes + ' ' + $filter('translate')('MINS') + ' ' + output;
    }
    return output;
  };
}
