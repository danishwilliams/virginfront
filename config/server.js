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

    app.put(apipath + '/goals/:id', function (req, res) {
      console.log('PUT at ' + req.url);
      res.status(200).send('Success!');
      res.end();
    });

    app.get(apipath + '/music/track/downloadurl/:id', function (req, res) {
      var data = {};
      res.header('Cache-Control', 'none').contentType('application/json').send(data);
      res.end();
    });

    app.get(apipath + '/playlists', function (req, res) {
      var file = '/playlists.json';
      fs.readFile(filepath + version + file, function(err, data) {
        if (err) {
          res.status(404).send('Not found');
        } else {
          res.header('Cache-Control', 'none').contentType('application/json').send(data);
        }
        res.end();
      });
    });

    app.get(apipath + '/playlists/:id', function (req, res) {
      var file = '';
      switch (req.params.id) {
        case "1c08805b-f9a4-4eb3-bfba-0fa408719cf4":
          file = '/playlists/summer_machine.json';
          break;
        case "0e16d4ba-1557-46d0-891c-05ac87ecf90a":
          file = '/playlists/danes_marvellous_medicine.json';
          break;
      }
      fs.readFile(filepath + version + file, function(err, data) {
        if (err) {
          res.status(404).send('Not found');
        } else {
          res.header('Cache-Control', 'none').contentType('application/json').send(data);
        }
        res.end();
      });
    });

    app.get(apipath + '/templategroups', function (req, res) {
      var file = '/templategroups.json';
      fs.readFile(filepath + version + file, function(err, data) {
        if (err) {
          res.status(404).send('Not found');
        } else {
          res.header('Cache-Control', 'none').contentType('application/json').send(data);
        }
        res.end();
      });
    });

    app.get(apipath + '/templategroups/classlengthoptions/:id', function (req, res) {
      var file = '';
      switch (req.params.id) {
        case "3946f337-3957-47d2-a69f-09b357e43b6a":
          file = "/templategroups/intervals.json";
          break;
      }
      fs.readFile(filepath + version + file, function(err, data) {
        if (err) {
          res.status(404).send('Not found');
        } else {
          res.header('Cache-Control', 'none').contentType('application/json').send(data);
        }
        res.end();
      });
    });

    app.get(apipath + '/templates', function (req, res) {
      var file = '/templates.json';
      fs.readFile(filepath + version + file, function(err, data) {
        if (err) {
          res.status(404).send('Not found');
        } else {
          res.header('Cache-Control', 'none').contentType('application/json').send(data);
        }
        res.end();
      });
    });

    app.get(apipath + '/templates/:id', function (req, res) {
      var file = '';
      switch (req.params.id) {
        case "0":
          file = '/templates/all_terrain.json';
          break;
        case "1":
          file = '/templates/strength_endurance.json';
          break;
        case "2":
          file = '/templates/intervals.json';
          break;
        case "3":
          file = '/templates/speed_work.json';
          break;
        case "4":
          file = '/templates/hill_climbs.json';
          break;
        case "e3929bda-3587-4889-bfa8-60a28e9b03dc":
          file = '/templates/strength_endurance_api.json';
          break;
      }
      fs.readFile(filepath + version + file, function(err, data) {
        if (err) {
          res.status(404).send('Not found');
        } else {
          res.header('Cache-Control', 'none').contentType('application/json').send(data);
        }
        res.end();
      });
    });

    app.get(apipath + '/users/:id', function (req, res) {
      var file = '';
      file = '/users/dane.json';
      fs.readFile(filepath + version + file, function(err, data) {
        if (err) {
          res.status(404).send('Not found');
        } else {
          res.header('Cache-Control', 'none').contentType('application/json').send(data);
        }
        res.end();
      });
    });

    app.get(apipath + '/playlists/:id', function (req, res) {
      var file = '/templates/strength_endurance.json';
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
