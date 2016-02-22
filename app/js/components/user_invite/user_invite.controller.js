angular.module("app.user_invite", []).controller('UserInviteController', function (InstructorsHR, Gyms, UserTypes, Users, spinnerService) {
  var self = this;
  // TODO: this should probably be refactored to use anchor tags or querystrings or something else so that the browser back button works
  self.step = 0;
  var instructorUserType = {};
  var packInstructorUserType = {};
  var gyms = [];

  InstructorsHR.getUninvitedInstructors().then(function (data) {
    spinnerService.hide('instructors');
    self.instructors = data;
  });

  // Select all (or none) values in a collection
  self.selectAll = function (collection, value) {
    collection.forEach(function(val) {
      val.selected = value;
    });
  };

  self.selectAllPackInstructors = function() {
    self.instructors.forEach(function(val) {
      val.packInstructor = self.selectPackInstructors;
    });
  };

  // Instructors have been chosen
  self.instructorsSelected = function () {
    self.step = 1;
    Gyms.loadGyms().then(function (data) {
      spinnerService.hide('instructorsGyms');
      self.gyms = data;
    });

    // May as well load up User Types at this stage
    UserTypes.loadUserTypes().then(function (data) {
      data.forEach(function (val) {
        if (val.Name === 'Instructor') {
          val.UserTypeId = val.Id;
          val.Id = undefined; // so we can insert a new record
          val.UserType = {
            Name: val.Name,
            PublicRole: val.PublicRole
          };
          instructorUserType = val;
        } else if (val.Name === 'Pack Instructor') {
          val.UserTypeId = val.Id;
          val.Id = undefined; // so we can insert a new record
          val.UserType = {
            Name: val.Name,
            PublicRole: val.PublicRole
          };
          packInstructorUserType = val;
        }
      });
    });
  };

  // Gyms have been selected
  self.gymsSelected = function () {
    self.step = 2;

    // What gyms have been selected?
    self.gyms.forEach(function (val) {
      if (val.selected) {
        gyms.push({
          Gym: val,
          GymId: val.Id
        });
      }
    });

    // What instructors have been selected?
    self.instructors.forEach(function (val) {
      if (val.selected) {
        val.status = 'Pending';
        val.statusClass = 'syncing';
        self.createUser(val);
      }
    });
  };

  self.createUser = function (instructor) {
    // Build up a new user object
    var newUser = instructor;
    newUser.sendInviteEmail = true;

    newUser.UserGyms = gyms;

    newUser.UserUserTypes = [instructorUserType];
    if (instructor.packInstructor) {
      newUser.UserUserTypes.push(packInstructorUserType);
    }

    newUser.Username = newUser.Email;
    newUser.EmployeeId = newUser.EmployeeNumber;
    Users.createNewUser(newUser).then(function () {
      instructor.status = 'Success';
      instructor.statusClass = 'success';
    }, function (res) {
      instructor.status = 'Failed';
      instructor.statusClass = 'error';
    });
  };

});
