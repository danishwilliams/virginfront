/**
 * Created by rogersaner on 15/09/22.
 */
ddescribe("controller: PlaylistController(vanilla jasmine, javascript)", function () {

  var playlistController;

  beforeEach(function () {
    module("app");
  });

  beforeEach(inject(function ($controller, $httpBackend, AuthenticationService, PlaylistFactory, TracksService) {
    this.$httpBackend = $httpBackend;
    this.TracksService = TracksService;
    this.PlaylistFactory = PlaylistFactory;

    // Various ways of working with a Factory
    //@see http://jasonmore.net/unit-testing-http-service-angular-js/

    // 1. Actually passing the call to the function in the Factory
    // But I found that these functions are getting called anyway, but the value of
    // playlistController.goals = PlaylistFactory.getGoals() isn't being updated, maybe because the value is being
    // set in a callback? Dunno.

    //spyOn(PlaylistFactory, 'loadGoals').andCallThrough();
    //spyOn(PlaylistFactory, 'getGoals').andCallThrough();

    // 2. Giving a pretend response from a Factory method
    /*
    spyOn(PlaylistFactory, 'loadGoals').andCallFake(function () {
      return {
        success: function (callback) {
          callback(
            [
              {
                "id": 0,
                "goal": "Warm Up",
                "aim": "We want you to ride at 80 - 90 rpm for the duration of the song",
                "bpm_low": 80,
                "bpm_high": 90,
                "goal_options": [
                  {
                    "id": 0,
                    "name": "Half time",
                    "position": "Seated",
                    "beat_ratio": 0.5,
                    "effort": 50,
                    "effort_high": 60
                  }
                ]
              }
            ]
          )
        }
      };
    });
    */

    playlistController = $controller('PlaylistController', {
      $httpBackend: $httpBackend,
      AuthenticationService: AuthenticationService,
      PlaylistFactory: PlaylistFactory,
      TracksService: TracksService
    });

    // Set values of goals, currentgoal, Tracks and Playlist. Mock all this data! It's a damn unit test!
    // We don't care about the quality of data which other things are giving us. At all. That can be tested separately.
    // What we care about is, does this unit of functionality in this controller work? That's all.

    playlistController.goals = [{
      "id": 0,
      "goal": "Warm Up",
      "aim": "We want you to ride at 80 - 90 rpm for the duration of the song",
      "bpm_low": 80,
      "bpm_high": 90,
      "show": true,
      "goal_options": [{
        "id": 0,
        "name": "Half time",
        "position": "Seated",
        "beat_ratio": 0.5,
        "effort": 50,
        "effort_high": 60
      }]
    }, {
      "id": 1,
      "goal": "Warm Up",
      "aim": "We want you to ride at 80 - 90 rpm for the duration of the song",
      "bpm_low": 80,
      "bpm_high": 90,
      "goal_options": [{
        "id": 0,
        "name": "Half time",
        "position": "Seated",
        "beat_ratio": 0.5,
        "effort": 50,
        "effort_high": 60
      }]
    }];

    playlistController.currentgoal = {
      id: playlistController.goals[0].id,
      bpm_low: playlistController.goals[0].bpm_low,
      bpm_high: playlistController.goals[0].bpm_high
    };

    this.PlaylistFactory.setupEmptyPlaylist(playlistController.goals);
  }));

  describe('Goals', function () {
    it('There should be some goals', function () {
      expect(playlistController.goals.length).toBe(2);
    });

    it('The first goal should be called Warm Up', function () {
      expect(playlistController.goals[0].goal).toEqual('Warm Up');
    });

    it('The first goal should be selected by default', function () {
      expect(playlistController.isGoalActive(playlistController.goals[0])).toBe(true);
    });

    it('Clicking on the first goal should deselect and collapse it', function () {
      // Click on the first goal
      playlistController.goalClicked(playlistController.goals[0]);

      expect(playlistController.goals[0].show).toEqual(false);
    });

    it('Clicking on the second goal should select that goal and deselect the first goal', function () {
      // Click on the second goal
      playlistController.goalClicked(playlistController.goals[1]);
      playlistController.currentgoal.id = 1;

      expect(playlistController.isGoalActive(playlistController.goals[0])).toBe(false);
      expect(playlistController.goals[0].show).toEqual(true);
      expect(playlistController.isGoalActive(playlistController.goals[1])).toBe(true);
      expect(playlistController.goals[1].show).toEqual(true);
    });
  });

  describe('Building a playlist with tracks', function () {

    beforeEach(inject(function () {
      // Set up a placeholder playlist structure
      playlistController.playlist = [];

      playlistController.goals.forEach(function (value) {
        playlistController.playlist.push([]);
      });

      // Add some tracks to the track selection sidebar
      playlistController.tracks = this.TracksService.initTracks();
    }));

    it('There should be some tracks', function () {
      expect(playlistController.tracks.length).toBeGreaterThan(0);
    });

    it('A track can be added to the first goal', function () {
      var track = playlistController.tracks[1];

      // Click on the second track because its BPM is 80
      playlistController.addTrack(track);

      // Update the playlist value: I don't know why this doesn't happen automatically
      playlistController.playlist = this.PlaylistFactory.getPlaylist();

      expect(playlistController.playlist[0][0].id).toEqual(track.id);
    });

    it('A track outside of a goal\'s BPM range can\'t be added to that goal', function () {
      var track = playlistController.tracks[0];

      // Click on the first track
      playlistController.addTrack(playlistController.tracks[0]);

      // Update the playlist value: I don't know why this doesn't happen automatically
      playlistController.playlist = this.PlaylistFactory.getPlaylist();

      expect(playlistController.playlist[0][0]).toBe(undefined);;
    });

    it('A track can be removed from a goal', function () {
      var track = playlistController.tracks[1];

      // Click on the second track because its BPM is 80
      playlistController.addTrack(track);

      // Update the playlist value: I don't know why this doesn't happen automatically
      playlistController.playlist = this.PlaylistFactory.getPlaylist();

      expect(playlistController.playlist[0][0].id).toEqual(track.id);

      // Remove the track
      playlistController.removeTrack(0, track);

      expect(playlistController.playlist[0][0]).toBe(undefined);;
    });

  });
});
