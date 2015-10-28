angular
  .module("app")
  .directive("ride", RideDirective);

function RideDirective() {
  var directive = {
    link: link,
    templateUrl: 'ride.directive.html',
    restrict: 'EA',
    controller: rideController,
    controllerAs: 'ride'
  };
  return directive;

  function link(scope, element, attrs) {}
}

rideController.$inject = ['$scope'];

function rideController($scope) {
  //console.log($scope.playlist);
  $scope.images = [];
  var $i = 0;
  $scope.playlist.CoverImages.forEach(function (image) {
    if ($i > 2) {
      return;
    }
    $scope.images.push({
      src: image
    });
    $i++;
  });
}
