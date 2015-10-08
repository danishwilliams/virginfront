angular.module("app.template_view", []).controller('Template_viewController', function ($routeParams, Templates) {
	var self = this;
	this.id = $routeParams.id;
	this.template = {};

	Templates.loadTemplate(this.id).then(function(data) {
		self.template = data;
		console.log(data);
	});


});
