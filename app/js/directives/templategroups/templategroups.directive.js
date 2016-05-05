angular.module('app').directive('templategroups', function () {
  var directive = {
    link: link,
    restrict: 'E',
    controller: templateGroupsController,
    controllerAs: 'vm',
    templateUrl: '../js/directives/templategroups/templategroups.directive.html',
    scope: {
      kind: '@',
      ngModel: '='
    },
    require: 'ngModel'
  };
  return directive;

  function link(scope, element, attrs, ngModel) {
    scope.vm.kind = scope.kind;
    scope.vm.setModelValue = function(val) {
      scope.ngModel = val;
      ngModel.$setViewValue(scope.ngModel);
    };
  }
});

templateGroupsController.$inject = ['Templates', 'spinnerService'];

function templateGroupsController(Templates, spinnerService) {
  var self = this;

  Templates.loadTemplateGroups().then(function (templateGroups) {
    self.templateGroups = templateGroups;

    var i = 0;

    templateGroups.forEach(function (val) {
      val.visible = false;
      if ((self.kind === 'active' && val.Enabled === true) || (self.kind === 'inactive' && val.Enabled === false)) {
        i++;
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
          spinnerService.hide('templates' + val.Id + 'Spinner');
        });
      }
    });
    self.setModelValue(i);
  });
}
