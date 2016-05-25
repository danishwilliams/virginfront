angular.module('app').directive('templateLengths', templateLengths);

function templateLengths() {
  var directive = {
    link: link,
    restrict: 'E',
    templateUrl: '../js/directives/template_lengths/template_lengths.directive.html',
    controller: newTemplateController,
    controllerAs: 'vm',
    scope: {
      ngModel: '=',
      action: '@', // displayed as the first (unselectable) option in the select
      excludeLengths: '@' // the class lengths which we shouldn't display
    },
    require: 'ngModel'
  };
  return directive;

  function link(scope, element, attrs, ngModel) {
    // This value isn't here at link time. So we HAVE to inject scope into the controller to get this value. ARGH
    //scope.vm.excludeLengths = scope.excludeLengths;
    scope.vm.selected = function () {
      // This triggers the ng-change on the directive so the parent controller can get the value
      ngModel.$setViewValue(scope.ngModel);
    };
  }
}

newTemplateController.$inject = ['Templates', '$scope'];

function newTemplateController(Templates, $scope) {
  var self = this;

  // Create the list of possible class length options
  self.options = Templates.getClassLengths();

  self.createNewTemplate = function () {
    self.selected();
  };

  self.excludeLength = function(time) {
    if (!$scope.excludeLengths) {
      return;
    }
    if ($scope.excludeLengths.indexOf(time) > -1) {
      return true;
    }
    return false;
  };
}
