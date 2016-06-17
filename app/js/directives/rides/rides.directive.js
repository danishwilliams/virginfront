angular
  .module("app")
  .directive("rides", RidesDirective);

RidesDirective.$inject = ['Playlists', 'spinnerService'];

function RidesDirective(Playlists, spinnerService) {
  var directive = {
    link: link,
    templateUrl: '../js/directives/rides/rides.directive.html',
    restrict: 'E',
    scope: {
      createNew: '@', // Optional: add a link in which allows an instructor to create a new ride
      rides: '@', // Number of rides to load
      userId: '@', // Optional: the user id for which to load up the rides for
      userName: '@', // Optional: the user's name, to show when they don't have any rides
      viewingOwnUserProfile: '@', // Optional: whether the current user is viewing their own user profile or not
      complete: '@' // Optional: whether to show complete or incomplete playlists (default: all)
    },
  };
  return directive;

  function link(scope, element, attrs) {
    var self = scope;
    if (!self.viewingOwnUserProfile) {
      self.viewingOwnUserProfile = true;
    }
    self.random = Math.floor(Math.random() * 10000);

    if (!self.rides) {
      self.rides = 4;
    }

    Playlists.loadPlaylists(self.rides, self.userId, self.complete).then(function (data) {
      // TODO: this can be removed once the Playlists.loadPlaylists() endpoint has been adjusted to only return
      // complete/incomplete playlists
      if (self.complete !== undefined) {
        self.playlists = [];
        data.forEach(function(val) {
          if (val.Complete.toString() === self.complete) {
            self.playlists.push(val);
          }
        });
      }
      else {
        self.playlists = data;
      }
      spinnerService.hide('spinner' + self.random);
    });
  }
}
