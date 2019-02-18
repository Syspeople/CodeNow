function ($scope, spUtil, $uibModal, $sce) {
    var c = this;

    $scope.$on('record.updated', function (name, data) {
        spUtil.update($scope);
    })

		$scope.canedit = $scope.user.sys_id == c.data.assign ? true : false;	
		
		c.data.user =  $scope.user.sys_id;
		
    c.openModal = function (id) {
        c.modalInstance = $uibModal.open({
            templateUrl: 'myNotesTemplate',
            controllerAs: "mc",
            controller: function () {
                var mc = this;
								mc.user = $scope.user.sys_id;
                mc.modalTitle = "My notes";
                mc.notes = $scope.data.notes;
								mc.isHR = $scope.data.isHR;
                mc.closeModal = function () {
                    c.closeModal();
                }
                mc.print = function (index) {
                    c.print(index);
                }
								mc.printAll = function () {
                    c.printAll();
                }
								mc.setPageNumber = function () {
                    c.setPageNumber();
                }
            }
        });
    }

    c.closeModal = function () {
        c.modalInstance.close();
    }

    c.print = function (index) {
        w = window.open();
        w.document.write(document.getElementsByClassName('panel-notes')[index].innerHTML);
        w.print();
        w.close();
    }
		
		c.printAll = function () {
        w = window.open();	
			  notes = document.getElementsByClassName('panel-notes');
				
				for (i = 0; i < notes.length; i++) { 
						w.document.write(document.getElementsByClassName('panel-notes')[i].innerHTML);
				}
        w.print();
        w.close();
    }
} 