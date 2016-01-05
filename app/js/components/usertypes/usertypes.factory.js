angular
  .module("app")
  .factory('UserTypes', UserTypesFactory);

UserTypesFactory.$inject = ['LoggedInRestangular'];

function UserTypesFactory(LoggedInRestangular) {
  var self = this;
  var usertypes = [];

  var usertypesFactory = {
    loadUserTypes: loadUserTypes,
    getUserTypes: getUserTypes,
    loadUserType: loadUserType
  };

  return usertypesFactory;

  function loadUserTypes() {
    return LoggedInRestangular.all('usertypes').getList().then(loadUserTypesComplete);

    function loadUserTypesComplete(data, status, headers, config) {
      self.usertypes = data;
      return self.usertypes;
    }
  }

  function getUserTypes() {
    return usertypes;
  }

  function loadUserType(id) {
    return LoggedInRestangular.one('usertypes', id).get().then(loadUserTypeComplete);

    function loadUserTypeComplete(data, status, headers, config) {
      return data;
    }
  }
}
