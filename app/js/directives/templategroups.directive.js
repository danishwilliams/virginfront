angular.module('app').directive('templategroups', function () {
  var directive = {
    link: link,
    restrict: 'E',
    controller: templateGroupsController,
    controllerAs: 'vm',
    templateUrl: 'templategroups.directive.html',
    scope: {
      kind: '@'
    }
  };
  return directive;

  function link(scope, element, attrs) {
    scope.vm.kind = scope.kind;
  }
});

templateGroupsController.$inject = ['Templates'];

function templateGroupsController(Templates) {
  var self = this;

  Templates.loadTemplateGroups(true).then(function (templateGroups) {
    self.templateGroups = templateGroups;

    templateGroups.forEach(function (val) {
      val.visible = false;
      if ((self.kind === 'active' && val.Enabled === true) || (self.kind === 'inactive' && val.Enabled === false)) {
        val.visible = true;
        Templates.loadTemplateGroupClasses(val.Id).then(function (data) {
          // TODO: there *must* be a way of updating an object within an array rather than searching through it by ID
          // There is!!!! https://www.jonathanfielding.com/combining-promises-angular/
          // Nah - that's a pattern for making multiple API calls which don't depend on each other
          // Also see http://blog.xebia.com/2014/02/23/promises-and-design-patterns-in-angularjs/
          var found = false;
          _.mapObject(self.templateGroups, function (val, key) {
            if (!found && val.Id === data.TemplateGroupId) {
              found = true;
              val.ClassLengths = data.TemplateClassLength;
            }
            return val;
          });
        });
      }
    });
  });
}
