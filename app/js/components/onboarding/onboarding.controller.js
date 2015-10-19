angular.module("app.onboarding", []).controller('OnboardingController', function ($stateParams) {
  var self = this;
  this.title = "Onboarding";

  this.id = $stateParams.id;
});
