/**
 * Created by rogersaner on 15/09/21.
 */
angular
  .module("app")
  .factory('PlaylistFactory', PlaylistFactory);

function PlaylistFactory() {
  // An array of goal playlists. Each goal playlist contains an array of tracks.
  return {
    playlist: [],
    goals: [],
    name: '',
    currentgoal: {id: 0, bpm_low: 0, bpm_high: 0} // The currently selected goal which tracks can be added to
  };
}
