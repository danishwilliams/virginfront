angular.module("app.template", []).controller('TemplateController', function ($stateParams, Templates, Beats, spinnerService) {
  var self = this;
  this.id = $stateParams.id;
  this.template = {};

  self.effortOptions = [40, 50, 60, 70, 80, 90, 100];
  self.bpmOptions = [60, 70, 80, 90, 100, 110, 120, 130, 140];

  Templates.loadTemplate(this.id).then(function (data) {
    self.template = data;
  });

  Beats.loadBeats().then(function(data) {
    self.beats = data;
  });

  self.saveTemplate = function() {
    spinnerService.show('saveTemplateTimeSpinner');
    self.template.put().then(function() {
      spinnerService.hide('saveTemplateTimeSpinner');
    });
  };
});
