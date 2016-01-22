angular.module('app').directive('templateLengths', templateLengths);

function templateLengths() {
  var directive = {
    link: link,
    restrict: 'E',
    templateUrl: 'template_lengths.directive.html',
    controller: newTemplateController,
    controllerAs: 'vm',
    scope: {
      ngModel: '=',
      action: '@' // displayed as the first (unselectable) option in the select
    },
    require: 'ngModel'
  };
  return directive;

  function link(scope, element, attrs, ngModel) {
    scope.vm.selected = function () {
      // This triggers the ng-change on the directive so the parent controller can get the value
      ngModel.$setViewValue(scope.ngModel);
    };
  }
}

newTemplateController.$inject = ['Templates'];

function newTemplateController(Templates) {
  var self = this;

  // Create the list of possible class length options
  self.options = Templates.getClassLengths();

  self.createNewTemplate = function () {
    self.selected();
  };
}
