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

    // Convert each heartbeat into a value between 0 and 287 (5 x 12 x 24) since there's a heartbeat every 5 minutes
    var secondsInADay = 60 * 60 * 24;

    data.forEach(function (val) {
      // Get the current time in seconds
      var seconds = Math.floor((new Date() - val.CreateDate) / 1000);

      // Convert this into a value between 0 and 287
      var beat = 287 - (287 * ((seconds / secondsInADay)));
      val.beat = Math.round(beat);
    });

    var num = 0;
    for (var i = 0; i < 287; i++) {
      // Work out the datetime
      var secondsAgo = (287 - i) * 5 * 60;
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

      // If the last record shows disconnected, that's in the last 5 minutes, so who cares. Don't show it.
      if (i === 286 && k === -1) {
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
