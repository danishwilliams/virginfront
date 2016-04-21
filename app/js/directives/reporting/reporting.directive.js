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

reportingController.$inject = ['Emails', 'Reporting', 'spinnerService'];

function reportingController(Emails, Reporting, spinnerService) {
  var self = this;

  // Load up registered/unregistered instructors
  Reporting.loadRegisteredInstructors().then(function(data) {
    self.registered = {
      registered: 0,
      unregistered: 0
    };
    data.forEach(function(val) {
      if (val.UserState === 'registered') {
        self.registered.registered++;
      }
      else {
        self.registered.unregistered++;
      }
    });
    spinnerService.hide('reportRegSpinner');
  });

  // Load up active/inactive instructors
  Reporting.loadActiveInactiveInstructors(14).then(function(data) {
    self.active = {
      active: data.ActiveCount,
      inactive: data.InactiveCount
    };
    spinnerService.hide('reportActiveSpinner');
  });

  // Load up email failures
  Emails.loadFails(1, 10000).then(function(data) {
    self.emailFailedCount = data.length;
    spinnerService.hide('reportEmailSpinner');
  });

  // Load up top templates
  Reporting.loadTemplatesUsedInRides(14).then(function(data) {
    self.templates = data;
    spinnerService.hide('reportTemplatesSpinner');
  });

  // Load up top rides per club
  Reporting.loadRidesTaughtPerClub(14).then(function(data) {
    self.templates = data;
    spinnerService.hide('reportClubSpinner');
  });
}
