angular
  .module("app")
  .directive("goalOption", goalOption);

function goalOption() {
  var directive = {
    templateUrl: '../js/directives/goal_option/goal_option.directive.html',
    restrict: 'E',
    controller: goalOptionController,
    controllerAs: 'vm',
    scope: {
      // Values such as goaloption.Effort etc are primitives, and so dot notation must be used. If we simply bind, say, effort: '=',
      // then changes within this directive scope won't propogate up to the parent scope.
      // This is because javascript is a pass-by-value language, and so primitives are copied within a nested scope.
      // @see http://zcourts.com/2013/05/31/angularjs-if-you-dont-have-a-dot-youre-doing-it-wrong/
      goaloption: '=',
      bpm: '@',
      freestyle: '@',
      customrpm: '@',
      'totalGoaloptions': '@', // Only show the Goal Option name if IsCustomRpm is false and there is more than 1 goaloption
      'challengeGoal': '@' // If this is a challenge goal, pass the ID through (so that we can disable editing the metadata)
    }
  };
  return directive;
}

goalOptionController.$inject = ['$scope'];

function goalOptionController($scope) {
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
