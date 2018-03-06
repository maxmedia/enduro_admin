enduro_admin_app.factory('user_service', ['$http', 'url_config', '$cookies', '$q', '$rootScope', 'modal_service', function user_service ($http, url_config, $cookies, $q, $rootScope, modal_service) {
	var service = {}

	service.login_by_password = function (username, password) {
		return $http.get(url_config.get_base_url() + 'login_by_password', {params: {username: username, password: password}})
			.then(function (res) {
				return res.data
			}, function () {
				return console.log('error logging in')
			})
	}

	service.is_logged_in = function () {
		return $http.get(url_config.get_base_url() + 'check_session')
	}

	service.logout = function () {
		return $http.get(url_config.get_base_url() + 'logout')
	}

	service.error_without_reject = function (err) {
		// session expired
		if (err.status == 401) {
			return modal_service.open('login_modal')
		}

		// does not have enough access rights
		if (err.status == 403) {
			return modal_service.open('no_rights_modal')
		}

		return $q.reject(err)
	}

	service.error = function (err) {
		service.error_without_reject(err)
		return $q.reject(false)
	}

	service.change_password = function (new_password) {
		return $http.put(url_config.get_base_url() + 'users/' + $rootScope.user.username, {
			password: new_password
		})
			.then(function (res) {
				if (!res.data.success) throw new Error('Failed to change password')
				return res.data.user
			}, function (err) {
				return user_service.error(err).catch(function () {
					console.error(err)
					return modal_service.openError('Something went wrong')
				})

				// return user_service.error(err).then(function (result) {
				// 	return result
				// }, function () {
				// 	console.error(err)
				// 	return modal_service.openError('Something went wrong')
				// })

				// if (err.status !== 401 && err.status !== 403) {
				// 	console.error(err)
				// 	return modal_service.openError('Something went wrong')
				// }
				// return user_service.error(err)
			})
	}

	return service
}])
