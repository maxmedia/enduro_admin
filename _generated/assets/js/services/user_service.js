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

	return service
}])
