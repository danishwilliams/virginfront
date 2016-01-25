angular.module("app.templategroup_view", []).controller('Templategroup_viewController', function ($stateParams, $state, Templates, spinnerService) {
  var self = this;
  this.id = $stateParams.id;
  this.templategroup = {};

  if ($state.current.name === 'templategroup') {
    // Viewing/editing a template group
    Templates.loadTemplateGroup(this.id).then(function (data) {
      self.templategroup = data;
      spinnerService.hide('loadTemplateGroupSpinner');

      Templates.loadTemplateGroupClasses(self.id).then(function (data) {
        spinnerService.hide('loadClassLengthsSpinner');
        self.templategroup.ClassLengths = data.TemplateClassLength;
      });
    });
  } else {
    // Creating a template group
    self.templategroup = Templates.createBlankTemplateGroup();
  }

  self.iconFileNames = [
    '',
    'allterrain.svg',
    'freestyle.svg',
    'hills.svg',
    'intervals.svg',
    'pack.svg',
    'speed.svg',
    'strengthendurance.svg'
  ];

  self.saveTemplate = function () {
    spinnerService.show('saveTemplateSpinner');
    console.log(self.templategroup);
    self.templategroup.put().then(function () {
      spinnerService.hide('saveTemplateSpinner');
      $state.go('templates-admin');
    });
  };

  self.createNewTemplate = function () {
    var template = {
      ClassLengthMinutes: self.mins,
      Enabled: true,
      TemplateId: self.templategroup.Id,
      CreateNew: true
    };
    self.templategroup.ClassLengths.push(template);
    self.addClassLength = false;
    self.addedClassLength = true;
  };

  self.archiveTemplateGroup = function () {
    spinnerService.show('archiveTemplateGroupSpinner');
    Templates.disableTemplateGroup(self.templategroup.Id).then(function (data) {
      spinnerService.hide('archiveTemplateGroupSpinner');
      self.templategroup.Enabled = false;
    });
  };

  self.unArchiveTemplateGroup = function () {
    spinnerService.show('archiveTemplateGroupSpinner');
    Templates.enableTemplateGroup(self.templategroup.Id).then(function (data) {
      spinnerService.hide('archiveTemplateGroupSpinner');
      self.templategroup.Enabled = true;
    });
  };
});
