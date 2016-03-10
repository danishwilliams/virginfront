angular
  .module("app")
  .directive("goalOption", goalOption);

function goalOption() {
  var directive = {
    templateUrl: 'goal_option.directive.html',
    restrict: 'E',
    controller: goalOptionController,
    controllerAs: 'vm',
    scope: {
      bpm: '@',
      freestyle: '@',
      effort: '=',
      efforthigh: '=',
      customrpm: '@',
      rpmlow: '=',
      rpmhigh: '=',
      'totalGoaloptions': '@' // Only show the Goal Option name if IsCustomRpm is false and there is more than 1 goaloption
    }
  };
  return directive;
}

goalOptionController.$inject = ['$scope'];

function goalOptionController($scope) {
  $scope.goaloption = $scope.$parent.goaloption;

  $scope.effortOptions = [40];
  for (i = 45; i <= 100; i = i + 5) {
    $scope.effortOptions.push(i);
  }

  $scope.rpmOptions = [0];
  for (i = 60; i <= 180; i = i + 5) {
    $scope.rpmOptions.push(i);
  }

  // Only show the name of goaloptions if there are more than 1
  if (parseInt($scope.goaloption.length) === 1) {
    $scope.goaloption.Name = '';
  }

  if ($scope.goaloption.EffortHigh) {
    $scope.goaloption.effortrange = $scope.goaloption.Effort + ' - ' + $scope.goaloption.EffortHigh;
  } else {
    $scope.goaloption.effortrange = $scope.goaloption.Effort;
  }

  if ($scope.goaloption.Beat) {
    switch ($scope.goaloption.Beat.Ratio) {
      case 0.5:
        $scope.beat = 'HALF_TIME';
        break;
      case 1:
        $scope.beat = 'ON_THE_BEAT';
        break;
    }
  }

  $scope.rpm = '';
  if ($scope.bpm) {
    updateBpm();
  }

  $scope.$watch('bpm', function () {
    updateBpm();
  });

  function updateBpm() {
    if ($scope.customrpm === 'false' && $scope.goaloption.Beat) {
      $scope.rpm = parseInt($scope.bpm * $scope.goaloption.Beat.Ratio);
    }
  }

  $scope.isCustomRpm = function() {
    return $scope.customrpm;
  };
}
