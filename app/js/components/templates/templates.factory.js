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

  var templatesFactory = {
    loadTemplates: loadTemplates,
    getTemplates: getTemplates,
    getTemplate: getTemplate
  };

  return templatesFactory;

  function loadTemplates() {
    return Restangular.one('templates').get({
      includeGoals: false
    }).then(loadTemplatesComplete);

    function loadTemplatesComplete(data, status, headers, config) {
      self.templates = data;
      return self.templates;
    }
  }

  function getTemplates() {
    return templates;
  }

  function getTemplate(id) {
    return Restangular.one('templates', id).get({
      includeGoals: true
    }).then(loadTemplateComplete);

    function loadTemplateComplete(data, status, headers, config) {
      return data;
    }
  }

}
