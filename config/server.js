/* Define custom server-side HTTP routes for lineman's development server
 *   These might be as simple as stubbing a little JSON to
 *   facilitate development of code that interacts with an HTTP service
 *   (presumably, mirroring one that will be reachable in a live environment).
 *
 * It's important to remember that any custom endpoints defined here
 *   will only be available in development, as lineman only builds
 *   static assets, it can't run server-side code.
 *
 * This file can be very useful for rapid prototyping or even organically
 *   defining a spec based on the needs of the client code that emerge.
 *
 */

module.exports = {
  drawRoutes: function(app) {
    var fs = require('fs');
    var filepath = 'config/stubs/';
    var api = 'api';
    var version = '1.0';
    var apipath = '/' + api + '/' + version;
    var _ = require('underscore');

    app.post('/login', function(req, res) {
      res.json({ message: 'logging in!' });
    });

    app.post('/logout', function(req, res) {
      res.json({ message: 'logging out!'});
    });

    app.get('/books', function (req, res) {
      res.json([
        {title: 'Great Expectations', author: 'Dickens'},
        {title: 'Foundation Series', author: 'Asimov'},
        {title: 'Treasure Island', author: 'Stephenson'}
      ]);
    });

    app.get(apipath + '/goals', function (req, res) {
      var file = '/goals.json';
      fs.readFile(filepath + version + file, function(err, data) {
        if (err) {
          res.status(404).send('Not found');
        } else {
          res.header('Cache-Control', 'none').contentType('application/json').send(data);
        }
        res.end();
      });
    });

    app.get(apipath + '/rides', function (req, res) {
      var file = '/rides.json';
      fs.readFile(filepath + version + file, function(err, data) {
        if (err) {
          res.status(404).send('Not found');
        } else {
          res.header('Cache-Control', 'none').contentType('application/json').send(data);
        }
        res.end();
      });
    });

    app.get(apipath + '/rides/:id', function (req, res) {
      var file = '';
      switch (parseInt(req.params.id)) {
        case 0:
          file = '/rides/all_terrain.json';
          break;
        case 1:
          file = '/rides/strength_endurance.json';
          break;
        case 2:
          file = '/rides/intervals.json';
          break;
        case 3:
          file = '/rides/speed_work.json';
          break;
        case 4:
          file = '/rides/hill_climbs.json';
          break;
      }
      fs.readFile(api + version + file, function(err, data) {
        if (err) {
          res.status(404).send('Not found');
        } else {
          res.header('Cache-Control', 'none').contentType('application/json').send(data);
        }
        res.end();
      });
    });

    app.get(apipath + '/playlists/:id', function (req, res) {
      var file = '/rides/strength_endurance.json';
      fs.readFile(filepath + version + file, function(err, data) {
        if (err) {
          res.status(404).send('Not found');
        } else {
          // Add a track into each goal
          var track = {
            id: 100,
            name: 'Black Magic',
            artist: 'Little Mix',
            album: 'Salute',
            genre: 'Pop',
            bpm: 141,
            duration: 193,
            source: 'https://cdn.example.com/path/to/track.mp3'
          };

          data = JSON.parse(data);

          _.mapObject(data.goals, function(val, key) {
            val.track = track;
            return val;
          });

          res.header('Cache-Control', 'none').contentType('application/json').send(data);
        }
        res.end();
      });
    });

  }
};
