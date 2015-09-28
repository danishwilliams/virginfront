/**
 * Created by rogersaner on 28/09/21.
 */
angular
  .module("app")
  .factory('GoalsFactory', GoalsFactory);

GoalsFactory.$inject = ['Restangular'];

function GoalsFactory(Restangular) {
	var service = Restangular.service('goals');

	return service;


/*
	var goalsFactory = {

	};

	return goalsFactory;
*/

}