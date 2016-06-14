require 'jasmine-given'

describe "my angular app", ->

  describe "visiting the login page", ->
    Given -> browser.get "/"

    describe "when a user logs in", ->
      Given -> element(By.model("login.credentials.username")).sendKeys "testsa@virginactive.co.za"
      Given -> element(By.model("login.credentials.password")).sendKeys "Therodge321"
      When  -> element(By.id("log-in")).click()
      #Then  -> expect(element(By.binding("playlist.name")).getText()).toEqual("All Terrain")
      Then  -> expect(element(By.id("recent-rides")).getText()).toEqual("Recent rides")

  describe "create a ride", ->
    Given -> browser.get "/playlists/new"

    describe "choose a ride template", ->
      When  -> element(By.id("template-0")).click()
      When  -> element(By.id("time-0")).click()
      Then  -> expect(element(By.id("title")).getText()).toEqual("Create your ride")
