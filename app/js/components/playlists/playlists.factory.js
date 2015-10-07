/**
 * Created by rogersaner on 28/09/21.
 */
angular
  .module("app")
  .factory('Playlists', PlaylistsFactory);

PlaylistsFactory.$inject = ['Restangular'];

function PlaylistsFactory(Restangular) {
  var self = this;
  var playlists = [];

  var playlistsFactory = {
    loadPlaylists: loadPlaylists,
    getPlaylists: getPlaylists,
    loadPlaylist: loadPlaylist
  };

  return playlistsFactory;

  function loadPlaylists() {
    return Restangular.one('playlists').get({
      includeGoals: false
    }).then(loadPlaylistsComplete);

    function loadPlaylistsComplete(data, status, headers, config) {
      self.playlists = data;
      return self.playlists;
    }
  }

  function getPlaylists() {
    return playlists;
  }

  function loadPlaylist(id) {
    return Restangular.one('playlists', id).get({
      includeGoals: true
    }).then(loadPlaylistComplete);

    function loadPlaylistComplete(data, status, headers, config) {
      return data;
    }
  }

}
