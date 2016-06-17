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
  // To keep track of completed API calls so we can initialize vertilize only once both calls in
  // a row of boxes have completed: active/registered and emails/templates
  var loaded = {
    active: false,
    registered: false,
    emails: false,
    templates: false
  };

  // Load up registered/unregistered instructors
  Reporting.loadRegisteredInstructors().then(function(data) {
    self.registered = {
      registered: 0,
      unregistered: 0
    };
    data.forEach(function(val) {
      if (val.UserState === 'registered') {
        self.registered.registered = self.registered.registered + val.Count;
      }
      else {
        self.registered.unregistered = self.registered.unregistered + val.Count;
      }
    });
    if (self.registered.unregistered === 0) {
      self.registered.percent = 100;
    }
    else {
      self.registered.percent = Math.floor(self.registered.registered / (self.registered.registered + self.registered.unregistered) * 100);
    }
    loaded.registered = true;
    instructorsLoaded();
  });

  // Load up active/inactive instructors
  Reporting.loadActiveInactiveInstructors(14).then(function(data) {
    self.active = {
      active: data.ActiveCount,
      inactive: data.InactiveCount
    };
    if (self.active.inactive === 0) {
      self.active.percent = 100;
    }
    else {
      self.active.percent = Math.floor(self.active.active / (self.active.active + self.active.inactive) * 100);
    }
    loaded.active = true;
    instructorsLoaded();
  });

  function instructorsLoaded() {
    if (loaded.active && loaded.registered) {
      spinnerService.hide('instructors');
    }
  }

  // Load up email failures
  Emails.loadFails(1, 10000).then(function(data) {
    self.emailFailedCount = data.length;
    self.emailLoaded = {loaded: true};
    loaded.emails = true;
    emailsTemplatesDone();
  });

  // Load up top templates which were used to create rides
  Reporting.loadTemplatesUsedByPlaylists(30).then(function(data) {
    data = _.sortBy(data, function (val) {
      return val.Count;
    });
    self.templates = [];
    for (var i = 0; i < 5; i++) {
      if (data[i]) {
        self.templates.push(data[i]);
      }
    }
    loaded.templates = true;
    emailsTemplatesDone();
  });

  function emailsTemplatesDone() {
    if (loaded.emails && loaded.templates) {
      spinnerService.hide('emailsTemplates');
    }
  }

  // Load up top rides per club
  Reporting.loadRidesTaughtPerClub(30).then(function(data) {
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
