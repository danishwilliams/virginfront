angular
  .module("app")
  .directive("recentClasses", RecentClassesDirective);

RecentClassesDirective.$inject = ['Playlists', 'spinnerService'];

function RecentClassesDirective(Playlists, spinnerService) {
  var directive = {
    link: link,
    templateUrl: '../js/directives/recent_classes/recent_classes.directive.html',
    restrict: 'E',
    scope: {
      classes: '@', // Number of classes to load
      userId: '@' // Optional: the user id for which to load up the recent classes for
    },
  };
  return directive;

  function link(scope, element, attrs) {
    var self = scope;
    self.random = Math.floor(Math.random() * 10000);

    if (!self.classes) {
      self.classes = 4;
    }

    Playlists.loadRecentClasses(self.classes, self.userId).then(function (data) {
      self.classes = data;
      spinnerService.hide('spinner' + self.random);
    });
  }
}
