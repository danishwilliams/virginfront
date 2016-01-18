angular.module("app.templategroup_view", []).controller('Templategroup_viewController', function ($stateParams, $state, Templates, spinnerService) {
  var self = this;
  this.id = $stateParams.id;
  this.templategroup = {};

  self.title = 'Create new template';

  Templates.loadTemplateGroup(this.id).then(function (data) {
    self.title = 'Edit template';
    self.templategroup = data;

    Templates.loadTemplateGroupClasses(self.id).then(function (data) {
      self.templategroup.ClassLengths = data.TemplateClassLength;
    });
  });

  self.saveTemplate = function() {
    spinnerService.show('saveTemplateSpinner');
    self.templategroup.put().then(function() {
      spinnerService.hide('saveTemplateSpinner');
      $state.go('templates-admin');
    });
  };
});
