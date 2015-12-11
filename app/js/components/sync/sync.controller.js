angular.module("app.sync", []).controller('SyncController', function ($routeParams, Sync) {
  var self = this;
  this.title = "Sync";
  this.id = $routeParams.id;

  Sync.loadSync().then(function (data) {
    self.sync = data;
  });
});
