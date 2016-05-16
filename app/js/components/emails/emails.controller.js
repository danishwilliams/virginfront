angular.module("app.emails", []).controller('EmailsController', function (Emails, Users, $scope) {
  var self = this;
  self.query = '';

  // @see https://sendgrid.com/docs/API_Reference/Webhooks/event.html for what the values mean

  Emails.loadLogs(1, 30, true).then(function(data) {
    self.logs = data;
    self.logs.forEach(function(entry) {
      if (entry.DateDelivered) {
        entry.date = entry.DateDelivered;
        entry.reason = 'EMAIL_DELIVERED';
        entry.class = 'delivered';
      }
      else {
        entry.date = entry.CreateDate;
        entry.reason = 'EMAIL_SENT';
        entry.class = 'sent';
      }
      if (entry.Communication && entry.Communication.Name === 'Invite') {
        entry.actionButton = 'resend';
      }
    });
  });

  self.fails = [];

  Emails.loadFails(1, 30).then(function(data) {
    self.fails = data;
    self.failsLoaded = true;
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
        title: 'Email sent',
        msg: 'Pending receipt'
      };
    });
  };

  self.saveEmail = function (entry) {
    entry.editing = false;
    entry.sending = true;
    entry.Alert = undefined;

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
                title: 'Email sent',
                msg: 'Pending receipt'
              };
            });
            break;
        }
      }, function (res) {
        entry.editing = true;
        entry.sending = false;
        entry.actionButton = 'editing';
        if (res.data.Message === 'Email address already exists') {
          entry.emailerror = true;
        }
        else {
          entry.Alert = {
            type: 'danger',
            msg: res.data.Message
          };
        }
      });
    });
  };

  self.editEmail = function (entry) {
    entry.actionButton = 'editing';
    if (!entry.editing) {
      entry.editing = true;
    }
  };

  self.entryFilter = function(entry) {
    self.query = self.query.toLowerCase();
    if (entry.User.FirstName && entry.User.FirstName.toLowerCase().indexOf(self.query) > -1) {
      return entry;
    }
    else if (entry.User.LastName && entry.User.LastName.toLowerCase().indexOf(self.query) > -1) {
      return entry;
    }
    else if (entry.User.Email && entry.User.Email.toLowerCase().indexOf(self.query) > -1) {
      return entry;
    }
    else if (self.query.indexOf(' ') > -1) {
      var firstName = self.query.substring(0, self.query.indexOf(' '));
      var lastName = self.query.substring(self.query.indexOf(' '));
      if (entry.User.FirstName && entry.User.FirstName.toLowerCase().indexOf(firstName) > -1) {
        return entry;
      }
      else if (entry.User.LastName && entry.User.LastName.toLowerCase().indexOf(lastName) > -1) {
        return entry;
      }
    }
  };

});
