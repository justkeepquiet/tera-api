"use strict";

const express = require("express");

/**
* @typedef {import("express").Express} Express
*/

/**
* @param {Express} app
*/
module.exports = app => {
	app.use("/public/shop/images/tera-icons", express.static("data/tera-icons"));
	app.use("/tera", require("./portal/tera.routes"));
};