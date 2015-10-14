angular
	.module("app")
	.directive("playlistWorkflow", playlistWorkflow);

function playlistWorkflow() {
	var directive = {
		link: link,
		templateUrl: 'playlist_workflow.html',
		restrict: 'EA',
		controller: playlistWorkflowController,
		controllerAs: 'vm'
	};
	return directive;

	function link(scope, element, attrs) {

	}
}

playlistWorkflowController.$inject = ['PlaylistEdit'];

function playlistWorkflowController(PlaylistEdit) {
	var self = this;
	this.steps = PlaylistEdit.getSteps();
}
