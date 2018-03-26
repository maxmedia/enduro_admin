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
			window.location.assign('/admin/#!/login')
			return
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
			})
	}

	service.update_user = function (username, tags) {
		return $http.put(url_config.get_base_url() + 'users/' + username, { tags: tags })
			.then(function (res) {
				if (!res.data.success) throw new Error('Failed to update user')
				return res.data.user
			}, function (err) {
				return user_service.error(err).catch(function () {
					console.error(err)
					return modal_service.openError('Something went wrong')
				})
			})
	}

	service.add_user = function (user) {
		return $http.post(url_config.get_base_url() + 'users', user)
			.then(function (res) {
				if (!res.data.success) throw new Error('Failed to add user')
				return res.data.user
			}, function (err) {
				return user_service.error(err).catch(function () {
					console.error(err)
					return modal_service.openError('Something went wrong')
				})
			})
	}

	service.delete_user = function (username) {
		return $http.delete(url_config.get_base_url() + 'users/' + username)
			.then(function (res) {
				if (!res.data.success) throw new Error('Failed to delete user')
				return res.data.user
			}, function (err) {
				return user_service.error(err).catch(function () {
					console.error(err)
					return modal_service.openError('Something went wrong')
				})
			})
	}

	service.get_user = function (username) {
		return $http.get(url_config.get_base_url() + 'users/' + username)
			.then(function (res) {
				if (!res.data.success) throw new Error('Failed to delete user')
				return res.data.user
			}, function (err) {
				return user_service.error(err).catch(function () {
					console.error(err)
					return modal_service.openError('Something went wrong')
				})
			})
	}

	service.get_users = function () {
		return $http.get(url_config.get_base_url() + 'users')
			.then(function (res) {
				if (!res.data.success) throw new Error('Failed to get users')
				return res.data.users
			}, function (err) {
				return user_service.error(err).catch(function () {
					console.error(err)
					return modal_service.openError('Something went wrong')
				})
			})
	}

	return service
}])
