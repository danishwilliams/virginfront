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
    goalPlaylist = element.all(by.id("playlistGoal"));
    //goalPlaylist = element.all(by.repeater('playlistGoal in playlist_edit.playlist.PlaylistGoals'));

    /*
    element.all(by.repeater('playlistGoal in playlist_edit.playlist.PlaylistGoals')).then(function (rows) {
      jasmine.log(rows);
      console.log(rows);
      goalPlaylist = rows;
    });
    */

    /*
    element.all(by.repeater('goal in playlist_edit.goals')).then(function (rows) {
      goalPlaylist = rows;
    });
    */

    tracksList = element.all(by.repeater('track in playlist_edit.tracks'));
    element.all(by.repeater('track in playlist_edit.tracks')).then(function (rows) {
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

    it('Verify a playlist structure is present', function () {
      expect(element(by.repeater('playlistGoal in playlist_edit.playlist.PlaylistGoals')).isPresent()).toBe(true);
      expect(goalPlaylist.count()).toEqual(6);
    });

    it('The first goal\'s name is "Warm Up"', function () {
      expect(goalPlaylist.first().element(by.id('goalName')).getText()).toEqual('Warm Up');
    });

    it('The first goal should be selected by default', function () {
      expect(goalPlaylist.first().element(by.css('.goal-container')).getAttribute('class')).toMatch('active');
    });

    it('All other goals should not should be selected by default', function () {
      goalPlaylist.each(function(el, index) {
        if (index > 0) {
          expect(el.element(by.css('.goal-container')).getAttribute('class')).not.toMatch('active');
        }
      });
    });
  });

  describe('Building a playlist with tracks', function () {

    it('First goal has no tracks', function() {
      expect(goalPlaylist.first().element(by.css('.play-container')).isPresent()).toBe(false);
    });

    it('A default list of tracks is returned for Warm Up', function() {
      goalPlaylist.first().element(by.css('.goal-name')).click();
      expect(element(by.id('tracks-container')).isPresent()).toBe(true);
      expect(element(by.repeater('track in vm.tracks track by $index')).isPresent()).toBe(true);

      tracksRepeater = element.all(by.id("tracksRepeater"));
      expect(tracksRepeater.count()).toBeGreaterThan(5);
    });

    it('Tracks can be searched for', function() {
      element(by.id('search')).sendKeys("justin"); // I know. I'm ashamed.
      tracksRepeater = element.all(by.id("tracksRepeater"));
      expect(tracksRepeater.count()).toBeGreaterThan(5);
    });

    it('A track can be added to Warm Up', function() {
      element(by.css('.selectable')).click();
      expect(element(by.id('tracks-container')).isPresent()).toBe(false);
      expect(element(by.repeater('track in vm.tracks track by $index')).isPresent()).toBe(false);

      expect(goalPlaylist.first().element(by.css('.play-container')).isPresent()).toBe(true);
    });

    /*
    it('Clicking on the first goal should deselect and collapse it', function () {
      goalPlaylist.first().element(by.css('.goal-name')).click();
      expect(goalPlaylist.first().element(by.css('.goal-container')).getAttribute('class')).not.toMatch('active');

      expect(goalPlaylist[1].element(by.css('.goal-container')).getAttribute('class')).not.toMatch('active');
    });

    it('Clicking on the second goal should select that goal and deselect the first goal', function () {
      goalPlaylist[1].element(by.binding('goal.Name')).click();
      expect(goalPlaylist[0].element(by.css('.goal-container')).getAttribute('class')).not.toMatch('active');
      expect(goalPlaylist[1].element(by.css('.goal-container')).getAttribute('class')).toMatch('active');
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
  */

  });

});
