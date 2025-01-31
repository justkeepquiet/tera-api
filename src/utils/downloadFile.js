"use strict";

const fs = require("fs");
const { URL } = require("url");
const http = require("http");
const https = require("https");

/**
 * @param {string} fileUrl
 * @param {string} outputPath
 * @param {number} connectTimeout
 * @param {number} responseTimeout
 * @param {string} [auth]
 */
function downloadFile(fileUrl, outputPath, connectTimeout = 5000, responseTimeout = 10000, auth = null) {
	return new Promise((resolve, reject) => {
		const urlObj = new URL(fileUrl);
		const protocol = urlObj.protocol === "https:" ? https : http;

		const options = { timeout: connectTimeout };
		if (auth) {
			options.headers = {
				Authorization: `Basic ${Buffer.from(auth).toString("base64")}`
			};
		}

		const tempPath = `${outputPath}.part`;

		const request = protocol.get(fileUrl, options, (response) => {
			if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
				return downloadFile(response.headers.location, outputPath, connectTimeout, responseTimeout, auth)
					.then(resolve)
					.catch(reject);
			} else if (response.statusCode !== 200) {
				return reject(new Error(`Error: received status ${response.statusCode}`));
			}

			const fileStream = fs.createWriteStream(tempPath);
			let timeoutHandler = setTimeout(() => {
				request.destroy();
				reject(new Error("Timeout while receiving data"));
			}, responseTimeout);

			response.pipe(fileStream);

			response.on("data", () => {
				clearTimeout(timeoutHandler);
				timeoutHandler = setTimeout(() => {
					request.destroy();
					reject(new Error("Timeout while receiving data"));
				}, responseTimeout);
			});

			fileStream.on("finish", () => {
				clearTimeout(timeoutHandler);
				fileStream.close(() => {
					fs.rename(tempPath, outputPath, (err) => {
						if (err) return reject(err);
						resolve();
					});
				});
			});

			const handleError = (err) => {
				clearTimeout(timeoutHandler);
				fs.unlink(tempPath, () => reject(err));
			};

			response.on("error", handleError);
			fileStream.on("error", handleError);
		});

		request.on("error", (err) => {
			fs.unlink(tempPath, () => reject(err));
		});
		request.on("timeout", () => {
			request.destroy();
			fs.unlink(tempPath, () => reject(new Error("Connection timeout")));
		});
	});
}

module.exports = downloadFile;