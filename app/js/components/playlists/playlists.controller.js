angular.module("app.playlists", []).controller('PlaylistsController', function (PlaylistEdit) {
	var self = this;
	this.playlists = PlaylistEdit.getPlaylists();
	this.newplaylist = {};

	PlaylistEdit.loadPlaylists(10).then(function(data) {
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