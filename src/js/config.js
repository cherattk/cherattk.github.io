const host = window.document.location.origin;
///////////////////////////////////////////////////
const hostAPI = host + "/data";
///////////////////////////////////////////////////

const Config = {
	host: host,
	api: {
		data: function(method , id) {
			if (method == 'get') {
				return `${hostAPI}/data.json`;
			}
		}
	}
}

export default Config;