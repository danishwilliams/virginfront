angular
  .module("app")
  .directive("gymPossibleRides", gymPossibleRides);

gymPossibleRides.$inject = ['Playlists'];

function gymPossibleRides(Playlists) {
  var directive = {
    link: link,
    templateUrl: 'gym_possible_rides.directive.html',
    restrict: 'E',
    controller: gymPossibleRidesController,
    controllerAs: 'vm',
    scope: {
      ngModel: '='
    },
    require: '?ngModel'
  };
  return directive;

  function link(scope, element, attrs, ngModel) {
    scope.vm.gym = scope.$parent.vm.gym;

    Playlists.loadPlaylistsNotInGym(scope.vm.gym.Gym.Id).then(function (data) {
      scope.vm.playlists = data;
    });

    scope.selected = function () {
      // This triggers the ng-change on the directive so the parent controller can get the value
      ngModel.$setViewValue(scope.ngModel);
    };
  }
}

gymPossibleRidesController.$inject = ['Playlists', '$scope'];

function gymPossibleRidesController(Playlists, $scope) {
  var self = this;

  self.add = function () {
    Playlists.addPlaylistToGym($scope.ngModel.Id, self.gym.Gym.Id).then(function (data) {
      // It worked!
    });
  };
}
