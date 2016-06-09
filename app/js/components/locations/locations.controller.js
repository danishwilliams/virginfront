/*
angular.module("app.locations", []).controller('LocationsController', function (Locations, Restangular, uuid2) {
  var self = this;

  Locations.loadLocations().then(function (data) {
    self.locations = data;
  });

  this.update = function (location) {
    location.put();
  };

  this.create = function () {
    Restangular.one("locations", self.newLocation.Id).customPUT(self.newLocation).then(function () {
      self.locations.push(self.newLocation);
      self.createBlankLocation();
    });
  };

  this.createBlankLocation = function () {
    self.newLocation = {
      Id: uuid2.newuuid().toString()
    };
  };

  self.createBlankLocation();
});

<h1>Locations</h1>
<table>
  <thead>
    <tr>
      <td>City</td>
      <td>Province</td>
      <td>Country</td>
      <td>Country code</td>
      <td>Location ID</td>
    </tr>
  </thead>
  <tbody>
    <tr ng-repeat="location in locations.locations | orderBy:'Country.Name'">
      <td contentEditable ng-change="locations.update(location)" ng-model-options="{updateOn : 'change blur'}" ng-model="location.City"></td>
      <td>{{location.Province}}</td>
      <td>{{location.Country.Name}}</td>
      <td>{{location.Country.Code}}</td>
      <td>{{location.Id}}</td>
    </tr>
    <tr>
      <td colspan="5"><h5>Add new location</h5></td>
    </tr>
    <tr>
      <td><input type="text" placeholder="City" ng-model="locations.newLocation.City"></td>
      <td><input type="text" placeholder="Province" ng-model="locations.newLocation.Province"></td>
      <td colspan="2"><country ng-model="locations.newLocation.CountryId"></country></td>
      <td>
        <button ng-click="locations.create()" type="button" class="tiny round">Add new location</button>
      </td>
    </tr>
  </tbody>
</table>

*/