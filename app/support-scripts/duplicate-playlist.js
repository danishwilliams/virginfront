/**
 * Duplicates a playlist by loading up an existing one and duplicating the structure so that it can
 * be manually saved via the API.
 *
 * Step 1: Grab the existing playlist JSON and save it to a file: playlist.json
 * Step 2: Grab the user ID who you're duplicating this playlist for, and set the new_uid variable to it.
 * Step 3: $ node duplicate-playlist.js > new_playlist.json
 * Step 4: Head over to Swagger, and paste the JSON into ```PUT /api/playlists/{id}```
 * Step 5: Grab the new playlist ID from the new_playlist.json file (it's the last variable in the file) and,
 *         in Swagger, paste it into the ```id``` field.
 * Step 6: Put in your auth token (hint: it's your token in the Resources tab in Dev Tools) prefixed by "Token "
 *         (note the space).
 * Step 7: Click "Try it out".
 * Step 8: Pray.
 *
 */

var fs = require('fs');
var new_uid = 'd1fdef61-d713-4a61-84db-58fdadba56b0'; // The new user id of the new playlist

fs.readFile('playlist.json', function (err, data) {
  if (err) {
    console.log('Not found: export the playlist you want to be cloned and save the JSON as playlist.json');
  } else {
    duplicate_playlist(data);
  }
});

function duplicate_playlist(data) {
  var playlist = JSON.parse(data);
  playlist.UserId = new_uid;
  playlist.Id = uuid2();

  playlist.PlaylistGoals.forEach(function(val) {
    val.Id = uuid2();
    val.PlaylistId = playlist.Id;

    val.PlaylistGoalNotes.forEach(function(val1) {
      delete val1.Id;
    });

    val.PlaylistGoalTracks.forEach(function(val1) {
      delete val1.Id;
    });
  });

  playlist.BackgroundTracks.forEach(function(val) {
    delete val.Id;
  });

  console.log(JSON.stringify(playlist));
}

function uuid2() {
  // http://www.ietf.org/rfc/rfc4122.txt
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";
  return s.join("");
}