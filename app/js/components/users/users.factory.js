angular
  .module("app")
  .factory('Users', UsersFactory);

UsersFactory.$inject = ['Restangular', 'Storage', 'uuid2', 'USER_STATES', '$translate'];

function UsersFactory(Restangular, Storage, uuid2, USER_STATES, $translate) {
  var users = [];
  var currentUser = {};

  var usersFactory = {
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
    setCurrentUserState: setCurrentUserState,
    sendInvite: sendInvite,
    createNewUser: createNewUser,
    disableUser: disableUser,
    enableUser: enableUser
  };

  return usersFactory;

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
    logout();
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

  /**
   * Loads all users
   *
   * @param type
   *   Optional. The type of user to load. Options: registered, unregistered, active, inactive
   */
  function loadUsers(type) {
    if (type) {
      var params = {};
      switch (type) {
        case 'active':
          params.active = true;
          break;
        case 'inactive':
          params.active = false;
          break;
        case 'registered':
          params.registered = true;
          break;
        case 'unregistered':
          params.registered = false;
          break;
      }
      return Restangular.all('users').getList(params).then(loadUsersComplete);
    }

    // Default GET
    return Restangular.all('users').getList().then(loadUsersComplete);

    function loadUsersComplete(data, status, headers, config) {
      /** Determine the type of the user:
       *  - 'Invited' if the user has been invited but hasn't ever logged in before
       *  - 'Registered' if the user has logged in at least once (includes onboarding)
       *  - 'Technical' if the user is a technical user (or we don't know what to do with them due to some error)
       */

      data.forEach(function (user) {
        var counted = false;
        if (user.Enabled) {
          user.Archived = false;
        }
        else {
          counted = true;
          user.Archived = true;
        }

        // Set the user type. One of Registered, Technical, Invited
        user.Type = 'Registered';
        user.UserUserTypes.forEach(function (type) {
          switch (user.State) {
            case USER_STATES.invite_emailed:
            case USER_STATES.invite_email_failed:
              user.Type = 'Invited';
              if (!counted) {
                counted = true;
              }
              break;
            case USER_STATES.onboarding_genres:
            case USER_STATES.onboarding_clubs:
            case USER_STATES.registered:
              user.Type = 'Registered';
              if (!counted) {
                counted = true;
              }
          }
          switch (type.UserType.Name) {
            case 'Admin':
            case 'API User':
            case 'Device':
            case 'Import':
              if (!counted) {
                counted = true;
              }
              user.Type = 'Technical';
          }
          if (!counted) {
            user.Type = 'Technical'; // So that if any users show up there we know something has screwed up
          }
        });
      });
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

      // Set language (if previously saved)
      var langKey = Storage.getItem('language' + currentUser.Id);
      if (langKey) {
        $translate.use(langKey);
      }
      else if (currentUser.Location.Country.Language.Code) {
        $translate.use(currentUser.Location.Country.Language.Code);
      }

      return currentUser;
    }
  }

  function getCurrentUser() {
    return currentUser;
  }

  function setCurrentUserState(state) {
    currentUser.State = state;
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
