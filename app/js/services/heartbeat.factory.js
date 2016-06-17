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
    var dateNowish = new Date(); // Defaults to now, but I want the nearest 15 minutes (rounded down)
    var dateMinutes = dateNowish.getMinutes();
    if (minutes === 15) {
      if (dateMinutes >= 45) {
        dateNowish.setMinutes(45);
      }
      else if (dateMinutes >= 30) {
        dateNowish.setMinutes(30);
      }
      else if (dateMinutes >= 15) {
        dateNowish.setMinutes(15);
      }
      else {
        dateNowish.setMinutes(0);
      }
    }

    data.forEach(function (val) {
      // Get the current time in seconds
      var seconds = Math.floor((dateNowish - val.CreateDate) / 1000);
      if (seconds > 0) {
        // Convert this into a value between 0 and range
        var beat = range - (range * ((seconds / secondsInADay)));
        val.beat = Math.round(beat);
      }
    });

    var num = 0;
    for (var i = 0; i <= range; i++) {
      // Work out the datetime
      var secondsAgo = (range - i) * minutes * 60;
      date = new Date(dateNowish.getTime() - secondsAgo * 1000);

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
        // The following line results in the popover showing a random heartbeat within a time range.
        // Rather just use the time range itself
        //date = data[k].CreateDate;
        num++;
      }

      // If the last record shows disconnected, that's in the last segment (5 or 15 minutes), so who cares. Don't show it.
      if (i === range && k === -1) {
        // Just kidding. Show it.
        //break;
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
