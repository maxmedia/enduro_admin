enduro_admin_app.factory('user_service', ['$http', 'url_config', '$cookies', '$q', '$rootScope', function user_service ($http, url_config, $cookies, $q, $rootScope) {
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

	service.error = function (err) {

		// session expired
		if (err.status == 401) {
			open_login_modal()
		}

		// does not have enough access rights
		if (err.status == 403) {
			open_no_rights_modal()
		}

		return $q.reject(false)
	}

	function open_login_modal () {
		if (!$rootScope.modal) {
			$rootScope.modal = '/admin/modals/login_modal/index.html'
		}
	}

	function open_no_rights_modal () {
		if (!$rootScope.modal) {
			$rootScope.modal = '/admin/modals/no_rights_modal/index.html'
		}
	}

	return service
}])
