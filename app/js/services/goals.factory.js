/**
 * Created by rogersaner on 28/09/21.
 */
angular
  .module("app")
  .factory('Goals', GoalsFactory);

GoalsFactory.$inject = ['Restangular', 'uuid2', 'Users'];

function GoalsFactory(Restangular, uuid2, Users) {
  // TODO: if we want multiple controllers/services to be able to use this data, then add a GoalsService
  // which has methods for a private goals variable with get/set
  var service = Restangular.service('goals');

  var self = this;
  var goals = [];
  var freestyleGoals = [];
  var effortrange = [];
  var bpmrange = [];

  var goalsFactory = {
    createBlankDefaultGoal: createBlankDefaultGoal,
    saveNewDefaultGoal: saveNewDefaultGoal,
    loadGoals: loadGoals,
    getFreestyleGoals: getFreestyleGoals,
    loadFreestyleGoals: loadFreestyleGoals,
    getEffortRange: getEffortRange,
    getBpmRange: getBpmRange
  };

  return goalsFactory;

  /**
   * Creates a new blank default (i.e. freestyle) goal, which shows up in the dropdown when
   * adding default goals to a new template
   */
  function createBlankDefaultGoal() {
    var user = Users.getCurrentUser();
    return {
      Goal: {
        GoalOptions: [{
          Name: '',
          RpmLow: 0,
          RpmHigh: 0
        }],
        Interval: false,
        NewGoal: true,
        IsFreestyleVisible: true
      }
    };
  }

  /**
   * Saves a new default goal
   *
   * @param goal
   *   This needs to be converted to a freestyle goal object
   */
  function saveNewDefaultGoal(goal) {
    // This is a new default goal, created by createBlankDefaultGoal() - but that function is actually
    // expecting that if that goal is saved in the api, it's a Goal not a Freestyle Goal, and we want
    // the latter
    var freestyleGoal = {
      Goal: goal,
      GoalId: goal.Id,
      Id: uuid2.newuuid().toString(),
      IsFreestyleVisible: true
    };
    return Restangular.one("goals/freestyle", freestyleGoal.Id).customPUT(freestyleGoal).then(saveNewDefaultGoalComplete);

    function saveNewDefaultGoalComplete(data, status, headers, config) {
      return data;
    }
  }

  function loadGoals() {
    return Restangular.all('goals').getList().then(loadGoalsComplete);

    function loadGoalsComplete(data, status, headers, config) {
      self.goals = data;
      return self.goals;
    }
  }

  function getFreestyleGoals() {
    return freestyleGoals;
  }

  function loadFreestyleGoals() {
    return Restangular.all('goals/freestyle').getList().then(loadFreestyleGoalsComplete);

    function loadFreestyleGoalsComplete(data, status, headers, config) {
      _.mapObject(data, function (val, key) {
        if (key >= 0) {
          val.ArrayId = key;
          val.PlaylistGoalTracks = val.PlaylistGoalNotes = [];
        }
        return val;
      });
      freestyleGoals = data;
      return data;
    }
  }

  function getEffortRange() {
    if (!_.isEmpty(effortrange)) {
      return effortrange;
    }

    for (i = 40; i <= 100; i = i + 5) {
      effortrange.push(i);
    }

    return effortrange;
  }

  function getBpmRange() {
    if (!_.isEmpty(bpmrange)) {
      return bpmrange;
    }

    for (i = 50; i <= 180; i = i + 5) {
      bpmrange.push(i);
    }
    return bpmrange;
  }

}
