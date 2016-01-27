angular.module("app.templategroup_view", []).controller('Templategroup_viewController', function ($stateParams, $state, Templates, spinnerService) {
  var self = this;
  this.id = $stateParams.id;
  this.templategroup = {};

  if ($state.current.name === 'templategroup') {
    // Viewing/editing a template group
    Templates.loadTemplateGroup(this.id).then(function (data) {
      self.templategroup = data;
      console.log(self.templategroup);
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

  self.types = ['ride', 'pack', 'freestyle'];

  self.editClick = function () {
    self.edit = true;
    self.snapshot = {
      name: self.templategroup.Name,
      description: self.templategroup.Description,
      icon: self.templategroup.IconFileName
    };
  };

  self.editCancelled = function () {
    self.templategroup.Name = self.snapshot.name;
    self.templategroup.Description = self.snapshot.description;
    self.templategroup.IconFileName = self.snapshot.icon;
    self.edit = false;
  };

  self.saveTemplateGroup = function () {
    spinnerService.show('saveTemplateSpinner');
    self.templategroup.put().then(function () {
      if (self.templategroup.NewTemplate) {
        $state.go('templategroup', {id: self.templategroup.Id});
      }
      else {
        spinnerService.hide('saveTemplateSpinner');
        self.edit = false;
        self.alerts = [{
          type: 'success',
          msg: 'Template successfully saved!'
        }];
      }
    });
  };

  self.createNewTemplate = function () {
    var template = {
      ClassLengthMinutes: self.mins,
      Enabled: true,
      TemplateId: self.templategroup.Id,
      CreateNew: true,
      active: true
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
