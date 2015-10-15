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
    loadPlaylist: loadPlaylist,
    publishPlaylist: publishPlaylist,
    publishPlaylistToMusicProvider: publishPlaylistToMusicProvider
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

  function publishPlaylist(id) {
    return Restangular.one('playlists/sync', id).post().then(publishPlaylistComplete);

    function publishPlaylistComplete(data, status, headers, config) {
      return data;
    }
  }

  /**
   * Publishes a playlist to a Music Provider i.e. creates/edits a playlist on Simfy
   */
  function publishPlaylistToMusicProvider(id) {
    return Restangular.one('music/playlist', id).post().then(publishPlaylistToMusicProviderComplete);

    function publishPlaylistToMusicProviderComplete(data, status, headers, config) {
      console.log(data);
      // TODO: build in error handling here if this fails
      return data;
    }
  }

}
