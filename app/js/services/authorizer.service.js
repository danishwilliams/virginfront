angular.module("app").service('Authorizer', function (APP_PERMISSIONS, USER_ROLES) {
  return function (user) {
    return {
      canAccess: function (permissions) {
        var permission, _i, _len;
        if (!angular.isArray(permissions)) {
          permissions = [permissions];
        }
        for (_i = 0, _len = permissions.length; _i < _len; _i++) {
          permission = permissions[_i];
          if (APP_PERMISSIONS[permission] == null) {
            throw "Bad permission value";
          }
          if (user && user.UserType.Name) {
            var role = user.UserType.Name;
            switch (permission) {
              // Everyone
              case APP_PERMISSIONS.viewContent:
              case APP_PERMISSIONS.viewUser:
              case APP_PERMISSIONS.editUser:
                return role === USER_ROLES.user || role === USER_ROLES.instructor || role === USER_ROLES.manager || role === USER_ROLES.admin;

                // Instructors, Managers, Admins
              case APP_PERMISSIONS.createPlaylist:
              case APP_PERMISSIONS.editPlaylist:
              case APP_PERMISSIONS.viewContent:
                return role === USER_ROLES.instructor || role === USER_ROLES.manager || role === USER_ROLES.admin;

                // Managers, Admins
              case APP_PERMISSIONS.viewTemplates:
              case APP_PERMISSIONS.editTemplates:
              case APP_PERMISSIONS.editAnyPlaylist:
                return role === USER_ROLES.manager || role === USER_ROLES.admin;

                // Admin
              case APP_PERMISSIONS.viewUsers:
              case APP_PERMISSIONS.editUsers:
              case APP_PERMISSIONS.viewAdmin:
              case APP_PERMISSIONS.editAdmin:
                return role === USER_ROLES.admin;
            }
          } else {
            return false;
          }
        }
        return false;
      }
    };
  };
});
