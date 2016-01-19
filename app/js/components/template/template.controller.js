angular.module("app.template", []).controller('TemplateController', function ($stateParams, Templates) {
  var self = this;
  this.id = $stateParams.id;
  this.template = {};

  $scope.effortOptions = [40, 50, 60, 70, 80, 90, 100];

  Templates.loadTemplate(this.id).then(function (data) {
    self.template = data;
  });

});
