angular
  .module("app")
  .directive("musicProviderStatus", musicProviderStatus);

function musicProviderStatus() {
  var directive = {
    templateUrl: '../js/directives/music_provider_status/music_provider_status.directive.html',
    restrict: 'E',
    controller: musicProviderStatusController,
    controllerAs: 'vm'
  };
  return directive;
}

musicProviderStatusController.$inject = ['Users', 'MusicProviders', 'spinnerService'];

function musicProviderStatusController(Users, MusicProviders, spinnerService) {
  var self = this;
  var user = Users.getCurrentUser();
  var id = user.Location.Country.MusicProvider.Id;
  self.name = user.Location.Country.MusicProvider.Name;

  MusicProviders.getHeartbeatLog(id, 1, 1).then(function (data) {
    self.loaded = true;
    self.log = {};
    if (_.isEmpty(data)) {
      self.log.Success = false;
      return;
    }
    self.log = data[0];
    self.log.CreateDate = new Date(self.log.CreateDate);
  });

}
