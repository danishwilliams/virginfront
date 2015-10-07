angular.module("app.templates", []).controller('TemplatesController', function (Templates) {
  var self = this;
  this.templates = Templates.getTemplates();
  this.newtemplate = {};

  Templates.loadTemplates(true).then(function (data) {
    self.templates = data;
  });

  this.update = function (template) {
    template.put();
  };

  this.delete = function (template) {
    // TODO: fill this out
  };

  this.create = function () {
    // TODO: fill this out
  };
});
