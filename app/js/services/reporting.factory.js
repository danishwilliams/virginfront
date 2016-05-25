/**
 * Created by rogersaner on 2016.04.21
 */
angular
  .module("app")
  .factory('Reporting', ReportingFactory);

ReportingFactory.$inject = ['Restangular'];

function ReportingFactory(Restangular) {
  var reportingFactory = {
    loadRegisteredInstructors: loadRegisteredInstructors,
    loadActiveInactiveInstructors: loadActiveInactiveInstructors,
    loadRidesTaughtPerClub: loadRidesTaughtPerClub,
    loadTemplatesUsedInRides: loadTemplatesUsedInRides,
    loadTemplatesUsedByPlaylists: loadTemplatesUsedByPlaylists
  };
  return reportingFactory;

  function loadRegisteredInstructors() {
    return Restangular.one('reports/instructor/count/state').get().then(loadRegisteredInstructorsComplete);

    function loadRegisteredInstructorsComplete(data, status, headers, config) {
      return data;
    }
  }

  function loadActiveInactiveInstructors(days) {
    return Restangular.one('reports/instructor/count/activity', days).get().then(loadActiveInactiveInstructorsComplete);

    function loadActiveInactiveInstructorsComplete(data, status, headers, config) {
      return data;
    }
  }

  function loadRidesTaughtPerClub(days) {
    return Restangular.one('reports/gym/count/ridestaught', days).get().then(loadRidesTaughtPerClubComplete);

    function loadRidesTaughtPerClubComplete(data, status, headers, config) {
      return data;
    }
  }

  function loadTemplatesUsedInRides(days) {
    return Restangular.one('reports/templates/count/ridestaught', days).get().then(loadTemplatesUsedInRidesComplete);

    function loadTemplatesUsedInRidesComplete(data, status, headers, config) {
      return data;
    }
  }

  function loadTemplatesUsedByPlaylists(days) {
    return Restangular.one('reports/templates/count/playlists', days).get().then(loadTemplatesUsedByPlaylistsComplete);

    function loadTemplatesUsedByPlaylistsComplete(data, status, headers, config) {
      return data;
    }
  }
}
