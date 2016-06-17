/*
angular.module("app.genres", []).controller('GenresController', function (Genres) {
  var self = this;

  Genres.loadGenres().then(function(data) {
    self.genres = data;
  });

  this.update = function (genre) {
    genre.put();
  };
});

<h1>Genres</h1>

<table>
  <thead>
    <tr>
      <td>Genre</td>
      <td>Id</td>
    </tr>
  </thead>
  <tbody>
    <tr ng-repeat="genre in genres.genres | orderBy:'Name'">
      <td contentEditable ng-change="genre.update(genre)" ng-model-options="{updateOn : 'change blur'}" ng-model="genre.Name"></td>
      <td>{{genre.Id}}</td>
    </tr>
  </tbody>
</table>
*/