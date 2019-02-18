function(spUtil,$uibModal) {
	/* widget controller */
	var c = this;

	c.openDetail = function(reg) {
		c.modalInstance = $uibModal.open({
			templateUrl: 'test-list.details.html'
		});
	}
}