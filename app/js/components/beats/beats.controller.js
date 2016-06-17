/*
angular.module("app.beats", []).controller('BeatsController', function (Beats) {
  var self = this;

  Beats.loadBeats().then(function(data) {
    self.beats = data;
  });
});

<h1>Beats</h1>

<table>
  <thead>
    <tr>
      <td>Beat name</td>
      <td>Beat ratio</td>
      <td>ID</td>
    </tr>
  </thead>
  <tbody>
    <tr ng-repeat="beat in beats.beats | orderBy:'Name'">
      <td>{{beat.Name}}</td>
      <td>{{beat.Ratio}}</td>
      <td>{{beat.Id}}</td>
    </tr>
  </tbody>
</table>
*/