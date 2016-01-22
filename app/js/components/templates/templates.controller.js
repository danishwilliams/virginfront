angular.module("app.templates", []).controller('TemplatesController', function (Templates, spinnerService) {
  var self = this;

  self.activeLoaded = function () {
    if (self.active >= 0 && self.inactive >= 0) {
      spinnerService.hide('templatesSpinner');
    }
  };
});
