angular
  .module("app")
  .factory('Users', UsersFactory);

UsersFactory.$inject = ['Restangular', 'Storage'];

function UsersFactory(Restangular, Storage) {
  var users = [];
  var currentUser = {};
  var onboardingStatus = false; // true if we're onboarding, false if we're not or if we're done

  var usersFactory = {
    getOnboardingStatus: getOnboardingStatus,
    setOnboardingStatus: setOnboardingStatus,
    getAccessToken: getAccessToken,
    loadAccessToken: loadAccessToken,
    setAccessToken: setAccessToken,
    changePassword: changePassword,
    logout: logout,
    loadUsers: loadUsers,
    getUsers: getUsers,
    loadUser: loadUser,
    loadCurrentUser: loadCurrentUser,
    getCurrentUser: getCurrentUser
  };

  return usersFactory;

  function getOnboardingStatus() {
    return onboardingStatus;
  }

  function setOnboardingStatus(value) {
    onboardingStatus = value;
  }

  function getAccessToken() {
    return Storage.getItem('token');
  }

  function loadAccessToken(credentials) {
    return Restangular.one('auth').customPOST({
      username: credentials.username,
      password: credentials.password
    }).then(loadAccessTokenComplete);

    function loadAccessTokenComplete(data, status, headers, config) {
      Restangular.setDefaultHeaders({
        "Authorization": "Token " + data.Value || ''
      });
      return data.Value;
    }
  }

  function setAccessToken(value) {
    Storage.setItem('token', value);
  }

  function changePassword(value) {
    return Restangular.one('users/changepassword').get({newPassword: value});
  }

  function logout() {
    Storage.removeItem('base64');
    Storage.removeItem('token');
    Restangular.setDefaultHeaders({
        "Authorization": "none"
      });
    users = [];
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

  function loadCurrentUser(token) {
    // If there is a token, we're manually passing this through because this is the onboarding first login
    if (token) {
      return Restangular.one('users/me').get({}, {Authorization: 'Token ' + token}).then(loadCurrentUserComplete);
    }
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
