const dotenv = require('dotenv');

dotenv.config();

const env = process.env.NODE_ENV

const options = {
	development: {
		BASE_URL: "https://matrix-2.cloudias79.com:9093/",
		BASE_URL_LOGIN: "https://matrix-2.cloudias79.com:9093/", // dev
		// BASE_URL_LOGIN: "https://bidikti.yayasanloyola.org:9115/", // prod
		// BASE_URL_LOGIN: "http://25.9.77.133:3000/",
		// BASE_URL_NOAUTH: "https://bidikti.yayasanloyola.org:9113/", // dev
		// BASE_URL_NOAUTH: " http://51.79.185.235:9093/", // prod
		// BASE_URL_NOAUTH: "http://25.77.235.85:9012/",
		COPYRIGHT: '20200716',
		VERSION: '0.0.2',
		client_id: '945768720821-5qmu21lc4s5hqkkde5ersd75vpuknja3.apps.googleusercontent.com',
		TIMEOUT: 120000,
	},
	production: {
		BASE_URL: "https://matrix-2.cloudias79.com:9093/",
		BASE_URL_LOGIN: "https://matrix-2.cloudias79.com:9093/",
		BASE_URL_NOAUTH: "https://matrix-2.cloudias79.com:9093/",
		client_id: '945768720821-5qmu21lc4s5hqkkde5ersd75vpuknja3.apps.googleusercontent.com',
		COPYRIGHT: '20200716',
		VERSION: '0.0.2',
		TIMEOUT: 120000,
	},
}
const config = options[env]

export default {
	...config
}


