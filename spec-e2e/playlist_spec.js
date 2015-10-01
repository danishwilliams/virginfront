describe('Create playlist', function () {

  var playlist;
  var goalPlaylist = [];
  var tracksList = [];
  var tracks = [];
  var goalPlaylistBuilt = false;

  /**
   * Given some kind of collection (like playlistController.goals) return the member with SortOrder = sortorder
   */
  var returnItemBySortOrder = function(collection, sortorder) {
    var value = {};
    var found = false;
    collection.forEach(function(item) {
      if (!found && item.SortOrder === sortorder) {
        value = item;
      }
    });
    return value;
  };

  beforeEach(function () {
    playlist = element.all(by.repeater('goal in playlist.goals'));

    element.all(by.repeater('goal in playlist.goals')).then(function (rows) {
      goalPlaylist = rows;
    });

    tracksList = element.all(by.repeater('track in playlist.tracks'));
    element.all(by.repeater('track in playlist.tracks')).then(function (rows) {
      tracks = rows;

      // Add track name and BPM value into the track array for easy access later
      var i = 0;
      var j = 0;
      tracks.forEach(function (value) {
        // TODO: Refactor to use Array#some http://stackoverflow.com/questions/2641347/how-to-short-circuit-array-foreach-like-calling-break
        value.element(by.binding('track.bpm')).getText().then(function (text) {
          tracks[i].bpm = parseInt(text.substr(0, text.length - 4));
          i++;
        });
        value.element(by.binding('track.name')).getText().then(function (text) {
          tracks[j].trackName = text;
          j++;
        });
      });
    });
  });

  describe('Goals', function () {

    it('Creates an empty structure for a playlist', function () {
      expect(goalPlaylist.length).toEqual(11);
    });

    it('The first goal\'s name is "Warm Up"', function () {
      expect(goalPlaylist[0].element(by.binding('goal.Name')).getText()).toEqual('Warm Up');
    });

    it('The first goal should be selected by default', function () {
      expect(goalPlaylist[0].element(by.css('.goal-container')).getAttribute('class')).toMatch('active');
    });

    it('The second goal should not be selected by default', function () {
      expect(goalPlaylist[1].element(by.css('.goal-container')).getAttribute('class')).not.toMatch('active');
    });

  });

  describe('Building a playlist with tracks', function () {

    it('Clicking on the first goal should deselect and collapse it', function () {
      goalPlaylist[0].element(by.css('.goal-name')).click();
      expect(goalPlaylist[0].element(by.css('.goal-container')).getAttribute('class')).not.toMatch('active');
      expect(goalPlaylist[1].element(by.css('.goal-container')).getAttribute('class')).not.toMatch('active');
    });

    it('Clicking on the second goal should select that goal and deselect the first goal', function () {
      goalPlaylist[1].element(by.binding('goal.Name')).click();
      expect(goalPlaylist[0].element(by.css('.goal-container')).getAttribute('class')).not.toMatch('active');
      expect(goalPlaylist[1].element(by.css('.goal-container')).getAttribute('class')).toMatch('active');
    });

    it('There should be some tracks', function () {
      expect(tracksList.count()).toBeGreaterThan(0);
    });

    it('A track can be added to the second goal', function () {
      var found = false;
      var bpm = 0;
      var i = 0;
      var trackName = '';

      tracks.forEach(function (value) {
        if (!found && value.bpm >= 100 && value.bpm <= 120) {
          //console.log('A track with acceptable BPM was found!');
          found = true;
          trackName = value.trackName;
          value.element(by.css('.add')).click();
        }
      });

      expect(found).toBe(true);

      expect(goalPlaylist[1].element(by.css('.track-name')).getText()).toEqual(trackName);
    });

    it('A track outside of a goal\'s BPM range can\'t be added to that goal', function () {
      goalPlaylist[0].element(by.binding('goal.Name')).click();
      tracks[0].element(by.css('.add')).click();

      goalPlaylist[0].all(by.binding('track.name')).then(function (items) {
        expect(items.length).toBe(0);
      });
    });

    it('A track can be removed from a goal', function () {
      goalPlaylist[1].element(by.css('.add')).click();

      goalPlaylist[0].all(by.binding('track.name')).then(function (items) {
        expect(items.length).toBe(0);
      });
    });

  });

});
