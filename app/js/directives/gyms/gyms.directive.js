angular
  .module("app")
  .directive("gyms", gyms);

function gyms() {
  var directive = {
    templateUrl: '../js/directives/gyms/gyms.directive.html',
    restrict: 'E',
    controller: gymsController,
    controllerAs: 'vm',
    scope: {
      ngModel: '='
    },
    required: ['ngModel']
  };
  return directive;
}

gymsController.$inject = ['Gyms', 'Users'];

function gymsController(Gyms, Users) {
  var self = this;

  self.user = Users.getCurrentUser();
  if (!self.user) {
    Users.loadCurrentUser().then(function (data) {
      self.user = data;
      loadGyms();
    });
  }
  else {
    loadGyms();
  }

  function loadGyms() {
    // Load all gyms
    Gyms.loadGyms().then(function (data) {
      self.gyms = data;
      // Mark the user gyms which have been chosen
      _.mapObject(self.gyms, function (val, key) {
        if (key >= 0) {
          var item = _.find(self.user.UserGyms, function (item) {
            return item.Gym.Name === val.Name;
          });
          if (item) {
            val.selected = true;
          }
        }
        return val;
      });
    });
  }
}
