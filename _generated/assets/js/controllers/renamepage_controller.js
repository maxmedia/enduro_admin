// * ———————————————————————————————————————————————————————— * //
// * 	renamepage controller
// * ———————————————————————————————————————————————————————— * //
enduro_admin_app.controller('renamepage_controller', function ($scope, $rootScope, content_service, format_service, $location, modal_service) {

	// add focus to page name input on opening the modal
	$('.rename_page_modal input.page_name').focus()

	// * ———————————————————————————————————————————————————————— * //
	// * 	renamepage
	// * ———————————————————————————————————————————————————————— * //
	$scope.renamepage = function () {

		console.log($rootScope)
		console.log($scope)

		// closes the modal
		modal_service.close()

		// eslint-disable-next-line no-useless-escape
		var current_page = $scope.current_page.match(/^((?:(generators)\/)?(?:((?:[^\/]+\/)*?(?:[^\/]+))\/)?)([^\/]+)$/)
		var slugged_newname = format_service.slug($scope.new_pagename)
		var new_path = current_page[1] + slugged_newname

		content_service.rename_page($scope.current_page, new_path)
			.then(function () {
				var parent = $rootScope.cmslist

				if (current_page[3]) {
					for (let node of current_page[3].split('/')) {
						parent = parent[ node ]
					}
				}

				let cmslist_node = parent[ current_page[4] ]

				cmslist_node.name = format_service.deslug(slugged_newname)
				cmslist_node.page_slug = slugged_newname
				cmslist_node.slug = slugged_newname
				cmslist_node.fullpath = '/' + new_path

				parent[ slugged_newname ] = cmslist_node
				delete parent[ current_page[4] ]

				$location.path('cms' + cmslist_node.fullpath)

				// $rootScope.cmslist = $rootScope.cmslist
			}, function (err) {
				console.log('renaming page failed', err)
			})
	}
})
