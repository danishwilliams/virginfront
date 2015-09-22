describe("controller: LoginController ($httpBackend.expect().respond, vanilla jasmine, javascript)", function() {

  beforeEach(function() {
    module("app");
  });

  beforeEach(inject(function($controller, $rootScope, $location, AuthenticationService, $httpBackend) {
    this.$location = $location;
    this.$httpBackend = $httpBackend;
    this.scope = $rootScope.$new();
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
    it("should redirect you to /playlist-create", function() {
      this.$httpBackend.expectPOST('/login', this.scope.credentials).respond(200);
      loginController.login();
      this.$httpBackend.flush();
      expect(this.redirect).toHaveBeenCalledWith('/playlist-create');
    });
  });
});
