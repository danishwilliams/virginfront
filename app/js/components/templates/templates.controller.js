angular.module("app.templates", []).controller('TemplatesController', function (Templates) {
	var self = this;
	this.templates = Templates.getTemplates();
	this.newtemplate = {};

	Templates.loadTemplates().then(function(data) {
		self.templates = data;
	});

	this.update = function(template) {
		// TODO: fill this out
	};

	this.delete = function(template) {
		// TODO: fill this out
	};

	this.create = function() {
		// TODO: fill this out
	};
});