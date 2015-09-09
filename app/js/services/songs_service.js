/**
 * Created by rogersaner on 15/09/07.
 */
angular.module("app").factory('SongsService', function () {
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

  return {
    getSongs: function () {
      return songs;
    }
  };
});