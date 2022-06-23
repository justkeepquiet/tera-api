"use strict";

const path = require("path");
const I18n = require("i18n").I18n;
const moment = require("moment-timezone");
const Op = require("sequelize").Op;
const jwt = require("jsonwebtoken");
const { query, body } = require("express-validator");
const logger = require("../utils/logger");
const helpers = require("../utils/helpers");
const fcgiHttpHelper = require("../utils/fcgiHttpHelper");
const boxHelper = require("../utils/boxHelper");
const accountModel = require("../models/account.model");
const shopModel = require("../models/shop.model");
const PromoCodeActions = require("../actions/promoCode.actions");

if (!process.env.API_PORTAL_LOCALE) {
	logger.error("Invalid configuration parameter: API_PORTAL_LOCALE");
	process.exit();
}

const i18n = new I18n({
	directory: path.resolve(__dirname, "../locales/shop"),
	defaultLocale: process.env.API_PORTAL_LOCALE
});

/**
 * @param {import("express").Response} res
 */
const result = (res, code, message, params = {}) => res.json({
	Return: code === 0, ReturnCode: code, Msg: message, ...params
});

/**
 * @type {import("express").RequestHandler}
 */
const validationHandler = (req, res, next) => {
	if (!helpers.validationResultLog(req).isEmpty()) {
		return res.send();
	}

	next();
};

/**
 * @type {import("express").RequestHandler}
 */
const authSessionHandler = (req, res, next) => {
	if (!/^true$/i.test(process.env.API_PORTAL_SHOP_ENABLE)) {
		return res.send();
	}

	try {
		const payload = jwt.verify(req.cookies.token, process.env.API_PORTAL_JWT_SECRET);

		accountModel.info.findOne({
			where: {
				accountDBID: payload.userNo
			}
		}).then(account => {
			if (account === null) {
				return res.send();
			}

			res.__account = account;
			next();
		}).catch(err => {
			logger.error(err.toString());
			res.send();
		});
	} catch (err) {
		logger.warn(err.toString());
		return res.send();
	}
};

/**
 * @type {import("express").RequestHandler}
 */
const i18nHandler = (req, res, next) => {
	res.locals.__ = i18n.__;
	return next();
};

module.exports.Auth = [
	i18nHandler,
	[query("authKey").notEmpty()],
	validationHandler,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		const { authKey } = req.query;

		accountModel.info.findOne({ where: { authKey } }).then(account => {
			if (account === null) {
				return res.send();
			}

			const token = jwt.sign({ userNo: account.get("accountDBID") }, process.env.API_PORTAL_JWT_SECRET, {
				algorithm: "HS256",
				expiresIn: 3600
			});

			res.cookie("token", token, { maxAge: 3600 * 1000 });
			res.redirect("ShopMain");
		}).catch(err => {
			logger.error(err.toString());
			res.send();
		});
	}
];

module.exports.MainHtml = [
	i18nHandler,
	validationHandler,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		res.render("shopMain");
	}
];

module.exports.PartialMenuHtml = [
	i18nHandler,
	authSessionHandler,
	[query("active").isNumeric().optional()],
	validationHandler,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		const { active } = req.query;

		shopModel.categories.belongsTo(shopModel.categoryStrings, { foreignKey: "id" });
		shopModel.categories.hasOne(shopModel.categoryStrings, { foreignKey: "categoryId" });

		shopModel.categories.findAll({
			where: { active: 1 },
			include: [{
				model: shopModel.categoryStrings,
				where: { language: i18n.getLocale() },
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
		}).then(categories => {
			if (categories === null) {
				return res.send();
			}

			res.render("partials/shopMenu", { categories, active });
		}).catch(err => {
			logger.error(err.toString());
			res.send();
		});
	}
];

module.exports.PartialCatalogHtml = [
	i18nHandler,
	authSessionHandler,
	[body("category").optional().isNumeric()],
	[body("search").optional().trim().isLength({ max: 128 })],
	validationHandler,
	/**
	 * @type {import("express").RequestHandler}
	 */
	async (req, res) => {
		const { category, search } = req.body;

		if (search !== undefined && search.length < 3) {
			return res.render("partials/shopErrorSearch", {
				message: i18n.__("Enter a search keyword that is at least 3 letters long.")
			});
		}

		shopModel.products.belongsTo(shopModel.productStrings, { foreignKey: "id" });
		shopModel.products.hasOne(shopModel.productStrings, { foreignKey: "productId" });

		shopModel.products.findAll({
			where: {
				...category ? { categoryId: category } : {},
				active: 1,
				validAfter: { [Op.lt]: shopModel.sequelize.fn("NOW") },
				validBefore: { [Op.gt]: shopModel.sequelize.fn("NOW") }
			},
			include: [{
				model: shopModel.productStrings,
				where: {
					...search ? { title: { [Op.like]: `%${search}%` } } : {},
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
		}).then(async products => {
			if (products === null) {
				return res.send();
			}

			const promises = [];
			const productsMap = new Map();

			shopModel.productItems.belongsTo(shopModel.itemTemplates, { foreignKey: "itemTemplateId" });
			shopModel.itemTemplates.hasOne(shopModel.itemStrings, { foreignKey: "itemTemplateId" });

			products.forEach(product => {
				productsMap.set(product.get("id"), {
					price: product.get("price"),
					title: product.get("title"),
					description: product.get("description"),
					icon: product.get("icon"),
					rareGrade: product.get("rareGrade"),
					itemCount: null
				});

				return promises.push(shopModel.productItems.findOne({
					where: { productId: product.get("id") },
					include: [{
						model: shopModel.itemTemplates,
						include: [{
							model: shopModel.itemStrings,
							where: {
								...search && !product.get("title") ? { string: { [Op.like]: `%${search}%` } } : {},
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
					}
				}));
			});

			const productItemsAssoc = await Promise.all(promises);

			if (productItemsAssoc !== null) {
				for (const productItem of productItemsAssoc) {
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

						if (!product.rareGrade) {
							product.rareGrade = productItem.get("rareGrade");
						}

						if (!product.itemCount) {
							product.itemCount = productItem.get("boxItemCount");
						}
					}

					// Remove unresolved products
					if (!product.icon || !product.title || !product.description) {
						productsMap.delete(productItem.get("productId"));
					}
				}
			}

			res.render("partials/shopCatalog", { products: productsMap, search: search || "" });
		}).catch(err => {
			logger.error(err.toString());
			res.send();
		});
	}
];

module.exports.PartialProductHtml = [
	i18nHandler,
	authSessionHandler,
	[body("id").isNumeric()],
	[body("search").optional()],
	validationHandler,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		const { id, search } = req.body;

		shopModel.products.belongsTo(shopModel.productStrings, { foreignKey: "id" });
		shopModel.products.hasOne(shopModel.productStrings, { foreignKey: "productId" });

		shopModel.products.findOne({
			where: {
				id,
				active: 1,
				validAfter: { [Op.lt]: shopModel.sequelize.fn("NOW") },
				validBefore: { [Op.gt]: shopModel.sequelize.fn("NOW") }
			},
			include: [{
				model: shopModel.productStrings,
				where: { language: i18n.getLocale() },
				attributes: [],
				required: false
			}],
			attributes: {
				include: [
					[shopModel.productStrings.sequelize.col("title"), "title"],
					[shopModel.productStrings.sequelize.col("description"), "description"]
				]
			}
		}).then(async product => {
			if (product === null) {
				return res.send();
			}

			const productObj = {
				id: product.get("id"),
				categoryId: product.get("categoryId"),
				price: product.get("price"),
				title: product.get("title"),
				description: product.get("description"),
				icon: product.get("icon"),
				rareGrade: product.get("rareGrade")
			};

			shopModel.productItems.belongsTo(shopModel.itemTemplates, { foreignKey: "itemTemplateId" });
			shopModel.itemTemplates.hasOne(shopModel.itemStrings, { foreignKey: "itemTemplateId" });

			return shopModel.productItems.findAll({
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
						[shopModel.itemTemplates.sequelize.col("requiredLevel"), "requiredLevel"],
						[shopModel.itemTemplates.sequelize.col("requiredClass"), "requiredClass"],
						[shopModel.itemTemplates.sequelize.col("requiredGender"), "requiredGender"],
						[shopModel.itemTemplates.sequelize.col("requiredRace"), "requiredRace"],
						[shopModel.itemTemplates.sequelize.col("tradable"), "tradable"],
						[shopModel.itemTemplates.sequelize.col("warehouseStorable"), "warehouseStorable"],
						[shopModel.itemTemplates.sequelize.col("icon"), "icon"],
						[shopModel.itemStrings.sequelize.col("string"), "string"],
						[shopModel.itemStrings.sequelize.col("toolTip"), "toolTip"]
					]
				}
			}).then(async items => {
				if (items === null) {
					return res.send();
				}

				const promises = [];

				items.forEach(async item => {
					shopModel.itemConversions.belongsTo(shopModel.itemTemplates, { foreignKey: "fixedItemTemplateId" });
					shopModel.itemTemplates.hasOne(shopModel.itemStrings, { foreignKey: "itemTemplateId" });

					promises.push(shopModel.itemConversions.findAll({
						where: { itemTemplateId: item.get("itemTemplateId") },
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
								[shopModel.itemTemplates.sequelize.col("icon"), "icon"],
								[shopModel.itemTemplates.sequelize.col("rareGrade"), "rareGrade"],
								[shopModel.itemStrings.sequelize.col("string"), "string"],
								[shopModel.itemStrings.sequelize.col("toolTip"), "toolTip"]
							]
						}
					}));
				});

				const firstItem = items[0];
				const ItemConversionsAssoc = await Promise.all(promises);
				const conversions = [];

				for (const ItemConversionAssoc of ItemConversionsAssoc) {
					ItemConversionAssoc.forEach(conversion => conversions.push(conversion));
				}

				if (!productObj.title) {
					productObj.title = firstItem.get("string");
				}

				if (!productObj.description) {
					productObj.description = firstItem.get("toolTip");
				}

				if (!productObj.icon) {
					productObj.icon = firstItem.get("icon");
				}

				if (!productObj.rareGrade) {
					productObj.rareGrade = firstItem.get("rareGrade");
				}

				productObj.requiredLevel = firstItem.get("requiredLevel");
				productObj.requiredClass = firstItem.get("requiredClass")?.split(";") || [];
				productObj.requiredGender = firstItem.get("requiredGender");
				productObj.requiredRace = (firstItem.get("requiredRace")?.split(";") || [])
					.map(race => (race === "popori" && productObj.requiredGender === "female" ? "elin" : "popori"));

				productObj.tradable = firstItem.get("tradable");
				productObj.warehouseStorable = firstItem.get("warehouseStorable");

				res.render("partials/shopProduct", { product: productObj, items, conversions, search });
			});
		}).catch(err => {
			logger.error(err.toString());
			res.send();
		});
	}
];

module.exports.PartialWelcomeHtml = [
	i18nHandler,
	authSessionHandler,
	/**
	 * @type {import("express").RequestHandler}
	 */
	async (req, res) => {
		try {
			const server = await accountModel.serverInfo.findOne({
				where: { serverId: res.__account.get("lastLoginServer") }
			});

			const benefitsData = await accountModel.benefits.findAll({
				where: { accountDBID: res.__account.get("accountDBID") }
			});

			if (server === null || benefitsData === null) {
				return res.send();
			}

			const benefits = {};
			for (const benefitData of benefitsData) {
				benefits[benefitData.get("benefitId")] = benefitData.get("availableUntil");
			}

			res.render("partials/shopWelcome", { moment, server, benefits });
		} catch (err) {
			console.log(err);
			logger.error(err.toString());
			res.send();
		}
	}
];

module.exports.PartialPromoCodeHtml = [
	i18nHandler,
	authSessionHandler,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		shopModel.promoCodeActivated.belongsTo(shopModel.promoCodes, { foreignKey: "promoCodeId" });
		shopModel.promoCodes.hasOne(shopModel.promoCodeStrings, { foreignKey: "promoCodeId" });

		return shopModel.promoCodeActivated.findAll({
			where: { accountDBID: res.__account.get("accountDBID") },
			include: [{
				model: shopModel.promoCodes,
				include: [{
					model: shopModel.promoCodeStrings,
					where: { language: i18n.getLocale() },
					attributes: [],
					required: false
				}],
				attributes: []
			}],
			attributes: {
				include: [
					[shopModel.itemStrings.sequelize.col("promoCode"), "promoCode"],
					[shopModel.itemStrings.sequelize.col("description"), "description"]
				]
			},
			order: [
				["createdAt", "DESC"]
			]
		}).then(promoCodesAcrivated => {
			res.render("partials/shopPromoCode", { moment, promoCodesAcrivated });
		}).catch(err => {
			logger.error(err.toString());
			res.send();
		});
	}
];

module.exports.PartialErrorHtml = [
	i18nHandler,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		res.render("partials/shopError");
	}
];

module.exports.GetAccountInfo = [
	i18nHandler,
	authSessionHandler,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		shopModel.accounts.findOne({
			where: { accountDBID: res.__account.get("accountDBID") }
		}).then(shopAccount =>
			result(res, 0, "success", {
				userNo: res.__account.get("accountDBID"),
				userName: res.__account.get("userName"),
				shopBalance: shopAccount !== null ?
					shopAccount.get("balance") : 0
			})
		).catch(err => {
			logger.error(err.toString());
			result(res, 1, "internal error");
		});
	}
];

module.exports.PurchaseAction = [
	i18nHandler,
	authSessionHandler,
	[body("productId").notEmpty().isNumeric()],
	validationHandler,
	/**
	 * @type {import("express").RequestHandler}
	 */
	async (req, res) => {
		const { productId } = req.body;

		if (!fcgiHttpHelper.isEnabled()) {
			return result(res, 2, "fcgi_gw api not configured");
		}

		try {
			/*
			const payLog = await shopModel.payLogs.findOne({ // buying rate limits
				where: {
					accountDBID: res.__account.get("accountDBID"),
					status: "completed",
					updatedAt: { [Op.gt]: shopModel.sequelize.literal("NOW() - INTERVAL 5 second") }
				}
			});

			if (payLog !== null) {
				return result(res, 1010, "denied");
			}
			*/

			const items = [];
			const shopProduct = await shopModel.products.findOne({
				where: {
					id: productId,
					active: 1,
					validAfter: { [Op.lt]: shopModel.sequelize.fn("NOW") },
					validBefore: { [Op.gt]: shopModel.sequelize.fn("NOW") }
				}
			});

			if (shopProduct === null) {
				return result(res, 2000, "product not exists");
			}

			const shopProductItems = await shopModel.productItems.findAll({
				where: { productId: shopProduct.get("id") }
			});

			if (shopProductItems === null) {
				return result(res, 3000, "items not exists");
			}

			shopProductItems.forEach(item =>
				items.push({
					item_id: item.get("boxItemId"),
					item_count: item.get("boxItemCount")
				})
			);

			if (items.length === 0) {
				return result(res, 3000, "items not exists");
			}

			const shopAccount = await shopModel.accounts.findOne({
				where: { accountDBID: res.__account.get("accountDBID"), active: 1 }
			});

			if (shopAccount === null || shopAccount.get("balance") < shopProduct.get("price")) {
				return result(res, 1000, "low balance");
			}

			const logResult = await shopModel.payLogs.create({
				accountDBID: res.__account.get("accountDBID"),
				serverId: res.__account.get("lastLoginServer"),
				ip: res.__account.get("lastLoginIP"),
				productId: shopProduct.get("id"),
				price: shopProduct.get("price"),
				status: "deposit"
			});

			if (logResult === null) {
				return result(res, 1, "internal error");
			}

			await shopModel.sequelize.transaction(async transaction => {
				await shopModel.accounts.decrement({
					balance: shopProduct.get("price")
				}, {
					where: { accountDBID: shopAccount.get("accountDBID") },
					transaction
				});

				const boxResult = await boxHelper.makeBox(
					{
						title: i18n.__("_box_title_"),
						content: i18n.__("_box_content_"),
						icon: "GiftBox02.bmp",
						days: 3650,
						items
					},
					logResult.get("id"),
					res.__account.get("lastLoginServer"),
					res.__account.get("accountDBID")
				);

				return await shopModel.payLogs.update({
					boxId: boxResult.box_id,
					status: "completed"
				}, {
					where: { id: logResult.get("id") }
				});
			});

			result(res, 0);
		} catch (err) {
			logger.error(err.toString());
			result(res, 1, "internal error");
		}
	}
];

module.exports.PromoCodeAction = [
	i18nHandler,
	authSessionHandler,
	[body("promoCode").trim().notEmpty()],
	validationHandler,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		const { promoCode } = req.body;

		return shopModel.promoCodes.findOne({
			where: {
				promoCode: promoCode,
				active: 1,
				validAfter: { [Op.lt]: shopModel.sequelize.fn("NOW") },
				validBefore: { [Op.gt]: shopModel.sequelize.fn("NOW") }
			}
		}).then(promocode => {
			if (promocode === null) {
				return result(res, 1000, { msg: "invalid promocode" });
			}

			return shopModel.promoCodeActivated.findOne({
				where: {
					accountDBID: res.__account.get("accountDBID"),
					promoCodeId: promocode.get("promoCodeId")
				}
			}).then(promocodeActivated => {
				if (promocodeActivated !== null) {
					return result(res, 1010, { msg: "invalid promocode" });
				}

				const actions = new PromoCodeActions(
					res.__account.get("lastLoginServer"),
					res.__account.get("accountDBID")
				);

				return actions.execute(promocode.get("function"), promoCode).then(() =>
					shopModel.promoCodeActivated.create({
						promoCodeId: promocode.get("promoCodeId"),
						accountDBID: res.__account.get("accountDBID")
					})
				).then(() =>
					result(res, 0, "success")
				);
			});
		}).catch(err => {
			logger.error(err.toString());
			result(res, 1, { msg: "internal error" });
		});
	}
];