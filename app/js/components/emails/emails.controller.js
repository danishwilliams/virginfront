angular.module("app.emails", []).controller('EmailsController', function (Emails) {
  var self = this;

  Emails.loadBounces().then(function(data) {
    self.emails = data;
  });
});
