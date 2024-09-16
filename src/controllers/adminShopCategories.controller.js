"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const expressLayouts = require("express-ejs-layouts");
const { query, body } = require("express-validator");

const {
	accessFunctionHandler,
	validationHandler,
	formValidationHandler,
	formResultErrorHandler,
	formResultSuccessHandler,
	writeOperationReport
} = require("../middlewares/admin.middlewares");

const shopLocales = require("../../config/admin").shopLocales;

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
module.exports.add = () => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		res.render("adminShopCategoriesAdd", {
			layout: "adminLayout",
			shopLocales
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.addAction = ({ i18n, logger, sequelize, reportModel, shopModel }) => [
	accessFunctionHandler,
	[
		body("sort")
			.isInt({ min: 0, max: 1e8 }).withMessage(i18n.__("Sort field must contain the value as a number.")),
		body("active").optional()
			.isIn(["on"]).withMessage(i18n.__("Active field has invalid value.")),
		body("title.*")
			.isLength({ min: 1, max: 1024 }).withMessage(i18n.__("Title field must be between 1 and 1024 characters."))
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
module.exports.edit = ({ logger, shopModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("id").notEmpty()
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

		res.render("adminShopCategoriesEdit", {
			layout: "adminLayout",
			shopLocales,
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
module.exports.editAction = ({ i18n, logger, sequelize, reportModel, shopModel }) => [
	accessFunctionHandler,
	[
		query("id").notEmpty(),
		body("sort")
			.isInt({ min: 0, max: 1e8 }).withMessage(i18n.__("Sort field must contain the value as a number.")),
		body("active").optional()
			.isIn(["on"]).withMessage(i18n.__("Active field has invalid value.")),
		body("title.*")
			.isLength({ min: 1, max: 1024 }).withMessage(i18n.__("Title field must be between 1 and 1024 characters."))
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

				shopLocales.forEach(language => {
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
		query("id").notEmpty()
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