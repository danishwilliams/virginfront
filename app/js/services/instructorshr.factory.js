angular
  .module("app")
  .factory('InstructorsHR', InstructorsHRFactory);

InstructorsHRFactory.$inject = ['Restangular'];

function InstructorsHRFactory(Restangular) {

  var instructorsHRFactory = {
    getInstructors: getInstructors,
    getInvitedInstructors: getInvitedInstructors,
    getUninvitedInstructors: getUninvitedInstructors
  };

  return instructorsHRFactory;

  /**
   * @param invited boolean
   *   Whether the instructor has been been invited or not (default null, which returns all instructors)
   */
  function getInstructors(invited) {
    return Restangular.one('instructors').get({invited: invited});
  }

  function getInvitedInstructors() {
    return getInstructors(true);
  }

  function getUninvitedInstructors() {
    return getInstructors(false);
  }
}
