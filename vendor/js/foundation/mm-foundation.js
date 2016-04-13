angular.module("mm.foundation", ["mm.foundation.tpls", "mm.foundation.accordion","mm.foundation.alert","mm.foundation.modal","mm.foundation.offcanvas","mm.foundation.tabs"]);
angular.module("mm.foundation.tpls", ["template/accordion/accordion-group.html","template/accordion/accordion.html","template/modal/backdrop.html","template/alert/alert.html","template/tabs/tab.html","template/tabs/tabset.html","template/modal/window.html"]);

angular.module("template/modal/backdrop.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/modal/backdrop.html",
    "<div class=\"reveal-modal-bg fade\" ng-class=\"{in: animate}\" ng-click=\"close($event)\" style=\"display: block\"></div>\n" +
    "");
}]);

angular.module("template/accordion/accordion-group.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/accordion/accordion-group.html",
    "<dd>\n" +
    "  <a ng-click=\"isOpen = !isOpen\" ng-class=\"{ active: isOpen }\"  accordion-transclude=\"heading\">{{heading}}</a>\n" +
    "  <div class=\"content\" ng-class=\"{ active: isOpen }\" ng-transclude></div>\n" +
    "</dd>\n" +
    "");
}]);

angular.module("template/accordion/accordion.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/accordion/accordion.html",
    "<dl class=\"accordion\" ng-transclude></dl>\n" +
    "");
}]);

angular.module("template/alert/alert.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/alert/alert.html",
    "<div class='alert-box' ng-class='(type || \"\")'>\n" +
    "  <span ng-transclude></span>\n" +
    "  <a ng-show='closeable' class='close' ng-click='close()'>&times;</a>\n" +
    "</div>\n" +
    "");
}]);

angular.module("template/tabs/tab.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/tabs/tab.html",
    "<dd ng-class=\"{active: active}\">\n" +
    "  <a ng-click=\"select()\" tab-heading-transclude>{{heading}}</a>\n" +
    "</dd>\n" +
    "");
}]);

angular.module("template/tabs/tabset.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/tabs/tabset.html",
    "<div class=\"tabbable\">\n" +
    "  <dl class=\"tabs\" ng-class=\"{'vertical': vertical}\" ng-transclude></dl>\n" +
    "  <div class=\"tabs-content\" ng-class=\"{'vertical': vertical}\">\n" +
    "    <div class=\"content\" \n" +
    "      ng-repeat=\"tab in tabs\" \n" +
    "      ng-class=\"{active: tab.active}\">\n" +
    "      <div tab-content-transclude=\"tab\"></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("template/modal/window.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/modal/window.html",
    "<div tabindex=\"-1\" class=\"reveal-modal fade {{ windowClass }}\"\n" +
    "  ng-class=\"{in: animate}\" style=\"display: block; visibility: visible\">\n" +
    "  <div ng-transclude></div>\n" +
    "</div>\n" +
    "");
}]);