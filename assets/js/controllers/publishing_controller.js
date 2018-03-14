enduro_admin_app.controller('publishing_controller', function ($scope, content_service, modal_service) {
	$scope.loading = true
	$scope.publishing = false
	$scope.confirming = false
	$scope.success = false

	content_service.get_publish_status()
		.then(function (data) {
			$scope.actions_orig = data.actions

			$scope.actions = data.actions.map(function (action) {
				return {
					path: action[0],
					path_nice: action[0].replace(/\/index\.html$/, ''),
					is_asset: action[0].startsWith('assets/'),
					action: action[1],
					noaction: action[1] === '',
					put: action[1] === 'put',
					'new': action[1] === 'new',
					'delete': action[1] === 'delete'
				}
			}).sort(function (a, b) {
				if (a.is_asset && !b.is_asset) return 1
				if (!a.is_asset && b.is_asset) return -1
				// else a.assset && b.is_asset
				if (a.path < b.path) return -1
				if (a.path > b.path) return 1
				return 0
			})

			$scope.loading = false
		}, function () {
			$scope.loading = false
		})

	$scope.action_item_classes = function (action) {
		return {
			'publish-put': action.put,
			'publish-new': action.new,
			'publish-delete': action.delete,
			'publish-noaction': action.noaction,
			'is-asset': action.is_asset
		}
	}

	$scope.confirm_publish = function () {
		$scope.confirming = true
	}

	$scope.confirm_cancel = function () {
		$scope.confirming = false
	}

	$scope.publish = function () {
		var self = this

		$scope.confirming = false
		$scope.publishing = true

		content_service.publish($scope.actions_orig)
			.then(function () {
				$scope.publishing = false
				$scope.success = true
			}, function () {
				self.close()
			})
	}
})
