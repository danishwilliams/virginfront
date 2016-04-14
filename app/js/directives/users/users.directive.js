angular
  .module("app")
  .directive("users", users);

function users() {
  var directive = {
    templateUrl: '../js/directives/users/users.directive.html',
    restrict: 'E',
    controller: usersController,
    controllerAs: 'vm',
    scope: {
      'type': '@' // The type of user we're viewing here
    },
    link: link
  };
  return directive;

  function link(scope, element, attrs, ngModel) {
    // This users directive always assumes the containing parent controller has loaded up all users
    console.log(scope);
    scope.vm.users = scope.$parent.$parent.$parent.users;
  }
}

usersController.$inject = ['spinnerService'];

function usersController(spinnerService) {

}