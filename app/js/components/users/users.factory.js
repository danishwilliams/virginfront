angular
  .module("app")
  .factory('Users', UsersFactory);

UsersFactory.$inject = ['Restangular'];

function UsersFactory(Restangular) {
  var users = [];
  var currentUser = {};

  var usersFactory = {
    loadUsers: loadUsers,
    getUsers: getUsers,
    loadUser: loadUser,
    loadCurrentUser: loadCurrentUser,
    getCurrentUser: getCurrentUser
  };

  return usersFactory;

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
        //currentUser.Roles.push('Admin');
      });
      return currentUser;
    }
  }

  function getCurrentUser() {
    return currentUser;
  }
}
