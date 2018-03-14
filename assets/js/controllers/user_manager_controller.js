enduro_admin_app.controller('user_manager_controller', function ($scope, user_service, modal_service) {
	$scope.loading = true
	$scope.deleting = false
	$scope.confirming_delete = false
	$scope.username = null
	$scope.success = true
	$scope.editing_user = false
	$scope.editing = false
	$scope.new_user = false
	$scope.adding = false

	function load_users () {
		return user_service.get_users()
			.then(function (users) {
				$scope.users = users.sort(function (a, b) {
					if (a.username < b.username) return -1
					if (a.username > b.username) return 1
					return 0
				})

				$scope.loading = false
			}, function () {
				$scope.loading = false
			})
	}
	load_users()

	$scope.confirm_delete = function (event) {
		$scope.username = $(event.target).data('username')
		$scope.confirming_delete = true
	}

	$scope.delete_cancel = function () {
		$scope.confirming_delete = false
		$scope.username = null
	}

	$scope.edit_user = function (event) {
		$scope.loading = true

		return user_service.get_user($(event.target).data('username'))
			.then(function (user) {
				$scope.editing_user = user
				$scope.editing_user_tags = {}
				for (var tag of user.tags) {
					$scope.editing_user_tags[tag] = tag
				}
				$scope.loading = false
			}, function () {
				$scope.loading = false
				self.close()
			})
	}

	$scope.edit_user_cancel = function () {
		$scope.editing_user = false
		$scope.editing_user_tags = false
	}

	$scope.edit_user_submit = function () {
		var self = this

		$scope.editing = true

		$scope.editing_user.tags = []
		for (var tag in $scope.editing_user_tags) {
			if ($scope.editing_user_tags.hasOwnProperty(tag) && $scope.editing_user_tags[tag]) {
				$scope.editing_user.tags.push(tag)
			}
		}

		return user_service.update_user($scope.editing_user.username, $scope.editing_user.tags)
			.then(function () {
				$scope.editing_user = false
				$scope.editing_user_tags = false

				return load_users()
					.then(function () {
						$scope.editing = false
					}, function () {
						$scope.editing = false
					})
			}, function () {
				$scope.editing_user = false
				$scope.editing = false
				self.close()
			})
	}

	$scope.add_user = function () {
		$scope.new_user = {}
		$scope.new_user_tags = {}
	}

	$scope.add_user_cancel = function () {
		$scope.new_user = false
		$scope.new_user_tags = false
	}

	$scope.add_user_submit = function () {
		var self = this

		$scope.adding = true

		$scope.new_user.tags = []
		for (var tag in $scope.new_user_tags) {
			if ($scope.new_user_tags.hasOwnProperty(tag) && $scope.new_user_tags[tag]) {
				$scope.new_user.tags.push(tag)
			}
		}

		return user_service.add_user($scope.new_user)
			.then(function () {
				$scope.new_user = false
				$scope.new_user_tags = false

				return load_users()
					.then(function () {
						$scope.adding = false
					}, function () {
						$scope.adding = false
					})
			}, function () {
				$scope.new_user = false
				$scope.adding = false
				self.close()
			})
	}

	$scope.delete_user = function () {
		var self = this

		$scope.confirming_delete = false
		$scope.deleting = true

		return user_service.delete_user($scope.username)
			.then(function () {
				$scope.username = null

				return load_users()
					.then(function () {
						$scope.deleting = false
					}, function () {
						$scope.deleting = false
					})
			}, function () {
				$scope.username = null
				$scope.deleting = false
				self.close()
			})
	}
})
