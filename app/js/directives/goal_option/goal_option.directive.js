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
      trackBpm: '@', // BPM of the track - used to calculate the Beat Ratio
      goalBpmLow: '@', // The lower BPM of the Goal's BPM range
      goalBpmHigh: '@', // The higher BPM of the Goal's BPM range
      freestyle: '@',
      customrpm: '@',
      goalGoaloptionNumber: '@', // The number of goal options in this goal OMG that's not confusing at all
      totalGoaloptions: '@', // Only show the Goal Option name if IsCustomRpm is false and there is more than 1 goaloption
      challengeGoal: '@' // If this is a challenge goal, pass the ID through (so that we can disable editing the metadata)
    }
  };
  return directive;
}

goalOptionController.$inject = ['$scope'];

function goalOptionController($scope) {
  // Because these should be integers. *sigh*
  $scope.trackBpm = parseInt($scope.trackBpm);
  $scope.goalBpmLow = parseInt($scope.goalBpmLow);
  $scope.goalBpmHigh = parseInt($scope.goalBpmHigh);
  $scope.totalGoaloptions = parseInt($scope.totalGoaloptions);
  $scope.goalGoaloptionNumber = parseInt($scope.goalGoaloptionNumber);

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
    // Figure out Beat Ratio based on chosen track

    if (($scope.totalGoaloptions > 0 && $scope.goalGoaloptionNumber === 1)) {
      half_time();
    }
    else if (($scope.goalBpmLow <= $scope.trackBpm && $scope.trackBpm <= $scope.goalBpmHigh)) {
      // The track BPM is in the goal option's BPM range, it's "on the beat"
      console.log($scope.goalBpmLow + ' <= ' + $scope.trackBpm + ' <= ' + $scope.goalBpmHigh, 'On the beat');
      $scope.goaloption.Beat.Ratio = 1;
      $scope.beat = 'ON_THE_BEAT';
    }
    else {
      half_time();
    }
  }

  function half_time() {
    console.log($scope.goalBpmLow + ' <= ' + $scope.trackBpm + ' <= ' + $scope.goalBpmHigh, 'Half time');
    $scope.goaloption.Beat.Ratio = 0.5;
    $scope.beat = 'HALF_TIME';
  }

  $scope.rpm = '';
  if ($scope.trackBpm) {
    updateBpm();
  }

  $scope.$watch('trackBpm', function () {
    updateBpm();
  });

  function updateBpm() {
    if ($scope.customrpm === 'false' && $scope.goaloption.Beat) {
      $scope.rpm = parseInt($scope.trackBpm * $scope.goaloption.Beat.Ratio);
    }
  }

  $scope.isCustomRpm = function() {
    return $scope.customrpm;
  };
}
