"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const expressLayouts = require("express-ejs-layouts");
const body = require("express-validator").body;
const moment = require("moment-timezone");
const helpers = require("../utils/helpers");

const { accessFunctionHandler, shopStatusHandler, writeOperationReport } = require("../middlewares/admin.middlewares");
const shopLocales = require("../../config/admin").shopLocales;

/**
 * @param {modules} modules
 */
module.exports.index = ({ i18n, logger, shopModel }) => [
	accessFunctionHandler,
	shopStatusHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res) => {
		const { categoryId } = req.query;

		try {
			shopModel.categories.belongsTo(shopModel.categoryStrings, { foreignKey: "id" });
			shopModel.categories.hasOne(shopModel.categoryStrings, { foreignKey: "categoryId" });

			const categories = await shopModel.categories.findAll({
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
				},
				order: [
					["sort", "DESC"]
				]
			});

			const categoriesAssoc = {};

			if (categories !== null) {
				categories.forEach(category =>
					categoriesAssoc[category.get("id")] = category.get("title")
				);
			}

			shopModel.products.belongsTo(shopModel.productStrings, { foreignKey: "id" });
			shopModel.products.hasOne(shopModel.productStrings, { foreignKey: "productId" });

			const products = await shopModel.products.findAll({
				where: {
					...categoryId ? { categoryId } : {}
				},
				include: [{
					model: shopModel.productStrings,
					where: {
						language: i18n.getLocale()
					},
					attributes: [],
					required: false
				}],
				attributes: {
					include: [
						[shopModel.productStrings.sequelize.col("title"), "title"],
						[shopModel.productStrings.sequelize.col("description"), "description"]
					]
				},
				order: [
					["sort", "DESC"]
				]
			});

			const productsMap = new Map();

			if (products !== null) {
				shopModel.productItems.belongsTo(shopModel.itemTemplates, { foreignKey: "itemTemplateId" });
				shopModel.itemTemplates.hasOne(shopModel.itemStrings, { foreignKey: "itemTemplateId" });

				const promises = [];

				products.forEach(product => {
					productsMap.set(product.get("id"), {
						sort: product.get("sort"),
						categoryId: product.get("categoryId"),
						categoryTitle: categoriesAssoc[product.get("categoryId")] || "",
						price: product.get("price"),
						title: product.get("title"),
						description: product.get("description"),
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
						include: [{
							model: shopModel.itemTemplates,
							include: [{
								model: shopModel.itemStrings,
								where: {
									language: i18n.getLocale()
								},
								attributes: []
							}],
							attributes: []
						}],
						attributes: {
							include: [
								[shopModel.productItems.sequelize.col("productId"), "productId"],
								[shopModel.productItems.sequelize.col("boxItemCount"), "boxItemCount"],
								[shopModel.itemTemplates.sequelize.col("rareGrade"), "rareGrade"],
								[shopModel.itemTemplates.sequelize.col("icon"), "icon"],
								[shopModel.itemStrings.sequelize.col("string"), "string"],
								[shopModel.itemStrings.sequelize.col("toolTip"), "toolTip"]
							]
						},
						order: [
							["createdAt", "ASC"]
						]
					}));
				});

				const productItemsAssoc = await Promise.all(promises);

				if (productItemsAssoc !== null) {
					for (const productItem of productItemsAssoc) {
						if (productItem === null) {
							break;
						}

						const product = productsMap.get(productItem.get("productId"));

						if (product) {
							if (!product.title) {
								product.title = productItem.get("string");
							}

							if (!product.description) {
								product.description = productItem.get("toolTip");
							}

							if (!product.icon) {
								product.icon = productItem.get("icon");
							}

							if (product.rareGrade === null) {
								product.rareGrade = productItem.get("rareGrade");
							}

							if (!product.itemCount) {
								product.itemCount = productItem.get("boxItemCount");
							}
						}
					}
				}
			}

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
	shopStatusHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res) => {
		const { categoryId, fromCategoryId } = req.query;

		try {
			shopModel.categories.belongsTo(shopModel.categoryStrings, { foreignKey: "id" });
			shopModel.categories.hasOne(shopModel.categoryStrings, { foreignKey: "categoryId" });

			const categories = await shopModel.categories.findAll({
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
				},
				order: [
					["sort", "DESC"]
				]
			});

			res.render("adminShopProductsAdd", {
				layout: "adminLayout",
				errors: null,
				moment,
				shopLocales,
				categories: categories || [],
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
module.exports.addAction = ({ i18n, logger, platform, reportModel, shopModel }) => [
	accessFunctionHandler,
	shopStatusHandler,
	expressLayouts,
	[
		body("price").trim()
			.isInt({ min: 0 }).withMessage(i18n.__("Price field must contain a valid number.")),
		body("categoryId").trim()
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
			.custom(value => shopModel.itemTemplates.findOne({
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
			shopModel.categories.belongsTo(shopModel.categoryStrings, { foreignKey: "id" });
			shopModel.categories.hasOne(shopModel.categoryStrings, { foreignKey: "categoryId" });

			const categories = await shopModel.categories.findAll({
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
				},
				order: [
					["sort", "DESC"]
				]
			});

			const itemsPromises = [];
			const resolvedItems = {};

			if (itemTemplateIds) {
				itemTemplateIds.forEach(itemTemplateId => {
					shopModel.itemTemplates.belongsTo(shopModel.itemStrings, { foreignKey: "itemTemplateId" });
					shopModel.itemTemplates.hasOne(shopModel.itemStrings, { foreignKey: "itemTemplateId" });

					itemsPromises.push(shopModel.itemTemplates.findOne({
						where: { itemTemplateId },
						include: [{
							model: shopModel.itemStrings,
							where: {
								language: i18n.getLocale()
							},
							attributes: []
						}],
						attributes: {
							include: [
								[shopModel.itemTemplates.sequelize.col("rareGrade"), "rareGrade"],
								[shopModel.itemTemplates.sequelize.col("icon"), "icon"],
								[shopModel.itemStrings.sequelize.col("string"), "string"],
								[shopModel.itemStrings.sequelize.col("toolTip"), "toolTip"]
							]
						}
					}));
				});
			}

			const items = await Promise.all(itemsPromises);

			items.forEach(item => {
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

			await shopModel.sequelize.transaction(async transaction => {
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
							promises.push(platform.createServiceItem(
								req.user.userSn || 0,
								itemTemplateId,
								1,
								moment().utc().format("YYYY-MM-DD HH:mm:ss"),
								true,
								resolvedItems[itemTemplateId].get("string"),
								helpers.formatStrsheet(resolvedItems[itemTemplateId].get("toolTip")),
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
module.exports.edit = ({ i18n, logger, shopModel }) => [
	accessFunctionHandler,
	shopStatusHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res) => {
		const { id, fromCategoryId } = req.query;

		try {
			shopModel.categories.belongsTo(shopModel.categoryStrings, { foreignKey: "id" });
			shopModel.categories.hasOne(shopModel.categoryStrings, { foreignKey: "categoryId" });

			const categories = await shopModel.categories.findAll({
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
				},
				order: [
					["sort", "DESC"]
				]
			});

			const product = await shopModel.products.findOne({ where: { id } });

			if (product === null) {
				return res.redirect("/shop_products");
			}

			const strings = await shopModel.productStrings.findAll({
				where: { productId: product.get("id") }
			});

			const title = {};
			const description = {};

			if (strings !== null) {
				strings.forEach(string => {
					title[string.get("language")] = string.get("title");
					description[string.get("language")] = string.get("description");
				});
			}

			shopModel.productItems.belongsTo(shopModel.itemTemplates, { foreignKey: "itemTemplateId" });
			shopModel.itemTemplates.hasOne(shopModel.itemStrings, { foreignKey: "itemTemplateId" });

			const productItems = await shopModel.productItems.findAll({
				where: { productId: product.get("id") },
				include: [{
					model: shopModel.itemTemplates,
					include: [{
						model: shopModel.itemStrings,
						where: { language: i18n.getLocale() },
						attributes: []
					}],
					attributes: []
				}],
				attributes: {
					include: [
						[shopModel.productItems.sequelize.col("productId"), "productId"],
						[shopModel.productItems.sequelize.col("boxItemCount"), "boxItemCount"],
						[shopModel.itemTemplates.sequelize.col("rareGrade"), "rareGrade"],
						[shopModel.itemTemplates.sequelize.col("icon"), "icon"],
						[shopModel.itemStrings.sequelize.col("string"), "string"],
						[shopModel.itemStrings.sequelize.col("toolTip"), "toolTip"]
					]
				},
				order: [
					["createdAt", "ASC"]
				]
			});

			const itemTemplateIds = [];
			const boxItemIds = [];
			const boxItemCounts = [];
			const promises = [];

			if (productItems !== null) {
				productItems.forEach(productItem => {
					itemTemplateIds.push(productItem.get("itemTemplateId"));
					boxItemIds.push(productItem.get("boxItemId"));
					boxItemCounts.push(productItem.get("boxItemCount"));
				});
			}

			itemTemplateIds.forEach(itemTemplateId => {
				shopModel.itemTemplates.belongsTo(shopModel.itemStrings, { foreignKey: "itemTemplateId" });
				shopModel.itemTemplates.hasOne(shopModel.itemStrings, { foreignKey: "itemTemplateId" });

				promises.push(shopModel.itemTemplates.findOne({
					where: { itemTemplateId },
					include: [{
						model: shopModel.itemStrings,
						where: {
							language: i18n.getLocale()
						},
						attributes: []
					}],
					attributes: {
						include: [
							[shopModel.itemTemplates.sequelize.col("rareGrade"), "rareGrade"],
							[shopModel.itemTemplates.sequelize.col("icon"), "icon"],
							[shopModel.itemStrings.sequelize.col("string"), "string"],
							[shopModel.itemStrings.sequelize.col("toolTip"), "toolTip"]
						]
					}
				}));
			});

			const items = await Promise.all(promises);
			const resolvedItems = {};

			items.forEach(item => {
				if (item) {
					resolvedItems[item.get("itemTemplateId")] = item;
				}
			});

			res.render("adminShopProductsEdit", {
				layout: "adminLayout",
				errors: null,
				moment,
				shopLocales,
				categories: categories || [],
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
module.exports.editAction = ({ i18n, logger, platform, reportModel, shopModel }) => [
	accessFunctionHandler,
	shopStatusHandler,
	expressLayouts,
	[
		body("price").trim()
			.isInt({ min: 0 }).withMessage(i18n.__("Price field must contain a valid number.")),
		body("sort").trim()
			.isNumeric().withMessage(i18n.__("Sort field must contain the value as a number.")),
		body("categoryId").trim()
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
			.custom(value => shopModel.itemTemplates.findOne({
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

			const product = await shopModel.products.findOne({ where: { id } });

			if (product === null) {
				return res.redirect("/shop_products");
			}

			shopModel.categories.belongsTo(shopModel.categoryStrings, { foreignKey: "id" });
			shopModel.categories.hasOne(shopModel.categoryStrings, { foreignKey: "categoryId" });

			const categories = await shopModel.categories.findAll({
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
				},
				order: [
					["sort", "DESC"]
				]
			});

			const itemsPromises = [];
			const resolvedItems = {};

			if (itemTemplateIds) {
				itemTemplateIds.forEach(itemTemplateId => {
					shopModel.itemTemplates.belongsTo(shopModel.itemStrings, { foreignKey: "itemTemplateId" });
					shopModel.itemTemplates.hasOne(shopModel.itemStrings, { foreignKey: "itemTemplateId" });

					itemsPromises.push(shopModel.itemTemplates.findOne({
						where: { itemTemplateId },
						include: [{
							model: shopModel.itemStrings,
							where: {
								language: i18n.getLocale()
							},
							attributes: []
						}],
						attributes: {
							include: [
								[shopModel.itemTemplates.sequelize.col("rareGrade"), "rareGrade"],
								[shopModel.itemTemplates.sequelize.col("icon"), "icon"],
								[shopModel.itemStrings.sequelize.col("string"), "string"],
								[shopModel.itemStrings.sequelize.col("toolTip"), "toolTip"]
							]
						}
					}));
				});
			}

			const items = await Promise.all(itemsPromises);

			items.forEach(item => {
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

			const productItems = await shopModel.productItems.findAll({
				where: { productId: product.get("id") }
			});

			const productStrings = await shopModel.productStrings.findAll({
				where: { productId: product.get("id") }
			});

			await shopModel.sequelize.transaction(async transaction => {
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

				productItems.forEach(productItem => {
					const itemTemplateId = productItem.get("itemTemplateId");
					const index = Object.keys(itemTemplateIds).find(k => itemTemplateIds[k] == itemTemplateId);

					if (itemTemplateIds[index]) {
						if (boxItemIds[index] != productItem.get("boxItemId")) {
							promises.push(platform.createServiceItem(
								req.user.userSn || 0,
								itemTemplateId,
								1,
								moment().utc().format("YYYY-MM-DD HH:mm:ss"),
								true,
								resolvedItems[itemTemplateId].get("string"),
								helpers.formatStrsheet(resolvedItems[itemTemplateId].get("toolTip")),
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
							promises.push(platform.removeServiceItem(productItem.get("boxItemId")));
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
								if (!boxItemIds[index]) {
									return platform.createServiceItem(
										req.user.userSn || 0,
										itemTemplateId,
										1,
										moment().utc().format("YYYY-MM-DD HH:mm:ss"),
										true,
										resolvedItems[itemTemplateId].get("string"),
										resolvedItems[itemTemplateId].get("toolTip"),
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

				productStrings.forEach(productString => {
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
module.exports.deleteAction = ({ logger, platform, reportModel, shopModel }) => [
	accessFunctionHandler,
	shopStatusHandler,
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

			const productItems = await shopModel.productItems.findAll({
				where: { productId: id }
			});

			await shopModel.sequelize.transaction(async transaction => {
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

				if (productItems !== null) {
					for (const productItem of productItems) {
						if (productItem.get("boxItemId")) {
							if (productItem.get("boxItemId")) {
								promises.push(platform.removeServiceItem(productItem.get("boxItemId")));
							}

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
					}
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