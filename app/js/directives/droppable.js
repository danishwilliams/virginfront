/**
 * Created by rogersaner on 15/09/04.
 */
angular.module("app").directive('droppable', function () {
  return {
    scope: {
      drop: '&', // parent
      bin: '=' // bi-directional scope
    },
    link: function (scope, element) {
      // again we need the native object
      var el = element[0];

      el.addEventListener(
        'dragover',
        function (e) {
          e.dataTransfer.dropEffect = 'move';
          // allows us to drop
          if (e.preventDefault) { e.preventDefault(); }
          this.classList.add('over');
          return false;
        },
        false
      );

      el.addEventListener(
        'dragenter',
        function (e) {
          this.classList.add('over');
          return false;
        },
        false
      );

      el.addEventListener(
        'dragleave',
        function (e) {
          this.classList.remove('over');
          return false;
        },
        false
      );

      el.addEventListener(
        'drop',
        function (e) {
          var binId = this.id;
          var item = document.getElementById(e.dataTransfer.getData('Text'));
          this.classList.add('dropped');
          this.appendChild(item);
          // call the passed drop function
          scope.$apply(function (scope) {
            var fn = scope.drop();
            if ('undefined' !== typeof fn) {
              fn(item.id, binId);
            }
          });

          /*
           // Stops some browsers from redirecting.
           if (e.stopPropagation) e.stopPropagation();

           this.classList.remove('over');

           var item = document.getElementById(e.dataTransfer.getData('Text'));
           this.appendChild(item);

           // call the drop passed drop function
           scope.$apply('drop()');
           */

          return false;
        },
        false
      );
    }
  };
});