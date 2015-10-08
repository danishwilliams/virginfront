angular.module("app.templates", []).controller('TemplatesController', function (Templates) {
  var self = this;
  this.templateGroups = Templates.getTemplateGroups();
  this.newTemplateGroup = {};

  Templates.loadTemplateGroups(true).then(function (templateGroups) {
    self.templateGroups = templateGroups;

    templateGroups.forEach(function (val) {
      Templates.loadTemplateGroupClasses(val.Id).then(function (data) {
        // TODO: there *must* be a way of updating an object within an array rather than searching through it by ID
        // There is!!!! https://www.jonathanfielding.com/combining-promises-angular/
        var found = false;
        _.mapObject(self.templateGroups, function (val, key) {
          if (!found && val.Id === data.TemplateGroupId) {
            found = true;
            val.ClassLengths = data.TemplateClassLength;
          }
          return val;
        });
      });
    });
  });

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
