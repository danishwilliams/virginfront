/**
 * Created by rogersaner on 15/09/04.
 */
angular.module("app").directive('droppable', function (PlaylistEdit) {
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
          var trackElement = document.getElementById(e.dataTransfer.getData('Text'));

          // Grab the angular model value
          var track = angular.element(trackElement).scope().track;

          // Check that the track BPM fits into the goal BPM range
          var goal = angular.element(this).scope().playlistGoal;
          if (track.bpm < goal.Goal.BpmLow || track.bpm > goal.Goal.BpmHigh) {
            // TODO: show some kind of helpful error message to the user
            return;
          }

          //TODO: refactor: move all of the below into PlayListFactory so that

          // If there are already tracks don't add one
          var tracks = PlaylistEdit.getPlaylistGoalTracks(goalid);
          if (tracks.length > 0) { return false; }

          // Tell the playlist about the track dropped into a goal
          PlaylistEdit.trackDropped(goalid, track);

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