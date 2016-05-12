angular.module("app.templategroup_view", []).controller('Templategroup_viewController', function ($stateParams, $state, Templates, spinnerService) {
  var self = this;
  this.id = $stateParams.id;
  this.templategroup = {};
  self.classLengths = []; // List of template times this template group contains

  // TODO: refactor templategroup-new so that we don't have to duplicate adding/editing templates

  // If a template has just been saved or added, show that message
  self.messages = Templates.getMessages();

  if ($state.current.name === 'templategroup') {
    // Viewing/editing a template group
    Templates.loadTemplateGroup(this.id).then(function (data) {
      self.templategroup = data;
      spinnerService.hide('loadTemplateGroupSpinner');

      Templates.loadTemplateGroupClasses(self.id).then(function (data) {
        spinnerService.hide('loadClassLengthsSpinner');
        self.templategroup.ClassLengths = data.TemplateClassLength;
        self.templategroup.ClassLengths.forEach(function (template) {
          self.classLengths.push(template.ClassLengthMinutes);
        });
      });
    });
  } else {
    // Creating a template group
    self.templategroup = Templates.createBlankTemplateGroup();
  }

  self.iconFileNames = [
    '',
    'allterrain.svg',
    'hills.svg',
    'intervals.svg',
    'pack.svg',
    'speed.svg',
    'strengthendurance.svg'
  ];

  self.types = ['ride', 'pack'];

  // If freestyle hasn't been created yet, add it in
  Templates.loadTemplateGroups().then(function(data) {
    var freestyleExists = false;
    data.forEach(function(val) {
      if (val.Type === 'freestyle') {
        freestyleExists = true;
      }
    });
    if (!freestyleExists) {
      self.types.push('freestyle');
      self.iconFileNames.push('freestyle');
    }
  });

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
    self.form.$setPristine();
    self.edit = false;
  };

  function validateTemplateGroup() {
    if (!self.templategroup.Name || !self.templategroup.Description || !self.templategroup.IconFileName || !self.templategroup.Type) {
      return false;
    }
    return true;
  }

  self.saveTemplateGroup = function () {
    if (!validateTemplateGroup()) {
      return;
    }

    spinnerService.show('saveTemplateSpinner');
    self.templategroup.put().then(function () {
      if (self.templategroup.NewTemplate) {
        Templates.setMessage('success', 'TEMPLATE_ADDED');
        $state.go('templategroup', {
          id: self.templategroup.Id
        });
      } else {
        spinnerService.hide('saveTemplateSpinner');
        self.edit = false;
        self.alerts = [{
          type: 'success',
          msg: 'TEMPLATE_EDITED'
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
      active: true,
      visible:true
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
      self.messages = [{
        type: 'success',
        msg: TEMPLATE_ARCHIVED
      }];
    });
  };

  self.unArchiveTemplateGroup = function () {
    spinnerService.show('archiveTemplateGroupSpinner');
    Templates.enableTemplateGroup(self.templategroup.Id).then(function (data) {
      spinnerService.hide('archiveTemplateGroupSpinner');
      self.templategroup.Enabled = true;
      self.messages = [{
        type: 'success',
        msg: TEMPLATE_UNARCHIVED
      }];
    });
  };
});
