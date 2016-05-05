/**
 * @see http://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site
 */

angular
  .module("app")
  .filter('timeago', TimeAgoFilter);

// Converts seconds to minutes
function TimeAgoFilter() {
  return function (input) {
    var seconds = Math.floor((new Date() - new Date(input)) / 1000);

    var interval = Math.floor(seconds / 31536000);
    interval = Math.floor(seconds / 86400);

    if (interval > 1) {
      return interval + " days ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " hours ago";
    }    interval = Math.floor(seconds / 60);
    return interval + " mins ago";
  };
}
