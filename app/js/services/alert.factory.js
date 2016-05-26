angular
  .module("app")
  .factory('Alert', AlertFactory);

function AlertFactory() {
  var alert;

  var alertFactory = {
    addAlert: addAlert,
    popAlert: popAlert,
  };

  return alertFactory;

  function addAlert(type, msg) {
    alert = {
      msg: msg,
      type: type
    };
  }

  function popAlert() {
    var alertReturn = angular.copy(alert);
    alert = undefined;
    return alertReturn;
  }

}
