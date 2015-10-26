/**
 * Created by rogersaner on 28/09/21.
 */
angular
  .module("app")
  .factory('Templates', TemplatesFactory);

TemplatesFactory.$inject = ['Restangular'];

function TemplatesFactory(Restangular) {
  var self = this;
  var templates = [];
  var templateGroups = [];

  var templatesFactory = {
    loadTemplates: loadTemplates,
    getTemplates: getTemplates,
    loadTemplate: loadTemplate,
    loadTemplateGroups: loadTemplateGroups,
    getTemplateGroups: getTemplateGroups,
    loadTemplateGroup: loadTemplateGroup,
    loadTemplateGroupClasses: loadTemplateGroupClasses
  };

  return templatesFactory;

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