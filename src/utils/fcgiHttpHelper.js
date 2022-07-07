"use strict";

const http = require("http");
const uuid = require("uuid").v4;
const logger = require("./logger").createLogger("FCGI helper");

module.exports.isEnabled = () =>
	/^true$/i.test(process.env.FCGI_GW_WEBAPI_ENABLE) && !!process.env.FCGI_GW_WEBAPI_URL
;

module.exports.get = urlParts => {
	if (!module.exports.isEnabled()) {
		return Promise.resolve();
	}

	return httpRequest("get", [process.env.FCGI_GW_WEBAPI_URL, ...urlParts].join("/"));
};

module.exports.post = (urlParts, body) => {
	if (!module.exports.isEnabled()) {
		return Promise.resolve();
	}

	return httpRequest("post", [process.env.FCGI_GW_WEBAPI_URL, ...urlParts].join("/"), JSON.stringify(body));
};

function httpRequest(method, url, body = null) {
	if (!["get", "post"].includes(method)) {
		throw new Error(`Invalid method: ${method}`);
	}

	let urlObject = null;

	try {
		urlObject = new URL(url);
	} catch (error) {
		throw new Error(`Invalid url ${url}`);
	}

	if (body && method !== "post") {
		throw new Error(`Invalid use of the body parameter while using the ${method.toUpperCase()} method.`);
	}

	const options = {
		method: method.toUpperCase(),
		hostname: urlObject.hostname,
		port: urlObject.port,
		path: urlObject.pathname
	};

	if (body) {
		options.headers = {
			"Content-Length": Buffer.byteLength(body)
		};
	}

	return new Promise((resolve, reject) => {
		const id = uuid();

		logger.debug(`Request (${id}): ${options.method} ${options.path} ${body || ""}`);

		const clientRequest = http.request(options, incomingMessage => {
			const response = {
				statusCode: incomingMessage.statusCode,
				headers: incomingMessage.headers,
				body: []
			};

			incomingMessage.on("data", chunk => {
				response.body.push(chunk);
			});

			incomingMessage.on("end", () => {
				if (response.body.length) {
					response.body = response.body.join();

					try {
						response.body = JSON.parse(response.body);
					} catch (_) {}
				}

				logger.debug(`Response (${id}): ${JSON.stringify(response.body)}`);
				resolve(response);
			});
		});

		clientRequest.on("error", error => {
			logger.error(`Error (${id}): ${error}`);
			reject(error);
		});

		if (body) {
			clientRequest.write(body);
		}

		clientRequest.end();
	});
}