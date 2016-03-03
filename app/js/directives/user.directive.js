angular
  .module("app")
  .directive("user", user);

function user() {
  var directive = {
    templateUrl: 'user.directive.html',
    restrict: 'E',
    controller: userController,
    controllerAs: 'vm',
    link: link
  };
  return directive;

  function link(scope, element, attrs) {
    // This users directive always assumes the containing parent controller has loaded up all users
    scope.vm.user = scope.$parent.user;
  }
}

userController.$inject = ['Users'];

function userController(Users) {
  self.sendInvite = function (id) {
    Users.sendInvite(id).then(function() {
      
    });
  };

  self.archive = function (user) {
    self.hasArchived = true;
    user.Enabled = false;
  };

  self.unarchive = function (user) {
    user.Enabled = true;
  };
}