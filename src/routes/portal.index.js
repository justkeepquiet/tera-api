"use strict";

/**
* @typedef {import("express").Express} Express
*/

/**
* @param {Express} app
*/
module.exports = app => {
	app.use("/tera", require("./portal/tera.routes"));
};