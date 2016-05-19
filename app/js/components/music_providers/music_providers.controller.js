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
