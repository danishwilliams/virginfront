angular
  .module("app")
  .directive("goalOption", goalOption);

function goalOption() {
  var directive = {
    link: link,
    templateUrl: 'goal_option.directive.html',
    restrict: 'E',
    controller: goalOptionController,
    controllerAs: 'vm',
    scope: {
      bpm: '@',
      goaloptiondata: '@'
    }
  };
  return directive;

  function link(scope, element, attrs) {
  }
}

goalOptionController.$inject = ['$scope'];

function goalOptionController($scope) {
  // Immensely hacky, but I couldn't figure out how to pass bpm AND goaloptions together. The latter comes through as a string,
  // and converting the string to an object doesn't actually results in showing the data in the template. Bizarrely. *shrug*
  $scope.goaloption = JSON.parse($scope.goaloptiondata);

  if ($scope.goaloption.EffortHigh) {
    $scope.goaloption.effort = $scope.goaloption.Effort + ' - ' + $scope.goaloption.EffortHigh;
  }
  else {
    $scope.goaloption.effort = $scope.goaloption.Effort;
  }

  switch ($scope.goaloption.Beat.Ratio) {
    case 0.5:
      $scope.beat = 'HALF_TIME';
      break;
    case 1:
      $scope.beat = 'ON_THE_BEAT';
      break;
  }

  $scope.rpm = '';
  if ($scope.bpm) {
    updateBpm();
  }

  $scope.$watch('bpm', function() {
    updateBpm();
  });

  function updateBpm() {
    $scope.rpm = parseInt($scope.bpm * $scope.goaloption.Beat.Ratio);
  }
}