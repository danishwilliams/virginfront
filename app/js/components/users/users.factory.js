angular
  .module("app")
  .factory('Users', UsersFactory);

UsersFactory.$inject = ['Restangular'];

function UsersFactory(Restangular) {
  var self = this;
  var users = [];

  var usersFactory = {
    loadUsers: loadUsers,
    getUsers: getUsers,
    loadUser: loadUser
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
}
