/**
 * Created by rogersaner on 15/09/03.
 */
angular.module("app").factory('ApiService', function($http) {
  var api = 'config/stubs/';
  var version = 'v1.0';

  // these routes map to stubbed API endpoints in config/server.js
  return {
    getRideTypes: function() {
      console.log('getRideTypes()');
      return $http.get(api + version + '/ride_types');
    }
  };
});
