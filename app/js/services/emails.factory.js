// @see https://sendgrid.com/docs/API_Reference/Webhooks/event.html for what the values mean

angular
  .module("app")
  .factory('Emails', EmailsFactory);

EmailsFactory.$inject = ['Restangular'];

function EmailsFactory(Restangular) {
  //var self = this;

  var emailsFactory = {
    loadBounces: loadBounces,
    loadLogs: loadLogs,
    loadFails: loadFails
  };
  return emailsFactory;

  function loadBounces() {
    return Restangular.all('communications/email/bounces').get('').then(loadBouncesComplete);

    function loadBouncesComplete(data, status, headers, config) {
      return data.EmailBounceList;
    }
  }

  function loadLogs(page, resultCount, userId, communicationName) {
    var parameters = setupLogParameters(page, resultCount, communicationName, userId);
    return Restangular.all('communications/logs').get('', parameters).then(loadLogsComplete);

    function loadLogsComplete(data, status, headers, config) {
      return data;
    }
  }

  function loadFails(page, resultCount, communicationName) {
    var parameters = setupLogParameters(page, resultCount, communicationName);
    return Restangular.all('communications/logs/fail').get('', parameters).then(loadFailsComplete);

    function loadFailsComplete(data, status, headers, config) {
      return data;
    }
  }

  /**
   * For use in loadLogs() and loadFails()
   */
  function setupLogParameters(page, resultCount, communicationName, userId) {
    if (!page) {
      page = 1;
    }
    if (!resultCount) {
      resultCount = 10;
    }
    var parameters = {
      page: page,
      resultCount: resultCount
    };
    if (communicationName) {
      parameters.communicationName = communicationName;
    }
    if (userId) {
      parameters.userId = userId;
    }
    return parameters;
  }
}
