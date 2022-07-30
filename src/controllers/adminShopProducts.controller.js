"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const expressLayouts = require("express-ejs-layouts");
const body = require("express-validator").body;
const moment = require("moment-timezone");
const Op = require("sequelize").Op;
const helpers = require("../utils/helpers");
const ServiceItem = require("../utils/boxHelper").ServiceItem;

const { accessFunctionHandler, writeOperationReport } = require("../middlewares/admin.middlewares");
const shopLocales = require("../../config/admin").shopLocales;

/**
 * @param {modules} modules
 */
module.exports.index = ({ i18n, logger, shopModel, dataModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res) => {
		const { categoryId } = req.query;

		try {
			const products = new Map();
			const categoriesAssoc = {};

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

			categories.forEach(category =>
				categoriesAssoc[category.get("id")] = category.get("strings")[0]?.get("title")
			);

			(await shopModel.products.findAll({
				where: { ...categoryId ? { categoryId } : {} },
				include: [
					{
						as: "strings",
						model: shopModel.productStrings,
						where: { language: i18n.getLocale() },
						required: false
					},
					{
						as: "item",
						model: shopModel.productItems,
						include: [
							{
								as: "template",
								model: dataModel.itemTemplates,
								required: true
							},
							{
								as: "strings",
								model: dataModel.itemStrings,
								where: { language: i18n.getLocale() },
								required: false
							}
						]
					}
				],
				order: [
					["sort", "DESC"],
					["id", "ASC"],
					[{ as: "item", model: shopModel.productItems }, "createdAt", "ASC"]
				]
			})).forEach(product => {
				const productInfo = {
					sort: product.get("sort"),
					categoryId: product.get("categoryId"),
					categoryTitle: categoriesAssoc[product.get("categoryId")] || "",
					price: product.get("price"),
					title: product.get("strings")[0]?.get("title"),
					description: product.get("strings")[0]?.get("description"),
					icon: product.get("icon"),
					rareGrade: product.get("rareGrade"),
					active: product.get("active"),
					published:
						product.get("active") &&
						moment().isSameOrAfter(moment(product.get("validAfter"))) &&
						moment().isSameOrBefore(moment(product.get("validBefore"))),
					itemCount: null
				};

				product.get("item").forEach(productItem => {
					if (!productInfo.title) {
						productInfo.title = productItem.get("strings")[0]?.get("string");
					}
					if (!productInfo.description) {
						productInfo.description = productItem.get("strings")[0]?.get("toolTip");
					}
					if (!productInfo.icon) {
						productInfo.icon = productItem.get("template").get("icon");
					}
					if (productInfo.rareGrade === null) {
						productInfo.rareGrade = productItem.get("template").get("rareGrade");
					}
					if (!productInfo.itemCount) {
						productInfo.itemCount = productItem.get("boxItemCount");
					}
				});

				products.set(product.get("id"), productInfo);
			});

			res.render("adminShopProducts", {
				layout: "adminLayout",
				categoryId,
				categories,
				products
			});
		} catch (err) {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		}
	}
];

/**
 * @param {modules} modules
 */
module.exports.add = ({ i18n, logger, shopModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res) => {
		const { categoryId, fromCategoryId } = req.query;

		try {
			const categories = await shopModel.categories.findAll({
				include: [
					{
						as: "strings",
						model: shopModel.categoryStrings,
						where: { language: i18n.getLocale() },
						required: false
					}
				],
				order: [
					["sort", "DESC"]
				]
			});

			res.render("adminShopProductsAdd", {
				layout: "adminLayout",
				errors: null,
				moment,
				shopLocales,
				categories,
				fromCategoryId,
				categoryId,
				validAfter: moment(),
				validBefore: moment().add(3600, "days"),
				active: 1,
				price: "",
				title: "",
				description: "",
				icon: "",
				rareGrade: null,
				resolvedItems: [],
				itemTemplateIds: [""],
				boxItemIds: [""],
				boxItemCounts: ["1"],
				itemIcons: new Set(),
				validate: 1
			});
		} catch (err) {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		}
	}
];

/**
 * @param {modules} modules
 */
module.exports.addAction = modules => [
	accessFunctionHandler,
	expressLayouts,
	[
		body("price")
			.isInt({ min: 0 }).withMessage(modules.i18n.__("Price field must contain a valid number.")),
		body("categoryId")
			.custom((value, { req }) => modules.shopModel.categories.findOne({
				where: {
					id: req.body.categoryId || null
				}
			}).then(data => {
				if (!data) {
					return Promise.reject(modules.i18n.__("Category field must contain an existing category ID."));
				}
			})),
		body("validAfter")
			.isISO8601().withMessage(modules.i18n.__("Valid from field must contain a valid date.")),
		body("validBefore")
			.isISO8601().withMessage(modules.i18n.__("Valid to field must contain a valid date.")),
		body("active").optional()
			.isIn(["on"]).withMessage(modules.i18n.__("Active field has invalid value.")),
		// Items
		body("itemTemplateIds.*")
			.isInt({ min: 1 }).withMessage(modules.i18n.__("Item template ID field has invalid value."))
			.custom(value => modules.dataModel.itemTemplates.findOne({
				where: {
					itemTemplateId: value || null
				}
			}).then(data => {
				if (value && !data) {
					return Promise.reject(`${modules.i18n.__("A non-existent item has been added")}: ${value}`);
				}
			}))
			.custom((value, { req }) => {
				const itemTemplateIds = req.body.itemTemplateIds.filter((e, i) =>
					req.body.itemTemplateIds.lastIndexOf(e) == i && req.body.itemTemplateIds.indexOf(e) != i
				);

				return !itemTemplateIds.includes(value);
			})
			.withMessage(modules.i18n.__("Added item already exists.")),
		body("boxItemIds.*").optional({ checkFalsy: true })
			.isInt({ min: 1 }).withMessage(modules.i18n.__("Service item ID field has invalid value.")),
		body("boxItemCounts.*")
			.isInt({ min: 1 }).withMessage(modules.i18n.__("Count field has invalid value.")),
		body("itemTemplateIds").notEmpty()
			.withMessage(modules.i18n.__("No items have been added to the product.")),
		// Additional info
		body("icon").optional().trim().toLowerCase()
			.isLength({ max: 2048 }).withMessage(modules.i18n.__("Icon must be between 1 and 255 characters.")),
		body("rareGrade").optional()
			.isIn(["", "0", "1", "2", "3", "4", "5"]).withMessage(modules.i18n.__("Rare grade field has invalid value.")),
		body("title.*").optional().trim()
			.isLength({ max: 1024 }).withMessage(modules.i18n.__("Title must be between 1 and 1024 characters.")),
		body("description.*").optional().trim()
			.isLength({ max: 2048 }).withMessage(modules.i18n.__("Description must be between 1 and 2048 characters."))
	],
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { fromCategoryId } = req.query;
		const { categoryId, validate, validAfter, validBefore, active, price,
			title, description, icon, rareGrade,
			itemTemplateIds, boxItemIds, boxItemCounts } = req.body;
		const errors = helpers.validationResultLog(req, modules.logger);
		const serviceItem = new ServiceItem(modules);

		try {
			const itemsPromises = [];
			const resolvedItems = {};
			const itemIcons = new Set();

			const categories = await modules.shopModel.categories.findAll({
				include: [{
					as: "strings",
					model: modules.shopModel.categoryStrings,
					where: { language: modules.i18n.getLocale() },
					required: false
				}],
				order: [
					["sort", "DESC"]
				]
			});

			if (itemTemplateIds) {
				itemTemplateIds.forEach(itemTemplateId => {
					itemsPromises.push(modules.dataModel.itemTemplates.findOne({
						where: { itemTemplateId },
						include: [
							{
								as: "strings",
								model: modules.dataModel.itemStrings,
								where: { language: modules.i18n.getLocale() },
								required: false
							},
							{
								as: "conversion",
								model: modules.dataModel.itemConversions,
								include: [{
									as: "template",
									model: modules.dataModel.itemTemplates
								}],
								required: false
							},
							{
								as: "skillIcon",
								model: modules.dataModel.skillIcons,
								required: false
							}
						]
					}));
				});
			}

			(await Promise.all(itemsPromises)).forEach(item => {
				if (item) {
					itemIcons.add(item.get("icon"));

					item.get("conversion").forEach(conversion =>
						itemIcons.add(conversion.get("template").get("icon"))
					);

					item.get("skillIcon").forEach(skillIcon =>
						itemIcons.add(skillIcon.get("icon"))
					);

					resolvedItems[item.get("itemTemplateId")] = item;
				}
			});

			if (!errors.isEmpty() || validate == 1) {
				return res.render("adminShopProductsAdd", {
					layout: "adminLayout",
					errors: errors.array(),
					moment,
					shopLocales,
					categories,
					fromCategoryId,
					categoryId,
					validAfter: moment.tz(validAfter, req.user.tz),
					validBefore: moment.tz(validBefore, req.user.tz),
					active,
					price,
					title: title || [],
					description: description || [],
					icon,
					rareGrade: rareGrade === "" ? null : Number(rareGrade),
					resolvedItems,
					itemTemplateIds: itemTemplateIds || [],
					boxItemIds: boxItemIds || [],
					boxItemCounts: boxItemCounts || [],
					itemIcons,
					validate: Number(!errors.isEmpty())
				});
			}

			await modules.sequelize.transaction(async transaction => {
				const product = await modules.shopModel.products.create({
					categoryId,
					active: active == "on",
					price,
					icon: icon || null,
					rareGrade: rareGrade === "" ? null : rareGrade,
					validAfter: moment.tz(validAfter, req.user.tz).toDate(),
					validBefore: moment.tz(validBefore, req.user.tz).toDate()
				}, {
					transaction
				});

				const promises = [];

				if (itemTemplateIds) {
					itemTemplateIds.forEach((itemTemplateId, index) => {
						if (!resolvedItems[itemTemplateId]) return;

						promises.push(serviceItem.checkCreate(
							boxItemIds[index],
							itemTemplateId,
							resolvedItems[itemTemplateId].get("strings")[0]?.get("string"),
							helpers.formatStrsheet(resolvedItems[itemTemplateId].get("strings")[0]?.get("toolTip")),
							req.user.userSn || 0
						).then(boxItemId =>
							modules.shopModel.productItems.create({
								productId: product.get("id"),
								itemTemplateId,
								boxItemId,
								boxItemCount: boxItemCounts[index]
							}, {
								transaction
							})
						));
					});
				}

				if (title || description) {
					shopLocales.forEach(language =>
						promises.push(modules.shopModel.productStrings.create({
							productId: product.get("id"),
							...title[language] ? { title: title[language] } : {},
							...description[language] ? { description: description[language] } : {},
							language
						}, {
							transaction
						}))
					);
				}

				await Promise.all(promises);
			});

			next();
		} catch (err) {
			modules.logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		}
	},
	writeOperationReport(modules.reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		res.redirect(`/shop_products?categoryId=${req.query.fromCategoryId || ""}`);
	}
];

/**
 * @param {modules} modules
 */
module.exports.edit = ({ i18n, logger, shopModel, dataModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res) => {
		const { id, fromCategoryId } = req.query;

		try {
			const title = {};
			const description = {};
			const itemTemplateIds = [];
			const boxItemIds = [];
			const boxItemCounts = [];
			const promises = [];
			const itemIcons = new Set();

			const product = await shopModel.products.findOne({
				where: { id },
				include: [
					{
						as: "item",
						model: shopModel.productItems,
						required: true
					},
					{
						as: "strings",
						model: shopModel.productStrings,
						required: false
					}
				],
				order: [
					[{ as: "item", model: shopModel.productItems }, "createdAt", "ASC"]
				]
			});

			if (product === null) {
				return res.redirect("/shop_products");
			}

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

			product.get("strings").forEach(string => {
				title[string.get("language")] = string.get("title");
				description[string.get("language")] = string.get("description");
			});

			product.get("item").forEach(productItem => {
				itemTemplateIds.push(productItem.get("itemTemplateId"));
				boxItemIds.push(productItem.get("boxItemId"));
				boxItemCounts.push(productItem.get("boxItemCount"));
			});

			itemTemplateIds.forEach(itemTemplateId => {
				promises.push(dataModel.itemTemplates.findOne({
					where: { itemTemplateId },
					include: [
						{
							as: "strings",
							model: dataModel.itemStrings,
							where: { language: i18n.getLocale() },
							required: false
						},
						{
							as: "conversion",
							model: dataModel.itemConversions,
							include: [{
								as: "template",
								model: dataModel.itemTemplates
							}],
							required: false
						},
						{
							as: "skillIcon",
							model: dataModel.skillIcons,
							required: false
						}
					]
				}));
			});

			(await Promise.all(promises)).forEach(item => {
				if (item) {
					itemIcons.add(item.get("icon"));

					item.get("conversion").forEach(conversion =>
						itemIcons.add(conversion.get("template").get("icon"))
					);

					item.get("skillIcon").forEach(skillIcon =>
						itemIcons.add(skillIcon.get("icon"))
					);
				}
			});

			res.render("adminShopProductsEdit", {
				layout: "adminLayout",
				errors: null,
				moment,
				shopLocales,
				categories,
				id,
				fromCategoryId,
				categoryId: product.get("categoryId"),
				validAfter: moment(product.get("validAfter")),
				validBefore: moment(product.get("validBefore")),
				active: product.get("active"),
				price: product.get("price"),
				sort: product.get("sort"),
				title,
				description,
				icon: product.get("icon"),
				rareGrade: product.get("rareGrade"),
				itemTemplateIds,
				boxItemIds,
				boxItemCounts,
				itemIcons,
				validate: 0
			});
		} catch (err) {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		}
	}
];

/**
 * @param {modules} modules
 */
module.exports.editAction = modules => [
	accessFunctionHandler,
	expressLayouts,
	[
		body("price")
			.isInt({ min: 0 }).withMessage(modules.i18n.__("Price field must contain a valid number.")),
		body("sort")
			.isNumeric().withMessage(modules.i18n.__("Sort field must contain the value as a number.")),
		body("categoryId")
			.custom((value, { req }) => modules.shopModel.categories.findOne({
				where: {
					id: req.body.categoryId || null
				}
			}).then(data => {
				if (!data) {
					return Promise.reject(modules.i18n.__("Category field must contain an existing category ID."));
				}
			})),
		body("validAfter")
			.isISO8601().withMessage(modules.i18n.__("Valid from field must contain a valid date.")),
		body("validBefore")
			.isISO8601().withMessage(modules.i18n.__("Valid to field must contain a valid date.")),
		body("active").optional()
			.isIn(["on"]).withMessage(modules.i18n.__("Active field has invalid value.")),
		// Items
		body("itemTemplateIds.*")
			.isInt({ min: 1 }).withMessage(modules.i18n.__("Item template ID field has invalid value."))
			.custom(value => modules.dataModel.itemTemplates.findOne({
				where: {
					itemTemplateId: value || null
				}
			}).then(data => {
				if (value && !data) {
					return Promise.reject(`${modules.i18n.__("A non-existent item has been added")}: ${value}`);
				}
			}))
			.custom((value, { req }) => {
				const itemTemplateIds = req.body.itemTemplateIds.filter((e, i) =>
					req.body.itemTemplateIds.lastIndexOf(e) == i && req.body.itemTemplateIds.indexOf(e) != i
				);

				return !itemTemplateIds.includes(value);
			})
			.withMessage(modules.i18n.__("Added item already exists.")),
		body("boxItemIds.*").optional({ checkFalsy: true })
			.isInt({ min: 1 }).withMessage(modules.i18n.__("Service item ID field has invalid value.")),
		body("boxItemCounts.*")
			.isInt({ min: 1 }).withMessage(modules.i18n.__("Count field has invalid value.")),
		body("itemTemplateIds").notEmpty()
			.withMessage(modules.i18n.__("No items have been added to the product.")),
		// Additional info
		body("icon").optional().trim().toLowerCase()
			.isLength({ max: 2048 }).withMessage(modules.i18n.__("Icon must be between 1 and 255 characters.")),
		body("rareGrade").optional()
			.isIn(["", "0", "1", "2", "3", "4", "5"]).withMessage(modules.i18n.__("Rare grade field has invalid value.")),
		body("title.*").optional().trim()
			.isLength({ max: 1024 }).withMessage(modules.i18n.__("Title must be between 1 and 1024 characters.")),
		body("description.*").optional().trim()
			.isLength({ max: 2048 }).withMessage(modules.i18n.__("Description must be between 1 and 2048 characters."))
	],
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { id, fromCategoryId } = req.query;
		const { validate, categoryId, validAfter, validBefore, active, price, sort,
			title, description, icon, rareGrade,
			itemTemplateIds, boxItemIds, boxItemCounts } = req.body;
		const errors = helpers.validationResultLog(req, modules.logger);
		const serviceItem = new ServiceItem(modules);

		try {
			if (!id) {
				return res.redirect("/shop_products");
			}

			const itemsPromises = [];
			const resolvedItems = {};
			const itemIcons = new Set();

			const product = await modules.shopModel.products.findOne({
				where: { id },
				include: [
					{
						as: "item",
						model: modules.shopModel.productItems,
						required: false
					},
					{
						as: "strings",
						model: modules.shopModel.productStrings,
						required: false
					}
				],
				order: [
					[{ as: "item", model: modules.shopModel.productItems }, "createdAt", "ASC"]
				]
			});

			if (product === null) {
				return res.redirect("/shop_products");
			}

			const categories = await modules.shopModel.categories.findAll({
				include: [{
					as: "strings",
					model: modules.shopModel.categoryStrings,
					where: { language: modules.i18n.getLocale() },
					required: false
				}],
				order: [
					["sort", "DESC"]
				]
			});

			if (itemTemplateIds) {
				itemTemplateIds.forEach(itemTemplateId => {
					itemsPromises.push(modules.dataModel.itemTemplates.findOne({
						where: { itemTemplateId },
						include: [
							{
								as: "strings",
								model: modules.dataModel.itemStrings,
								where: { language: modules.i18n.getLocale() },
								required: false
							},
							{
								as: "conversion",
								model: modules.dataModel.itemConversions,
								include: [{
									as: "template",
									model: modules.dataModel.itemTemplates
								}],
								required: false
							},
							{
								as: "skillIcon",
								model: modules.dataModel.skillIcons,
								required: false
							}
						]
					}));
				});
			}

			(await Promise.all(itemsPromises)).forEach(item => {
				if (item) {
					itemIcons.add(item.get("icon"));

					item.get("conversion").forEach(conversion =>
						itemIcons.add(conversion.get("template").get("icon"))
					);

					item.get("skillIcon").forEach(skillIcon =>
						itemIcons.add(skillIcon.get("icon"))
					);

					resolvedItems[item.get("itemTemplateId")] = item;
				}
			});

			if (!errors.isEmpty() || validate == 1) {
				return res.render("adminShopProductsEdit", {
					layout: "adminLayout",
					errors: errors.array(),
					moment,
					shopLocales,
					categories,
					id: product.get("id"),
					fromCategoryId,
					categoryId,
					validAfter: moment.tz(validAfter, req.user.tz),
					validBefore: moment.tz(validBefore, req.user.tz),
					active,
					price,
					sort,
					title: title || [],
					description: description || [],
					icon,
					rareGrade: rareGrade === "" ? null : Number(rareGrade),
					itemTemplateIds: itemTemplateIds || [],
					boxItemIds: boxItemIds || [],
					boxItemCounts: boxItemCounts || [],
					itemIcons,
					validate: Number(!errors.isEmpty())
				});
			}

			await modules.sequelize.transaction(async transaction => {
				const promises = [
					modules.shopModel.products.update({
						categoryId,
						active: active == "on",
						price,
						sort,
						icon: icon || null,
						rareGrade: rareGrade === "" ? null : rareGrade,
						validAfter: moment.tz(validAfter, req.user.tz).toDate(),
						validBefore: moment.tz(validBefore, req.user.tz).toDate()
					}, {
						where: { id: product.get("id") },
						transaction
					})
				];

				product.get("item").forEach(productItem => {
					const itemTemplateId = productItem.get("itemTemplateId");
					const index = Object.keys(itemTemplateIds).find(k => itemTemplateIds[k] == itemTemplateId);

					if (itemTemplateIds[index]) {
						if (boxItemIds[index] != productItem.get("boxItemId")) {
							promises.push(serviceItem.checkCreate(
								boxItemIds[index],
								itemTemplateId,
								resolvedItems[itemTemplateId].get("strings")[0]?.get("string"),
								helpers.formatStrsheet(resolvedItems[itemTemplateId].get("strings")[0]?.get("toolTip")),
								req.user.userSn || 0
							).then(boxItemId =>
								modules.shopModel.productItems.update({
									boxItemId,
									boxItemCount: boxItemCounts[index] || 1
								}, {
									where: { id: productItem.get("id") },
									transaction
								})
							));
						}
					} else {
						promises.push(modules.shopModel.productItems.destroy({
							where: { id: productItem.get("id") },
							transaction
						}));

						promises.push(modules.shopModel.productItems.findOne({
							where: {
								id: { [Op.ne]: productItem.get("id") },
								boxItemId: productItem.get("boxItemId")
							}
						}).then(resultProductItem => modules.boxModel.items.findOne({
							where: {
								boxItemId: productItem.get("boxItemId")
							}
						}).then(resultBoxItem => {
							if (resultProductItem === null && resultBoxItem === null) {
								promises.push(serviceItem.remove(productItem.get("boxItemId")));
							}
						})));
					}
				});

				if (itemTemplateIds) {
					itemTemplateIds.forEach((itemTemplateId, index) =>
						promises.push(modules.shopModel.productItems.findOne({
							where: {
								productId: product.get("id"),
								itemTemplateId
							}
						}).then(productItem => {
							if (productItem !== null || !resolvedItems[itemTemplateId]) return;

							return serviceItem.checkCreate(
								boxItemIds[index],
								itemTemplateId,
								resolvedItems[itemTemplateId].get("strings")[0]?.get("string"),
								helpers.formatStrsheet(resolvedItems[itemTemplateId].get("strings")[0]?.get("toolTip")),
								req.user.userSn || 0
							).then(boxItemId =>
								modules.shopModel.productItems.create({
									productId: product.get("id"),
									itemTemplateId,
									boxItemId,
									boxItemCount: boxItemCounts[index] || 1
								}, {
									transaction
								})
							);
						}))
					);
				}

				product.get("strings").forEach(productString => {
					const language = productString.get("language");

					if (title[language] || description[language]) {
						promises.push(modules.shopModel.productStrings.update({
							title: title[language] || null,
							description: description[language] || null
						}, {
							where: {
								id: productString.get("id"),
								language
							},
							transaction
						}));
					} else {
						promises.push(modules.shopModel.productStrings.destroy({
							where: {
								id: productString.get("id"),
								language
							},
							transaction
						}));
					}
				});

				shopLocales.forEach(language => {
					if (title[language] || description[language]) {
						promises.push(modules.shopModel.productStrings.create({
							productId: product.get("id"),
							title: title[language] || null,
							description: description[language] || null,
							language
						}, {
							ignoreDuplicates: true,
							transaction
						}));
					}
				});

				await Promise.all(promises);
			});

			next();
		} catch (err) {
			modules.logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		}
	},
	writeOperationReport(modules.reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		res.redirect(`/shop_products?categoryId=${req.query.fromCategoryId || ""}`);
	}
];

/**
 * @param {modules} modules
 */
module.exports.deleteAction = modules => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { id } = req.query;
		const serviceItem = new ServiceItem(modules);

		try {
			if (!id) {
				return res.redirect("/shop_products");
			}

			await modules.sequelize.transaction(async transaction => {
				const promises = [
					modules.shopModel.products.destroy({
						where: { id },
						transaction
					}),
					modules.shopModel.productStrings.destroy({
						where: { productId: id },
						transaction
					})
				];

				(await modules.shopModel.productItems.findAll({
					where: { productId: id }
				})).forEach(productItem => {
					if (productItem.get("boxItemId")) {
						promises.push(modules.shopModel.productItems.findOne({
							where: {
								id: { [Op.ne]: productItem.get("id") },
								boxItemId: productItem.get("boxItemId")
							}
						}).then(resultProductItem => modules.boxModel.items.findOne({
							where: {
								boxItemId: productItem.get("boxItemId")
							}
						}).then(resultBoxItem => {
							if (resultProductItem === null && resultBoxItem === null) {
								promises.push(serviceItem.remove(productItem.get("boxItemId")));
							}
						})));

						promises.push(modules.shopModel.productItems.destroy({
							where: { id: productItem.get("id") },
							transaction
						}));
					} else {
						promises.push(modules.shopModel.productItems.destroy({
							where: { id: productItem.get("id") },
							transaction
						}));
					}
				});

				await Promise.all(promises);
			});

			next();
		} catch (err) {
			modules.logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		}
	},
	writeOperationReport(modules.reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		res.redirect(`/shop_products?categoryId=${req.query.fromCategoryId || ""}`);
	}
];