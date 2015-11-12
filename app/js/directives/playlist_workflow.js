angular
	.module("app")
	.directive("playlistWorkflow", playlistWorkflow);

function playlistWorkflow() {
	var directive = {
		link: link,
		templateUrl: 'playlist_workflow.html',
		restrict: 'E',
		controller: playlistWorkflowController,
		controllerAs: 'vm'
	};
	return directive;

	function link(scope, element, attrs) {

	}
}

playlistWorkflowController.$inject = ['Playlists'];

function playlistWorkflowController(Playlists) {
	var self = this;
	this.steps = Playlists.getSteps();
}
