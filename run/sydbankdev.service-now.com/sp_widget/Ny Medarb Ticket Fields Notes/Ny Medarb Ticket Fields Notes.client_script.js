function ($scope, $filter, spUtil, $sce) {
    var c = this;
	
    $scope.trustAsHtml = function (string) {
        return $sce.trustAsHtml(string);
    };

    $scope.canedit = $scope.user.sys_id == c.data.assign ? true : false;

    $scope.save = function () {
        $scope.data.op = 'submitNotes';
        $scope.data.u_medarb_opgave_sys_id = $scope.data.sys_id;
        $scope.data.notes = $scope.data.notes;

        c.server.update().then(function (response) {
          spUtil.addInfoMessage("Noter er gemt");
				});
    }
}