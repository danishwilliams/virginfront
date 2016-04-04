angular.module("app.emails", []).controller('EmailsController', function (Emails, Users) {
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
        entry.actionButton = 'resend';
      }
      else if (entry.SpamReport) {
        entry.reason = 'EMAIL_SPAM';
        entry.date = entry.DateSpamReport;
        entry.actionButton = 'resend';
      }
      else if (entry.Bounce) {
        if (entry.BounceReason) {
          entry.reason = entry.BounceReason;
        }
        else {
          entry.reason = 'EMAIL_INVALID';
        }
        entry.date = entry.DateBounce;
        entry.actionButton = 'edit';
      }
      else if (entry.Dropped) {
        if (entry.DroppedReason) {
          entry.reason = entry.DroppedReason;
        }
        else {
          entry.reason = 'EMAIL_INVALID';
        }
        entry.date = entry.DateDropped;
        entry.actionButton = 'edit';
      }
      if (!entry.date) {
        entry.date = entry.CreateDate;
      }

      // Figure out the failure date
    });
  });

  // Resend an email invite to a user
  self.sendInvite = function (entry) {
    entry.sending = true;
    Users.sendInvite(entry.User.Id).then(function() {
      entry.actionButton = false;
      entry.Alert = {
        type: 'success',
        msg: 'Email sent'
      };
    });
  };

  self.editEmail = function (entry) {
    if (!entry.editing) {
      entry.editing = true;
      return;
    }

    entry.editing = false;
    entry.sending = true;

    // Save email address by loading the specific user, setting the new email address, and saving the user
    Users.loadUser(entry.User.Id).then(function(user) {
      user.Email = entry.To;
      user.put().then(function() {
        switch (entry.Communication.Name) {
          case 'Invite':
            // Resend invite email
            self.sendInvite(entry);
            break;
          case 'PasswordReset':
            // Resend password reset email
            Users.resetPassword(user.Email).then(function() {
              entry.actionButton = false;
              entry.Alert = {
                type: 'success',
                msg: 'Email sent'
              };
            });
            break;
        }
      });
    });
  };

});
