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

goalOptionController.$inject = ['$scope', 'Goals'];

function goalOptionController($scope, Goals) {
  // Because these should be integers. *sigh*
  $scope.trackBpm = parseInt($scope.trackBpm);
  $scope.goalBpmLow = parseInt($scope.goalBpmLow);
  $scope.goalBpmHigh = parseInt($scope.goalBpmHigh);
  $scope.totalGoaloptions = parseInt($scope.totalGoaloptions);
  checkForNullBeatObject();
  calculateEffortRange();

  $scope.effortOptions = Goals.getEffortRange();
  $scope.rpmOptions = Goals.getBpmRange();

  // Only show the name of goaloptions if there are more than 1
  if (parseInt($scope.goaloption.length) === 1) {
    $scope.goaloption.Name = '';
  }

  $scope.rpm = '';

  $scope.$watch('trackBpm', function () {
    $scope.trackBpm = parseInt($scope.trackBpm);
    updateBpm();
  });

  function updateBpm() {
    if ($scope.customrpm === 'false' && $scope.goaloption.Beat) {
      $scope.rpm = parseInt($scope.trackBpm * $scope.goaloption.Beat.Ratio);
    }

    // Figure out Beat Ratio based on chosen track
    if ($scope.totalGoaloptions > 1) {
      /*
      console.log('');
      console.log($scope.goaloption.Name);
      console.log('total goal options', $scope.totalGoaloptions);
      console.log('goalGoaloptionNumber', $scope.goalGoaloptionNumber);
      */
      if ($scope.goalGoaloptionNumber === '0') {
        on_the_beat();
      }
      else if ($scope.goalGoaloptionNumber === '1') {
        half_time();
      }
    }
    else if ($scope.trackBpm <= $scope.goalBpmHigh) {
      on_the_beat();
    }
    else {
      half_time();
    }
  }

  function checkForNullBeatObject() {
    if (!$scope.goaloption.Beat) {
      $scope.goaloption.Beat = {Name: 'required'};
    }
  }

  function calculateEffortRange() {
    if ($scope.goaloption.EffortHigh) {
      $scope.goaloption.effortrange = $scope.goaloption.Effort + ' - ' + $scope.goaloption.EffortHigh;
    } else {
      $scope.goaloption.effortrange = $scope.goaloption.Effort;
    }
  }

  function on_the_beat() {
    // The track BPM is in the goal option's BPM range, it's "on the beat"
    //console.log($scope.goalBpmLow + ' <= ' + $scope.trackBpm + ' <= ' + $scope.goalBpmHigh, 'On the beat');

    // No idea why this must be called again. Somehow if we're in the following workflow, we lost the Beat object
    // on goaloptions, as well as effortrange: view new incomplete playlist, add a track.
    checkForNullBeatObject();
    calculateEffortRange();

    $scope.goaloption.Beat.Ratio = 1;
    $scope.beat = 'ON_THE_BEAT';
  }

  function half_time() {
    //console.log($scope.goalBpmLow + ' <= ' + $scope.trackBpm + ' <= ' + $scope.goalBpmHigh, 'Half time');

    // No idea why this must be called again. Somehow if we're in the following workflow, we lost the Beat object
    // on goaloptions, as well as effortrange: view new incomplete playlist, add a track.
    checkForNullBeatObject();
    calculateEffortRange();

    $scope.goaloption.Beat.Ratio = 0.5;
    $scope.beat = 'HALF_TIME';
  }

  $scope.isCustomRpm = function() {
    return $scope.customrpm;
  };
}
