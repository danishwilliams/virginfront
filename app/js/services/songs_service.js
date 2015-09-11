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

  return {
    getSongs: function () {
      return songs;
    }
  };
});