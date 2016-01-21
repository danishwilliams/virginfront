angular.module("app.templates", []).controller('TemplatesController', function (Templates, spinnerService) {
  var self = this;

  self.activeLoaded = function () {
    spinnerService.hide('templatesSpinner');
  };
});
