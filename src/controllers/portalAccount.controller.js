"use strict";

const body = require("express-validator").body;
const crypto = require("crypto");
const uuid = require("uuid");
const logger = require("../utils/logger");
const helpers = require("../utils/helpers");
const accountModel = require("../models/account.model");

/**
 * @type {import("express").RequestHandler}
 */
const validationHandler = (req, res, next) => {
	if (!helpers.validationResultLog(req).isEmpty()) {
		return res.json({
			Return: false,
			ReturnCode: 2,
			Msg: "invalid parameter"
		});
	}

	next();
};

module.exports = {
	ActionLogin: [
		[body("userID").notEmpty(), body("password").notEmpty()],
		validationHandler,
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			const { userID, password } = req.body;

			accountModel.info.findOne({ where: { userName: userID } }).then(account => {
				let passwordString = password;

				if (/^true$/i.test(process.env.API_USE_SHA512_PASSWORDS)) {
					passwordString = crypto.createHash("sha512").update(process.env.API_USE_SHA512_PASSWORDS_SALT + password).digest("hex");
				}

				if (account === null || account.get("passWord") !== passwordString) {
					logger.warn("Invalid login or password");
					return res.json({
						Return: false,
						ReturnCode: 50015,
						Msg: "password error"
					});
				}

				const authKey = uuid.v4();

				accountModel.info.update({ authKey: authKey }, {
					where: { accountDBID: account.get("accountDBID") }
				}).then(async () => {
					let characterCount = "0";

					try {
						const characters = await accountModel.characters.findAll(
							{ where: { accountDBID: account.get("accountDBID") } }
						);

						characterCount = helpers.getCharCountString(characters, "serverId", "charCount");
					} catch (err) {
						logger.error(err.toString());
					}

					res.json({
						Return: true,
						ReturnCode: 0,
						Msg: "success",
						CharacterCount: characterCount,
						Permission: account.get("permission"),
						UserNo: account.get("accountDBID"),
						AuthKey: authKey
					});
				}).catch(err => {
					logger.error(err.toString());
					res.json({
						Return: false,
						ReturnCode: 50811,
						Msg: "failure update auth token"
					});
				});
			}).catch(err => {
				logger.error(err.toString());
				res.json({
					Return: false,
					ReturnCode: 50000,
					Msg: "account not exist"
				});
			});
		}
	],

	ActionLogout: [
		[body("authKey").notEmpty(), body("userNo").notEmpty().isNumeric()],
		validationHandler,
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			const { authKey, userNo } = req.body;

			accountModel.info.findOne({
				where: { accountDBID: userNo, authKey: authKey }
			}).then(account => {
				if (account === null) {
					return res.json({
						Return: false,
						ReturnCode: 50000,
						Msg: "account not exist"
					});
				}

				accountModel.info.update({ authKey: null }, {
					where: { accountDBID: account.get("accountDBID") }
				}).then(() =>
					res.json({
						Return: true,
						ReturnCode: 0,
						Msg: "success"
					})
				).catch(err => {
					logger.error(err.toString());
					res.json({
						Return: false,
						ReturnCode: 50811,
						Msg: "failure update auth token"
					});
				});
			}).catch(err => {
				logger.error(err.toString());
				res.json({
					Return: false,
					ReturnCode: 50000,
					Msg: "account not exist"
				});
			});
		}
	],

	GetAccountInfo: [
		[body("id").notEmpty().isNumeric()],
		validationHandler,
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			const { id } = req.body;

			accountModel.info.findOne({ where: { accountDBID: id } }).then(async account => {
				if (account === null) {
					return res.json({
						Return: false,
						ReturnCode: 50000,
						Msg: "account not exist"
					});
				}

				let characterCount = "0";

				try {
					const characters = await accountModel.characters.findAll(
						{ where: { accountDBID: account.get("accountDBID") } }
					);

					characterCount = helpers.getCharCountString(characters, "serverId", "charCount");
				} catch (err) {
					logger.error(err.toString());
				}

				res.json({
					Return: true,
					ReturnCode: 0,
					Msg: "success",
					// VipitemInfo: "", // @todo
					// PassitemInfo: "", // @todo
					CharacterCount: characterCount,
					Permission: account.get("permission")
				});
			}).catch(err => {
				logger.error(err.toString());
				res.json({
					Return: false,
					ReturnCode: 50000,
					Msg: "account not exist"
				});
			});
		}
	]
};