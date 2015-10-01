/**
 * Created by rogersaner on 15/09/22.
 */
ddescribe("controller: PlaylistController(vanilla jasmine, javascript)", function () {

  var playlistController;

  beforeEach(function () {
    module("app");
  });

  /**
   * Given some kind of collection (like playlistController.goals) return the member with SortOrder = sortorder
   */
  var returnItemBySortOrder = function(collection, sortorder) {
    var value = {};
    var found = false;
    collection.forEach(function(item) {
      if (!found && item.SortOrder === sortorder) {
        value = item;
      }
    });
    return value;
  };

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
    // (We do want to use the structure of data which the API is returning, though.)
    // What we care about is, does this unit of functionality in this controller work? That's all.

    playlistController.goals = [{
      "GoalOptions": [{
        "Name": "Half time",
        "Effort": 60,
        "EffortHigh": 0,
        "Position": "Seated",
        "GoalId": "75a96b7d-cbf9-4b0c-9c50-6bf448817a6a",
        "BeatId": "b0f317ec-f812-4645-9240-6c5b062f1e95",
        "Beat": {
          "Name": "Half Time",
          "Ratio": 0.5,
          "Id": "b0f317ec-f812-4645-9240-6c5b062f1e95"
        },
        "Id": "e1c3892d-aaab-4f8b-a406-be78b23ae8b7"
      }],
      "Id": "6d48451a-8180-4df1-acbf-098777ca3736",
      "SortOrder": 6,
      "Name": "Recovery",
      "BpmHigh": 150,
      "BpmLow": 120,
      "Aim": "We want you to ride at 60 - 75 rpm for the duration of the song",
      "CountryId": "8c816daf-70b9-4ecf-b6df-16b5c80fbb31"
    }, {
      "GoalOptions": [{
        "Name": "Seated Sprint",
        "Effort": 80,
        "EffortHigh": 0,
        "Position": "Seated",
        "GoalId": "abdf12d3-c42c-4b43-86f7-72a59a73bee1",
        "BeatId": "cc248edb-247d-4b1f-bdf2-47f9d5508d9d",
        "Beat": {
          "Name": "On The Beat",
          "Ratio": 1,
          "Id": "cc248edb-247d-4b1f-bdf2-47f9d5508d9d"
        },
        "Id": "f018a893-6746-4bd5-a573-24c379a6a890"
      }, {
        "Name": "Seated",
        "Effort": 50,
        "EffortHigh": 0,
        "Position": "Seated",
        "GoalId": "abdf12d3-c42c-4b43-86f7-72a59a73bee1",
        "BeatId": "b0f317ec-f812-4645-9240-6c5b062f1e95",
        "Beat": {
          "Name": "Half Time",
          "Ratio": 0.5,
          "Id": "b0f317ec-f812-4645-9240-6c5b062f1e95"
        },
        "Id": "399a53e0-8e16-4f5d-8bc7-346c68866fdc"
      }],
      "Id": "54101c13-7666-4494-861e-14882325bf00",
      "SortOrder": 3,
      "Name": "Seated Intervals",
      "BpmHigh": 140,
      "BpmLow": 120,
      "Aim": "We want you to alternate sprinting at 120 - 140 rpm and recovering at 60 - 80 rpm for the duration of the song",
      "CountryId": "8c816daf-70b9-4ecf-b6df-16b5c80fbb31"
    }, {
      "GoalOptions": [{
        "Name": "Half time",
        "Effort": 80,
        "EffortHigh": 0,
        "Position": "Seated",
        "GoalId": "a1018f74-03fb-486c-9b16-5f5a032b1fd8",
        "BeatId": "b0f317ec-f812-4645-9240-6c5b062f1e95",
        "Beat": {
          "Name": "Half Time",
          "Ratio": 0.5,
          "Id": "b0f317ec-f812-4645-9240-6c5b062f1e95"
        },
        "Id": "3d09ec4b-c283-48c4-8c35-020472e74ab0"
      }],
      "Id": "a89110e1-89e4-4d6d-9aca-589ba57cffe4",
      "SortOrder": 7,
      "Name": "Seated Climb 2",
      "BpmHigh": 130,
      "BpmLow": 100,
      "Aim": "We want you to ride at 50 - 65 rpm for the duration of the song",
      "CountryId": "8c816daf-70b9-4ecf-b6df-16b5c80fbb31"
    }, {
      "GoalOptions": [{
        "Name": "Half time",
        "Effort": 50,
        "EffortHigh": 60,
        "Position": "Seated",
        "GoalId": "9a078df4-f805-47b8-9d59-aac16d404d5e",
        "BeatId": "b0f317ec-f812-4645-9240-6c5b062f1e95",
        "Beat": {
          "Name": "Half Time",
          "Ratio": 0.5,
          "Id": "b0f317ec-f812-4645-9240-6c5b062f1e95"
        },
        "Id": "1c2e643e-df33-4208-92e2-43c4ab76e81b"
      }],
      "Id": "062b1411-41ef-4bd4-a4a8-694aa5cd967a",
      "SortOrder": 1,
      "Name": "Warm Up",
      "BpmHigh": 90,
      "BpmLow": 80,
      "Aim": "We want you to ride at 80 - 90 rpm for the duration of the song",
      "CountryId": "8c816daf-70b9-4ecf-b6df-16b5c80fbb31"
    }];

    // Set currentgoal to the first goal and mark that goal as active
    _.mapObject(playlistController.goals, function(goal, key) {
      if (goal.SortOrder === 1) {
        goal.show = true;
        playlistController.currentgoal = {
          Id: goal.Id,
          Name: goal.Name,
          BpmLow: goal.BpmLow,
          BpmHigh: goal.BpmHigh
        };
      }
    });

    this.PlaylistFactory.setupEmptyPlaylist(playlistController.goals);
  }));

  describe('Goals', function () {
    it('There should be some goals', function () {
      expect(playlistController.goals.length).toBe(4);
    });

    it('The first goal should be called Warm Up', function () {
      var goal = returnItemBySortOrder(playlistController.goals, 1);
      expect(goal.Name).toEqual('Warm Up');
    });

    it('The first goal should be selected by default', function () {
      var goal = returnItemBySortOrder(playlistController.goals, 1);
      expect(playlistController.isGoalActive(goal)).toBe(true);
    });

    it('Clicking on the first goal should deselect and collapse it', function () {
      // Click on the first goal
      var goal = returnItemBySortOrder(playlistController.goals, 1);
      playlistController.goalClicked(goal);
      expect(goal.show).toEqual(false);
    });

    it('Clicking on the second goal should select that goal and deselect the first goal', function () {
      // Click on the second goal
      var goal2 = returnItemBySortOrder(playlistController.goals, 2);
      playlistController.goalClicked(goal2);
      playlistController.currentgoal.Id = goal2.Id;

      var goal1 = returnItemBySortOrder(playlistController.goals, 1);
      expect(playlistController.isGoalActive(goal1)).toBe(false);
      expect(goal1.show).toEqual(true);
      expect(playlistController.isGoalActive(goal2)).toBe(true);
      expect(goal2.show).toEqual(true);
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

      var goal1 = returnItemBySortOrder(playlistController.goals, 1);
      expect(playlistController.playlist[goal1.Id][0].id).toEqual(track.id);
    });

    it('A track outside of a goal\'s BPM range can\'t be added to that goal', function () {
      var track = playlistController.tracks[0];

      // Click on the second track
      playlistController.addTrack(track);

      // Update the playlist value: I don't know why this doesn't happen automatically
      playlistController.playlist = this.PlaylistFactory.getPlaylist();

      var goal1 = returnItemBySortOrder(playlistController.goals, 1);
      expect(playlistController.playlist[goal1.Id].length).toBe(0);;
    });

    it('A track can be removed from a goal', function () {
      var track = playlistController.tracks[1];

      // Click on the second track because its BPM is 80
      playlistController.addTrack(track);

      // Update the playlist value: I don't know why this doesn't happen automatically
      playlistController.playlist = this.PlaylistFactory.getPlaylist();

      var goal1 = returnItemBySortOrder(playlistController.goals, 1);
      expect(playlistController.playlist[goal1.Id][0].id).toEqual(track.id);

      // Remove the track
      playlistController.removeTrack(goal1.Id, track);

      expect(playlistController.playlist[goal1.Id].length).toBe(0);;
    });

  });
});
