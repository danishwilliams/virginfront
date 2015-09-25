describe('Create playlist', function () {

  var playlist;
  var goalPlaylist;
  var tracksList;
  var tracks;

  beforeEach(function () {
    playlist = element.all(by.repeater('goal in playlist.goals'));

    element.all(by.repeater('goal in playlist.goals')).then(function (rows) {
      goalPlaylist = rows;
    });

    tracksList = element.all(by.repeater('track in playlist.tracks'));
    element.all(by.repeater('track in playlist.tracks')).then(function (rows) {
      tracks = rows;
    });
  });

  describe('Goals', function () {

    it('Creates an empty structure for a playlist', function () {
      expect(playlist.count()).toEqual(10);
    });

    it('The first goal\'s name is "Warm Up"', function () {
      expect(goalPlaylist[0].element(by.binding('goal.goal')).getText()).toEqual('Warm Up');
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
      goalPlaylist[1].element(by.binding('goal.goal')).click();
      expect(goalPlaylist[0].element(by.css('.goal-container')).getAttribute('class')).not.toMatch('active');
      expect(goalPlaylist[1].element(by.css('.goal-container')).getAttribute('class')).toMatch('active');
    });

    it('There should be some tracks from Deezer', function () {
      // Don't need to do this once existing Track objects are updated via callbacks; currently it's sloooooow
      browser.sleep(3000);

      expect(tracksList.count()).toBeGreaterThan(0);
    });

    it('A track can be added to the second goal', function () {
      tracks[4].element(by.css('.add')).click();
      expect(goalPlaylist[1].element(by.css('.track-name')).getText()).toEqual('King');
    });

    it('A track outside of a goal\'s BPM range can\'t be added to that goal', function () {
      goalPlaylist[0].element(by.binding('goal.goal')).click();
      tracks[0].element(by.css('.add')).click();

      goalPlaylist[0].all(by.binding('track.name')).then(function(items) {
        expect(items.length).toBe(0);
      });
    });

    it('A track can be removed from a goal', function () {
      goalPlaylist[1].element(by.css('.add')).click();

      goalPlaylist[0].all(by.binding('track.name')).then(function(items) {
        expect(items.length).toBe(0);
      });
    });

  });

});
