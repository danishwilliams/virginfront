angular
  .module("app")
  .directive("user", user);

function user() {
  var directive = {
    templateUrl: '../js/directives/user/user.directive.html',
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
  var self = this;

  self.sendInvite = function (id) {
    Users.sendInvite(id).then(function() {
      
    });
  };

  self.enable = function (user) {
    user.Enabled = true;
    user.archiveMessage = {
      type: 'success',
      msg: 'USER_ENABLED'
    };

    Users.enableUser(user.Id).then(function() {}, function() {
      user.archiveMessage = {
        type: 'danger',
        msg: 'ENABLE_ACCOUNT_FAILED',
      };
    });
  };

  self.disable = function (user) {
    user.Enabled = false;
    user.archiveMessage = {
      type: 'success',
      msg: 'USER_DISABLED',
      undo: true
    };

    Users.disableUser(user.Id).then(function() {}, function() {
      user.archiveMessage = {
        type: 'danger',
        msg: 'DISABLE_ACCOUNT_FAILED',
      };
    });
  };
}