angular.module("app.device-disable-modal", []).controller('DeviceDisableModalInstanceCtrl', function ($modalInstance) {
  var self = this;

  self.ok = function () {
    $modalInstance.close(true);
  };

  self.cancel = function () {
    $modalInstance.dismiss(false);
  };
});
