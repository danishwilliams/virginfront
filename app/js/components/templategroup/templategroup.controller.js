angular.module("app.templategroup_view", []).controller('Templategroup_viewController', function ($stateParams, $state, Templates, spinnerService, uuid2) {
  var self = this;
  this.id = $stateParams.id;
  this.templategroup = {};

  if (this.id) {
    self.editing = true;
    self.title = 'Edit template';
  }
  else {
    self.create = true;
    self.title = 'Create new template';
    self.templategroup.Id = uuid2.newuuid().toString();
  }

  if (self.editing) {
    Templates.loadTemplateGroup(this.id).then(function (data) {
      self.templategroup = data;

      Templates.loadTemplateGroupClasses(self.id).then(function (data) {
        self.templategroup.ClassLengths = data.TemplateClassLength;
      });
    });
  }

  self.saveTemplate = function () {
    spinnerService.show('saveTemplateSpinner');
    self.templategroup.put().then(function () {
      spinnerService.hide('saveTemplateSpinner');
      $state.go('templates-admin');
    });
  };
});
