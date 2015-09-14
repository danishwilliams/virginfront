/**
 * Created by rogersaner on 15/09/07.
 */
angular.module("app").factory('TracksService', function () {
  var tracks = [
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

  return {
    getTracks: function () {
      return tracks;
    }
  };
});