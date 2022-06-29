"use strict";

const expressLayouts = require("express-ejs-layouts");
const Op = require("sequelize").Op;
const moment = require("moment-timezone");
const logger = require("../utils/logger");
const accountModel = require("../models/account.model");
const { i18nHandler, resultJson, validationHandler, accessFunctionHandler } = require("../middlewares/admin.middlewares");

module.exports.accounts = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		const { server } = req.query;

		accountModel.info.findAll().then(accounts => {
			res.render("adminAccounts", {
				layout: "adminLayout",
				accounts,
				moment,
				server
			});
		}).catch(err => {
			logger.error(err.toString());
			res.render("adminError", { layout: "adminLayout", err });
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
		const { server, account } = req.query;

		accountModel.serverInfo.findAll().then(servers => {
			if (!server || !account) {
				return res.render("adminAccountCharacters", {
					layout: "adminLayout",
					characters: null,
					servers,
					moment,
					server,
					account
				});
			}

			return accountModel.characters.findAll({
				where: {
					serverId: server,
					accountDBID: account
				}
			}).then(characters => {
				res.render("adminAccountCharacters", {
					layout: "adminLayout",
					characters,
					servers,
					moment,
					server,
					account
				});
			});
		}).catch(err => {
			logger.error(err.toString());
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];

module.exports.benefits = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		const { account } = req.query;

		if (!account) {
			return res.render("adminAccountBenefits", {
				layout: "adminLayout",
				benefits: null,
				moment,
				account
			});
		}

		accountModel.benefits.findAll({
			where: {
				accountDBID: account
			}
		}).then(benefits => {
			res.render("adminAccountBenefits", {
				layout: "adminLayout",
				benefits,
				moment,
				account
			});
		}).catch(err => {
			logger.error(err.toString());
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];