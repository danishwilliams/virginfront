angular
  .module("app")
  .directive("gymPossibleRides", gymPossibleRides);

gymPossibleRides.$inject = ['Playlists', 'spinnerService'];

function gymPossibleRides(Playlists, spinnerService) {
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
    scope.vm.random = Math.floor(Math.random() * 10000);

    Playlists.loadPlaylistsNotInGym(scope.vm.gym.Gym.Id).then(function (data) {
      scope.vm.playlists = data;
      spinnerService.hide('gymRidesSpinner' + scope.vm.random);
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
    // Doing this check because somehow this function gets called twice, I think because of the $setViewValue
    if ($scope.ngModel) {
      $scope.selected();
      Playlists.addPlaylistToGym($scope.ngModel.Id, self.gym.Gym.Id).then(function (data) {
        // It worked!
        self.playlists = _.without(self.playlists, $scope.ngModel);
        Playlists.publishPlaylist($scope.ngModel.Id, self.gym.Gym.Id).then(function (data) {
          // It worked!
        });
      });
    }
  };
}
