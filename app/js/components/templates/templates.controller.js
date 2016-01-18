angular.module("app.templates", []).controller('TemplatesController', function (Templates) {
  var self = this;
  this.templateGroups = Templates.getTemplateGroups();
  this.newTemplateGroup = {};

  // TODO: probably don't need this any more
  this.updateTemplateGroup = function (templateGroup) {
    templateGroup.put();
  };

  this.deleteTemplateGroup = function (template) {
    // TODO: fill this out
    console.log("This is a really bad idea! I won't do it!");
  };

  this.create = function () {
    // TODO: fill this out
  };
});
