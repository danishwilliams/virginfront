/*
angular.module("app.tracks", []).controller('TracksController', function (TracksFactory) {
  var self = this;

  TracksFactory.loadTracks().then(function (data) {
    self.tracks = data;
  });

  this.update = function (track) {
    track.put();
  };
});
*/

/*

<h1>Tracks</h1>

<table>
  <thead>
    <tr>
      <td>Track name</td>
      <td>Artist</td>
      <td>Album</td>
      <td>BPM</td>
      <td>Cover image</td>
      <td>Duration</td>
      <td>Genre</td>
      <td>Music Provider</td>
      <td>Music Provider Track ID</td>
      <td>URL</td>
      <td>Track ID</td>
    </tr>
  </thead>
  <tbody>
    <tr ng-repeat="track in tracks.tracks | orderBy:'Artist'">
      <td contentEditable ng-change="tracks.update(track)" ng-model-options="{updateOn : 'change blur'}" ng-model="track.Name"></td>
      <td>{{track.Artist}}</td>
      <td>{{track.Album}}</td>
      <td>{{track.Bpm}}</td>
      <td><img width="60px" src="{{track.CoverImgUrl}}"></td>
      <td>{{track.DurationSeconds}}</td>
      <td>{{track.Genre.Name}}</td>
      <td>{{track.MusicProvider.Name}}</td>
      <td>{{track.MusicProviderTrackId}}</td>
      <td>{{track.Source}}</td>
      <td>{{track.Id}}</td>
    </tr>
  </tbody>
</table>

*/