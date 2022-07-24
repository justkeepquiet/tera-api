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
			const productsMap = new Map();
			const promises = [];
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
				categoriesAssoc[category.get("id")] = category.get("strings")?.get("title")
			);

			(await shopModel.products.findAll({
				where: {
					...categoryId ? { categoryId } : {}
				},
				include: [{
					as: "strings",
					model: shopModel.productStrings,
					where: { language: i18n.getLocale() },
					required: false
				}],
				order: [
					["sort", "DESC"]
				]
			})).forEach(product => {
				productsMap.set(product.get("id"), {
					sort: product.get("sort"),
					categoryId: product.get("categoryId"),
					categoryTitle: categoriesAssoc[product.get("categoryId")] || "",
					price: product.get("price"),
					title: product.get("strings")?.get("title"),
					description: product.get("strings")?.get("description"),
					icon: product.get("icon"),
					rareGrade: product.get("rareGrade"),
					active: product.get("active"),
					published:
						product.get("active") &&
						moment().isSameOrAfter(moment(product.get("validAfter"))) &&
						moment().isSameOrBefore(moment(product.get("validBefore"))),
					itemCount: null
				});

				promises.push(shopModel.productItems.findOne({
					where: { productId: product.get("id") },
					include: [
						{
							as: "template",
							model: dataModel.itemTemplates
						},
						{
							as: "strings",
							model: dataModel.itemStrings,
							where: { language: i18n.getLocale() },
							required: false
						}
					],
					order: [
						["createdAt", "ASC"]
					]
				}));
			});

			(await Promise.all(promises)).forEach(productItem => {
				if (productItem === null) {
					return;
				}

				const product = productsMap.get(productItem.get("productId"));

				if (product) {
					if (!product.title) {
						product.title = productItem.get("strings")?.get("string");
					}

					if (!product.description) {
						product.description = productItem.get("strings")?.get("toolTip");
					}

					if (!product.icon) {
						product.icon = productItem.get("template").get("icon");
					}

					if (product.rareGrade === null) {
						product.rareGrade = productItem.get("template").get("rareGrade");
					}

					if (!product.itemCount) {
						product.itemCount = productItem.get("boxItemCount");
					}
				}
			});

			res.render("adminShopProducts", {
				layout: "adminLayout",
				categoryId,
				categories: categories || [],
				products: productsMap
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
				validBefore: moment().add(2, "years"),
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
module.exports.addAction = ({ i18n, logger, hub, sequelize, reportModel, shopModel, dataModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		body("price")
			.isInt({ min: 0 }).withMessage(i18n.__("Price field must contain a valid number.")),
		body("categoryId")
			.custom((value, { req }) => shopModel.categories.findOne({
				where: {
					id: req.body.categoryId
				}
			}).then(data => {
				if (!data) {
					return Promise.reject(i18n.__("Category field must contain an existing category ID."));
				}
			})),
		body("validAfter")
			.isISO8601().withMessage(i18n.__("Valid from field must contain a valid date.")),
		body("validBefore")
			.isISO8601().withMessage(i18n.__("Valid to field must contain a valid date.")),
		body("active").optional()
			.isIn(["on"]).withMessage(i18n.__("Active field has invalid value.")),
		// Items
		body("itemTemplateIds.*")
			.isInt({ min: 1 }).withMessage(i18n.__("Item template ID field has invalid value."))
			.custom(value => dataModel.itemTemplates.findOne({
				where: {
					itemTemplateId: value
				}
			}).then(data => {
				if (value && !data) {
					return Promise.reject(`${i18n.__("A non-existent item has been added")}: ${value}`);
				}
			}))
			.custom((value, { req }) => {
				const itemTemplateIds = req.body.itemTemplateIds.filter((e, i) =>
					req.body.itemTemplateIds.lastIndexOf(e) == i && req.body.itemTemplateIds.indexOf(e) != i
				);

				return !itemTemplateIds.includes(value);
			})
			.withMessage(i18n.__("Added item already exists.")),
		body("boxItemIds.*").optional({ checkFalsy: true })
			.isInt({ min: 1 }).withMessage(i18n.__("Box item ID field has invalid value.")),
		body("boxItemCounts.*")
			.isInt({ min: 1 }).withMessage(i18n.__("Count field has invalid value.")),
		body("itemTemplateIds").notEmpty()
			.withMessage(i18n.__("No items have been added to the product.")),
		// Additional info
		body("icon").optional().trim().toLowerCase()
			.isLength({ max: 2048 }).withMessage(i18n.__("Icon must be between 1 and 255 characters.")),
		body("rareGrade").optional()
			.isIn(["", "0", "1", "2", "3", "4", "5"]).withMessage(i18n.__("Rare grade field has invalid value.")),
		body("title.*").optional().trim()
			.isLength({ max: 1024 }).withMessage(i18n.__("Title must be between 1 and 1024 characters.")),
		body("description.*").optional().trim()
			.isLength({ max: 2048 }).withMessage(i18n.__("Description must be between 1 and 2048 characters."))
	],
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { fromCategoryId } = req.query;
		const { categoryId, validate, validAfter, validBefore, active, price,
			title, description, icon, rareGrade,
			itemTemplateIds, boxItemIds, boxItemCounts } = req.body;
		const errors = helpers.validationResultLog(req, logger);

		try {
			const itemsPromises = [];
			const resolvedItems = {};

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

			if (itemTemplateIds) {
				itemTemplateIds.forEach(itemTemplateId => {
					itemsPromises.push(dataModel.itemTemplates.findOne({
						where: { itemTemplateId },
						include: [{
							as: "strings",
							model: dataModel.itemStrings,
							where: { language: i18n.getLocale() },
							required: false
						}]
					}));
				});
			}

			(await Promise.all(itemsPromises)).forEach(item => {
				if (item) {
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
					title,
					description,
					icon,
					rareGrade: rareGrade === "" ? null : Number(rareGrade),
					resolvedItems,
					itemTemplateIds: itemTemplateIds || [],
					boxItemIds: boxItemIds || [],
					boxItemCounts: boxItemCounts || [],
					validate: Number(!errors.isEmpty())
				});
			}

			await sequelize.transaction(async transaction => {
				const product = await shopModel.products.create({
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
						if (boxItemIds[index] === "" && resolvedItems[itemTemplateId]) {
							if (!resolvedItems[itemTemplateId]) return;

							promises.push(hub.createServiceItem(
								req.user.userSn || 0,
								itemTemplateId,
								1,
								moment().utc().format("YYYY-MM-DD HH:mm:ss"),
								true,
								resolvedItems[itemTemplateId].get("strings")?.get("string"),
								helpers.formatStrsheet(resolvedItems[itemTemplateId].get("strings")?.get("toolTip")),
								"1,1,1"
							).then(boxItemId =>
								shopModel.productItems.create({
									productId: product.get("id"),
									itemTemplateId,
									boxItemId,
									boxItemCount: boxItemCounts[index]
								}, {
									transaction
								})
							));
						} else {
							promises.push(shopModel.productItems.create({
								productId: product.get("id"),
								itemTemplateId,
								boxItemId: boxItemIds[index] || null,
								boxItemCount: boxItemCounts[index]
							}, {
								transaction
							}));
						}
					});
				}

				if (title || description) {
					shopLocales.forEach(language =>
						promises.push(shopModel.productStrings.create({
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
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		}
	},
	writeOperationReport(reportModel),
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
			const resolvedItems = {};
			const promises = [];

			const product = await shopModel.products.findOne({ where: { id } });

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

			(await shopModel.productStrings.findAll({
				where: { productId: product.get("id") }
			})).forEach(string => {
				title[string.get("language")] = string.get("title");
				description[string.get("language")] = string.get("description");
			});

			(await shopModel.productItems.findAll({
				where: { productId: product.get("id") },
				order: [
					["createdAt", "ASC"]
				]
			})).forEach(productItem => {
				itemTemplateIds.push(productItem.get("itemTemplateId"));
				boxItemIds.push(productItem.get("boxItemId"));
				boxItemCounts.push(productItem.get("boxItemCount"));
			});

			itemTemplateIds.forEach(itemTemplateId => {
				promises.push(dataModel.itemTemplates.findOne({
					where: { itemTemplateId },
					include: [{
						as: "strings",
						model: dataModel.itemStrings,
						where: { language: i18n.getLocale() },
						required: false
					}]
				}));
			});

			(await Promise.all(promises)).forEach(item => {
				if (item) {
					resolvedItems[item.get("itemTemplateId")] = item;
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
				resolvedItems,
				itemTemplateIds,
				boxItemIds,
				boxItemCounts,
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
module.exports.editAction = ({ i18n, logger, hub, sequelize, reportModel, shopModel, dataModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		body("price")
			.isInt({ min: 0 }).withMessage(i18n.__("Price field must contain a valid number.")),
		body("sort")
			.isNumeric().withMessage(i18n.__("Sort field must contain the value as a number.")),
		body("categoryId")
			.custom((value, { req }) => shopModel.categories.findOne({
				where: {
					id: req.body.categoryId
				}
			}).then(data => {
				if (!data) {
					return Promise.reject(i18n.__("Category field must contain an existing category ID."));
				}
			})),
		body("validAfter")
			.isISO8601().withMessage(i18n.__("Valid from field must contain a valid date.")),
		body("validBefore")
			.isISO8601().withMessage(i18n.__("Valid to field must contain a valid date.")),
		body("active").optional()
			.isIn(["on"]).withMessage(i18n.__("Active field has invalid value.")),
		// Items
		body("itemTemplateIds.*")
			.isInt({ min: 1 }).withMessage(i18n.__("Item template ID field has invalid value."))
			.custom(value => dataModel.itemTemplates.findOne({
				where: {
					itemTemplateId: value
				}
			}).then(data => {
				if (value && !data) {
					return Promise.reject(`${i18n.__("A non-existent item has been added")}: ${value}`);
				}
			}))
			.custom((value, { req }) => {
				const itemTemplateIds = req.body.itemTemplateIds.filter((e, i) =>
					req.body.itemTemplateIds.lastIndexOf(e) == i && req.body.itemTemplateIds.indexOf(e) != i
				);

				return !itemTemplateIds.includes(value);
			})
			.withMessage(i18n.__("Added item already exists.")),
		body("boxItemIds.*").optional({ checkFalsy: true })
			.isInt({ min: 1 }).withMessage(i18n.__("Box item ID field has invalid value.")),
		body("boxItemCounts.*")
			.isInt({ min: 1 }).withMessage(i18n.__("Count field has invalid value.")),
		body("itemTemplateIds").notEmpty()
			.withMessage(i18n.__("No items have been added to the product.")),
		// Additional info
		body("icon").optional().trim().toLowerCase()
			.isLength({ max: 2048 }).withMessage(i18n.__("Icon must be between 1 and 255 characters.")),
		body("rareGrade").optional()
			.isIn(["", "0", "1", "2", "3", "4", "5"]).withMessage(i18n.__("Rare grade field has invalid value.")),
		body("title.*").optional().trim()
			.isLength({ max: 1024 }).withMessage(i18n.__("Title must be between 1 and 1024 characters.")),
		body("description.*").optional().trim()
			.isLength({ max: 2048 }).withMessage(i18n.__("Description must be between 1 and 2048 characters."))
	],
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { id, fromCategoryId } = req.query;
		const { validate, categoryId, validAfter, validBefore, active, price, sort,
			title, description, icon, rareGrade,
			itemTemplateIds, boxItemIds, boxItemCounts } = req.body;
		const errors = helpers.validationResultLog(req, logger);

		try {
			if (!id) {
				return res.redirect("/shop_products");
			}

			const itemsPromises = [];
			const resolvedItems = {};

			const product = await shopModel.products.findOne({ where: { id } });

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

			if (itemTemplateIds) {
				itemTemplateIds.forEach(itemTemplateId => {
					itemsPromises.push(dataModel.itemTemplates.findOne({
						where: { itemTemplateId },
						include: [{
							as: "strings",
							model: dataModel.itemStrings,
							where: { language: i18n.getLocale() },
							required: false
						}]
					}));
				});
			}

			(await Promise.all(itemsPromises)).forEach(item => {
				if (item) {
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
					title,
					description,
					icon,
					rareGrade: rareGrade === "" ? null : Number(rareGrade),
					resolvedItems,
					itemTemplateIds: itemTemplateIds || [],
					boxItemIds: boxItemIds || [],
					boxItemCounts: boxItemCounts || [],
					validate: Number(!errors.isEmpty())
				});
			}

			await sequelize.transaction(async transaction => {
				const promises = [
					shopModel.products.update({
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

				(await shopModel.productItems.findAll({
					where: { productId: product.get("id") }
				})).forEach(productItem => {
					const itemTemplateId = productItem.get("itemTemplateId");
					const index = Object.keys(itemTemplateIds).find(k => itemTemplateIds[k] == itemTemplateId);

					if (itemTemplateIds[index]) {
						if (!boxItemIds[index]) {
							if (!resolvedItems[itemTemplateId]) return;

							promises.push(hub.createServiceItem(
								req.user.userSn || 0,
								itemTemplateId,
								1,
								moment().utc().format("YYYY-MM-DD HH:mm:ss"),
								true,
								resolvedItems[itemTemplateId].get("strings")?.get("string"),
								helpers.formatStrsheet(resolvedItems[itemTemplateId].get("strings")?.get("toolTip")),
								"1,1,1"
							).then(boxItemId =>
								shopModel.productItems.update({
									boxItemId,
									boxItemCount: boxItemCounts[index] || 1
								}, {
									where: { id: productItem.get("id") },
									transaction
								})
							));
						} else {
							promises.push(shopModel.productItems.update({
								boxItemId: boxItemIds[index] || null,
								boxItemCount: boxItemCounts[index] || 1
							}, {
								where: { id: productItem.get("id") },
								transaction
							}));
						}
					} else {
						if (productItem.get("boxItemId")) {
							promises.push(hub.removeServiceItem(productItem.get("boxItemId")));
						}

						promises.push(shopModel.productItems.destroy({
							where: { id: productItem.get("id") },
							transaction
						}));
					}
				});

				if (itemTemplateIds) {
					itemTemplateIds.forEach((itemTemplateId, index) =>
						promises.push(shopModel.productItems.findOne({
							where: {
								productId: product.get("id"),
								itemTemplateId
							}
						}).then(async productItem => {
							if (productItem === null) {
								if (!resolvedItems[itemTemplateId]) return;

								if (!boxItemIds[index]) {
									return hub.createServiceItem(
										req.user.userSn || 0,
										itemTemplateId,
										1,
										moment().utc().format("YYYY-MM-DD HH:mm:ss"),
										true,
										resolvedItems[itemTemplateId].get("strings")?.get("string"),
										helpers.formatStrsheet(resolvedItems[itemTemplateId].get("strings")?.get("toolTip")),
										"1,1,1"
									).then(boxItemId =>
										shopModel.productItems.create({
											productId: product.get("id"),
											itemTemplateId,
											boxItemId,
											boxItemCount: boxItemCounts[index] || 1
										}, {
											transaction
										})
									);
								} else {
									return shopModel.productItems.create({
										productId: product.get("id"),
										itemTemplateId,
										boxItemId: boxItemIds[index] || null,
										boxItemCount: boxItemCounts[index] || 1
									}, {
										transaction
									});
								}
							}
						}))
					);
				}

				(await shopModel.productStrings.findAll({
					where: { productId: product.get("id") }
				})).forEach(productString => {
					const language = productString.get("language");

					if (title[language] || description[language]) {
						promises.push(shopModel.productStrings.update({
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
						promises.push(shopModel.productStrings.destroy({
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
						promises.push(shopModel.productStrings.create({
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
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		}
	},
	writeOperationReport(reportModel),
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
module.exports.deleteAction = ({ logger, hub, sequelize, reportModel, shopModel, boxModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { id } = req.query;

		try {
			if (!id) {
				return res.redirect("/shop_products");
			}

			await sequelize.transaction(async transaction => {
				const promises = [
					shopModel.products.destroy({
						where: { id },
						transaction
					}),
					shopModel.productStrings.destroy({
						where: { productId: id },
						transaction
					})
				];

				(await shopModel.productItems.findAll({
					where: { productId: id }
				})).forEach(productItem => {
					if (productItem.get("boxItemId")) {
						promises.push(shopModel.productItems.findOne({
							where: {
								id: { [Op.ne]: productItem.get("id") },
								boxItemId: productItem.get("boxItemId")
							}
						}).then(resultProductItem => boxModel.items.findOne({
							where: {
								boxItemId: productItem.get("boxItemId")
							}
						}).then(resultBoxItem => {
							if (resultProductItem === null && resultBoxItem === null) {
								promises.push(hub.removeServiceItem(productItem.get("boxItemId")));
							}
						})));

						promises.push(shopModel.productItems.destroy({
							where: { id: productItem.get("id") },
							transaction
						}));
					} else {
						promises.push(shopModel.productItems.destroy({
							where: { id: productItem.get("id") },
							transaction
						}));
					}
				});

				await Promise.all(promises);
			});

			next();
		} catch (err) {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		}
	},
	writeOperationReport(reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		res.redirect(`/shop_products?categoryId=${req.query.fromCategoryId || ""}`);
	}
];