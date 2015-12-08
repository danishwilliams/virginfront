angular
  .module("app")
  .directive("gymPossibleRides", gymPossibleRides);

function gymPossibleRides() {
  var directive = {
    link: link,
    templateUrl: 'gym_possible_rides.directive.html',
    restrict: 'E',
    controller: gymPossibleRidesController,
    controllerAs: 'vm',
    scope: {
      ngModel: '='
    },
    require: '?ngModel',
  };
  return directive;

  function link(scope, element, attrs, ngModel) {
    scope.vm.gym = scope.$parent.vm.gym;
    scope.selected = function () {
      // This triggers the ng-change on the directive so the parent controller can get the value
      ngModel.$setViewValue(scope.ngModel);
    };
  }
}

gymPossibleRidesController.$inject = ['Playlists', '$scope'];

function gymPossibleRidesController(Playlists, $scope) {
  var self = this;

  Playlists.loadPlaylists(4).then(function (data) {
    self.playlists = data;
  });

  self.add = function () {
    Playlists.addPlaylistToGym($scope.ngModel.Id, self.gym.Gym.Id).then(function (data) {
      // It worked!
    });
  };
}
