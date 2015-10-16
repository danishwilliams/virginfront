angular.module("app.template_view", []).controller('Template_viewController', function ($stateParams, Templates) {
	var self = this;
	this.id = $stateParams.id;
	this.template = {};

	Templates.loadTemplate(this.id).then(function(data) {
		self.template = data;
	});

});
