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
    loadTemplates: loadTemplates,
    getTemplates: getTemplates,
    loadTemplate: loadTemplate,
    loadTemplateGroups: loadTemplateGroups,
    getTemplateGroups: getTemplateGroups,
    loadTemplateGroup: loadTemplateGroup,
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
      // TODO: don't hard-code this
      template.MaxFreestyleGoals = 11;
      return template;
    });
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
        switch (data.ClassLengthMinutes) {
          case 30:
            data.MaxFreestyleGoals = 7;
            break;
          case 45:
            data.MaxFreestyleGoals = 11;
            break;
          case 60:
            data.MaxFreestyleGoals = 14;
            break;
          case 90:
            data.MaxFreestyleGoals = 22;
            break;
        }
      }
      return data;
    }
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

  function loadTemplateGroupClasses(id) {
    return Restangular.one('templategroups/classlengthoptions', id).get().then(loadTemplateGroupClassesComplete);

    function loadTemplateGroupClassesComplete(data, status, headers, config) {
      return data;
    }
  }
}
