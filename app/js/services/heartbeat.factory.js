angular
  .module("app")
  .factory('Heartbeat', HeartbeatFactory);

function HeartbeatFactory() {
  var self = this;

  var heartbeatFactory = {
    createHeartbeat: createHeartbeat
  };

  return heartbeatFactory;

  // for a week: 287 -> 2100
  // 5 -> 35

  function createHeartbeat(data) {
    var heartbeat = [];
    var hasHeartbeat = false;
    var newDay = false;
    var newDayIndex = 0;

    // Convert each heartbeat into a value between 0 and 287 (60/5 x 24) since there's a heartbeat every 5 minutes
    // Or
    // Convert each heartbeat into a value between 0 and 96 (60/15 x 24) since there's a heartbeat every 15 minutes
    var minutes = 15;
    var range = (60 / minutes) * 24;

    var secondsInADay = 60 * 60 * 24;
    data.forEach(function (val) {
      // Get the current time in seconds
      var seconds = Math.floor((new Date() - val.CreateDate) / 1000);

      // Convert this into a value between 0 and range
      var beat = range - (range * ((seconds / secondsInADay)));
      val.beat = Math.round(beat);
    });

    var num = 0;
    for (var i = 0; i <= range; i++) {
      // Work out the datetime
      var secondsAgo = (range - i) * minutes * 60;
      var date = new Date(new Date().getTime() - secondsAgo * 1000);

      if (!newDay && date.getHours() === 0) {
        newDay = date;
        newDayIndex = i;
      }

      // Is this a heartbeat or not?
      var beat = false;
      var k = _.findIndex(data, {
        beat: i
      });
      if (k > -1) {
        hasHeartbeat = true;
        beat = true;
        date = data[k].CreateDate;
        num++;
      }

      // If the last record shows disconnected, that's in the last segment (5 or 15 minutes), so who cares. Don't show it.
      if (i === range && k === -1) {
        break;
      }

      heartbeat.push({
        beat: beat,
        date: date
      });
    }
    return {
      heartbeat: heartbeat,
      hasHeartbeat: hasHeartbeat,
      newDay: newDay,
      newDayIndex: newDayIndex
    };
  }

}
