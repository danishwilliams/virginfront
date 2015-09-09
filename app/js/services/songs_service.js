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
      genre: 'Pop',
      bpm: '80',
      time: '03:31'
    },
    {
      id: 150,
      name: 'How deep is your love',
      artist: 'Calvin Harris',
      genre: 'Alternative',
      bpm: '80',
      time: '03:32'
    },
    {
      id: 175,
      name: 'Too bad, so sad',
      artist: 'Matric',
      genre: 'R&B/Soul',
      bpm: '80',
      time: '03:24'
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

          DZ.player.playPlaylist(1368297815, false, function (response) {
            console.log("List of track objects", response.tracks);
            var i = 0;
            var numberTracks = _.size(response.tracks);

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
              i++;
            });
            $rootScope.$broadcast('playlistLoaded');
          });
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