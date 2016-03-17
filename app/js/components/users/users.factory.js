angular
  .module("app")
  .factory('Users', UsersFactory);

UsersFactory.$inject = ['Restangular', 'Storage', 'uuid2'];

function UsersFactory(Restangular, Storage, uuid2) {
  var users = [];
  var currentUser = {};
  var onboardingStatus = false; // true if we're onboarding, false if we're not or if we're done

  var usersFactory = {
    getOnboardingStatus: getOnboardingStatus,
    setOnboardingStatus: setOnboardingStatus,
    getAccessToken: getAccessToken,
    loadAccessToken: loadAccessToken,
    deleteAccessToken: deleteAccessToken, // Deletes the access token from the API
    removeLocalAccessToken: removeLocalAccessToken, // Removes the local access token
    setAccessToken: setAccessToken,
    changePassword: changePassword,
    resetPassword: resetPassword,
    logout: logout,
    loadUsers: loadUsers,
    getUsers: getUsers,
    loadUser: loadUser,
    updateGenres: updateGenres,
    loadCurrentUser: loadCurrentUser,
    getCurrentUser: getCurrentUser,
    sendInvite: sendInvite,
    createNewUser: createNewUser,
    disableUser: disableUser,
    enableUser: enableUser
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
    }, '', {}, {
      Authorization: ''
    }).then(loadAccessTokenComplete);

    function loadAccessTokenComplete(data, status, headers, config) {
      Restangular.setDefaultHeaders({
        "Authorization": "Token " + data.Value || ''
      });
      return data.Value;
    }
  }

  function deleteAccessToken(accessToken) {
    var token = Storage.getItem('token');
    return Restangular.one('users/token/remove').customPOST({}, '', {
      token: accessToken
    }, {
      Authorization: 'Token ' + token
    });
  }

  function removeLocalAccessToken() {
    Storage.removeItem('token');
  }

  function setAccessToken(value) {
    Storage.setItem('token', value);
  }

  function changePassword(value) {
    var token = Storage.getItem('token');
    return Restangular.one('users/password/change').customPOST({
      NewPassword: value
    }, '', {}, {
      Authorization: 'Token ' + token
    });
  }

  function resetPassword(username) {
    return Restangular.one('users/password/reset').customPOST({}, '', {
      username: username
    });
  }

  function logout() {
    Storage.removeItem('base64');
    Storage.removeItem('token');
    Restangular.setDefaultHeaders({
      "Authorization": "none"
    });
    users = [];
    currentUser = {};
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

  /**
   * Updates the chosen genres for a user
   *
   * @param A restangular user object
   * @param genres (e.g. from the Genres directive)
   */
  function updateGenres(genres) {
    currentUser.UserGenres = [];
    genres.forEach(function (val) {
      if (val.selected) {
        currentUser.UserGenres.push({
          Genre: val,
          GenreId: val.Id
        });
      }
    });
    currentUser.put();
  }

  function loadCurrentUser(token) {
    // If there is a token, we're manually passing this through because this is the onboarding first login
    if (token) {
      return Restangular.one('users/me').get({}, {
        Authorization: 'Token ' + token
      }).then(loadCurrentUserComplete);
    }
    return Restangular.one('users/me').get().then(loadCurrentUserComplete);

    function loadCurrentUserComplete(data, status, headers, config) {
      currentUser = data;
      currentUser.route = 'users';
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

  /**
   * Sends an email invite to a user
   */
  function sendInvite(userId) {
    return Restangular.one("users/invite", userId).post().then(createInviteComplete);

    function createInviteComplete(data, status, headers, config) {
      return data;
    }
  }

  function createNewUser(user) {
    if (!user.Id) {
      user.Id = uuid2.newuuid().toString();
    }
    var queryString = {};
    user.State = 'created';
    if (user.sendInviteEmail) {
      queryString = {
        sendInviteEmail: true
      };
    }
    return Restangular.one("users", user.Id).customPUT(user, '', queryString).then(createNewUserComplete);

    function createNewUserComplete(data, status, headers, config) {
      return data;
    }
  }

  function disableUser(userId) {
    return Restangular.one("users/disable", userId).post().then(disableUserComplete);

    function disableUserComplete(data, status, headers, config) {
      return data;
    }
  }

  function enableUser(userId) {
    return Restangular.one("users/enable", userId).post().then(enableUserComplete);

    function enableUserComplete(data, status, headers, config) {
      return data;
    }
  }
}
