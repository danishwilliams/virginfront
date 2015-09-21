/**
 * Created by rogersaner on 15/09/21.
 */
angular
  .module("app")
  .factory('TracksFactory', TracksFactory);

function TracksFactory() {
  return {
    tracks: [], // A list of track objects
    playertrack: [] // The track loaded to the player
  };
}
