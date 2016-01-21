angular.module("app.templategroup_view", []).controller('Templategroup_viewController', function ($stateParams, $state, Templates, spinnerService) {
  var self = this;
  this.id = $stateParams.id;
  this.templategroup = {};

  Templates.loadTemplateGroup(this.id).then(function (data) {
    self.templategroup = data;

    Templates.loadTemplateGroupClasses(self.id).then(function (data) {
      self.templategroup.ClassLengths = data.TemplateClassLength;
    });
  });

  self.saveTemplate = function () {
    spinnerService.show('saveTemplateSpinner');
    self.templategroup.put().then(function () {
      spinnerService.hide('saveTemplateSpinner');
      $state.go('templates-admin');
    });
  };

  self.createNewTemplate = function () {
    $state.go('template-new', {
      id: self.templategroup.Id,
      mins: self.mins
    });
  };
});
