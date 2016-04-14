angular
  .module("app")
  .directive("rides", RidesDirective);

RidesDirective.$inject = ['Playlists', 'spinnerService'];

function RidesDirective(Playlists, spinnerService) {
  var directive = {
    link: link,
    templateUrl: 'rides.directive.html',
    restrict: 'E',
    scope: {
      createNew: '@', // Optional: add a link in which allows an instructor to create a new ride
      rides: '@' // Number of rides to load
    },
  };
  return directive;

  function link(scope, element, attrs) {
    var self = scope;
    self.random = Math.floor(Math.random() * 10000);
    self.createNew = scope.createNew;

    if (!self.rides) {
      self.rides = 4;
    }

    Playlists.loadPlaylists(self.rides).then(function (data) {
      self.playlists = data;
      spinnerService.hide('spinner' + self.random);
    });
  }
}
