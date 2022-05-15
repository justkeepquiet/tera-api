"use strict";

const { body, validationResult } = require("express-validator");
const crypto = require("crypto");
const uuid = require("uuid");
const logger = require("../utils/logger");
const helpers = require("../utils/helpers");
const accountModel = require("../models/account.model");

module.exports = {
	LauncherLoginAction: [
		[body("userID").notEmpty(), body("password").notEmpty()],
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			if (!validationResult(req).isEmpty()) {
				return res.json({
					Return: false,
					ReturnCode: 2,
					Msg: "invalid parameter"
				});
			}

			const { userID, password } = req.body;

			accountModel.info.findOne({ where: { userName: userID } }).then(account => {
				let passwordString = password;

				if (/^true$/i.test(process.env.API_USE_SHA512_PASSWORDS)) {
					passwordString = crypto.createHash("sha512").update(process.env.API_USE_SHA512_PASSWORDS_SALT + password).digest("hex");
				}

				if (account.get("passWord") !== passwordString) {
					res.json({
						Return: false,
						ReturnCode: 50015,
						Msg: "password error"
					});
				} else {
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
							VipitemInfo: "", // @todo
							PassitemInfo: "", // @todo
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
							Msg: "failure insert auth token"
						});
					});
				}
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

	GetAccountInfoByUserNo: [
		[body("id").notEmpty().isNumeric()],
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			if (!validationResult(req).isEmpty()) {
				return res.json({
					Return: false,
					ReturnCode: 2,
					Msg: "invalid parameter"
				});
			}

			const { id } = req.body;

			accountModel.info.findOne({ where: { accountDBID: id } }).then(async account => {
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
					VipitemInfo: "", // @todo
					PassitemInfo: "", // @todo
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