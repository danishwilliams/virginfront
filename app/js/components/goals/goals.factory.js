/**
 * Created by rogersaner on 28/09/21.
 */
angular
  .module("app")
  .factory('Goals', GoalsFactory);

GoalsFactory.$inject = ['Restangular'];

function GoalsFactory(Restangular) {
  // TODO: if we want multiple controllers/services to be able to use this data, then add a GoalsService
  // which has methods for a private goals variable with get/set
  var service = Restangular.service('goals');

  return service;
}
