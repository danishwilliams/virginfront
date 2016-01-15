angular.module("app.templategroup_view", []).controller('Templategroup_viewController', function ($stateParams, Templates) {
  var self = this;
  this.id = $stateParams.id;
  this.templategroup = {};

  console.log(this.id);

  Templates.loadTemplateGroup(this.id).then(function(data) {
    self.templategroup = data;
  });

});
