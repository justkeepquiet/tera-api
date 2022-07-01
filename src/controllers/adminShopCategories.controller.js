"use strict";

const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const body = require("express-validator").body;
const I18n = require("i18n").I18n;
const logger = require("../utils/logger");
const helpers = require("../utils/helpers");
const shopModel = require("../models/shop.model");
const { i18n, i18nHandler, accessFunctionHandler } = require("../middlewares/admin.middlewares");

const shopLocales = (new I18n({ directory: path.resolve(__dirname, "../locales/shop") })).getLocales();

module.exports.index = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		shopModel.categories.belongsTo(shopModel.categoryStrings, { foreignKey: "id" });
		shopModel.categories.hasOne(shopModel.categoryStrings, { foreignKey: "categoryId" });

		shopModel.categories.findAll({
			include: [{
				model: shopModel.categoryStrings,
				where: { language: i18n.getLocale() },
				required: false,
				attributes: []
			}],
			attributes: {
				include: [
					[shopModel.categoryStrings.sequelize.col("title"), "title"]
				]
			}
		}).then(categories => {
			res.render("adminShopCategories", {
				layout: "adminLayout",
				categories
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
		res.render("adminShopCategoriesAdd", {
			layout: "adminLayout",
			errors: null,
			shopLocales,
			sort: "0",
			active: 1,
			title: []
		});
	}
];

module.exports.addAction = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	[
		body("sort").trim()
			.isNumeric().withMessage(i18n.__("Sort field must contain the value as a number.")),
		body("active").optional()
			.isIn(["on"]).withMessage(i18n.__("Active field has invalid value.")),
		body("title.*")
			.isLength({ min: 1, max: 1024 }).withMessage(i18n.__("Title field must be between 1 and 1024 characters."))
	],
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		const { sort, active, title } = req.body;
		const errors = helpers.validationResultLog(req);

		if (!errors.isEmpty()) {
			return res.render("adminShopCategoriesAdd", {
				layout: "adminLayout",
				errors: errors.array(),
				shopLocales,
				sort,
				active,
				title
			});
		}

		shopModel.sequelize.transaction(transaction =>
			shopModel.categories.create({
				sort,
				active: active == "on"
			}, {
				transaction
			}).then(category => {
				const promises = [];

				if (title) {
					Object.keys(title).forEach(language => {
						promises.push(shopModel.categoryStrings.create({
							categoryId: category.get("id"),
							language,
							title: title[language]
						}, {
							transaction
						}));
					});
				}

				return Promise.all(promises).then(() =>
					res.redirect("/shop_categories")
				);
			})
		).then(() =>
			res.redirect("/shop_categories")
		).catch(err => {
			logger.error(err.toString());
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];

module.exports.edit = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		const { id } = req.query;

		if (!id) {
			return res.redirect("/shop_categories");
		}

		shopModel.categories.findOne({
			where: { id }
		}).then(category => {
			if (category === null) {
				return res.redirect("/shop_categories");
			}

			return shopModel.categoryStrings.findAll({
				where: { categoryId: category.get("id") }
			}).then(strings => {
				const title = {};

				if (strings !== null) {
					strings.forEach(string => {
						title[string.get("language")] = string.get("title");
					});
				}

				res.render("adminShopCategoriesEdit", {
					layout: "adminLayout",
					errors: null,
					shopLocales,
					id: category.get("id"),
					sort: category.get("sort"),
					active: category.get("active"),
					title
				});
			});
		}).catch(err => {
			logger.error(err.toString());
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
],

module.exports.editAction = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	[
		body("sort").trim()
			.isNumeric().withMessage(i18n.__("Sort field must contain the value as a number.")),
		body("active").optional()
			.isIn(["on"]).withMessage(i18n.__("Active field has invalid value.")),
		body("title.*")
			.isLength({ min: 1, max: 1024 }).withMessage(i18n.__("Title field must be between 1 and 1024 characters."))
	],
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		const { id } = req.query;
		const { sort, active, title } = req.body;
		const errors = helpers.validationResultLog(req);

		if (!id) {
			return res.redirect("/shop_categories");
		}

		shopModel.categories.findOne({
			where: { id }
		}).then(category => {
			if (category === null) {
				return res.redirect("/shop_categories");
			}

			if (!errors.isEmpty()) {
				return res.render("adminShopCategoriesEdit", {
					layout: "adminLayout",
					errors: errors.array(),
					shopLocales,
					id: category.get("id"),
					sort: category.get("sort"),
					active,
					title
				});
			}

			return shopModel.sequelize.transaction(transaction =>
				shopModel.categories.update({
					sort,
					active: active == "on"
				}, {
					where: { id },
					transaction
				}).then(() => {
					const promises = [];

					if (title) {
						Object.keys(title).forEach(language => {
							promises.push(shopModel.categoryStrings.update({
								title: title[language]
							}, {
								transaction,
								where: {
									categoryId: id,
									language
								}
							}));
						});
					}

					return Promise.all(promises).then(() =>
						res.redirect("/shop_categories")
					);
				})
			);
		}).catch(err => {
			logger.error(err.toString());
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];

module.exports.deleteAction = [
	i18nHandler,
	accessFunctionHandler(),
	expressLayouts,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		const { id } = req.query;

		if (!id) {
			return res.redirect("/shop_categories");
		}

		shopModel.sequelize.transaction(transaction =>
			Promise.all([
				shopModel.categories.destroy({
					where: { id },
					transaction
				}),
				shopModel.categoryStrings.destroy({
					where: { categoryId: id },
					transaction
				})
			]).then(() =>
				res.redirect("/shop_categories")
			)
		).catch(err => {
			logger.error(err.toString());
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];