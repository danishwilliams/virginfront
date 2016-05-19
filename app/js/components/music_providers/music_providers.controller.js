angular.module("app.music_providers", []).controller('Music_providersController', function (Users, MusicProviders, Heartbeat, spinnerService) {
  var self = this;

  var user = Users.getCurrentUser();
  var id = user.Location.Country.MusicProvider.Id;
  self.name = user.Location.Country.MusicProvider.Name;

  MusicProviders.getHeartbeatLog(id, 288, 1).then(function (data) {
    var i = 0;
    self.days = [];
    data.forEach(function(val) {
      val.beat = false;
      if (val.Success) {
        val.beat = true;
        self.hasHeartbeat = true;
      }
      val.date = new Date(val.CreateDate);
      val.i = i;

      i++;
    });
    data.reverse();

    /*
      var date = new Date(val.date);
      if (date.getHours() === 0 && date.getMinutes() === 0) {
        self.days.push({
          date: val.date,
          i: i
        });
      }
    */

    // Figure out when it's a new day
    // number of data points: 288
    // How many days in that time?
    /*
    var seconds = Math.floor((new Date(data[data.length - 1].date) - new Date(data[0].date)) / 1000);
    var days = Math.round(seconds / (60 * 60 * 24));
    console.log('days', days);
    var date = new Date(data[0].date);
    self.days.push({
      date: new Date(data[0].date)
    });
    self.days.push({
      date: new Date(data[data.length - 1].date),
      i: Math.round((data.length)
    });
    */

    /*
    for (i = 0; i < days; i++) {
      self.days.push({
        date: angular.copy(date),
        i: Math.round((data.length / days) * i)
      });
      date.setDate(date.getDate() + 1);
    }
    */

    console.log(self.days);
    self.heartbeat = data;
    spinnerService.hide('heartbeatlog');
  });

  self.popoverContents = function (beat) {
    if (beat.beat) {
      return 'AVAILABLE';
    }
    return 'UNAVAILABLE';
  };
});
