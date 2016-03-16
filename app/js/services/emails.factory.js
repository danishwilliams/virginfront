angular
  .module("app")
  .factory('Emails', EmailsFactory);

EmailsFactory.$inject = ['Restangular'];

function EmailsFactory(Restangular) {
  //var self = this;

  var emailsFactory = {
    loadBounces: loadBounces
  };
  return emailsFactory;

  function loadBounces() {
    return Restangular.all('communications/email/bounces').get('', {days:7}).then(loadBouncesComplete);

    function loadBouncesComplete(data, status, headers, config) {
      return data.EmailBounceList;
    }
  }
}
