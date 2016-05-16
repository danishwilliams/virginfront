/**
 * Created by rogersaner on 28/09/21.
 */
angular
  .module("app")
  .factory('Templates', TemplatesFactory);

TemplatesFactory.$inject = ['Restangular', 'uuid2', 'Users'];

function TemplatesFactory(Restangular, uuid2, Users) {
  var self = this;
  var templates = [];
  var templateGroups = [];
  var messages = []; // A list of messages each consisting of an object: {type: 'success', msg: 'The message'}

  var templatesFactory = {
    createBlankTemplate: createBlankTemplate,
    getClassLengths: getClassLengths,
    loadTemplates: loadTemplates,
    getTemplates: getTemplates,
    loadTemplate: loadTemplate,
    numGoalsInClass: numGoalsInClass,
    enableTemplate: enableTemplate,
    disableTemplate: disableTemplate,
    //isValidTemplate: isValidTemplate,
    createBlankTemplateGroup: createBlankTemplateGroup,
    loadTemplateGroups: loadTemplateGroups,
    getTemplateGroups: getTemplateGroups,
    loadTemplateGroup: loadTemplateGroup,
    disableTemplateGroup: disableTemplateGroup,
    enableTemplateGroup: enableTemplateGroup,
    loadTemplateGroupClasses: loadTemplateGroupClasses,
    addMessage: addMessage,
    setMessage: setMessage,
    getMessages: getMessages
  };

  return templatesFactory;

  function createBlankTemplate(templateGroupId, mins) {
    return loadTemplateGroup(templateGroupId).then(function (data) {
      var id = uuid2.newuuid().toString();
      var user = Users.getCurrentUser();
      template = Restangular.one('templates', id);

      template.TemplateGroup = {
        Name: data.Name,
        Description: data.Description,
        Type: data.Type,
        Id: data.Id,
        CountryId: data.CountryId,
        IsCustomRpm: user.Location.Country.CustomRpm
      };
      template.Goals = [];
      template.CountryId = data.CountryId;
      template.TemplateGroupId = data.Id;
      template.ClassLengthMinutes = mins;
      template.Enabled = true;
      template.MaxFreestyleGoals = numGoalsInClass(mins);
      return template;
    });
  }

  function getClassLengths() {
    var options = [];
    for (var i = 25; i < 125; i = i + 5) {
      options.push(i);
    }
    return options;
  }

  function loadTemplates(includeGoals) {
    return Restangular.all('templates').getList({
      includeGoals: includeGoals
    }).then(loadTemplatesComplete);

    function loadTemplatesComplete(data, status, headers, config) {
      self.templates = data;
      return self.templates;
    }
  }

  function getTemplates() {
    return templates;
  }

  function loadTemplate(id) {
    return Restangular.one('templates', id).get({
      includeGoals: true
    }).then(loadTemplateComplete);

    function loadTemplateComplete(data, status, headers, config) {
      // this _could_ be done in the API but doesn't have to be
      if (data.TemplateGroup.Type === 'freestyle') {
        data.MaxFreestyleGoals = numGoalsInClass(data.ClassLengthMinutes) - 1; // -1, because Warm Up already exists
      }
      return data;
    }
  }

  function disableTemplate(id) {
    return Restangular.one('templates/disable', id).post();
  }

  function enableTemplate(id) {
    return Restangular.one('templates/enable', id).post();
  }

  /**
   * Checks if a template is valid
   */
  /*
  function isValidTemplate(template) {
    // TODO: iterate through all goals, an if a goal has an error set goal.show = true
    // as well as the error on the specific place i.e. bpm, effort, rpm, beat ratio
    // so it can be displayed in the frontend
    // But this can also be done by checking form.$valid in the controller
    return {
      template: template,
      valid: true
    };
  }
  */

  /**
   * Given a certain class length, calculate how many goals are in that class
   */
  function numGoalsInClass(mins) {
    return Math.floor(mins / 4) + 1;
  }

  function createBlankTemplateGroup() {
    var id = uuid2.newuuid().toString();
    var templategroup = Restangular.one('templategroups', id);

    templategroup.NewTemplate = true;
    templategroup.Id = id;
    templategroup.Name = '';
    templategroup.Type = 'ride'; // default: can also be 'pack' or 'freestyle'
    templategroup.Description = '';
    templategroup.Enabled = true;
    templategroup.IconFileName = '';
    return templategroup;
  }

  function loadTemplateGroups(includeGoals) {
    return Restangular.all('templategroups').getList({
      includeGoals: includeGoals
    }).then(loadTemplateGroupsComplete);

    function loadTemplateGroupsComplete(data, status, headers, config) {
      templateGroups = data;
      return templateGroups;
    }
  }

  function getTemplateGroups() {
    return templateGroups;
  }

  function loadTemplateGroup(id) {
    return Restangular.one('templategroups', id).get().then(loadTemplateGroupComplete);

    function loadTemplateGroupComplete(data, status, headers, config) {
      return data;
    }
  }

  function disableTemplateGroup(id) {
    return Restangular.one('templategroups/disable', id).post();
  }

  function enableTemplateGroup(id) {
    return Restangular.one('templategroups/enable', id).post();
  }

  function loadTemplateGroupClasses(id) {
    return Restangular.one('templategroups/classlengthoptions', id).get().then(loadTemplateGroupClassesComplete);

    function loadTemplateGroupClassesComplete(data, status, headers, config) {
      return data;
    }
  }

  function addMessage(type, msg) {
    messages.push({type: type, msg: msg});
  }

  function setMessage(type, msg) {
    messages = [{type: type, msg: msg}];
  }

  function getMessages() {
    return messages;
  }
}
