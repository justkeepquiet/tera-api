"use strict";

const http = require("http");
const uuid = require("uuid").v4;

class FcgiConnection {
	constructor(fcgiUrl, params) {
		this.fcgiUrl = fcgiUrl;
		this.params = params;
	}

	get(urlParts) {
		return this.request("get", [this.fcgiUrl, ...urlParts].join("/"));
	}

	post(urlParts, body) {
		return this.request("post", [this.fcgiUrl, ...urlParts].join("/"), JSON.stringify(body));
	}

	request(method, url, body = null) {
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

			if (this.params.logger?.debug) {
				this.params.logger.debug(`Request (${id}): ${options.method} ${options.path} ${body || ""}`);
			}

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

					if (this.params.logger?.debug) {
						this.params.logger.debug(`Response (${id}): ${JSON.stringify(response.body)}`);
					}

					resolve(response);
				});
			});

			clientRequest.on("error", error =>
				reject(error)
			);

			if (body) {
				clientRequest.write(body);
			}

			clientRequest.end();
		});
	}
}

module.exports = FcgiConnection;