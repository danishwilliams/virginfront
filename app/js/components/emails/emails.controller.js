angular.module("app.emails", []).controller('EmailsController', function (Emails) {
  var self = this;

  // @see https://sendgrid.com/docs/API_Reference/Webhooks/event.html for what the values mean

  Emails.loadLogs(1, 10).then(function(data) {
    self.logs = data;
  });

  Emails.loadFails(1, 10).then(function(data) {
    self.fails = data;
    self.fails.forEach(function(entry) {
      // Figure out the failure reason, date, and what action to take
      if (entry.Deferred) {
        entry.reason = 'EMAIL_DEFERRED';
        entry.date = entry.DateDeferred;
        entry.action = 'EMAIL_RESEND';
      }
      else if (entry.SpamReport) {
        entry.reason = 'EMAIL_SPAM';
        entry.date = entry.DateSpamReport;
        entry.action = 'EMAIL_RESEND';
      }
      else if (entry.Bounce) {
        if (entry.BounceReason) {
          entry.reason = entry.BounceReason;
        }
        else {
          entry.reason = 'EMAIL_INVALID';
        }
        entry.date = entry.DateBounce;
        entry.action = 'EMAIL_EDIT';
      }
      else if (entry.Dropped) {
        if (entry.DroppedReason) {
          entry.reason = entry.DroppedReason;
        }
        else {
          entry.reason = 'EMAIL_INVALID';
        }
        entry.date = entry.DateDropped;
        entry.action = 'EMAIL_EDIT';
      }
      if (!entry.date) {
        entry.date = entry.CreateDate;
      }

      // Figure out the failure date
    });
  });
});
