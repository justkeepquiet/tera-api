"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const { query, body } = require("express-validator");
const moment = require("moment-timezone");
const Op = require("sequelize").Op;

const { getSupportedLanguagesByDirectory, formatStrsheet, validationResultLog } = require("../utils/helpers");
const { ServiceItem } = require("../utils/boxHelper");

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
module.exports.index = ({ i18n, sequelize, shopModel, datasheetModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { categoryId } = req.query;

		const products = new Map();
		const categoriesAssoc = {};

		const categories = await shopModel.categories.findAll({
			attributes: {
				include: [[sequelize.fn("NOW"), "dateNow"]]
			},
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
					model: shopModel.productItems
				}
			],
			order: [
				["sort", "DESC"],
				["id", "ASC"],
				[{ as: "item", model: shopModel.productItems }, "createdAt", "ASC"]
			]
		})).forEach(product => {
			let productDiscount = 0;

			if (product.get("discount") > 0 &&
				product.get("discountValidAfter") &&
				product.get("discountValidBefore") &&
				moment(product.get("dateNow")).isSameOrAfter(product.get("discountValidAfter")) &&
				moment(product.get("dateNow")).isSameOrBefore(product.get("discountValidBefore"))
			) {
				productDiscount = product.get("discount");
			}

			let tag = null;

			if (product.get("tag") !== null &&
				product.get("tagValidAfter") &&
				product.get("tagValidBefore") &&
				moment(product.get("dateNow")).isSameOrAfter(product.get("tagValidAfter")) &&
				moment(product.get("dateNow")).isSameOrBefore(product.get("tagValidBefore"))
			) {
				tag = product.get("tag");
			}

			const productInfo = {
				sort: product.get("sort"),
				categoryId: product.get("categoryId"),
				categoryTitle: categoriesAssoc[product.get("categoryId")] || "",
				price: product.get("price"),
				discount: productDiscount,
				title: product.get("strings")[0]?.get("title"),
				description: product.get("strings")[0]?.get("description"),
				icon: product.get("icon"),
				rareGrade: product.get("rareGrade"),
				tag,
				active: product.get("active"),
				published:
					product.get("active") &&
					moment().isSameOrAfter(moment(product.get("validAfter"))) &&
					moment().isSameOrBefore(moment(product.get("validBefore"))),
				itemCount: null
			};

			product.get("item").forEach(productItem => {
				const itemData = datasheetModel.itemData.get(i18n.getLocale())?.getOne(productItem.get("itemTemplateId"));
				const strSheetItem = datasheetModel.strSheetItem.get(i18n.getLocale())?.getOne(productItem.get("itemTemplateId"));

				if (strSheetItem) {
					if (!productInfo.title) {
						productInfo.title = strSheetItem.string;
					}

					if (!productInfo.description) {
						productInfo.description = strSheetItem.toolTip;
					}
				}

				if (itemData) {
					if (!productInfo.icon) {
						productInfo.icon = itemData.icon;
					}

					if (productInfo.rareGrade === null) {
						productInfo.rareGrade = itemData.rareGrade;
					}
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
	}
];

/**
 * @param {modules} modules
 */
module.exports.add = ({ localization, i18n, shopModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { categoryId, fromCategoryId } = req.query;

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

		const languages = getSupportedLanguagesByDirectory(path.join(__dirname, "../locales/shop"), localization);

		res.render("adminShopProductsAdd", {
			layout: "adminLayout",
			errors: null,
			moment,
			languages,
			categories,
			fromCategoryId,
			categoryId
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.addAction = modules => [
	accessFunctionHandler,
	[
		body("price")
			.isInt({ min: 0, max: 1e8 }).withMessage(modules.i18n.__("Price field must contain a valid number.")),
		body("sort")
			.isInt({ min: -1e8, max: 1e8 }).withMessage(modules.i18n.__("Sort field must contain the value as a number.")),
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
			.isInt({ min: 1, max: 1e8 }).withMessage(modules.i18n.__("Item template ID field has invalid value."))
			.custom(value => {
				if (value && !modules.datasheetModel.itemData.get(modules.i18n.getLocale())?.getOne(value)) {
					return Promise.reject(`${modules.i18n.__("A non-existent item has been added")}: ${value}`);
				}
				return true;
			})
			.custom((value, { req }) => {
				const itemTemplateIds = req.body.itemTemplateIds.filter((e, i) =>
					req.body.itemTemplateIds.lastIndexOf(e) == i && req.body.itemTemplateIds.indexOf(e) != i
				);

				return !itemTemplateIds.includes(value);
			})
			.withMessage(modules.i18n.__("Added item already exists.")),
		body("boxItemIds.*").optional({ checkFalsy: true })
			.isInt({ min: 1, max: 1e8 }).withMessage(modules.i18n.__("Service item ID field has invalid value.")),
		body("boxItemCounts.*")
			.isInt({ min: 1, max: 1e6 }).withMessage(modules.i18n.__("Count field has invalid value.")),
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
			.isLength({ max: 2048 }).withMessage(modules.i18n.__("Description must be between 1 and 2048 characters.")),
		body("tag").optional()
			.isIn(["", "0", "1", "2", "3"]).withMessage(modules.i18n.__("Tag field has invalid value.")),
		body("tagValidAfter").optional({ checkFalsy: true })
			.isISO8601().withMessage(modules.i18n.__("Tag valid from field must contain a valid date.")),
		body("tagValidBefore").optional({ checkFalsy: true })
			.isISO8601().withMessage(modules.i18n.__("Tag valid to field must contain a valid date.")),
		body("discount")
			.isInt({ min: 0, max: 100 }).withMessage(modules.i18n.__("Discount field must contain a valid number.")),
		body("discountValidAfter").optional({ checkFalsy: true })
			.isISO8601().withMessage(modules.i18n.__("Discount valid from field must contain a valid date.")),
		body("discountValidBefore").optional({ checkFalsy: true })
			.isISO8601().withMessage(modules.i18n.__("Discount valid to field must contain a valid date."))

	],
	formValidationHandler(modules.logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { categoryId, validAfter, validBefore, active, price, sort,
			title, description, icon, rareGrade,
			tag, tagValidAfter, tagValidBefore,
			discount, discountValidAfter, discountValidBefore,
			itemTemplateIds, boxItemIds, boxItemCounts } = req.body;

		const serviceItem = new ServiceItem(modules);
		const resolvedItems = {};

		if (itemTemplateIds) {
			itemTemplateIds.forEach(itemTemplateId =>
				resolvedItems[itemTemplateId] = modules.datasheetModel.strSheetItem.get(modules.i18n.getLocale())?.getOne(itemTemplateId)
			);
		}

		await modules.sequelize.transaction(async () => {
			const product = await modules.shopModel.products.create({
				categoryId,
				active: active == "on",
				price,
				validAfter: moment.tz(validAfter, req.user.tz).toDate(),
				validBefore: moment.tz(validBefore, req.user.tz).toDate(),
				sort,
				icon: icon || null,
				rareGrade: rareGrade === "" ? null : rareGrade,
				tag: tag === "" ? null : tag,
				tagValidAfter: tagValidAfter ? moment.tz(tagValidAfter, req.user.tz).toDate() : null,
				tagValidBefore: tagValidBefore ? moment.tz(tagValidBefore, req.user.tz).toDate() : null,
				discount,
				discountValidAfter: discountValidAfter ? moment.tz(discountValidAfter, req.user.tz).toDate() : null,
				discountValidBefore: discountValidBefore ? moment.tz(discountValidBefore, req.user.tz).toDate() : null
			});

			const promises = [];

			if (itemTemplateIds) {
				itemTemplateIds.forEach((itemTemplateId, index) => {
					if (!resolvedItems[itemTemplateId]) return;

					promises.push(serviceItem.checkCreate(
						boxItemIds[index],
						itemTemplateId,
						resolvedItems[itemTemplateId].string,
						formatStrsheet(resolvedItems[itemTemplateId].toolTip),
						req.user.userSn || 0
					).then(boxItemId =>
						modules.shopModel.productItems.create({
							productId: product.get("id"),
							itemTemplateId,
							boxItemId,
							boxItemCount: boxItemCounts[index]
						})
					));
				});
			}

			if (title || description) {
				const languages = getSupportedLanguagesByDirectory(path.join(__dirname, "../locales/shop"), modules.localization);

				languages.forEach(language =>
					promises.push(modules.shopModel.productStrings.create({
						productId: product.get("id"),
						...title[language] ? { title: title[language] } : {},
						...description[language] ? { description: description[language] } : {},
						language
					}))
				);
			}

			await Promise.all(promises);
		});

		next();
	},
	writeOperationReport(modules.reportModel),
	formResultErrorHandler(modules.logger),
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		formResultSuccessHandler(`/shop_products?categoryId=${req.query.fromCategoryId || ""}`)(req, res, next);
	}
];

/**
 * @param {modules} modules
 */
module.exports.edit = ({ localization, logger, i18n, shopModel }) => [
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
		const { id, fromCategoryId } = req.query;

		const title = {};
		const description = {};
		const itemTemplateIds = [];
		const boxItemIds = [];
		const boxItemCounts = [];

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

		const languages = getSupportedLanguagesByDirectory(path.join(__dirname, "../locales/shop"), localization);

		res.render("adminShopProductsEdit", {
			layout: "adminLayout",
			errors: null,
			moment,
			languages,
			categories,
			id,
			fromCategoryId,
			categoryId: product.get("categoryId"),
			price: product.get("price"),
			validAfter: moment(product.get("validAfter")),
			validBefore: moment(product.get("validBefore")),
			active: product.get("active"),
			sort: product.get("sort"),
			title,
			description,
			icon: product.get("icon"),
			rareGrade: product.get("rareGrade"),
			tag: product.get("tag"),
			tagValidAfter: product.get("tagValidAfter") ? moment(product.get("tagValidAfter")) : "",
			tagValidBefore: product.get("tagValidBefore") ? moment(product.get("tagValidBefore")) : "",
			discount: product.get("discount"),
			discountValidAfter: product.get("discountValidAfter") ? moment(product.get("discountValidAfter")) : "",
			discountValidBefore: product.get("discountValidBefore") ? moment(product.get("discountValidBefore")) : "",
			itemTemplateIds,
			boxItemIds,
			boxItemCounts,
			validate: 0
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.editAction = modules => [
	accessFunctionHandler,
	[
		query("id").notEmpty(),
		body("price")
			.isInt({ min: 0, max: 1e8 }).withMessage(modules.i18n.__("Price field must contain a valid number.")),
		body("sort")
			.isInt({ min: -1e8, max: 1e8 }).withMessage(modules.i18n.__("Sort field must contain the value as a number.")),
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
			.isInt({ min: 1, max: 1e8 }).withMessage(modules.i18n.__("Item template ID field has invalid value."))
			.custom(value => {
				if (value && !modules.datasheetModel.itemData.get(modules.i18n.getLocale())?.getOne(value)) {
					return Promise.reject(`${modules.i18n.__("A non-existent item has been added")}: ${value}`);
				}
				return true;
			})
			.custom((value, { req }) => {
				const itemTemplateIds = req.body.itemTemplateIds.filter((e, i) =>
					req.body.itemTemplateIds.lastIndexOf(e) == i && req.body.itemTemplateIds.indexOf(e) != i
				);

				return !itemTemplateIds.includes(value);
			})
			.withMessage(modules.i18n.__("Added item already exists.")),
		body("boxItemIds.*").optional({ checkFalsy: true })
			.isInt({ min: 1, max: 1e8 }).withMessage(modules.i18n.__("Service item ID field has invalid value.")),
		body("boxItemCounts.*")
			.isInt({ min: 1, max: 1e6 }).withMessage(modules.i18n.__("Count field has invalid value.")),
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
			.isLength({ max: 2048 }).withMessage(modules.i18n.__("Description must be between 1 and 2048 characters.")),
		body("tag").optional()
			.isIn(["", "0", "1", "2", "3"]).withMessage(modules.i18n.__("Tag field has invalid value.")),
		body("tagValidAfter").optional({ checkFalsy: true })
			.isISO8601().withMessage(modules.i18n.__("Tag valid from field must contain a valid date.")),
		body("tagValidBefore").optional({ checkFalsy: true })
			.isISO8601().withMessage(modules.i18n.__("Tag valid to field must contain a valid date.")),
		body("discount")
			.isInt({ min: 0, max: 100 }).withMessage(modules.i18n.__("Discount field must contain a valid number.")),
		body("discountValidAfter").optional({ checkFalsy: true })
			.isISO8601().withMessage(modules.i18n.__("Discount valid from field must contain a valid date.")),
		body("discountValidBefore").optional({ checkFalsy: true })
			.isISO8601().withMessage(modules.i18n.__("Discount valid to field must contain a valid date."))
	],
	formValidationHandler(modules.logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { id } = req.query;
		const { categoryId, validAfter, validBefore, active, price, sort,
			title, description, icon, rareGrade,
			tag, tagValidAfter, tagValidBefore,
			discount, discountValidAfter, discountValidBefore,
			itemTemplateIds, boxItemIds, boxItemCounts } = req.body;

		const serviceItem = new ServiceItem(modules);
		const resolvedItems = {};

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
			throw Error("Object not found");
		}

		if (itemTemplateIds) {
			itemTemplateIds.forEach(itemTemplateId =>
				resolvedItems[itemTemplateId] = modules.datasheetModel.strSheetItem.get(modules.i18n.getLocale())?.getOne(itemTemplateId)
			);
		}

		await modules.sequelize.transaction(async () => {
			const promises = [
				modules.shopModel.products.update({
					categoryId,
					active: active == "on",
					price,
					validAfter: moment.tz(validAfter, req.user.tz).toDate(),
					validBefore: moment.tz(validBefore, req.user.tz).toDate(),
					sort,
					icon: icon || null,
					rareGrade: rareGrade === "" ? null : rareGrade,
					tag: tag === "" ? null : tag,
					tagValidAfter: tagValidAfter ? moment.tz(tagValidAfter, req.user.tz).toDate() : null,
					tagValidBefore: tagValidBefore ? moment.tz(tagValidBefore, req.user.tz).toDate() : null,
					discount,
					discountValidAfter: discountValidAfter ? moment.tz(discountValidAfter, req.user.tz).toDate() : null,
					discountValidBefore: discountValidBefore ? moment.tz(discountValidBefore, req.user.tz).toDate() : null
				}, {
					where: { id: product.get("id") }
				})
			];

			product.get("item").forEach(productItem => {
				const itemTemplateId = productItem.get("itemTemplateId");
				const index = Object.keys(itemTemplateIds).find(k => itemTemplateIds[k] == itemTemplateId);

				if (itemTemplateIds[index]) {
					if (boxItemIds[index] != productItem.get("boxItemId") ||
						boxItemCounts[index] != productItem.get("boxItemCount")
					) {
						if (!resolvedItems[itemTemplateId]) return;

						promises.push(serviceItem.checkCreate(
							boxItemIds[index],
							itemTemplateId,
							resolvedItems[itemTemplateId].string,
							formatStrsheet(resolvedItems[itemTemplateId].toolTip),
							req.user.userSn || 0
						).then(boxItemId =>
							modules.shopModel.productItems.update({
								boxItemId,
								boxItemCount: boxItemCounts[index] || 1
							}, {
								where: { id: productItem.get("id") }
							})
						));
					}
				} else {
					promises.push(modules.shopModel.productItems.destroy({
						where: { id: productItem.get("id") }
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
							resolvedItems[itemTemplateId].string,
							formatStrsheet(resolvedItems[itemTemplateId].toolTip),
							req.user.userSn || 0
						).then(boxItemId =>
							modules.shopModel.productItems.create({
								productId: product.get("id"),
								itemTemplateId,
								boxItemId,
								boxItemCount: boxItemCounts[index] || 1
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
						}
					}));
				} else {
					promises.push(modules.shopModel.productStrings.destroy({
						where: {
							id: productString.get("id"),
							language
						}
					}));
				}
			});

			const languages = getSupportedLanguagesByDirectory(path.join(__dirname, "../locales/shop"), modules.localization);

			languages.forEach(language => {
				if (title[language] || description[language]) {
					promises.push(modules.shopModel.productStrings.create({
						productId: product.get("id"),
						title: title[language] || null,
						description: description[language] || null,
						language
					}, {
						ignoreDuplicates: true
					}));
				}
			});

			await Promise.all(promises);
		});

		next();
	},
	writeOperationReport(modules.reportModel),
	formResultErrorHandler(modules.logger),
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		formResultSuccessHandler(`/shop_products?categoryId=${req.query.fromCategoryId || ""}`)(req, res, next);
	}
];

/**
 * @param {modules} modules
 */
module.exports.editAllAction = modules => [
	accessFunctionHandler,
	expressLayouts,
	[
		body("price").optional({ checkFalsy: true })
			.isInt({ min: 0, max: 1e8 }).withMessage(modules.i18n.__("Price field must contain a valid number.")),
		body("sort").optional({ checkFalsy: true })
			.isInt({ min: -1e8, max: 1e8 }).withMessage(modules.i18n.__("Sort field must contain the value as a number.")),
		body("categoryId").optional({ checkFalsy: true })
			.custom((value, { req }) => modules.shopModel.categories.findOne({
				where: {
					id: req.body.categoryId || null
				}
			}).then(data => {
				if (!data) {
					return Promise.reject(modules.i18n.__("Category field must contain an existing category ID."));
				}
			})),
		body("validAfter").optional({ checkFalsy: true })
			.isISO8601().withMessage(modules.i18n.__("Valid from field must contain a valid date.")),
		body("validBefore").optional({ checkFalsy: true })
			.isISO8601().withMessage(modules.i18n.__("Valid to field must contain a valid date.")),
		body("active").optional({ checkFalsy: true })
			.isIn(["on", "off"]).withMessage(modules.i18n.__("Active field has invalid value."))
	],
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { id } = req.body;
		const { categoryId, validAfter, validBefore, price, sort, active, validate } = req.body;

		const errors = validationResultLog(req, modules.logger);

		const productIds = new Set(Array.isArray(id) ? id : [id]);

		if (productIds.size === 0) {
			throw Error("Object not found");
		}

		const products = await modules.shopModel.products.findAll({
			where: { id: { [Op.in]: Array.from(productIds) } }
		});

		if (products.length === 0) {
			throw Error("Object not found");
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

		if (validate && errors.isEmpty()) {
			await modules.shopModel.products.update({
				...categoryId !== "" ? { categoryId } : {},
				...validAfter !== "" ? { validAfter: moment.tz(validAfter, req.user.tz).toDate() } : {},
				...validBefore !== "" ? { validBefore: moment.tz(validBefore, req.user.tz).toDate() } : {},
				...price !== "" ? { price } : {},
				...sort !== "" ? { sort } : {},
				...active !== "" ? { active: active === "on" } : {}
			}, {
				where: { id: { [Op.in]: products.map(product => product.get("id")) } }
			});

			return next();
		}

		const categoryIdEqual = products.map(product => product.get("categoryId")).every((v, i, a) => v === a[0]);
		const validAfterEqual = products.map(product => product.get("validAfter").toString()).every((v, i, a) => v === a[0]);
		const validBeforeEqual = products.map(product => product.get("validBefore").toString()).every((v, i, a) => v === a[0]);
		const priceEqual = products.map(product => product.get("price")).every((v, i, a) => v === a[0]);
		const sortEqual = products.map(product => product.get("sort")).every((v, i, a) => v === a[0]);
		const activeEqual = products.map(product => product.get("active")).every((v, i, a) => v === a[0]);

		const languages = getSupportedLanguagesByDirectory(path.join(__dirname, "../locales/shop"), modules.localization);

		res.render("adminShopProductsEditAll", {
			layout: "adminLayout",
			errors: errors.array(),
			moment,
			languages,
			id,
			categories,
			categoryId: categoryIdEqual ? products[0].get("categoryId") : "",
			validAfter: validAfterEqual ? moment.tz(products[0].get("validAfter"), req.user.tz) : "",
			validBefore: validBeforeEqual ? moment.tz(products[0].get("validBefore"), req.user.tz) : "",
			price: priceEqual ? products[0].get("price") : "",
			sort: sortEqual ? products[0].get("sort") : "",
			active: activeEqual ? !!products[0].get("active") : ""
		});
	},
	writeOperationReport(modules.reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
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
		const id = req.query.id || req.body.id;
		const serviceItem = new ServiceItem(modules);

		const productIds = new Set(Array.isArray(id) ? id : [id]);

		if (productIds.size === 0) {
			throw Error("Object not found");
		}

		for (const productId of productIds) {
			await modules.sequelize.transaction(async () => {
				const promises = [
					modules.shopModel.products.destroy({
						where: { id: productId }
					}),
					modules.shopModel.productStrings.destroy({
						where: { productId }
					})
				];

				(await modules.shopModel.productItems.findAll({
					where: { productId }
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
							where: { id: productItem.get("id") }
						}));
					} else {
						promises.push(modules.shopModel.productItems.destroy({
							where: { id: productItem.get("id") }
						}));
					}
				});

				await Promise.all(promises);
			});
		}

		next();
	},
	writeOperationReport(modules.reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		res.redirect(`/shop_products?categoryId=${req.query.fromCategoryId || ""}`);
	}
];