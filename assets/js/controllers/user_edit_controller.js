enduro_admin_app.controller('user_edit_controller', function ($scope, $rootScope, user_service, modal_service) {
	$scope.user = $rootScope.user
	$scope.saving = false
	$scope.confirmed = false
	$scope.success = false

	$scope.verify_password_confirmed = function () {
		if ($scope.password === $scope.password_confirm) {
			$scope.confirmed = true
		} else {
			$scope.confirmed = false
		}
	}

	$scope.save = function () {
		var self = this

		$scope.saving = true

		return user_service.change_password($scope.password)
			.then(function (updated_user) {
				$scope.user = $rootScope.user = updated_user
				$scope.saving = false
				$scope.success = true
			}, function () {
				self.close()
			})
	}
})
