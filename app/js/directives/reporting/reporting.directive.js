angular
  .module("app")
  .directive("reporting", reporting);

function reporting() {
  var directive = {
    templateUrl: '../js/directives/reporting/reporting.directive.html',
    restrict: 'E',
    controller: reportingController,
    controllerAs: 'vm'
  };
  return directive;
}

reportingController.$inject = ['Emails'];

function reportingController(Emails) {
  var self = this;

  // Load up email failures
  Emails.loadFails(1, 10000).then(function(data) {
    var i = 0;
    // This is a restangular array so consists of lots of functions and things. The keys which are integers are actual data. So count those.
    _.keys(data).forEach(function(key) {
      if (key >= 0) {
        i++;
      }
    });
    self.emailFailedCount = i;
  });
}
