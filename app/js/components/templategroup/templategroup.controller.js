angular.module("app.templategroup_view", []).controller('Templategroup_viewController', function ($stateParams, $state, Templates, spinnerService) {
  var self = this;
  this.id = $stateParams.id;
  this.templategroup = {};

  Templates.loadTemplateGroup(this.id).then(function (data) {
    self.templategroup = data;
    spinnerService.hide('loadTemplateGroupSpinner');

    Templates.loadTemplateGroupClasses(self.id).then(function (data) {
      spinnerService.hide('loadClassLengthsSpinner');
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

  self.archiveTemplateGroup = function (){
    spinnerService.show('archiveTemplateGroupSpinner');
    Templates.disableTemplateGroup(self.templategroup.Id).then(function(data) {
      spinnerService.hide('archiveTemplateGroupSpinner');
      self.templategroup.Enabled = false;
    });
  };

  self.unArchiveTemplateGroup = function (){
    spinnerService.show('archiveTemplateGroupSpinner');
    Templates.enableTemplateGroup(self.templategroup.Id).then(function(data) {
      spinnerService.hide('archiveTemplateGroupSpinner');
      self.templategroup.Enabled = true;
    });
  };
});
