/**
 * @see http://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site
 */

angular
  .module("app")
  .filter('timeago', TimeAgoFilter);

TimeAgoFilter.$inject = ['$filter'];

// Converts seconds to minutes
function TimeAgoFilter($filter) {
  return function (input) {
    var seconds = Math.floor((new Date() - new Date(input)) / 1000);

    var interval = Math.floor(seconds / 31536000);

    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + ' ' + $filter('translate')('DAYS_AGO');
    }

    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + ' ' + $filter('translate')('HOURS_AGO');
    }

    interval = Math.floor(seconds / 60);
    return interval + ' ' + $filter('translate')('MINS_AGO');
  };
}
