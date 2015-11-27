angular.module("app.playlists", []).controller('PlaylistsController', function (Playlists) {
	var self = this;
	this.playlists = Playlists.getPlaylists();
	this.newplaylist = {};

	Playlists.loadPlaylists(100).then(function(data) {
		self.playlists = data;
	});

	this.update = function(template) {
		// TODO: fill this out
	};

	this.delete = function(template) {
		// TODO: fill this out
	};

	this.create = function() {
		// TODO: fill this out
	};
});