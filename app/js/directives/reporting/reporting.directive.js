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
    self.rides = data;
    var top = 0;
    // Find the highest value
    self.rides.forEach(function(val) {
      if (val.Count > top) {
        top = val.Count;
      }
    });

    // Use this as a baseline to figure out what percentage each ride is
    self.rides.forEach(function(val) {
      val.Percent = Math.floor(val.Count / top * 100);
    });
    spinnerService.hide('reportClubSpinner');
  });
}
