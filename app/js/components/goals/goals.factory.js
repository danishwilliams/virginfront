/**
 * Created by rogersaner on 28/09/21.
 */
angular
  .module("app")
  .factory('Goals', GoalsFactory);

GoalsFactory.$inject = ['LoggedInRestangular'];

function GoalsFactory(LoggedInRestangular) {
  // TODO: if we want multiple controllers/services to be able to use this data, then add a GoalsService
  // which has methods for a private goals variable with get/set
  var service = LoggedInRestangular.service('goals');

  var self = this;
  var goals = [];

  var goalsFactory = {
    loadGoals: loadGoals,
    loadFreestyleGoals: loadFreestyleGoals
  };

  return goalsFactory;

  function loadGoals() {
    return LoggedInRestangular.all('goals').getList().then(loadGoalsComplete);

    function loadGoalsComplete(data, status, headers, config) {
      self.goals = data;
      return self.goals;
    }
  }

  function loadFreestyleGoals() {
    return LoggedInRestangular.all('goals/freestyle').withHttpConfig({ cache: true}).getList().then(loadFreestyleGoalsComplete);

    function loadFreestyleGoalsComplete(data, status, headers, config) {
      _.mapObject(data, function (val, key) {
        if (key >= 0) {
          val.ArrayId = key;
          val.PlaylistGoalTracks = val.PlaylistGoalNotes = [];
        }
        return val;
      });
      return data;
    }
  }
}
