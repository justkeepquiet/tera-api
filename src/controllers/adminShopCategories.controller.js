"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const { query, body } = require("express-validator");

const { getSupportedLanguagesByDirectory } = require("../utils/helpers");
const {
	accessFunctionHandler,
	validationHandler,
	formValidationHandler,
	formResultErrorHandler,
	formResultSuccessHandler,
	writeOperationReport
} = require("../middlewares/admin.middlewares");

/**
 * @param {modules} modules
 */
module.exports.index = ({ i18n, shopModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const categories = await shopModel.categories.findAll({
			include: [{
				as: "strings",
				model: shopModel.categoryStrings,
				where: { language: i18n.getLocale() },
				required: false
			}],
			order: [
				["sort", "DESC"]
			]
		});

		res.render("adminShopCategories", {
			layout: "adminLayout",
			categories
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.add = ({ localization }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const languages = getSupportedLanguagesByDirectory(path.join(__dirname, "../locales/shop"), localization);

		res.render("adminShopCategoriesAdd", {
			layout: "adminLayout",
			languages
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.addAction = ({ i18n, logger, sequelize, reportModel, shopModel }) => [
	accessFunctionHandler,
	[
		body("sort").trim()
			.isInt({ min: -1e8, max: 1e8 }).withMessage(i18n.__("The field must contain the value as a number.")),
		body("active").optional().trim()
			.isIn(["on"]).withMessage(i18n.__("The field has invalid value.")),
		body("title.*").trim()
			.isLength({ min: 1, max: 1024 }).withMessage(i18n.__("The field must be between 1 and 1024 characters."))
	],
	formValidationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { sort, active, title } = req.body;

		await sequelize.transaction(async () => {
			const category = await shopModel.categories.create({
				sort,
				active: active == "on"
			});

			const promises = [];

			if (title) {
				Object.keys(title).forEach(language => {
					promises.push(shopModel.categoryStrings.create({
						categoryId: category.get("id"),
						language,
						title: title[language]
					}));
				});
			}

			await Promise.all(promises);
		});

		next();
	},
	writeOperationReport(reportModel),
	formResultErrorHandler(logger),
	formResultSuccessHandler("/shop_categories")
];

/**
 * @param {modules} modules
 */
module.exports.edit = ({ localization, logger, shopModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("id").trim().notEmpty()
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { id } = req.query;

		const category = await shopModel.categories.findOne({
			where: { id }
		});

		if (category === null) {
			throw Error("Object not found");
		}

		const strings = await shopModel.categoryStrings.findAll({
			where: { categoryId: category.get("id") }
		});

		const title = {};

		strings.forEach(string => {
			title[string.get("language")] = string.get("title");
		});

		const languages = getSupportedLanguagesByDirectory(path.join(__dirname, "../locales/shop"), localization);

		res.render("adminShopCategoriesEdit", {
			layout: "adminLayout",
			languages,
			id: category.get("id"),
			sort: category.get("sort"),
			active: category.get("active"),
			title
		});
	}
],

/**
 * @param {modules} modules
 */
module.exports.editAction = ({ localization, i18n, logger, sequelize, reportModel, shopModel }) => [
	accessFunctionHandler,
	[
		query("id").trim().notEmpty(),
		body("sort").trim()
			.isInt({ min: -1e8, max: 1e8 }).withMessage(i18n.__("The field must contain the value as a number.")),
		body("active").optional().trim()
			.isIn(["on"]).withMessage(i18n.__("The field has invalid value.")),
		body("title.*").trim()
			.isLength({ min: 1, max: 1024 }).withMessage(i18n.__("The field must be between 1 and 1024 characters."))
	],
	formValidationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { id } = req.query;
		const { sort, active, title } = req.body;

		const category = await shopModel.categories.findOne({
			where: { id }
		});

		if (category === null) {
			throw Error("Object not found");
		}

		await sequelize.transaction(async () => {
			const promises = [
				shopModel.categories.update({
					sort,
					active: active == "on"
				}, {
					where: { id }
				})
			];

			if (title) {
				const categoryStrings = await shopModel.categoryStrings.findAll({
					where: { categoryId: id }
				});

				categoryStrings.forEach(categoryString => {
					const language = categoryString.get("language");

					if (title[language]) {
						promises.push(shopModel.categoryStrings.update({
							title: title[language]
						}, {
							where: {
								categoryId: id,
								language
							}
						}));
					} else {
						promises.push(shopModel.categoryStrings.destroy({
							where: {
								categoryId: id,
								language
							}
						}));
					}
				});

				const languages = getSupportedLanguagesByDirectory(path.join(__dirname, "../locales/shop"), localization);

				languages.forEach(language => {
					if (title[language]) {
						promises.push(shopModel.categoryStrings.create({
							categoryId: id,
							title: title[language],
							language
						}, {
							ignoreDuplicates: true
						}));
					}
				});
			}

			await Promise.all(promises);
		});

		next();
	},
	writeOperationReport(reportModel),
	formResultErrorHandler(logger),
	formResultSuccessHandler("/shop_categories")
];

/**
 * @param {modules} modules
 */
module.exports.deleteAction = ({ logger, sequelize, reportModel, shopModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("id").trim().notEmpty()
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { id } = req.query;

		await sequelize.transaction(async () => {
			await shopModel.categories.destroy({
				where: { id }
			});
			await shopModel.categoryStrings.destroy({
				where: { categoryId: id }
			});
		});

		next();
	},
	writeOperationReport(reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		res.redirect("/shop_categories");
	}
];