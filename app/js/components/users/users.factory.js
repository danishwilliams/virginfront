angular
  .module("app")
  .factory('Users', UsersFactory);

UsersFactory.$inject = ['Restangular'];

function UsersFactory(Restangular) {
  var self = this;
  self.users = [];
  self.currentUser = {Id: '5794cd8b-6ffc-4b9c-892c-ac8b1481dce8'}; // TODO: this is temporary

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
    var id = '5794cd8b-6ffc-4b9c-892c-ac8b1481dce8';
    return Restangular.one('users', id).get().then(loadCurrentUserComplete);

    function loadCurrentUserComplete(data, status, headers, config) {
      self.currentUser = data;
      return data;
    }
  }

  function getCurrentUser() {
    return self.currentUser;
  }
}
