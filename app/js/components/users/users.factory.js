angular
  .module("app")
  .factory('Users', UsersFactory);

UsersFactory.$inject = ['Restangular', 'LoggedInRestangular'];

function UsersFactory(Restangular, LoggedInRestangular) {
  var users = [];
  var currentUser = {};

  var usersFactory = {
    getAccessToken: getAccessToken,
    loadAccessToken: loadAccessToken,
    setAccessToken: setAccessToken,
    logout: logout,
    loadUsers: loadUsers,
    getUsers: getUsers,
    loadUser: loadUser,
    loadCurrentUser: loadCurrentUser,
    getCurrentUser: getCurrentUser
  };

  return usersFactory;

  function getAccessToken() {
    return localStorage.getItem('token');
  }

  function loadAccessToken(credentials) {
    return Restangular.one('auth').get({
      username: credentials.username,
      password: credentials.password
    }).then(loadAccessTokenComplete);

    function loadAccessTokenComplete(data, status, headers, config) {
      return data.Value;
    }
  }

  function setAccessToken(value) {
    localStorage.setItem('token', value);
  }

  function logout() {
    localStorage.removeItem('base64');
    localStorage.removeItem('token');
    users = [];
    currentUser = [];
  }

  function loadUsers() {
    return LoggedInRestangular.all('users').getList().then(loadUsersComplete);

    function loadUsersComplete(data, status, headers, config) {
      users = data;
      return users;
    }
  }

  function getUsers() {
    return users;
  }

  function loadUser(id) {
    return LoggedInRestangular.one('users', id).get().then(loadUserComplete);

    function loadUserComplete(data, status, headers, config) {
      return data;
    }
  }

  function loadCurrentUser() {
    return LoggedInRestangular.one('users/me').get().then(loadCurrentUserComplete);

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
