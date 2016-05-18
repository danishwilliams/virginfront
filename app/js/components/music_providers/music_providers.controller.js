angular.module("app.music_providers", []).controller('Music_providersController', function (Users, MusicProviders, Heartbeat, spinnerService) {
  var self = this;

  var user = Users.getCurrentUser();
  var id = user.Location.Country.MusicProvider.Id;
  self.name = user.Location.Country.MusicProvider.Name;

  MusicProviders.getHeartbeatLog(id, 288, 1).then(function (data) {
    var log = Heartbeat.createHeartbeat(data);
    self.heartbeat = log.heartbeat;
    self.hasHeartbeat = log.hasHeartbeat;
    self.newDay = log.newDay;
    self.newDayIndex = log.newDayIndex;
    spinnerService.hide('heartbeatlog');
  });

  self.popoverContents = function (beat) {
    if (beat.beat) {
      return 'CONNECTED';
    }
    return 'DISCONNECTED';
  };
});
