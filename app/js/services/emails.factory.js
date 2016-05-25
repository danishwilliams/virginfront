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

  /**
   * Email logs
   *
   * @param page
   *   Optional. Defaults to 1
   * @param resultCount
   *   Optional. Defaults to 10
   * @param userId
   *   Optional. The ID of the user to load the logs for.
   * @param communicationName
   *   Optional. String. The name of the communication we're interested in.
   */
  function loadLogs(page, resultCount, success, userId, communicationName) {
    var parameters = setupLogParameters(page, resultCount, communicationName, userId, success);
    return Restangular.all('communications/logs').get('', parameters).then(loadLogsComplete);

    function loadLogsComplete(data, status, headers, config) {
      return _convertDates(data);
    }
  }

  /**
   * Email failures
   *
   * @param page
   *   Optional. Defaults to 1
   * @param resultCount
   *   Optional. Defaults to 10
   * @param communicationName
   *   Optional. String. The name of the communication we're interested in.
   */
  function loadFails(page, resultCount, communicationName) {
    var parameters = setupLogParameters(page, resultCount, communicationName);
    return Restangular.all('communications/logs/fail').get('', parameters).then(loadFailsComplete);

    function loadFailsComplete(data, status, headers, config) {
      return _convertDates(data);
    }
  }

  function _convertDates(data) {
    if (!_.isArray(data)) {
      return data;
    }
    data.forEach(function(val) {
      if (val.CreateDate) { val.CreateDate = new Date(val.CreateDate);}
      if (val.DateBounce) { val.DateBounce = new Date(val.DateBounce);}
      if (val.DateClicked) { val.DateClicked = new Date(val.DateClicked);}
      if (val.DateDeferred) { val.DateDeferred = new Date(val.DateDeferred);}
      if (val.DateDelivered) { val.DateDelivered = new Date(val.DateDelivered);}
      if (val.DateDropped) { val.DateDropped = new Date(val.DateDropped);}
      if (val.DateOpen) { val.DateOpen = new Date(val.DateOpen);}
      if (val.DateProcessed) { val.DateProcessed = new Date(val.DateProcessed);}
      if (val.DateSpamReport) { val.DateSpamReport = new Date(val.DateSpamReport);}
    });
    return data;
  }

  /**
   * For use in loadLogs() and loadFails()
   */
  function setupLogParameters(page, resultCount, communicationName, userId, success) {
    if (!page) {
      page = 1;
    }
    if (!resultCount) {
      resultCount = 10;
    }
    var parameters = {
      page: page,
      resultCount: resultCount,
      success: success
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
