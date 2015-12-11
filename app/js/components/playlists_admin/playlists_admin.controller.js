angular.module("app.playlists_admin", []).controller('PlaylistsAdminController', function (Playlists) {
	var self = this;
	this.playlists = Playlists.getPlaylists();
	this.newplaylist = {};

	Playlists.loadPlaylists(100).then(function(data) {
		self.playlists = data;
	});

	this.delete = function(template) {
		// TODO: fill this out
	};

});