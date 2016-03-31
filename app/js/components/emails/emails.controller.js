angular.module("app.emails", []).controller('EmailsController', function (Emails) {
  var self = this;

  // @see https://sendgrid.com/docs/API_Reference/Webhooks/event.html for what the values mean

  Emails.loadLogs(1, 10).then(function(data) {
    self.logs = data;
  });

  Emails.loadFails(1, 10).then(function(data) {
    self.fails = data;
  });
});
