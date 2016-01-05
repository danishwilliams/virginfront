angular
  .module("app")
  .factory('LoggedInRestangular', LoggedInRestangularFactory);

LoggedInRestangularFactory.$inject = ['Restangular'];

function LoggedInRestangularFactory(Restangular) {
  return Restangular.withConfig(function (RestangularConfigurer) {
    RestangularConfigurer.setDefaultHeaders({
      "Authorization": "Token " + localStorage.getItem('token') || ''
    });
  });
}
