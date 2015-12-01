/**
 * Created by rogersaner on 15/09/22.
 */
ddescribe("controller: Playlist_editController(vanilla jasmine, javascript)", function () {

  var playlistController;

  beforeEach(function () {
    module("app");
  });

  /**
   * Given some kind of collection (like playlistController.goals) return the member with SortOrder = sortorder
   */
  var returnItemBySortOrder = function (collection, sortorder) {
    var value = {};
    var found = false;
    collection.forEach(function (item) {
      if (!found && item.SortOrder === sortorder) {
        value = item;
      }
    });
    return value;
  };

  beforeEach(inject(function ($controller, $httpBackend, AuthenticationService, Playlists, Tracks) {
    this.$httpBackend = $httpBackend;
    this.Tracks = Tracks;
    this.Playlists = Playlists;

    // Various ways of working with a Factory
    //@see http://jasonmore.net/unit-testing-http-service-angular-js/

    // 1. Actually passing the call to the function in the Factory
    // But I found that these functions are getting called anyway, but the value of
    // playlistController.goals = Playlists.getGoals() isn't being updated, maybe because the value is being
    // set in a callback? Dunno.

    //spyOn(Playlists, 'loadGoals').andCallThrough();
    //spyOn(Playlists, 'getGoals').andCallThrough();

    // 2. Giving a pretend response from a Factory method
    /*
    spyOn(Playlists, 'loadGoals').andCallFake(function () {
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

    playlistController = $controller('Playlist_editController', {
      $httpBackend: $httpBackend,
      AuthenticationService: AuthenticationService,
      Playlists: Playlists,
      Tracks: Tracks
    });

    this.createAnewPlaylist = function () {
      var playlist = this.Playlists.createNewPlaylistFromTemplate(this.playlistTemplate);
      this.Playlists.setPlaylist(playlist);
      playlistController.newPlaylist = true;
      playlistController.playlist = this.Playlists.getPlaylist();
    };

    this.editPlaylist = function () {
      this.Playlists.setPlaylist(this.playlist);
      playlistController.newPlaylist = false;
      playlistController.playlist = this.Playlists.getPlaylist();
    };

    /****** Playlist add/edit tests because they're called multiple times ******/

    this.testTrackCanBeAddedToTheFirstGoal = function () {
      this.Playlists.addTrackToGoalPlaylist(0, this.trackNormal);

      expect(playlistController.playlist.PlaylistGoals[0].PlaylistGoalTracks[0].Track.Name).toEqual('Hello');
    };

    this.testTrackCanBeRemovedFromAgoal = function () {
      this.Playlists.addTrackToGoalPlaylist(0, this.trackNormal);

      playlistController.removeTrack(0, this.trackNormal);

      expect(playlistController.playlist.PlaylistGoals[0].PlaylistGoalTracks.length).toBe(0);
    };

    this.testTrackCounterCorrectAfterAddingSong = function () {
      this.Playlists.addTrackToGoalPlaylist(0, this.trackNormal);

      playlistController.playlistTracksLength = this.Playlists.getPlaylistLength();

      expect(playlistController.playlistTracksLength).toEqual(260);
    };

    this.testTrackCounterCorrectAfterAddingTwoSongs = function () {
      this.Playlists.addTrackToGoalPlaylist(0, this.trackNormal);
      this.Playlists.addTrackToGoalPlaylist(1, this.trackShort);

      playlistController.playlistTracksLength = this.Playlists.getPlaylistLength();

      expect(playlistController.playlistTracksLength).toEqual(320);
    };

    this.testTrackCounterCorrectAfterAddingManySongs = function () {
      this.Playlists.addTrackToGoalPlaylist(0, this.trackNormal);
      this.Playlists.addTrackToGoalPlaylist(1, this.trackShort);
      this.Playlists.addTrackToGoalPlaylist(2, this.trackNormal);
      this.Playlists.addTrackToGoalPlaylist(3, this.trackShort);
      this.Playlists.addTrackToGoalPlaylist(4, this.trackNormal);
      this.Playlists.addTrackToGoalPlaylist(5, this.trackShort);
      this.Playlists.addTrackToGoalPlaylist(6, this.trackShort);
      this.Playlists.addTrackToGoalPlaylist(7, this.trackLong);

      playlistController.playlistTracksLength = this.Playlists.getPlaylistLength();

      expect(playlistController.playlistTracksLength).toEqual(1620);
    };

    this.testTrackCounterCorrectAfterAddingAndRemovingSongs = function () {
      this.Playlists.addTrackToGoalPlaylist(0, this.trackNormal);
      this.Playlists.addTrackToGoalPlaylist(1, this.trackShort);
      this.Playlists.addTrackToGoalPlaylist(2, this.trackNormal);
      this.Playlists.addTrackToGoalPlaylist(3, this.trackShort);
      this.Playlists.addTrackToGoalPlaylist(4, this.trackNormal);
      playlistController.removeTrack(0, this.trackNormal);
      this.Playlists.addTrackToGoalPlaylist(5, this.trackShort);
      this.Playlists.addTrackToGoalPlaylist(6, this.trackShort);
      this.Playlists.addTrackToGoalPlaylist(7, this.trackLong);
      playlistController.removeTrack(6, this.trackShort);

      playlistController.playlistTracksLength = this.Playlists.getPlaylistLength();

      expect(playlistController.playlistTracksLength).toEqual(1300);
    };


    // Set values of goals, currentgoal, Tracks and Playlist. Mock all this data! It's a damn unit test!
    // We don't care about the quality of data which other things are giving us. At all. That can be tested separately.
    // (We do want to use the structure of data which the API is returning, though.)
    // What we care about is, does this unit of functionality in this controller work? That's all.

    // Set up some tracks
    this.trackNormal = {
      "Name": "Hello",
      "Album": "Hello",
      "Artist": "Adele",
      "Bpm": 82,
      "DurationSeconds": 260,
      "Source": "http://l3.simfyafrica.com/data/3/7/a/9/37a96fa3f8ac31e10d7c24eb984c74c3?nvb=20151129210306&nva=20151202070415&encoded=0e3ece39d05351c826b15",
      "CoverImgUrl": "http://www.simfy.co.za/photos/tracks/54525247/320.jpg",
      "MusicProviderTrackId": "54525247",
      "MusicProviderId": "6fde5180-3a6f-4230-aea7-c607c726616f",
      "GenreId": "31db3a05-30c7-4058-94a6-504046d4b178",
      "Genre": {
        "Name": "Pop",
        "Id": "31db3a05-30c7-4058-94a6-504046d4b178"
      }
    };
    this.trackShort = {
      "Name": "The Wolf",
      "Album": "Wilder Mind",
      "Artist": "Mumford & Sons",
      "Bpm": 135,
      "DurationSeconds": 60,
      "Source": "http://l3.simfyafrica.com/data/d/4/1/d/d41d773f4bfc03be65d4e4b4d6b47c43?nvb=20151129222204&nva=20151202070524&encoded=06ad3e442a06912e43d41",
      "CoverImgUrl": "http://www.simfy.co.za/photos/tracks/50503094/320.jpg",
      "MusicProviderTrackId": "50503094",
      "MusicProviderId": "6fde5180-3a6f-4230-aea7-c607c726616f",
      "GenreId": "7c87cd38-cdad-4bb7-9380-2b9121f7eef3",
      "Genre": {
        "Name": "Alternative",
        "Id": "7c87cd38-cdad-4bb7-9380-2b9121f7eef3"
      }
    };
    this.trackLong = {
      "Name": "Concerto No. 21 in C Major for Piano and Orchestra, K. 467: II. Andante (\"Elvira Madigan\")",
      "Album": "Homework Hits, Vol. 5: Mozart",
      "Artist": "Wolfgang Amadeus Mozart",
      "Bpm": 125,
      "DurationSeconds": 600,
      "Source": "http://l3.simfyafrica.com/data/0/0/c/3/00c3cd373ae3ec0a14b229c965d81565?nvb=20151129210306&nva=20151202070440&encoded=0dbf4adbc2ff2d9e6d42f",
      "CoverImgUrl": "http://www.simfy.co.za/photos/tracks/14130640/320.jpg",
      "MusicProviderTrackId": "14130640",
      "MusicProviderId": "6fde5180-3a6f-4230-aea7-c607c726616f",
      "GenreId": "f2092b8f-2ffe-49ce-bb27-97b677eb2c67",
      "Genre": {
        "Name": "Other",
        "Id": "f2092b8f-2ffe-49ce-bb27-97b677eb2c67"
      }
    };

    this.playlistTemplate = {
      "Id": "3d139eb7-5a3a-416b-8ab4-bf9d345eae8e",
      "TemplateGroup": {
        "Name": "All Terrain",
        "Description": "Mix it up with a variety of track goals and a broad range of intensities.",
        "IconFileName": "allterrain.svg",
        "Id": "f30a2661-21f2-4455-8cd1-5a793eb8c438"
      },
      "ClassLengthMinutes": 45,
      "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34",
      "Goals": [{
        "GoalOptions": [{
          "Name": null,
          "Effort": 50,
          "EffortHigh": 60,
          "Position": "Seated",
          "GoalId": "61038c2e-4ee9-44cb-9dac-b7371b501197",
          "BeatId": "0cc08123-f231-47f1-8023-f8d78457e302",
          "Beat": {
            "Name": "On The Beat",
            "Ratio": 1,
            "Id": "0cc08123-f231-47f1-8023-f8d78457e302"
          },
          "Id": "91d13ce5-f3c5-4cee-87e3-fabb7906a4ea"
        }],
        "Id": "61038c2e-4ee9-44cb-9dac-b7371b501197",
        "SortOrder": 1,
        "Name": "Warm Up",
        "BpmHigh": 100,
        "BpmLow": 90,
        "Aim": null,
        "Interval": false,
        "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34"
      }, {
        "GoalOptions": [{
          "Name": null,
          "Effort": 60,
          "EffortHigh": 70,
          "Position": "Seated",
          "GoalId": "442fc263-1972-437a-b1f3-fdbdd9740acf",
          "BeatId": "0cc08123-f231-47f1-8023-f8d78457e302",
          "Beat": {
            "Name": "On The Beat",
            "Ratio": 1,
            "Id": "0cc08123-f231-47f1-8023-f8d78457e302"
          },
          "Id": "702da904-4ae1-46c8-9c20-3b12a0237c97"
        }],
        "Id": "442fc263-1972-437a-b1f3-fdbdd9740acf",
        "SortOrder": 2,
        "Name": "Seated Ride",
        "BpmHigh": 110,
        "BpmLow": 90,
        "Aim": null,
        "Interval": false,
        "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34"
      }, {
        "GoalOptions": [{
          "Name": "Sprint",
          "Effort": 70,
          "EffortHigh": 80,
          "Position": "Seated",
          "GoalId": "00e1a846-8e8e-472b-a9dd-a23410011f31",
          "BeatId": "0cc08123-f231-47f1-8023-f8d78457e302",
          "Beat": {
            "Name": "On The Beat",
            "Ratio": 1,
            "Id": "0cc08123-f231-47f1-8023-f8d78457e302"
          },
          "Id": "a7148f42-d11e-4fbc-9963-83968ea42b0e"
        }, {
          "Name": "Recovery",
          "Effort": 60,
          "EffortHigh": 0,
          "Position": "Seated",
          "GoalId": "00e1a846-8e8e-472b-a9dd-a23410011f31",
          "BeatId": "4e8885d1-4939-463c-bcda-adbdeede628d",
          "Beat": {
            "Name": "Half Time",
            "Ratio": 0.5,
            "Id": "4e8885d1-4939-463c-bcda-adbdeede628d"
          },
          "Id": "297c3502-7ad0-42b0-a0fd-0004d3040a4f"
        }],
        "Id": "00e1a846-8e8e-472b-a9dd-a23410011f31",
        "SortOrder": 3,
        "Name": "Seated Interval",
        "BpmHigh": 130,
        "BpmLow": 110,
        "Aim": null,
        "Interval": false,
        "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34"
      }, {
        "GoalOptions": [{
          "Name": null,
          "Effort": 80,
          "EffortHigh": 90,
          "Position": "Standing",
          "GoalId": "c011d9a2-aa8b-4e5b-a090-c4a89c347014",
          "BeatId": "4e8885d1-4939-463c-bcda-adbdeede628d",
          "Beat": {
            "Name": "Half Time",
            "Ratio": 0.5,
            "Id": "4e8885d1-4939-463c-bcda-adbdeede628d"
          },
          "Id": "8099abb0-7608-4c53-a12a-eb992e1a9042"
        }],
        "Id": "c011d9a2-aa8b-4e5b-a090-c4a89c347014",
        "SortOrder": 4,
        "Name": "Standing Climb",
        "BpmHigh": 160,
        "BpmLow": 120,
        "Aim": null,
        "Interval": false,
        "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34"
      }, {
        "GoalOptions": [{
          "Name": null,
          "Effort": 70,
          "EffortHigh": 80,
          "Position": "Seated",
          "GoalId": "c887dae4-98ef-43a0-a64d-937ce60e26d3",
          "BeatId": "0cc08123-f231-47f1-8023-f8d78457e302",
          "Beat": {
            "Name": "On The Beat",
            "Ratio": 1,
            "Id": "0cc08123-f231-47f1-8023-f8d78457e302"
          },
          "Id": "87db1a3e-2ea8-48ba-af27-c54e302746c0"
        }],
        "Id": "c887dae4-98ef-43a0-a64d-937ce60e26d3",
        "SortOrder": 5,
        "Name": "Seated Rolling Hills",
        "BpmHigh": 110,
        "BpmLow": 90,
        "Aim": null,
        "Interval": false,
        "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34"
      }, {
        "GoalOptions": [{
          "Name": "Sprint",
          "Effort": 60,
          "EffortHigh": 0,
          "Position": "Seated",
          "GoalId": "ccc20698-8253-491b-9783-5cda00935522",
          "BeatId": "0cc08123-f231-47f1-8023-f8d78457e302",
          "Beat": {
            "Name": "On The Beat",
            "Ratio": 1,
            "Id": "0cc08123-f231-47f1-8023-f8d78457e302"
          },
          "Id": "b5e93e55-8a30-4bfd-ab28-ea7d412afc5f"
        }, {
          "Name": "Recovery",
          "Effort": 60,
          "EffortHigh": 0,
          "Position": "Seated",
          "GoalId": "ccc20698-8253-491b-9783-5cda00935522",
          "BeatId": "4e8885d1-4939-463c-bcda-adbdeede628d",
          "Beat": {
            "Name": "Half Time",
            "Ratio": 0.5,
            "Id": "4e8885d1-4939-463c-bcda-adbdeede628d"
          },
          "Id": "651fb47d-b27a-42cd-a17c-d383a23c7169"
        }],
        "Id": "ccc20698-8253-491b-9783-5cda00935522",
        "SortOrder": 6,
        "Name": "Active Recovery",
        "BpmHigh": 180,
        "BpmLow": 160,
        "Aim": null,
        "Interval": false,
        "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34"
      }, {
        "GoalOptions": [{
          "Name": "Sprint",
          "Effort": 70,
          "EffortHigh": 80,
          "Position": "Seated",
          "GoalId": "00e1a846-8e8e-472b-a9dd-a23410011f31",
          "BeatId": "0cc08123-f231-47f1-8023-f8d78457e302",
          "Beat": {
            "Name": "On The Beat",
            "Ratio": 1,
            "Id": "0cc08123-f231-47f1-8023-f8d78457e302"
          },
          "Id": "a7148f42-d11e-4fbc-9963-83968ea42b0e"
        }, {
          "Name": "Recovery",
          "Effort": 60,
          "EffortHigh": 0,
          "Position": "Seated",
          "GoalId": "00e1a846-8e8e-472b-a9dd-a23410011f31",
          "BeatId": "4e8885d1-4939-463c-bcda-adbdeede628d",
          "Beat": {
            "Name": "Half Time",
            "Ratio": 0.5,
            "Id": "4e8885d1-4939-463c-bcda-adbdeede628d"
          },
          "Id": "297c3502-7ad0-42b0-a0fd-0004d3040a4f"
        }],
        "Id": "00e1a846-8e8e-472b-a9dd-a23410011f31",
        "SortOrder": 7,
        "Name": "Seated Interval",
        "BpmHigh": 130,
        "BpmLow": 110,
        "Aim": null,
        "Interval": false,
        "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34"
      }, {
        "GoalOptions": [{
          "Name": null,
          "Effort": 80,
          "EffortHigh": 90,
          "Position": "Seated",
          "GoalId": "c1d42fa8-a27f-4129-a1da-e0930efb2cec",
          "BeatId": "0cc08123-f231-47f1-8023-f8d78457e302",
          "Beat": {
            "Name": "On The Beat",
            "Ratio": 1,
            "Id": "0cc08123-f231-47f1-8023-f8d78457e302"
          },
          "Id": "07df87dc-e90d-429b-9eae-0201414d3e3c"
        }],
        "Id": "c1d42fa8-a27f-4129-a1da-e0930efb2cec",
        "SortOrder": 8,
        "Name": "Standing Rolling Hills",
        "BpmHigh": 100,
        "BpmLow": 80,
        "Aim": null,
        "Interval": false,
        "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34"
      }, {
        "GoalOptions": [{
          "Name": "Sprint",
          "Effort": 90,
          "EffortHigh": 0,
          "Position": "Seated",
          "GoalId": "3a796d73-4406-409d-893f-6ed04e2dead9",
          "BeatId": "0cc08123-f231-47f1-8023-f8d78457e302",
          "Beat": {
            "Name": "On The Beat",
            "Ratio": 1,
            "Id": "0cc08123-f231-47f1-8023-f8d78457e302"
          },
          "Id": "6ae5546e-b967-496e-8451-764c40e635a9"
        }, {
          "Name": "Recovery",
          "Effort": 60,
          "EffortHigh": 0,
          "Position": "Standing",
          "GoalId": "3a796d73-4406-409d-893f-6ed04e2dead9",
          "BeatId": "4e8885d1-4939-463c-bcda-adbdeede628d",
          "Beat": {
            "Name": "Half Time",
            "Ratio": 0.5,
            "Id": "4e8885d1-4939-463c-bcda-adbdeede628d"
          },
          "Id": "cb46f85d-96da-4b1c-bb56-1ba9b955d875"
        }],
        "Id": "3a796d73-4406-409d-893f-6ed04e2dead9",
        "SortOrder": 9,
        "Name": "Alt Seated & Standing Climb",
        "BpmHigh": 160,
        "BpmLow": 120,
        "Aim": null,
        "Interval": false,
        "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34"
      }, {
        "GoalOptions": [{
          "Name": null,
          "Effort": 90,
          "EffortHigh": 100,
          "Position": "Seated",
          "GoalId": "1a63b68c-2f9b-48eb-9ded-883d71d670e7",
          "BeatId": "0cc08123-f231-47f1-8023-f8d78457e302",
          "Beat": {
            "Name": "On The Beat",
            "Ratio": 1,
            "Id": "0cc08123-f231-47f1-8023-f8d78457e302"
          },
          "Id": "cc6dde04-d7d1-449c-a96b-fb06c4157ea2"
        }],
        "Id": "1a63b68c-2f9b-48eb-9ded-883d71d670e7",
        "SortOrder": 10,
        "Name": "The Finish Line Sprint",
        "BpmHigh": 200,
        "BpmLow": 130,
        "Aim": null,
        "Interval": false,
        "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34"
      }, {
        "GoalOptions": [{
          "Name": null,
          "Effort": 50,
          "EffortHigh": 60,
          "Position": "Seated",
          "GoalId": "8dec4aa5-b994-438d-b64f-17c96d53dfe4",
          "BeatId": "0cc08123-f231-47f1-8023-f8d78457e302",
          "Beat": {
            "Name": "On The Beat",
            "Ratio": 1,
            "Id": "0cc08123-f231-47f1-8023-f8d78457e302"
          },
          "Id": "f9afe5cd-128f-4950-ba9f-691cf6c5be0f"
        }],
        "Id": "8dec4aa5-b994-438d-b64f-17c96d53dfe4",
        "SortOrder": 11,
        "Name": "Cool Down",
        "BpmHigh": 90,
        "BpmLow": 80,
        "Aim": null,
        "Interval": false,
        "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34"
      }]
    };

    this.playlist = {
      "Name": "calvin harris 2",
      "Shared": false,
      "SharedFromPlayListId": null,
      "UserId": "d1510e26-d628-459c-9f50-379662f61d05",
      "User": null,
      "TemplateName": "All Terrain",
      "TemplateIconFileName": "allterrain.svg",
      "TemplateId": "3d139eb7-5a3a-416b-8ab4-bf9d345eae8e",
      "LastUpdated": "2015-11-27T09:42:18.203",
      "CreateDate": "2015-10-28T12:21:37.257",
      "ClassLengthMinutes": 45,
      "MusicProviderPlaylistId": "18061059",
      "MusicProviderPlaylistSaved": false,
      "Complete": true,
      "PlaylistGoals": [{
        "SortOrder": 1,
        "PlaylistId": "0e16d4ba-1557-46d0-891c-05ac87ecf90a",
        "GoalId": "4733c545-81e3-4138-b91a-47a096c9d7dc",
        "Goal": {
          "Name": "Warm Up",
          "BpmHigh": 90,
          "BpmLow": 80,
          "Aim": "We want you to ride at 80 - 90 rpm for the duration of the song",
          "Interval": false,
          "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34",
          "Country": null,
          "GoalChallenge": null,
          "GoalChallengeId": null,
          "GoalOptions": [{
            "Name": "On the beat",
            "Effort": 90,
            "EffortHigh": 0,
            "Position": "Standing",
            "GoalId": "4733c545-81e3-4138-b91a-47a096c9d7dc",
            "BeatId": "0cc08123-f231-47f1-8023-f8d78457e302",
            "Beat": {
              "Name": "On The Beat",
              "Ratio": 1,
              "Id": "0cc08123-f231-47f1-8023-f8d78457e302"
            },
            "Id": "2e832bde-1317-4f49-951a-6bae1242ca76"
          }],
          "Id": "4733c545-81e3-4138-b91a-47a096c9d7dc"
        },
        "PlaylistGoalNotes": [{
          "TrackTimeSeconds": null,
          "NoteText": "I'd like to add some notes, please!",
          "TrackId": "00ae4a3b-52ce-4c29-88e9-29ed070f4c27",
          "SortOrder": 1,
          "Id": "5c5baf44-b4c7-477b-853f-d646920610c5"
        }],
        "PlaylistGoalTracks": [{
          "TrackId": "0f60c832-43cc-4c7d-9105-1f9e593b4faa",
          "Track": {
            "Name": "Lean On (feat. MØ & DJ Snake)",
            "Album": "Peace Is The Mission",
            "Artist": "Major Lazer",
            "Bpm": 177,
            "DurationSeconds": 176,
            "CoverImgUrl": "http://www.simfy.co.za/photos/tracks/51340018/320.jpg",
            "MusicProviderTrackId": "51340018",
            "MusicProviderId": "6fde5180-3a6f-4230-aea7-c607c726616f",
            "MusicProvider": null,
            "GenreId": "f2092b8f-2ffe-49ce-bb27-97b677eb2c67",
            "Genre": {
              "Name": "Other",
              "Id": "f2092b8f-2ffe-49ce-bb27-97b677eb2c67"
            },
            "Id": "0f60c832-43cc-4c7d-9105-1f9e593b4faa"
          },
          "SortOrder": 0,
          "Id": "49e122a4-4856-4ece-b95d-0e1cd5715938"
        }],
        "Id": "7d811b32-5e1f-44ed-99b8-247f58720098"
      }, {
        "SortOrder": 2,
        "PlaylistId": "0e16d4ba-1557-46d0-891c-05ac87ecf90a",
        "GoalId": "21c37c85-b8b5-4e54-8750-8ea48d412104",
        "Goal": {
          "Name": "Seated Ride",
          "BpmHigh": 120,
          "BpmLow": 100,
          "Aim": "We want you to ride at 100 - 120 rpm for the duration of the song",
          "Interval": false,
          "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34",
          "Country": null,
          "GoalChallenge": null,
          "GoalChallengeId": null,
          "GoalOptions": [{
            "Name": "Seated Sprint",
            "Effort": 70,
            "EffortHigh": 0,
            "Position": "Seated",
            "GoalId": "21c37c85-b8b5-4e54-8750-8ea48d412104",
            "BeatId": "0cc08123-f231-47f1-8023-f8d78457e302",
            "Beat": {
              "Name": "On The Beat",
              "Ratio": 1,
              "Id": "0cc08123-f231-47f1-8023-f8d78457e302"
            },
            "Id": "dd297d55-8b05-4988-8091-4fb642b9afd7"
          }],
          "Id": "21c37c85-b8b5-4e54-8750-8ea48d412104"
        },
        "PlaylistGoalNotes": [],
        "PlaylistGoalTracks": [{
          "TrackId": "d842cbb2-c834-49c5-b545-f68c8ff8b69c",
          "Track": {
            "Name": "Não Tô Entendendo",
            "Album": "Ronaldo Foi Pra Guerra",
            "Artist": "Lobão E Os Ronaldos",
            "Bpm": 103,
            "DurationSeconds": 152,
            "CoverImgUrl": "http://www.simfy.co.za/photos/tracks/28093011/320.jpg",
            "MusicProviderTrackId": "28093011",
            "MusicProviderId": "6fde5180-3a6f-4230-aea7-c607c726616f",
            "MusicProvider": null,
            "GenreId": "31db3a05-30c7-4058-94a6-504046d4b178",
            "Genre": {
              "Name": "Pop",
              "Id": "31db3a05-30c7-4058-94a6-504046d4b178"
            },
            "Id": "d842cbb2-c834-49c5-b545-f68c8ff8b69c"
          },
          "SortOrder": 0,
          "Id": "9e301d6e-3a2c-4f69-98f0-bece19b4f1cf"
        }],
        "Id": "ac4e1472-1b65-49fa-ba2b-53eafa8937a4"
      }, {
        "SortOrder": 3,
        "PlaylistId": "0e16d4ba-1557-46d0-891c-05ac87ecf90a",
        "GoalId": "aef40c68-b087-45b2-be0b-119f6b686329",
        "Goal": {
          "Name": "Seated Intervals",
          "BpmHigh": 140,
          "BpmLow": 120,
          "Aim": "We want you to alternate sprinting at 120 - 140 rpm and recovering at 60 - 80 rpm for the duration of the song",
          "Interval": false,
          "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34",
          "Country": null,
          "GoalChallenge": null,
          "GoalChallengeId": null,
          "GoalOptions": [{
            "Name": "Seated Sprint",
            "Effort": 80,
            "EffortHigh": 0,
            "Position": "Seated",
            "GoalId": "aef40c68-b087-45b2-be0b-119f6b686329",
            "BeatId": "0cc08123-f231-47f1-8023-f8d78457e302",
            "Beat": {
              "Name": "On The Beat",
              "Ratio": 1,
              "Id": "0cc08123-f231-47f1-8023-f8d78457e302"
            },
            "Id": "6e63ccfe-ebb9-4e4d-b0ce-6ac74b48a7ca"
          }, {
            "Name": "Seated",
            "Effort": 50,
            "EffortHigh": 0,
            "Position": "Seated",
            "GoalId": "aef40c68-b087-45b2-be0b-119f6b686329",
            "BeatId": "4e8885d1-4939-463c-bcda-adbdeede628d",
            "Beat": {
              "Name": "Half Time",
              "Ratio": 0.5,
              "Id": "4e8885d1-4939-463c-bcda-adbdeede628d"
            },
            "Id": "6182c77c-480e-4007-86cd-9a63155c6ed4"
          }],
          "Id": "aef40c68-b087-45b2-be0b-119f6b686329"
        },
        "PlaylistGoalNotes": [{
          "TrackTimeSeconds": null,
          "NoteText": "Aim: Alternate between sprinting on the beat and recovering on the half beat for the duration of the song.",
          "TrackId": "47a79159-6ae9-46c1-92ea-e28f0dcae417",
          "SortOrder": 1,
          "Id": "67b70591-658a-4e4a-9397-c83e0aeb6641"
        }],
        "PlaylistGoalTracks": [{
          "TrackId": "47a79159-6ae9-46c1-92ea-e28f0dcae417",
          "Track": {
            "Name": "Le Legionnaire",
            "Album": "Bzn Live - 20 Jaar",
            "Artist": "BZN",
            "Bpm": 123,
            "DurationSeconds": 288,
            "CoverImgUrl": "http://www.simfy.co.za/photos/tracks/12761579/320.jpg",
            "MusicProviderTrackId": "53636415",
            "MusicProviderId": "6fde5180-3a6f-4230-aea7-c607c726616f",
            "MusicProvider": null,
            "GenreId": "31db3a05-30c7-4058-94a6-504046d4b178",
            "Genre": {
              "Name": "Pop",
              "Id": "31db3a05-30c7-4058-94a6-504046d4b178"
            },
            "Id": "47a79159-6ae9-46c1-92ea-e28f0dcae417"
          },
          "SortOrder": 0,
          "Id": "0807fd5c-baee-4d73-89b3-d41f410ae78a"
        }],
        "Id": "b6edab4d-4ff7-415f-8a4d-ba07759d588c"
      }, {
        "SortOrder": 4,
        "PlaylistId": "0e16d4ba-1557-46d0-891c-05ac87ecf90a",
        "GoalId": "b0b675be-684e-45f8-a275-03844f713674",
        "Goal": {
          "Name": "Seated Climb",
          "BpmHigh": 130,
          "BpmLow": 100,
          "Aim": "We want you to ride at 50 - 65 rpm for the duration of the song",
          "Interval": false,
          "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34",
          "Country": null,
          "GoalChallenge": null,
          "GoalChallengeId": null,
          "GoalOptions": [{
            "Name": "Half time",
            "Effort": 80,
            "EffortHigh": 0,
            "Position": "Seated",
            "GoalId": "b0b675be-684e-45f8-a275-03844f713674",
            "BeatId": "4e8885d1-4939-463c-bcda-adbdeede628d",
            "Beat": {
              "Name": "Half Time",
              "Ratio": 0.5,
              "Id": "4e8885d1-4939-463c-bcda-adbdeede628d"
            },
            "Id": "1223f8d4-2391-47b7-9c83-93fa7eba5e2d"
          }],
          "Id": "b0b675be-684e-45f8-a275-03844f713674"
        },
        "PlaylistGoalNotes": [{
          "TrackTimeSeconds": 14,
          "NoteText": "Hit them hard now!",
          "TrackId": "21761241-4dd4-45d3-8b5d-898b0ae867e0",
          "SortOrder": 1,
          "Id": "16ec1aa1-081e-443a-8cfa-2a62cd128029"
        }],
        "PlaylistGoalTracks": [{
          "TrackId": "0e2c6ea8-bb06-4e0f-a702-e1532b2410f0",
          "Track": {
            "Name": "Devil In Me",
            "Album": "22-20s",
            "Artist": "22-20s",
            "Bpm": 103,
            "DurationSeconds": 259,
            "CoverImgUrl": "http://www.simfy.co.za/photos/tracks/14585397/320.jpg",
            "MusicProviderTrackId": "14585397",
            "MusicProviderId": "6fde5180-3a6f-4230-aea7-c607c726616f",
            "MusicProvider": null,
            "GenreId": "f2092b8f-2ffe-49ce-bb27-97b677eb2c67",
            "Genre": {
              "Name": "Other",
              "Id": "f2092b8f-2ffe-49ce-bb27-97b677eb2c67"
            },
            "Id": "0e2c6ea8-bb06-4e0f-a702-e1532b2410f0"
          },
          "SortOrder": 0,
          "Id": "57e24191-f480-453d-ad84-0b97130fbfae"
        }],
        "Id": "b5999600-a1d7-4b40-9530-d60f948b1871"
      }, {
        "SortOrder": 5,
        "PlaylistId": "0e16d4ba-1557-46d0-891c-05ac87ecf90a",
        "GoalId": "cb06d8b8-d1d7-4dec-96c3-9a552e7ea7c1",
        "Goal": {
          "Name": "Standing Climb",
          "BpmHigh": 130,
          "BpmLow": 100,
          "Aim": "We want you to ride at 50 - 65 rpm for the duration of the song",
          "Interval": false,
          "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34",
          "Country": null,
          "GoalChallenge": null,
          "GoalChallengeId": null,
          "GoalOptions": [{
            "Name": "Half time",
            "Effort": 90,
            "EffortHigh": 0,
            "Position": "Standing",
            "GoalId": "cb06d8b8-d1d7-4dec-96c3-9a552e7ea7c1",
            "BeatId": "0cc08123-f231-47f1-8023-f8d78457e302",
            "Beat": {
              "Name": "On The Beat",
              "Ratio": 1,
              "Id": "0cc08123-f231-47f1-8023-f8d78457e302"
            },
            "Id": "55cd31d7-5ef6-4a2f-b5ca-c9bd45d2c8a4"
          }],
          "Id": "cb06d8b8-d1d7-4dec-96c3-9a552e7ea7c1"
        },
        "PlaylistGoalNotes": [{
          "TrackTimeSeconds": 55,
          "NoteText": "Hmmm what should I eat tonight",
          "TrackId": "69cb3bbf-757d-434f-b734-eed62f66ba68",
          "SortOrder": 1,
          "Id": "6dc84a27-0edd-4b23-9846-35cef14e75b2"
        }],
        "PlaylistGoalTracks": [{
          "TrackId": "bbaf11fb-89d5-4991-b8c8-0eedd0d063eb",
          "Track": {
            "Name": "My Name Is Jonas",
            "Album": "Weezer",
            "Artist": "Weezer",
            "Bpm": 118,
            "DurationSeconds": 204,
            "CoverImgUrl": "http://www.simfy.co.za/photos/tracks/288351/320.jpg",
            "MusicProviderTrackId": "288351",
            "MusicProviderId": "6fde5180-3a6f-4230-aea7-c607c726616f",
            "MusicProvider": null,
            "GenreId": "31db3a05-30c7-4058-94a6-504046d4b178",
            "Genre": {
              "Name": "Pop",
              "Id": "31db3a05-30c7-4058-94a6-504046d4b178"
            },
            "Id": "bbaf11fb-89d5-4991-b8c8-0eedd0d063eb"
          },
          "SortOrder": 0,
          "Id": "b7502f19-582c-4a6c-91c4-4af077362d1e"
        }],
        "Id": "92bf8e0f-0143-4c1c-82e2-d1a739e27705"
      }, {
        "SortOrder": 6,
        "PlaylistId": "0e16d4ba-1557-46d0-891c-05ac87ecf90a",
        "GoalId": "faa2dc8e-676c-41e7-9ff1-7e991b72bcc2",
        "Goal": {
          "Name": "Recovery",
          "BpmHigh": 150,
          "BpmLow": 120,
          "Aim": "We want you to ride at 60 - 75 rpm for the duration of the song",
          "Interval": false,
          "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34",
          "Country": null,
          "GoalChallenge": null,
          "GoalChallengeId": null,
          "GoalOptions": [{
            "Name": "Half time",
            "Effort": 60,
            "EffortHigh": 0,
            "Position": "Seated",
            "GoalId": "faa2dc8e-676c-41e7-9ff1-7e991b72bcc2",
            "BeatId": "4e8885d1-4939-463c-bcda-adbdeede628d",
            "Beat": {
              "Name": "Half Time",
              "Ratio": 0.5,
              "Id": "4e8885d1-4939-463c-bcda-adbdeede628d"
            },
            "Id": "00a8228a-9e49-4cd8-8f0d-1718905c1524"
          }],
          "Id": "faa2dc8e-676c-41e7-9ff1-7e991b72bcc2"
        },
        "PlaylistGoalNotes": [],
        "PlaylistGoalTracks": [{
          "TrackId": "83ef494c-f721-4400-923c-56f45e28ce22",
          "Track": {
            "Name": "Madagascar",
            "Album": "Chinese Democracy",
            "Artist": "Guns N' Roses",
            "Bpm": 128,
            "DurationSeconds": 338,
            "CoverImgUrl": "http://www.simfy.co.za/photos/tracks/572075/320.jpg",
            "MusicProviderTrackId": "572075",
            "MusicProviderId": "6fde5180-3a6f-4230-aea7-c607c726616f",
            "MusicProvider": null,
            "GenreId": "34ab966c-7c95-4dc3-ac71-be3153ee8a98",
            "Genre": {
              "Name": "Rock",
              "Id": "34ab966c-7c95-4dc3-ac71-be3153ee8a98"
            },
            "Id": "83ef494c-f721-4400-923c-56f45e28ce22"
          },
          "SortOrder": 0,
          "Id": "66af16c6-704c-4a3c-a4ea-ff08581380cb"
        }],
        "Id": "2e832bde-1317-4f49-951a-6bae1242ca76"
      }, {
        "SortOrder": 7,
        "PlaylistId": "0e16d4ba-1557-46d0-891c-05ac87ecf90a",
        "GoalId": "4278403d-3652-4085-b491-ba3a9ced4f17",
        "Goal": {
          "Name": "Seated Climb 2",
          "BpmHigh": 130,
          "BpmLow": 100,
          "Aim": "We want you to ride at 50 - 65 rpm for the duration of the song",
          "Interval": false,
          "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34",
          "Country": null,
          "GoalChallenge": null,
          "GoalChallengeId": null,
          "GoalOptions": [{
            "Name": "Half time",
            "Effort": 80,
            "EffortHigh": 0,
            "Position": "Seated",
            "GoalId": "4278403d-3652-4085-b491-ba3a9ced4f17",
            "BeatId": "4e8885d1-4939-463c-bcda-adbdeede628d",
            "Beat": {
              "Name": "Half Time",
              "Ratio": 0.5,
              "Id": "4e8885d1-4939-463c-bcda-adbdeede628d"
            },
            "Id": "dc0b56b7-5595-4222-8a4d-b6dd81ffab5b"
          }],
          "Id": "4278403d-3652-4085-b491-ba3a9ced4f17"
        },
        "PlaylistGoalNotes": [],
        "PlaylistGoalTracks": [{
          "TrackId": "cac52c3f-5be1-4618-8e00-85b224a91f39",
          "Track": {
            "Name": "Daniel Na Cova Dos Leões",
            "Album": "Letra & Música: Canções de Renato Russo",
            "Artist": "Célia Porto",
            "Bpm": 108,
            "DurationSeconds": 147,
            "CoverImgUrl": "http://www.simfy.co.za/photos/tracks/48342403/320.jpg",
            "MusicProviderTrackId": "48342403",
            "MusicProviderId": "6fde5180-3a6f-4230-aea7-c607c726616f",
            "MusicProvider": null,
            "GenreId": "f2092b8f-2ffe-49ce-bb27-97b677eb2c67",
            "Genre": {
              "Name": "Other",
              "Id": "f2092b8f-2ffe-49ce-bb27-97b677eb2c67"
            },
            "Id": "cac52c3f-5be1-4618-8e00-85b224a91f39"
          },
          "SortOrder": 0,
          "Id": "68268934-5300-414e-bf8f-462f812a6ef1"
        }],
        "Id": "1bcd3397-08e1-4668-900e-82a3a8d54b92"
      }, {
        "SortOrder": 8,
        "PlaylistId": "0e16d4ba-1557-46d0-891c-05ac87ecf90a",
        "GoalId": "c24f3530-38ee-4ec1-b486-cd5ef8d59b92",
        "Goal": {
          "Name": "Standing Climb 2",
          "BpmHigh": 130,
          "BpmLow": 100,
          "Aim": "We want you to ride at 50 - 65 rpm for the duration of the song",
          "Interval": false,
          "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34",
          "Country": null,
          "GoalChallenge": null,
          "GoalChallengeId": null,
          "GoalOptions": [{
            "Name": "Half time",
            "Effort": 90,
            "EffortHigh": 0,
            "Position": "Standing",
            "GoalId": "c24f3530-38ee-4ec1-b486-cd5ef8d59b92",
            "BeatId": "4e8885d1-4939-463c-bcda-adbdeede628d",
            "Beat": {
              "Name": "Half Time",
              "Ratio": 0.5,
              "Id": "4e8885d1-4939-463c-bcda-adbdeede628d"
            },
            "Id": "b24d83b0-8360-49a7-9807-18ecd1637e07"
          }],
          "Id": "c24f3530-38ee-4ec1-b486-cd5ef8d59b92"
        },
        "PlaylistGoalNotes": [],
        "PlaylistGoalTracks": [{
          "TrackId": "2d4a6b86-7671-459d-9922-34da6059928f",
          "Track": {
            "Name": "Still Remains",
            "Album": "AB III",
            "Artist": "Alter Bridge",
            "Bpm": 105,
            "DurationSeconds": 284,
            "CoverImgUrl": "http://www.simfy.co.za/photos/tracks/23069128/320.jpg",
            "MusicProviderTrackId": "23069128",
            "MusicProviderId": "6fde5180-3a6f-4230-aea7-c607c726616f",
            "MusicProvider": null,
            "GenreId": "34ab966c-7c95-4dc3-ac71-be3153ee8a98",
            "Genre": {
              "Name": "Rock",
              "Id": "34ab966c-7c95-4dc3-ac71-be3153ee8a98"
            },
            "Id": "2d4a6b86-7671-459d-9922-34da6059928f"
          },
          "SortOrder": 0,
          "Id": "16ebc972-8081-4496-9fec-82dced8c20e5"
        }],
        "Id": "4c38ef69-5aeb-4b3d-a056-effa469dd144"
      }, {
        "SortOrder": 9,
        "PlaylistId": "0e16d4ba-1557-46d0-891c-05ac87ecf90a",
        "GoalId": "2dc1ee7f-fcb9-4b49-bfb0-5986204b989d",
        "Goal": {
          "Name": "Seated Intervals 2",
          "BpmHigh": 140,
          "BpmLow": 120,
          "Aim": "We want you to alternate sprinting at 120 - 140 rpm and recovering at 60 - 80 rpm for the duration of the song",
          "Interval": false,
          "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34",
          "Country": null,
          "GoalChallenge": null,
          "GoalChallengeId": null,
          "GoalOptions": [{
            "Name": "Recover Half Time",
            "Effort": 50,
            "EffortHigh": 0,
            "Position": "Seated",
            "GoalId": "2dc1ee7f-fcb9-4b49-bfb0-5986204b989d",
            "BeatId": "4e8885d1-4939-463c-bcda-adbdeede628d",
            "Beat": {
              "Name": "Half Time",
              "Ratio": 0.5,
              "Id": "4e8885d1-4939-463c-bcda-adbdeede628d"
            },
            "Id": "aecaf685-85ca-4f74-bec8-a3eff2883248"
          }, {
            "Name": "Sprint on the beat",
            "Effort": 80,
            "EffortHigh": 90,
            "Position": "Seated",
            "GoalId": "2dc1ee7f-fcb9-4b49-bfb0-5986204b989d",
            "BeatId": "0cc08123-f231-47f1-8023-f8d78457e302",
            "Beat": {
              "Name": "On The Beat",
              "Ratio": 1,
              "Id": "0cc08123-f231-47f1-8023-f8d78457e302"
            },
            "Id": "ba9c551e-9f7c-4b7d-ae09-b6d694e23c21"
          }],
          "Id": "2dc1ee7f-fcb9-4b49-bfb0-5986204b989d"
        },
        "PlaylistGoalNotes": [],
        "PlaylistGoalTracks": [{
          "TrackId": "2a7791b2-559c-42d2-8775-7470581bd318",
          "Track": {
            "Name": "Forgotten Man",
            "Album": "Hypnotic Eye",
            "Artist": "Tom Petty & The Heartbreakers",
            "Bpm": 130,
            "DurationSeconds": 168,
            "CoverImgUrl": "http://www.simfy.co.za/photos/tracks/43933655/320.jpg",
            "MusicProviderTrackId": "43933655",
            "MusicProviderId": "6fde5180-3a6f-4230-aea7-c607c726616f",
            "MusicProvider": null,
            "GenreId": "34ab966c-7c95-4dc3-ac71-be3153ee8a98",
            "Genre": {
              "Name": "Rock",
              "Id": "34ab966c-7c95-4dc3-ac71-be3153ee8a98"
            },
            "Id": "2a7791b2-559c-42d2-8775-7470581bd318"
          },
          "SortOrder": 0,
          "Id": "96da0cff-9c04-4d48-9b89-1daa51e78ab8"
        }],
        "Id": "fe552888-26cd-47ab-869b-76e547694d36"
      }, {
        "SortOrder": 10,
        "PlaylistId": "0e16d4ba-1557-46d0-891c-05ac87ecf90a",
        "GoalId": "6c9af002-d0e2-477c-91ec-50d71fffba50",
        "Goal": {
          "Name": "The Finish Line",
          "BpmHigh": 130,
          "BpmLow": 90,
          "Aim": "We want you to ride at 90 - 130 rpm for the duration of the song",
          "Interval": false,
          "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34",
          "Country": null,
          "GoalChallenge": null,
          "GoalChallengeId": null,
          "GoalOptions": [{
            "Name": "Sprint on the beat",
            "Effort": 90,
            "EffortHigh": 0,
            "Position": "Seated",
            "GoalId": "6c9af002-d0e2-477c-91ec-50d71fffba50",
            "BeatId": "0cc08123-f231-47f1-8023-f8d78457e302",
            "Beat": {
              "Name": "On The Beat",
              "Ratio": 1,
              "Id": "0cc08123-f231-47f1-8023-f8d78457e302"
            },
            "Id": "60b669c3-7373-4fa0-aaa3-725eb6ab7ba7"
          }],
          "Id": "6c9af002-d0e2-477c-91ec-50d71fffba50"
        },
        "PlaylistGoalNotes": [],
        "PlaylistGoalTracks": [{
          "TrackId": "cfa5c59e-c607-430c-9eb6-75aff3531255",
          "Track": {
            "Name": "Must Have Done Something Right",
            "Album": "Five Score and Seven Years Ago",
            "Artist": "Relient K",
            "Bpm": 98,
            "DurationSeconds": 199,
            "CoverImgUrl": "http://www.simfy.co.za/photos/tracks/35785292/320.jpg",
            "MusicProviderTrackId": "35785292",
            "MusicProviderId": "6fde5180-3a6f-4230-aea7-c607c726616f",
            "MusicProvider": null,
            "GenreId": "f2092b8f-2ffe-49ce-bb27-97b677eb2c67",
            "Genre": {
              "Name": "Other",
              "Id": "f2092b8f-2ffe-49ce-bb27-97b677eb2c67"
            },
            "Id": "cfa5c59e-c607-430c-9eb6-75aff3531255"
          },
          "SortOrder": 0,
          "Id": "eeb22476-9183-4c82-8ddf-4a846467c699"
        }],
        "Id": "78557a4a-d28b-4db9-908c-3eb9ba1b6303"
      }, {
        "SortOrder": 11,
        "PlaylistId": "0e16d4ba-1557-46d0-891c-05ac87ecf90a",
        "GoalId": "ab3c2ee0-dd6c-4c47-b154-9f0d9fd0f93f",
        "Goal": {
          "Name": "Cool Down",
          "BpmHigh": 90,
          "BpmLow": 60,
          "Aim": null,
          "Interval": false,
          "CountryId": "87d2a384-a84b-471c-855d-a5f457210c34",
          "Country": null,
          "GoalChallenge": null,
          "GoalChallengeId": null,
          "GoalOptions": [{
            "Name": "On the beat",
            "Effort": 50,
            "EffortHigh": 0,
            "Position": "Seated",
            "GoalId": "ab3c2ee0-dd6c-4c47-b154-9f0d9fd0f93f",
            "BeatId": "0cc08123-f231-47f1-8023-f8d78457e302",
            "Beat": {
              "Name": "On The Beat",
              "Ratio": 1,
              "Id": "0cc08123-f231-47f1-8023-f8d78457e302"
            },
            "Id": "ab8a791f-b50f-4e7f-98b1-a1b135bcbff8"
          }],
          "Id": "ab3c2ee0-dd6c-4c47-b154-9f0d9fd0f93f"
        },
        "PlaylistGoalNotes": [],
        "PlaylistGoalTracks": [{
          "TrackId": "6fcbca3e-130a-4911-bf73-bce7f424db62",
          "Track": {
            "Name": "Get Down With Me",
            "Album": "Tribute to the Spice Girls: Girl Power!",
            "Artist": "Déjà Vu",
            "Bpm": 143,
            "DurationSeconds": 227,
            "CoverImgUrl": "http://www.simfy.co.za/photos/tracks/16367533/320.jpg",
            "MusicProviderTrackId": "16367533",
            "MusicProviderId": "6fde5180-3a6f-4230-aea7-c607c726616f",
            "MusicProvider": null,
            "GenreId": "f2092b8f-2ffe-49ce-bb27-97b677eb2c67",
            "Genre": {
              "Name": "Other",
              "Id": "f2092b8f-2ffe-49ce-bb27-97b677eb2c67"
            },
            "Id": "6fcbca3e-130a-4911-bf73-bce7f424db62"
          },
          "SortOrder": 0,
          "Id": "7bcb0057-89ed-41c0-a866-f04d6b435043"
        }],
        "Id": "dae6c184-0438-4b20-b0b4-64c30621cead"
      }],
      "BackgroundTracks": [{
        "SortOrder": 1,
        "PlaylistPosition": "Before",
        "TrackId": "0953ad56-64c9-4a88-85be-0dcadbd1e39c",
        "Track": {
          "Name": "Dog days are over",
          "Album": "",
          "Artist": "Florence + The Machine",
          "Bpm": 150,
          "DurationSeconds": 245,
          "CoverImgUrl": "http://media.giphy.com/media/PgxjDJUaUqy6k/giphy-facebook_s.jpg",
          "MusicProviderTrackId": "12321195",
          "MusicProviderId": "6fde5180-3a6f-4230-aea7-c607c726616f",
          "MusicProvider": null,
          "GenreId": "7c87cd38-cdad-4bb7-9380-2b9121f7eef3",
          "Genre": {
            "Name": "Alternative",
            "Id": "7c87cd38-cdad-4bb7-9380-2b9121f7eef3"
          },
          "Id": "0953ad56-64c9-4a88-85be-0dcadbd1e39c"
        },
        "Id": "49b51cd0-ba07-400a-81e3-5afb3d3cd246"
      }, {
        "SortOrder": 1,
        "PlaylistPosition": "After",
        "TrackId": "12aec035-cec2-48a4-ba83-af992ee00174",
        "Track": {
          "Name": "Too bad, so sad",
          "Album": "Salute",
          "Artist": "Matric",
          "Bpm": 80,
          "DurationSeconds": 245,
          "CoverImgUrl": "http://media.giphy.com/media/PgxjDJUaUqy6k/giphy-facebook_s.jpg",
          "MusicProviderTrackId": "573787",
          "MusicProviderId": "6fde5180-3a6f-4230-aea7-c607c726616f",
          "MusicProvider": null,
          "GenreId": "31db3a05-30c7-4058-94a6-504046d4b178",
          "Genre": {
            "Name": "Pop",
            "Id": "31db3a05-30c7-4058-94a6-504046d4b178"
          },
          "Id": "12aec035-cec2-48a4-ba83-af992ee00174"
        },
        "Id": "8cfb4b93-b91a-4bb0-89d6-d1774055e140"
      }, {
        "SortOrder": 2,
        "PlaylistPosition": "After",
        "TrackId": "3a0a7f77-d473-43cd-8bcb-bb1ae61e2769",
        "Track": {
          "Name": "Pump it up",
          "Album": "",
          "Artist": "Toya Delazy",
          "Bpm": 100,
          "DurationSeconds": 245,
          "CoverImgUrl": "http://media.giphy.com/media/PgxjDJUaUqy6k/giphy-facebook_s.jpg",
          "MusicProviderTrackId": "32093259",
          "MusicProviderId": "6fde5180-3a6f-4230-aea7-c607c726616f",
          "MusicProvider": null,
          "GenreId": "7c87cd38-cdad-4bb7-9380-2b9121f7eef3",
          "Genre": {
            "Name": "Alternative",
            "Id": "7c87cd38-cdad-4bb7-9380-2b9121f7eef3"
          },
          "Id": "3a0a7f77-d473-43cd-8bcb-bb1ae61e2769"
        },
        "Id": "16ec1aa1-081e-443a-8cfa-2a62cd128029"
      }, {
        "SortOrder": 2,
        "PlaylistPosition": "Before",
        "TrackId": "dddc39da-8bea-4c5f-8f12-31c1316a6443",
        "Track": {
          "Name": "Burn",
          "Album": "Burn",
          "Artist": "Ellie Golding",
          "Bpm": 174,
          "DurationSeconds": 245,
          "CoverImgUrl": "http://media.giphy.com/media/PgxjDJUaUqy6k/giphy-facebook_s.jpg",
          "MusicProviderTrackId": "46545191",
          "MusicProviderId": "6fde5180-3a6f-4230-aea7-c607c726616f",
          "MusicProvider": null,
          "GenreId": "7c87cd38-cdad-4bb7-9380-2b9121f7eef3",
          "Genre": {
            "Name": "Alternative",
            "Id": "7c87cd38-cdad-4bb7-9380-2b9121f7eef3"
          },
          "Id": "dddc39da-8bea-4c5f-8f12-31c1316a6443"
        },
        "Id": "17d2ab27-d953-49ca-bce2-ec44021ae27d"
      }],
      "CoverImages": [
        "http://www.simfy.co.za/photos/tracks/51340018/320.jpg",
        "http://www.simfy.co.za/photos/tracks/28093011/320.jpg",
        "http://www.simfy.co.za/photos/tracks/12761579/320.jpg",
        "http://www.simfy.co.za/photos/tracks/14585397/320.jpg",
        "http://www.simfy.co.za/photos/tracks/288351/320.jpg",
        "http://www.simfy.co.za/photos/tracks/572075/320.jpg",
        "http://www.simfy.co.za/photos/tracks/48342403/320.jpg",
        "http://www.simfy.co.za/photos/tracks/23069128/320.jpg",
        "http://www.simfy.co.za/photos/tracks/43933655/320.jpg",
        "http://www.simfy.co.za/photos/tracks/35785292/320.jpg",
        "http://www.simfy.co.za/photos/tracks/16367533/320.jpg"
      ],
      "TrackCount": 11,
      "TotalDurationSeconds": 2442,
      "Id": "0e16d4ba-1557-46d0-891c-05ac87ecf90a"
    };
  }));

  /*

  Create
  ------

  createNewPlaylistFromTemplate(template_id)


  Edit
  ----

  Load up new playlist json structure


  Can create a new playlist from a template, which has specific goals
  Can add a track and track counter is correct
  Can remove a track
  Can add another track and track counter is correct
  Can click out, come back, and all is sane

  Checking submit button text and visibility
  * on playlist creation, on playlist edit:
    * no tracks added
    * some tracks added
    * all tracks added
      * time too short
      * time just right
      * time too long

  */

  describe('[Add a playlist] Goals', function () {

    beforeEach(function () {
      this.createAnewPlaylist();
    });

    it('There should be some goals', function () {
      var i = 0;
      playlistController.playlist.PlaylistGoals.forEach(function () {
        i++;
      });
      expect(i).toBeGreaterThan(1);
    });

    it('The first goal should be called Warm Up', function () {
      // The playlist object should have goals sorted by sortorder anyway
      expect(playlistController.playlist.PlaylistGoals[0].Goal.Name).toEqual('Warm Up');
    });

    it('The last goal should be called Cool Down', function () {
      var i = playlistController.playlist.PlaylistGoals.length;
      expect(playlistController.playlist.PlaylistGoals[i - 1].Goal.Name).toEqual('Cool Down');
    });
  });

  describe('Editing a playlist', function () {

    beforeEach(function () {
      this.editPlaylist();
    });

    it('There should be some goals', function () {
      var i = 0;
      playlistController.playlist.PlaylistGoals.forEach(function () {
        i++;
      });
      expect(i).toBeGreaterThan(1);
    });

    it('The first goal should be called Warm Up', function () {
      // The playlist object should have goals sorted by sortorder anyway
      expect(playlistController.playlist.PlaylistGoals[0].Goal.Name).toEqual('Warm Up');
    });

    it('The last goal should be called Cool Down', function () {
      var i = playlistController.playlist.PlaylistGoals.length;
      expect(playlistController.playlist.PlaylistGoals[i - 1].Goal.Name).toEqual('Cool Down');
    });

    it('There should be one track per goal in this playlist', function () {
      expect(playlistController.checkAllGoalsHaveTracks()).toBe(true);
    });

  });

  describe('[Add a playlist] Building a playlist with tracks', function () {

    beforeEach(inject(function () {
      this.createAnewPlaylist();
    }));

    it('A track can be added to the first goal', function () {
      this.testTrackCanBeAddedToTheFirstGoal();
    });

    it('A track can be removed from a goal', function () {
      this.testTrackCanBeRemovedFromAgoal();
    });

    it('Track counter is correct after adding a song', function () {
      this.testTrackCounterCorrectAfterAddingSong();
    });

    it('Track counter is correct after adding two songs', function () {
      this.testTrackCounterCorrectAfterAddingTwoSongs();
    });

    it('Track counter is correct after adding many songs', function () {
      this.testTrackCounterCorrectAfterAddingManySongs();
    });

    it('Track counter is correct after adding and removing many songs', function () {
      this.testTrackCounterCorrectAfterAddingAndRemovingSongs();
    });

  });

  describe('[Add/editing a playlist] Testing workflow', function () {

    it('A track can be added to the first goal', function () {
      this.createAnewPlaylist();
      this.editPlaylist();
      this.testTrackCanBeAddedToTheFirstGoal();
      this.createAnewPlaylist();
      this.testTrackCanBeAddedToTheFirstGoal();
      this.editPlaylist();
      this.testTrackCanBeAddedToTheFirstGoal();
      this.createAnewPlaylist();
      this.testTrackCanBeAddedToTheFirstGoal();
    });

    it('A track can be removed from a goal', function () {
      this.createAnewPlaylist();
      this.editPlaylist();
      this.testTrackCanBeRemovedFromAgoal();
      this.createAnewPlaylist();
      this.testTrackCanBeRemovedFromAgoal();
      this.editPlaylist();
      this.testTrackCanBeRemovedFromAgoal();
      this.createAnewPlaylist();
      this.testTrackCanBeRemovedFromAgoal();
    });

    it('Track counter is correct after adding a song', function () {
      this.editPlaylist();
      this.createAnewPlaylist();
      this.editPlaylist();
      this.createAnewPlaylist();
      this.testTrackCounterCorrectAfterAddingSong();
    });

    it('Track counter is correct after adding two songs', function () {
      this.editPlaylist();
      this.createAnewPlaylist();
      this.testTrackCounterCorrectAfterAddingTwoSongs();
    });

    it('Track counter is correct after adding many songs', function () {
      this.createAnewPlaylist();
      this.editPlaylist();
      this.createAnewPlaylist();
      this.testTrackCounterCorrectAfterAddingManySongs();
    });

    it('Track counter is correct after adding and removing many songs', function () {
      this.createAnewPlaylist();
      this.editPlaylist();
      this.createAnewPlaylist();
      this.testTrackCounterCorrectAfterAddingAndRemovingSongs();
    });

  });

  describe('[New playlist] Checking submit button text', function () {

    beforeEach(inject(function () {
      this.createAnewPlaylist();
    }));

    it('Playlist contains no tracks', function () {
      expect(playlistController.checkAllGoalsHaveTracks()).toBe(false);
      expect(playlistController.checkPlaylistLength()).toBe(false);
      expect(playlistController.submitButtonText()).toEqual('Save and continue later');
    });

    it('Playlist contains some tracks', function () {
      this.Playlists.addTrackToGoalPlaylist(0, this.trackNormal);
      this.Playlists.addTrackToGoalPlaylist(2, this.trackNormal);
      this.Playlists.addTrackToGoalPlaylist(3, this.trackNormal);
      this.Playlists.addTrackToGoalPlaylist(4, this.trackNormal);
      this.Playlists.addTrackToGoalPlaylist(5, this.trackNormal);
      playlistController.playlistTracksLength = this.Playlists.getPlaylistLength();
      expect(playlistController.checkAllGoalsHaveTracks()).toBe(false);
      expect(playlistController.checkPlaylistLength()).toBe(false);
      expect(playlistController.submitButtonText()).toEqual('Save and continue later');
    });

    it('Playlist has a track per goal: total time too short', function () {
      this.Playlists.addTrackToGoalPlaylist(0, this.trackShort);
      this.Playlists.addTrackToGoalPlaylist(1, this.trackShort);
      this.Playlists.addTrackToGoalPlaylist(2, this.trackShort);
      this.Playlists.addTrackToGoalPlaylist(3, this.trackShort);
      this.Playlists.addTrackToGoalPlaylist(4, this.trackShort);
      this.Playlists.addTrackToGoalPlaylist(5, this.trackShort);
      this.Playlists.addTrackToGoalPlaylist(6, this.trackShort);
      this.Playlists.addTrackToGoalPlaylist(7, this.trackShort);
      this.Playlists.addTrackToGoalPlaylist(8, this.trackShort);
      this.Playlists.addTrackToGoalPlaylist(9, this.trackShort);
      this.Playlists.addTrackToGoalPlaylist(10, this.trackShort);
      playlistController.playlistTracksLength = this.Playlists.getPlaylistLength();
      expect(playlistController.checkAllGoalsHaveTracks()).toBe(true);
      expect(playlistController.checkPlaylistLength()).toBe(false);
      expect(playlistController.submitButtonText()).toEqual('Save and continue later');
    });

    it('Playlist has a track per goal: total time is good', function () {
      this.Playlists.addTrackToGoalPlaylist(0, this.trackNormal);
      this.Playlists.addTrackToGoalPlaylist(1, this.trackNormal);
      this.Playlists.addTrackToGoalPlaylist(2, this.trackNormal);
      this.Playlists.addTrackToGoalPlaylist(3, this.trackNormal);
      this.Playlists.addTrackToGoalPlaylist(4, this.trackNormal);
      this.Playlists.addTrackToGoalPlaylist(5, this.trackNormal);
      this.Playlists.addTrackToGoalPlaylist(6, this.trackNormal);
      this.Playlists.addTrackToGoalPlaylist(7, this.trackNormal);
      this.Playlists.addTrackToGoalPlaylist(8, this.trackNormal);
      this.Playlists.addTrackToGoalPlaylist(9, this.trackNormal);
      this.Playlists.addTrackToGoalPlaylist(10, this.trackNormal);
      playlistController.playlistTracksLength = this.Playlists.getPlaylistLength();
      expect(playlistController.checkAllGoalsHaveTracks()).toBe(true);
      expect(playlistController.checkPlaylistLength()).toBe(true);
      expect(playlistController.submitButtonText()).toEqual('Next: preview my ride');
    });

    it('Playlist has a track per goal: total time too long', function () {
      this.Playlists.addTrackToGoalPlaylist(0, this.trackLong);
      this.Playlists.addTrackToGoalPlaylist(1, this.trackLong);
      this.Playlists.addTrackToGoalPlaylist(2, this.trackLong);
      this.Playlists.addTrackToGoalPlaylist(3, this.trackLong);
      this.Playlists.addTrackToGoalPlaylist(4, this.trackLong);
      this.Playlists.addTrackToGoalPlaylist(5, this.trackLong);
      this.Playlists.addTrackToGoalPlaylist(6, this.trackLong);
      this.Playlists.addTrackToGoalPlaylist(7, this.trackLong);
      this.Playlists.addTrackToGoalPlaylist(8, this.trackLong);
      this.Playlists.addTrackToGoalPlaylist(9, this.trackLong);
      this.Playlists.addTrackToGoalPlaylist(10, this.trackLong);
      playlistController.playlistTracksLength = this.Playlists.getPlaylistLength();
      expect(playlistController.checkAllGoalsHaveTracks()).toBe(true);
      expect(playlistController.checkPlaylistLength()).toBe(false);
      expect(playlistController.submitButtonText()).toEqual('Save and continue later');
    });

  });

  describe('[Edited playlist] Checking submit button text', function () {

    beforeEach(inject(function () {
      this.editPlaylist();
    }));

    it('Playlist contains no tracks', function () {
      playlistController.removeTrack(0, this.trackNormal);
      playlistController.removeTrack(1, this.trackNormal);
      playlistController.removeTrack(2, this.trackNormal);
      playlistController.removeTrack(3, this.trackNormal);
      playlistController.removeTrack(4, this.trackNormal);
      playlistController.removeTrack(5, this.trackNormal);
      playlistController.removeTrack(6, this.trackNormal);
      playlistController.removeTrack(7, this.trackNormal);
      playlistController.removeTrack(8, this.trackNormal);
      playlistController.removeTrack(9, this.trackNormal);
      playlistController.removeTrack(10, this.trackNormal);
      expect(playlistController.checkAllGoalsHaveTracks()).toBe(false);
      expect(playlistController.checkPlaylistLength()).toBe(false);
      expect(playlistController.submitButtonText()).toEqual('Each goal needs a track');
    });

    it('Playlist contains some tracks', function () {
      playlistController.removeTrack(0, this.trackNormal);
      playlistController.removeTrack(1, this.trackNormal);
      playlistController.removeTrack(2, this.trackNormal);
      playlistController.removeTrack(3, this.trackNormal);
      expect(playlistController.checkAllGoalsHaveTracks()).toBe(false);
      expect(playlistController.checkPlaylistLength()).toBe(false);
      expect(playlistController.submitButtonText()).toEqual('Each goal needs a track');
    });

    it('Playlist has a track per goal: total time too short', function () {
      playlistController.removeTrack(0, this.trackNormal);
      playlistController.removeTrack(1, this.trackNormal);
      playlistController.removeTrack(2, this.trackNormal);
      playlistController.removeTrack(3, this.trackNormal);
      playlistController.removeTrack(4, this.trackNormal);
      playlistController.removeTrack(5, this.trackNormal);
      playlistController.removeTrack(6, this.trackNormal);
      playlistController.removeTrack(7, this.trackNormal);
      playlistController.removeTrack(8, this.trackNormal);
      playlistController.removeTrack(9, this.trackNormal);
      playlistController.removeTrack(10, this.trackNormal);
      this.Playlists.addTrackToGoalPlaylist(0, this.trackShort);
      this.Playlists.addTrackToGoalPlaylist(1, this.trackShort);
      this.Playlists.addTrackToGoalPlaylist(2, this.trackShort);
      this.Playlists.addTrackToGoalPlaylist(3, this.trackShort);
      this.Playlists.addTrackToGoalPlaylist(4, this.trackShort);
      this.Playlists.addTrackToGoalPlaylist(5, this.trackShort);
      this.Playlists.addTrackToGoalPlaylist(6, this.trackShort);
      this.Playlists.addTrackToGoalPlaylist(7, this.trackShort);
      this.Playlists.addTrackToGoalPlaylist(8, this.trackShort);
      this.Playlists.addTrackToGoalPlaylist(9, this.trackShort);
      this.Playlists.addTrackToGoalPlaylist(10, this.trackShort);
      playlistController.playlistTracksLength = this.Playlists.getPlaylistLength();
      expect(playlistController.checkAllGoalsHaveTracks()).toBe(true);
      expect(playlistController.checkPlaylistLength()).toBe(false);
      expect(playlistController.submitButtonText()).toEqual('Save and continue later');
    });

    it('Playlist has a track per goal: total time is good', function () {
      playlistController.removeTrack(0, this.trackNormal);
      playlistController.removeTrack(1, this.trackNormal);
      playlistController.removeTrack(2, this.trackNormal);
      playlistController.removeTrack(3, this.trackNormal);
      playlistController.removeTrack(4, this.trackNormal);
      playlistController.removeTrack(5, this.trackNormal);
      playlistController.removeTrack(6, this.trackNormal);
      playlistController.removeTrack(7, this.trackNormal);
      playlistController.removeTrack(8, this.trackNormal);
      playlistController.removeTrack(9, this.trackNormal);
      playlistController.removeTrack(10, this.trackNormal);
      this.Playlists.addTrackToGoalPlaylist(0, this.trackNormal);
      this.Playlists.addTrackToGoalPlaylist(1, this.trackNormal);
      this.Playlists.addTrackToGoalPlaylist(2, this.trackNormal);
      this.Playlists.addTrackToGoalPlaylist(3, this.trackNormal);
      this.Playlists.addTrackToGoalPlaylist(4, this.trackNormal);
      this.Playlists.addTrackToGoalPlaylist(5, this.trackNormal);
      this.Playlists.addTrackToGoalPlaylist(6, this.trackNormal);
      this.Playlists.addTrackToGoalPlaylist(7, this.trackNormal);
      this.Playlists.addTrackToGoalPlaylist(8, this.trackNormal);
      this.Playlists.addTrackToGoalPlaylist(9, this.trackNormal);
      this.Playlists.addTrackToGoalPlaylist(10, this.trackNormal);
      playlistController.playlistTracksLength = this.Playlists.getPlaylistLength();
      expect(playlistController.checkAllGoalsHaveTracks()).toBe(true);
      expect(playlistController.checkPlaylistLength()).toBe(true);
      expect(playlistController.submitButtonText()).toEqual('Update changes');
    });

    it('Playlist has a track per goal: total time too long', function () {
      playlistController.removeTrack(0, this.trackNormal);
      playlistController.removeTrack(1, this.trackNormal);
      playlistController.removeTrack(2, this.trackNormal);
      playlistController.removeTrack(3, this.trackNormal);
      playlistController.removeTrack(4, this.trackNormal);
      playlistController.removeTrack(5, this.trackNormal);
      playlistController.removeTrack(6, this.trackNormal);
      playlistController.removeTrack(7, this.trackNormal);
      playlistController.removeTrack(8, this.trackNormal);
      playlistController.removeTrack(9, this.trackNormal);
      playlistController.removeTrack(10, this.trackNormal);
      this.Playlists.addTrackToGoalPlaylist(0, this.trackLong);
      this.Playlists.addTrackToGoalPlaylist(1, this.trackLong);
      this.Playlists.addTrackToGoalPlaylist(2, this.trackLong);
      this.Playlists.addTrackToGoalPlaylist(3, this.trackLong);
      this.Playlists.addTrackToGoalPlaylist(4, this.trackLong);
      this.Playlists.addTrackToGoalPlaylist(5, this.trackLong);
      this.Playlists.addTrackToGoalPlaylist(6, this.trackLong);
      this.Playlists.addTrackToGoalPlaylist(7, this.trackLong);
      this.Playlists.addTrackToGoalPlaylist(8, this.trackLong);
      this.Playlists.addTrackToGoalPlaylist(9, this.trackLong);
      this.Playlists.addTrackToGoalPlaylist(10, this.trackLong);
      playlistController.playlistTracksLength = this.Playlists.getPlaylistLength();
      expect(playlistController.checkAllGoalsHaveTracks()).toBe(true);
      expect(playlistController.checkPlaylistLength()).toBe(false);
      expect(playlistController.submitButtonText()).toEqual('Save and continue later');
    });

  });

});
