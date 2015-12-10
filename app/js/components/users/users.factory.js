angular
  .module("app")
  .factory('Users', UsersFactory);

UsersFactory.$inject = ['Restangular'];

function UsersFactory(Restangular) {
  var users = [];
  var currentUser = {};

  var usersFactory = {
    initAuthHeader: initAuthHeader,
    setAuthHeader: setAuthHeader,
    logout: logout,
    loadUsers: loadUsers,
    getUsers: getUsers,
    loadUser: loadUser,
    loadCurrentUser: loadCurrentUser,
    getCurrentUser: getCurrentUser
  };

  return usersFactory;

  // Initializes the Authentication header, if we have the value in localstorage (return true) else return false
  function initAuthHeader() {
    var base64 = localStorage.getItem('base64', base64);
    if (base64) {
      Restangular.setDefaultHeaders({Authorization: 'Basic ' + base64});
      return true;
    }
    return false;
  }

  function setAuthHeader(credentials) {
    var base64 = btoa(credentials.username + ':' + credentials.password);
    localStorage.setItem('base64', base64);
    Restangular.setDefaultHeaders({Authorization: 'Basic ' + base64});
  }

  function logout() {
    localStorage.removeItem('base64');
    currentUser = [];
  }

  function loadUsers() {
    return Restangular.all('users').getList().then(loadUsersComplete);

    function loadUsersComplete(data, status, headers, config) {
      users = data;
      return users;
    }
  }

  function getUsers() {
    return users;
  }

  function loadUser(id) {
    return Restangular.one('users', id).get().then(loadUserComplete);

    function loadUserComplete(data, status, headers, config) {
      return data;
    }
  }

  function loadCurrentUser() {
    return Restangular.one('users/me').get().then(loadCurrentUserComplete);

    function loadCurrentUserComplete(data, status, headers, config) {
      currentUser = data;
      currentUser.Roles = [];
      currentUser.UserUserTypes.forEach(function (val) {
        currentUser.Roles.push(val.UserType.Name);
        //currentUser.Roles.push('Manager');
        //currentUser.Roles.push('Admin');
      });
      return currentUser;
    }
  }

  function getCurrentUser() {
    return currentUser;
  }
}
