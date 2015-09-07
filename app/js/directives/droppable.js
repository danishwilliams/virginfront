/**
 * Created by rogersaner on 15/09/04.
 */
angular.module("app").directive('droppable', function (PlaylistService) {
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
          var goalid = binId.substring(3);

          // If there are already songs don't add one
          var songs = PlaylistService.getGoalPlaylist(goalid);
          if (songs.length > 0) return false;

          this.classList.add('dropped');
          this.removeAttribute('droppable');
          var song = document.getElementById(e.dataTransfer.getData('Text'));
          song.classList.add('ng-hide');

          // Tell the playlist about the song dropped into a goal
          var songid = song.id.substring(4);
          PlaylistService.songDropped(goalid, songid);

          // TODO: at some point this needs to also track which playlist we're building, although that might be done on url

          // call the passed drop function
          scope.$apply(function (scope) {
            var fn = scope.drop();
            if ('undefined' !== typeof fn) {
              fn(item.id, binId);
            }
          });

          return false;
        },
        false
      );
    }
  };
});