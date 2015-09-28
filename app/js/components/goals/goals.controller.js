angular.module("app.goals", []).controller('GoalsController', function (Restangular) {
	this.goals = Restangular.all('Goals').getList().$object;
});