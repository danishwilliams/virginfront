/**
 * Created by rogersaner on 15/09/07.
 */
angular.module("app").factory('SongsService', function ($rootScope) {
  // TODO: is this structure ok?
  var songs = [
    {
      id: 100,
      name: 'Black Magic',
      artist: 'Little Mix',
      album: 'Salute',
      genre: 'Pop',
      bpm: 141,
      time: 193,
      source: 'https://cdn.example.com/path/to/track.mp3'
    },
    {
      id: 150,
      name: 'How deep is your love',
      artist: 'Calvin Harris',
      genre: 'Alternative',
      album: 'Salute',
      bpm: 80,
      time: 233,
      source: 'https://cdn.example.com/path/to/track.mp3'
    },
    {
      id: 175,
      name: 'Too bad, so sad',
      artist: 'Matric',
      album: 'Salute',
      genre: 'R&B/Soul',
      bpm: 80,
      time: 245,
      source: 'https://cdn.example.com/path/to/track.mp3'
    }
  ];

  songs = [];
  var playerTrack = []; // The track loaded to the player

  window.dzAsyncInit = function () {
    DZ.init({
      appId: 'virgin_console',
      channelUrl: 'http://localhost:8000/deezer.html',
      player: {
        onload: function (response) {
          console.log('DZ.player is ready', response);

          var genreid = 106; // Electro
          DZ.api('/chart/' + genreid + '?limit=50', function (response) {
            // Transform the Deezer tracks into the kind of array we want
            response.tracks.data.forEach(function (track) {

              // We need to do a separate call to get the bpm
              DZ.api('/track/' + track.id, function (response) {
                songs.push({
                  id: parseInt(track.id),
                  name: track.title,
                  artist: track.artist.name,
                  genre: 'Electro',
                  bpm: response.bpm,
                  time: track.duration
                });
                // TODO: probably refactor this so that we only have to call the broadcast once, updating the object
                $rootScope.$broadcast('tracksLoaded');
              });
            });
          });

          /*
          DZ.player.playPlaylist(1368297815, false, function (response) {
            console.log("List of track objects", response.tracks);
            // Transform the Deezer tracks into the kind of array we want
            response.tracks.forEach(function (track) {
              songs.push({
                id: parseInt(track.id),
                name: track.title,
                artist: track.artist.name,
                genre: 'No genre',
                bpm: '0',
                time: track.duration
              });
            });
            $rootScope.$broadcast('tracksLoaded');
          });
          */
        }
      }
    });
  };
  (function () {
    var e = document.createElement('script');
    e.src = 'https://cdns-files.deezer.com/js/min/dz.js';
    e.async = true;
    document.getElementById('dz-root').appendChild(e);
  }());

  return {
    getSongs: function () {
      return songs;
    },
    getPlayerTrack: function () {
      return playerTrack;
    },
    setPlayerTrack: function (track) {
      playerTrack = [track];
    }
  };
});