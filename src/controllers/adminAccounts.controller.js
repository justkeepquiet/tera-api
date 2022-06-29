"use strict";

const expressLayouts = require("express-ejs-layouts");
const Op = require("sequelize").Op;
const moment = require("moment-timezone");
const logger = require("../utils/logger");
const accountModel = require("../models/account.model");
const { i18nHandler, resultJson, validationHandler, accessFunctionHandler } = require("../middlewares/admin.middlewares");

module.exports.index = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		const { serverId } = req.query;

		accountModel.info.findAll().then(accounts => {
			res.render("adminAccounts", {
				layout: "adminLayout",
				accounts,
				moment,
				serverId
			});
		}).catch(err => {
			logger.error(err.toString());
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];

module.exports.add = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		res.render("adminAccountsAdd", {
			layout: "adminLayout",
			errors: null,
			userName: "",
			passWord: "",
			email: ""
		});
	}
];

module.exports.characters = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		const { serverId, accountDBID } = req.query;

		accountModel.serverInfo.findAll().then(servers => {
			if (!serverId || !accountDBID) {
				return res.render("adminAccountsCharacters", {
					layout: "adminLayout",
					characters: null,
					servers,
					moment,
					serverId,
					accountDBID
				});
			}

			return accountModel.characters.findAll({
				where: {
					serverId,
					accountDBID
				}
			}).then(characters => {
				res.render("adminAccountsCharacters", {
					layout: "adminLayout",
					characters,
					servers,
					moment,
					serverId,
					accountDBID
				});
			});
		}).catch(err => {
			logger.error(err.toString());
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];