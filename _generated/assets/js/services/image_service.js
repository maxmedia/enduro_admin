enduro_admin_app.factory('image_service', ['url_config', '$cookies', '$q', 'Upload', 'user_service', function image_service (url_config, $cookies, $q, Upload, user_service) {
	var image_service = {}

	image_service.upload_image = function (file, metadata) {
		var url = url_config.get_base_url() + 'img_upload'
		var url_search = []

		if (metadata) {
			for (var key in metadata) {
				if (metadata.hasOwnProperty(key)) {
					url_search.push([
						encodeURIComponent(key),
						encodeURIComponent(metadata[key])
					].join('='))
				}
			}

			if (url_search.length) {
				url = url + '?' + url_search.join('&')
			}
		}

		return $q(function (resolve, reject) {
			Upload.upload({
				url: url,
				data: {
					file: file
				}
			}).then(function (res) {
				if (!res.data.success || !res.data.image_url) {
					return reject(new Error('upload not successfull ' + res.data))
				}
				console.log('uploaded', res.data.image_url)
				resolve(res.data.image_url)
			}, function (res) {
				var err = new Error('upload failed')
				err.status = res.status
				err.statusText = res.statusText
				err.data = res.data
				reject(err)
			})
		})
	}

	return image_service
}])
