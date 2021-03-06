/*
angular
  .module("app")
  .directive("playlistGoal", playlistGoal);

function playlistGoal() {
  // TODO: use this directive in the playlist edit template
  var directive = {
    templateUrl: '../js/directives/playlist_goal/playlist_goal.directive.html',
    restrict: 'E',
    controller: playlistGoalController,
    controllerAs: 'vm',
    scope: {
      ngModel: '=',
      playlistPosition: '@',
      playlistGoalArrayId: '@'
    },
    require: 'ngModel',
  };
  return directive;
}

playlistGoalController.$inject = ['$scope', 'Playlists'];

function playlistGoalController($scope, Playlists) {
  var self = this;

  // Return the number of tracks this goal/background music thingy holds
  self.numTracks = function () {
    // For goals
    // playlist_edit.playlist.PlaylistGoals[playlistGoal.ArrayId].PlaylistGoalTracks.length
    return 10;
  };

  // This is here because we use it for background tracks
  self.showTrack = function (track) {
    return true;
  };

  self.removeTrack = function(track) {
    self.removeTrackFromPlaylist($scope.playlistGoalArrayId, track);
  };

  // Remove a track from a goal playlist
  self.removeTrackFromPlaylist = function (playlistGoalArrayId, track) {
    Playlists.removeTrackFromGoalPlaylist(playlistGoalArrayId, track);
    this.playlistTracksLength = Playlists.getPlaylistLength();
    self.checkAllGoalsHaveTracks();
    Tracks.stopTrack(track.Track);

    // The track isn't "dropped" any more
    // TODO: refactor this so we're not manipulating the DOM from a controller
    var bin = document.getElementById("bin" + playlistGoalArrayId);
    if (bin) {
      bin.classList.remove('dropped');
      bin.setAttribute('droppable', '');
    }
  };
}

*/

// HTML template

/*
<div class="goal-container" ng-class="{'active': playlist_edit.isGoalActive(playlistGoal)}">
  <div class="row goal-name" ng-click="playlist_edit.goalClicked(playlistGoal)">
    <div class="large-10 columns">
      <h4 ng-class="{'has-track' : playlist_edit.playlist.PlaylistGoals[playlistGoal.ArrayId].PlaylistGoalTracks.length > 0}">
          <img ng-if="playlistGoal.Goal.GoalChallengeId" src="/img/playlists/pack_highlight.svg">
          {{playlistGoal.Goal.Name}} 
          <em ng-if="playlistGoal.Goal.GoalChallengeId">{{'CHALLENGE' | translate}}</em>
        </h4>
    </div>
    <div class="large-8 columns text-right">
      <a ng-show="playlist_edit.playlist.PlaylistGoals[playlistGoal.ArrayId].PlaylistGoalTracks.length === 0">+ {{'ADD_SONG' | translate}}</a>
    </div>
  </div>
  <div class="row" ng-show="playlist_edit.playlist.PlaylistGoals[playlistGoal.ArrayId].PlaylistGoalTracks.length > 0">
    <div class="bin" ng-class="{'dropped' : playlist_edit.playlist.PlaylistGoals[playlistGoal.ArrayId].PlaylistGoalTracks.length > 0}" id="bin{{playlistGoal.ArrayId}}">
      <div class="row track dropped" id="playlist{{playlistGoal.Id}}{{track.Track.MusicProviderTrackId}}" data-ng-repeat="track in playlistGoal.PlaylistGoalTracks">
        <div class="large-1 small-1 columns play" id="track{{track.Track.MusicProviderTrackId}}" ng-click="playlist_edit.playTrack(track.Track);" ng-class="{'playing': track.Track.playing}">
          <a href="#">{{'PLAY' | translate}}</a>
        </div>
        <div class="large-11 small-11 columns">
          <span class="track-name">{{track.Track.Name | limitTo : 80}}<span ng-if="track.Track.Name.length > 80">&hellip;</span></span> <span class="artist">{{track.Track.Artist}}</span> | <span class="bpm">{{track.Track.Bpm}} {{'BPM' | translate}}</span>
        </div>
        <div class="large-4 columns time text-center">
          <span class="position" ng-show="track.Track.currentTime >= 0">{{track.Track.currentTime | minutes}}</span> {{track.Track.DurationSeconds | minutes}}
        </div>
        <div class="large-1 columns remove" ng-click="playlist_edit.removeTrack(playlistGoal.ArrayId, track)"> - </div>
      </div>
    </div>
  </div>
  <div class="row goal-meta" ng-click="goal.show = !playlistGoal.show" ng-show="playlistGoal.show && playlist_edit.playlist.PlaylistGoals[playlistGoal.ArrayId].PlaylistGoalTracks.length > 0">
    <ul class="large-block-grid-2">
      <li ng-repeat="goaloption in playlist_edit.playlist.PlaylistGoals[playlistGoal.ArrayId].Goal.GoalOptions">
        <goal_option data-freestyle="{{playlist_edit.freestyleTemplate}}" data-effort="goaloption.Effort" data-efforthigh="goaloption.EffortHigh" data-bpm="{{playlistGoal.PlaylistGoalTracks[0].Track.Bpm}}" data-customrpm="playlist_edit.playlist.TemplateGroup.IsCustomRpm"></goal_option>
      </li>
    </ul>
    <div class="row notes">
      {{'TRACK_NOTES' | translate}}
      <form name="playlistGoalNote{{playlistGoal.ArrayId}}">
        <textarea name="note" maxlength="200" ng-maxlength="200" ng-change="playlist_edit.playlistGoalNoteCreate(playlistGoal.ArrayId, 0)" ng-model-options="{updateOn : 'change blur'}" ng-model="playlist_edit.playlist.PlaylistGoals[playlistGoal.ArrayId].PlaylistGoalNotes[0].NoteText"></textarea>
        <span class="maxlength">{{'NOTE_MAX' | translate}}</span>
      </form>
    </div>
  </div>
</div>
*/