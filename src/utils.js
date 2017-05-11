export default {
	serialize (obj) {

		if (typeof obj == 'object') {
			let arr = Object.keys(obj);
			let result = '';
			arr.forEach((key) => {
				let value = obj[key];

				if (Array.isArray(value)) {
					value.forEach((v) => {
						result += '&' + key + '=' + v;
					});
				}

				else {
					result += '&' + key + '=' + value;
				}
			});

			return result.substr(1);
		}

		else if (obj) {
			return obj;
		}

		else {
			return '';
		}

	},

	ajax (method = 'GET', url, data = {}) {

		let body;

		if (method === 'GET') {
			url += this.serialize(data);
			body = { method };
		}

		else {
			body = { method, body: this.serialize(data) };
		}

		return fetch(url, body);
	},

	get (url, data = {}) {
		return this.ajax('GET', url, data);
	},

	post (url, data = {}) {
		return this.ajax('POST', url, data);
	},

	del (url, data = {}) {
		return this.ajax('delete', url, data);
	}
};