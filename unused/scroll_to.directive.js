/* Supposedly scrolls to an element which has the scroll-to attribute on it but couldn't get it working */
angular
  .module("app")
  .directive("scrollTo", scrollTo);

scrollTo.$inject = ['$uiViewScroll'];

function scrollTo($uiViewScroll) {
  return {
    restrict: 'A',
    link: link
  };

  function link (scope, element, attr) {
    $uiViewScroll(element);
  }
}
