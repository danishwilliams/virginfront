angular.module("app.gym_edit", []).controller('GymController', function ($stateParams, Gyms, spinnerService) {
  var self = this;

  self.id = $stateParams.id;

  // We're editing a club
  if (self.id) {
    self.action = 'edit';
    Gyms.loadGym(self.id).then(function (data) {
      self.gym = data;
      self.snapshot = angular.copy(data);
      console.log(data);
      spinnerService.hide('gym');
    });
  }
  else {
    self.gym = {};
    self.action = 'add';
  }

  self.saveGym = function () {
    // TODO: Check if this location exists, or if it's a new city to be added

    //self.gym.put().then(function() {

    //});
  };

});
