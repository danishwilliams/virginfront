/**
 * Created by rogersaner on 15/09/07.
 */
angular
  .module("app")
  .service('TracksService', TracksService);

TracksService.$inject = ['$rootScope'];

function TracksService($rootScope) {

  var tracks = []; // A list of track objects
  var playerTrack = []; // The track loaded to the player

  tracks = initTracks();
  tracks = [];

  (function () {
    var e = document.createElement('script');
    e.src = 'https://cdns-files.deezer.com/js/min/dz.js';
    e.async = true;
    var dz = document.getElementById('dz-root');
    // dz is null when running tests; handle that case
    if (dz) {
      dz.appendChild(e);
    }
  }());

  window.dzAsyncInit = function () {
    DZ.init(deezerInit());
  };

  var tracksService = {
    addTrack: addTrack,
    getTracks: getTracks,
    getPlayerTrack: getPlayerTrack,
    setPlayerTrack: setPlayerTrack,
  };

  return tracksService;

  function addTrack(track) {
    tracks.push(track);
  }

  function getTracks() {
    return tracks;
  }

  function getPlayerTrack() {
    return playerTrack;
  }

  function setPlayerTrack(track) {
    playerTrack = [track];
  }

  function initTracks() {
    return [
      {
        id: 100,
        name: 'Black Magic',
        artist: 'Little Mix',
        album: 'Salute',
        genre: 'Pop',
        bpm: 141,
        duration: 193,
        source: 'https://cdn.example.com/path/to/track.mp3'
      },
      {
        id: 150,
        name: 'How deep is your love',
        artist: 'Calvin Harris',
        genre: 'Alternative',
        album: 'Salute',
        bpm: 80,
        duration: 233,
        source: 'https://cdn.example.com/path/to/track.mp3'
      },
      {
        id: 175,
        name: 'Too bad, so sad',
        artist: 'Matric',
        album: 'Salute',
        genre: 'R&B/Soul',
        bpm: 80,
        duration: 245,
        source: 'https://cdn.example.com/path/to/track.mp3'
      }
    ];
  }

  function deezerInit() {
    return {
      appId: 'virgin_console',
      channelUrl: 'http://localhost:8000/deezer.html',
      player: {
        onload: function (response) {
          console.log('DZ.player is ready', response);

          var genreid = 106; // Electro
          DZ.api('/chart/' + genreid + '?limit=20', function (response) {
            var i = 0;
            var k = 0;
            var bpm = 0;
            // Transform the Deezer tracks into the kind of array we want
            response.tracks.data.forEach(function (track) {

              // We need to do a separate call to get the bpm
              DZ.api('/track/' + track.id, function (response) {
                k++;

                if (!response.bpm || response.bpm === 0) {
                  return;
                }

                /*if (response.bpm < 160 || response.bpm > 180) {
                 return;
                 }*/
                bpm += response.bpm;
                i++;
                console.log("Average BPM for " + i + " tracks (total track API calls: " + k + "): " + bpm / i);

                tracks.push({
                  id: parseInt(track.id),
                  name: track.title,
                  artist: track.artist.name,
                  genre: 'Electro',
                  bpm: response.bpm,
                  time: track.duration
                });
                $rootScope.$apply();
              });
            });
          });
        }
      }
    };
  }
}
