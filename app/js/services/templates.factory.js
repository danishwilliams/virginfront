/**
 * Created by rogersaner on 28/09/21.
 */
angular
  .module("app")
  .factory('Templates', TemplatesFactory);

TemplatesFactory.$inject = ['Restangular', 'uuid2'];

function TemplatesFactory(Restangular, uuid2) {
  var self = this;
  var templates = [];
  var templateGroups = [];

  var templatesFactory = {
    createBlankTemplate: createBlankTemplate,
    getClassLengths: getClassLengths,
    loadTemplates: loadTemplates,
    getTemplates: getTemplates,
    loadTemplate: loadTemplate,
    enableTemplate: enableTemplate,
    disableTemplate: disableTemplate,
    createBlankTemplateGroup: createBlankTemplateGroup,
    loadTemplateGroups: loadTemplateGroups,
    getTemplateGroups: getTemplateGroups,
    loadTemplateGroup: loadTemplateGroup,
    disableTemplateGroup: disableTemplateGroup,
    enableTemplateGroup: enableTemplateGroup,
    loadTemplateGroupClasses: loadTemplateGroupClasses
  };

  return templatesFactory;

  function createBlankTemplate(templateGroupId, mins) {
    return loadTemplateGroup(templateGroupId).then(function (data) {
      var id = uuid2.newuuid().toString();
      template = Restangular.one('templates', id);

      template.TemplateGroup = {
        Name: data.Name,
        Description: data.Description,
        Type: data.Type,
        Id: data.Id,
        CountryId: data.CountryId
      };
      template.Goals = [];
      template.CountryId = data.CountryId;
      template.TemplateGroupId = data.Id;
      template.ClassLengthMinutes = mins;
      template.IsCustomRpm = false;
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
      // TODO: get Dane to add MaxGoals into the API
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
   * Given a certain class length, calculate how many goals are in that class
   */
  function numGoalsInClass(mins) {
    return Math.floor(mins / 4) + 1;
  }

  function createBlankTemplateGroup() {
    var id = uuid2.newuuid().toString();
    var templategroup = Restangular.one('templategroups', id);

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
      self.templateGroups = data;
      return self.templateGroups;
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
}
