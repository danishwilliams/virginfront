angular
  .module("app", [
    "ngResource",
    "ngSanitize",
    "ngNewRouter",
    "app.login",
    "app.goals",
    "app.playlist",
    "pascalprecht.translate",
    "restangular"])
  .controller("AppController", ['$router', AppController])
  .config(function ($componentLoaderProvider, RestangularProvider) {
    /*
     * overriding the template mapping of the new router to make it
     * compatible with grunt-angular-templates
     */
    $componentLoaderProvider.setTemplateMapping(function (name) {
      var dashName = dashCase(name);
      return '../js/components/' + dashName + '/' + dashName + '.html';
    });

    /*
     * Restangular config
     */
     //set the base url for api calls on our RESTful services
    var newBaseUrl = "";
    if (window.location.hostname === "localhost") {
      newBaseUrl = "http://localhost:8000/varockstar/api/"; // Dane's laptop
      newBaseUrl = "http://localhost:8000/api/1.0/"; // dev
    } else {
      var deployedAt = window.location.href.substring(0, window.location.href);
      newBaseUrl = deployedAt + "/api/rest/register";
    }
    RestangularProvider.setBaseUrl(newBaseUrl);

    RestangularProvider.setDefaultRequestParams({apikey: "secret key"});

    RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
      var extractedData;
      console.log('Restangular operation: ' + operation + ', on ' + what + ' at ' + url);
      // .. to look for getList operations
      if (operation === "getList") {
        // .. and handle the data and meta data

        //data.message = 'An error has occurred.';

        if (data.message === 'An error has occurred.') {
          console.log('[ERROR] API down! Reverting to local fallback');
          console.log(url);
          console.log(what);

          /*
          Can't inject $http at this stage so probably move the entire function into .run
          $http.get('/api/1.0/' . what).then(function(data) {
            console.log(data);
            extractedData = data.data;
          });
          */

        }
        else {
          extractedData = data.ResponseObject;
          extractedData.Success = data.Success;
          extractedData.FailureMessage = data.FailureMessage;
          extractedData.FriendlyFailureMessage = data.FriendlyFailureMessage;
        }
      } else {
        extractedData = data.data;
      }
      return extractedData;
    });
  });

function AppController($router) {
  $router.config([
    {path: '/', redirectTo: '/login'},
    {path: '/login', component: 'login'},
    {path: '/admin/goals', component: 'goals'},
    {path: '/playlist-create', component: 'playlist'},
  ]);
}
