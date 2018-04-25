(function() {
  describe("directive: shows-message-when-hovered (jasmine-given, coffeescript)", function() {
    Given(function() {
      return module("app");
    });
    Given(inject(function($rootScope, $compile) {
      this.directiveMessage = 'ralph was here';
      this.html = "<div shows-message-when-hovered message='" + this.directiveMessage + "'></div>";
      this.scope = $rootScope.$new();
      this.scope.message = this.originalMessage = 'things are looking grim';
      return this.elem = $compile(this.html)(this.scope);
    }));
    describe("when a user mouses over the element", function() {
      When(function() {
        return this.elem.triggerHandler('mouseenter');
      });
      return Then("the message on the scope is set to the message attribute of the element", function() {
        return this.scope.message === this.directiveMessage;
      });
    });
    return describe("when a users mouse leaves the element", function() {
      When(function() {
        return this.elem.triggerHandler('mouseleave');
      });
      return Then("the message is reset to the original message", function() {
        return this.scope.message === this.originalMessage;
      });
    });
  });

}).call(this);
