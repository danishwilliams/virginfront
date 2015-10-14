angular.module("app.sync", []).controller('SyncController', function ($routeParams, Sync) {
  var self = this;
  this.title = "Sync";
  this.id = $routeParams.id;

  // TODO: bug fix for "Controller loads twice" @see https://github.com/angular/router/issues/204
  if (!self.sync) {
	  Sync.loadSync().then(function(data) {
	    self.sync = data;
	  });
	}
});
