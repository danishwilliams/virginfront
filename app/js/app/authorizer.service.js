angular.module("app").service('Authorizer', function (APP_PERMISSIONS, USER_ROLES, Users) {
  var roles = {};

  var authorizer = {
    canAccess: canAccess
  };

  return authorizer;

  function canAccess(permissions, user) {
    if (_.isEmpty(user)) {
      user = Users.getCurrentUser();
      roles = user.Roles;
    }
    var permission, _i, _len;
    if (!angular.isArray(permissions)) {
      permissions = [permissions];
    }
    for (_i = 0, _len = permissions.length; _i < _len; _i++) {
      permission = permissions[_i];
      if (APP_PERMISSIONS[permission] == null) {
        throw "Bad permission value";
      }
      if (user && user.Roles) {
        switch (permission) {
          // Everyone
          case APP_PERMISSIONS.user:
              return hasRole(USER_ROLES.user) || hasRole(USER_ROLES.instructor) || hasRole(USER_ROLES.manager) || hasRole(USER_ROLES.techManager) || hasRole(USER_ROLES.admin);

            // Instructors, Managers, Admins
          case APP_PERMISSIONS.viewContent:
          case APP_PERMISSIONS.viewPlaylist:
          case APP_PERMISSIONS.createPlaylist:
          case APP_PERMISSIONS.editPlaylist:
            return hasRole(USER_ROLES.instructor) || hasRole(USER_ROLES.manager) || hasRole(USER_ROLES.techManager) || hasRole(USER_ROLES.admin);

          // Managers only
          case APP_PERMISSIONS.isManager:
            return hasRole(USER_ROLES.manager) || hasRole(USER_ROLES.techManager) && !hasRole(USER_ROLES.admin);

            // Managers, Admins
          case APP_PERMISSIONS.editAnyPlaylist:
          case APP_PERMISSIONS.templates:
          case APP_PERMISSIONS.users:
            // TODO: add permissions: clubs
            return hasRole(USER_ROLES.manager) || hasRole(USER_ROLES.techManager) || hasRole(USER_ROLES.admin);

            // Technical manager
          case APP_PERMISSIONS.devices:
            return hasRole(USER_ROLES.techManager) || hasRole(USER_ROLES.admin);

            // Admin
          case APP_PERMISSIONS.gyms:
          case APP_PERMISSIONS.editAdmin:
          case APP_PERMISSIONS.viewAdmin:
            return hasRole(USER_ROLES.admin);
        }
      } else {
        return false;
      }
    }
    return false;
  }

  function hasRole(role) {
    if (_.isEmpty(roles)) {
      roles = Users.getCurrentUser().Roles;
    }
    return _.contains(roles, role);
  }
});
