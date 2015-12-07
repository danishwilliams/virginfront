angular
  .module("app")
  .directive("backgroundMusic", backgroundMusic);

function backgroundMusic() {
  var directive = {
    templateUrl: 'background_music.directive.html',
    restrict: 'E',
    controller: backgroundMusicController,
    controllerAs: 'vm',
    scope: {
      ngModel: '='
    },
    //require: '?ngModel',
    require: 'ngModel',
    //link: link
  };
  return directive;

  function link(scope, element, attrs, ngModel) {
    scope.selected = function (id) {
      // This triggers the ng-change on the directive so the parent controller can get the value
      //ngModel.$setViewValue(scope.vm.goals[id]);
      // reset select list to not select anything
      //scope.vm.goalArrayId = undefined;
    };
  }
}

backgroundMusicController.$inject = ['$scope'];

function backgroundMusicController($scope) {
  var self = this;
  //console.log($scope);

  //console.log($parent.ngModel);

  //self.tracks = $scope.tracks;
}
