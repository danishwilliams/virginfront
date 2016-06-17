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
    return Restangular.one('reports/instructor/count/state').get();
  }

  function loadActiveInactiveInstructors(days) {
    return Restangular.one('reports/instructor/count/activity', days).get();
  }

  function loadRidesTaughtPerClub(days) {
    return Restangular.one('reports/gym/count/ridestaught', days).get();
  }

  function loadTemplatesUsedInRides(days) {
    return Restangular.one('reports/templates/count/ridestaught', days).get();
  }

  function loadTemplatesUsedByPlaylists(days) {
    return Restangular.one('reports/templates/count/playlists', days).get();
  }
}
