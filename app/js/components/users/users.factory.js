angular
  .module("app")
  .factory('Users', UsersFactory);

UsersFactory.$inject = ['Restangular'];

function UsersFactory(Restangular) {
  var self = this;
  self.users = [];
  self.currentUser = {};

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
      self.users = data;
      return self.users;
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
    // TODO: this is temporary
    return Restangular.one('users/me').get().then(loadCurrentUserComplete);

    function loadCurrentUserComplete(data, status, headers, config) {
      self.currentUser = data;
      return data;
    }
  }

  function getCurrentUser() {
    return self.currentUser;
  }
}
