describe("controller: LoginController ($httpBackend.expect().respond, vanilla jasmine, javascript)", function() {

  beforeEach(function() {
    module("app");
  });

  beforeEach(inject(function($controller, $location, AuthenticationService, $httpBackend) {
    this.$location = $location;
    this.$httpBackend = $httpBackend;
    this.redirect = spyOn($location, 'path');
    loginController = $controller('LoginController', {
      $location: $location,
      AuthenticationService: AuthenticationService
    });
  }));

  afterEach(function() {
    this.$httpBackend.verifyNoOutstandingRequest();
    this.$httpBackend.verifyNoOutstandingExpectation();
  });

  describe("successfully logging in", function() {
    it("should redirect you to /admin/playlists", function() {
      this.$httpBackend.expectPOST('/login', loginController.credentials).respond(200);
      loginController.login();
      this.$httpBackend.flush();
      expect(this.redirect).toHaveBeenCalledWith('/admin/playlists');
    });
  });
});
