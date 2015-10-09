angular.module("app").config(function (RestangularProvider) {
  /*
   * Restangular config
   */
  //set the base url for api calls on our RESTful services
  var newBaseUrl = "";
  if (window.location.hostname === "localhost") {
    newBaseUrl = "http://localhost:8000/varockstar/api/"; // Dane's laptop, via ../config/proxy.js
    newBaseUrl = "http://localhost:8000/api/1.0/"; // dev
  } else {
    var deployedAt = window.location.href.substring(0, window.location.href);
    newBaseUrl = deployedAt + "/api/rest/register";
  }
  RestangularProvider.setBaseUrl(newBaseUrl);

  // The API's default id is Id with CamelCase
  RestangularProvider.setRestangularFields({
    id: "Id"
  });

  // Add a secret key as URL parameters into every request
  RestangularProvider.setDefaultRequestParams({
    apikey: "secret key"
  });

  // DELETEs are sent without a body
  RestangularProvider.setRequestInterceptor(function(elem, operation) {
    if (operation === "remove") {
       return null;
    }
    return elem;
  });

  // Requests specify that we want JSON
  RestangularProvider.addFullRequestInterceptor(function (element, operation, route, url, headers, params) {
    if (operation === 'put' && route === 'goals') {
      //console.log(element);
      //console.log(params);
      //element = 
    }
    return {
      headers: {
        'Content-Type': 'application/json'
      }
    };
  });

  // TODO: figure out how to retry requests

  RestangularProvider.addResponseInterceptor(function (data, operation, what, url, response, deferred) {
    var extractedData;
    console.log('Restangular operation: ' + operation + ', on ' + what + ' at ' + url);

    if (data.Message === 'An error has occurred.') {
      console.log('[ERROR] API down!');
      return '';

      /*
      Can't inject $http at this stage so probably move the entire function into .run
      $http.get('/api/1.0/' . what).then(function(data) {
        console.log(data);
        extractedData = data.data;
      });
      */
    }
    return data;
  });

  RestangularProvider.setErrorInterceptor(function (response, deferred, responseHandler) {
    if (response.status === 500) {
      console.log('[ERROR] Internal Server Error');
    }
    if (response.status === 403) {
      refreshAccesstoken().then(function () {
        // Repeat the request and then call the handlers the usual way.
        $http(response.config).then(responseHandler, deferred.reject);
        // Be aware that no request interceptors are called this way.
      });

      return false; // error handled
    }

    return true; // error not handled
  });

});
