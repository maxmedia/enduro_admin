// * ———————————————————————————————————————————————————————— * //
// * 	deletepage controller
// * ———————————————————————————————————————————————————————— * //
enduro_admin_app.controller('deletepage_controller', function ($scope, $rootScope, content_service, format_service, $location, modal_service) {

	// * ———————————————————————————————————————————————————————— * //
	// * 	deletepage
	// * ———————————————————————————————————————————————————————— * //
	$scope.deletepage = function () {

		console.log($rootScope)
		console.log($scope)

		// closes the modal
		modal_service.close()

		// eslint-disable-next-line no-useless-escape
		var current_page = $scope.current_page.match(/^((?:(generators)\/)?(?:((?:[^\/]+\/)*?(?:[^\/]+))\/)?)([^\/]+)$/)

		content_service.delete_page($scope.current_page)
			.then(function () {
				var parent = $rootScope.cmslist

				if (current_page[3]) {
					for (let node of current_page[3].split('/')) {
						parent = parent[ node ]
					}
				}

				delete parent[ current_page[4] ]

				$location.path('/')

				// $rootScope.cmslist = $rootScope.cmslist
			}, function (err) {
				console.log('renaming page failed', err)
			})
	}
})
