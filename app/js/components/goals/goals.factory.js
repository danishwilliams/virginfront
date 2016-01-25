/**
 * Created by rogersaner on 28/09/21.
 */
angular
  .module("app")
  .factory('Goals', GoalsFactory);

GoalsFactory.$inject = ['Restangular', 'uuid2'];

function GoalsFactory(Restangular, uuid2) {
  // TODO: if we want multiple controllers/services to be able to use this data, then add a GoalsService
  // which has methods for a private goals variable with get/set
  var service = Restangular.service('goals');

  var self = this;
  var goals = [];

  var goalsFactory = {
    createBlankGoal: createBlankGoal,
    loadGoals: loadGoals,
    loadFreestyleGoals: loadFreestyleGoals
  };

  return goalsFactory;

  function createBlankGoal() {
    return {
      Id: uuid2.newuuid().toString(),
      Goal: {
        GoalOptions: [{
          Name: '',
          BeatId: 0,
          Beat: {},
          RpmLow: 0,
          RpmHigh: 0
        }],
        Interval: false,
        CountryId: '', // this needs a value GAH
        // TODO: IsCustomRpm: how do we know this? Can we grab it from country? Or can the API give us a blank template json?
        IsCustomRpm: false
      }
    };
  }

  function loadGoals() {
    return Restangular.all('goals').getList().then(loadGoalsComplete);

    function loadGoalsComplete(data, status, headers, config) {
      self.goals = data;
      return self.goals;
    }
  }

  function loadFreestyleGoals() {
    return Restangular.all('goals/freestyle').withHttpConfig({ cache: true}).getList().then(loadFreestyleGoalsComplete);

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
