angular
  .module("app")
  .directive("userTypes", userTypes);

function userTypes() {
  var directive = {
    templateUrl: 'user_types.directive.html',
    restrict: 'E',
    controller: userTypesController,
    controllerAs: 'vm',
    scope: {
      ngModel: '='
    },
    required: ['ngModel']
  };

  return directive;
}

userTypesController.$inject = ['UserTypes'];

function userTypesController(UserTypes) {
  var self = this;

  UserTypes.loadUserTypes().then(function (data) {
    self.userTypes = data;
  });
}