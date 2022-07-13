"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const moment = require("moment-timezone");
const Op = require("sequelize").Op;
const { query, body } = require("express-validator");
const helpers = require("../utils/helpers");
const PromoCodeActions = require("../actions/promoCode.actions");

const { validationHandler, authSessionHandler, shopStatusHandler, resultJson } = require("../middlewares/portalShop.middlewares");

/**
 * @param {modules} modules
 */
module.exports.Auth = ({ passport }) => [
	shopStatusHandler,
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		if (req.isAuthenticated()) {
			return res.redirect("ShopMain");
		}

		passport.authenticate("custom", (error, user) => {
			if (error) {
				return res.send(error);
			}

			req.login(user, () => {
				res.redirect("ShopMain");
			});
		})(req, res, next);
	}
];

/**
 * @param {modules} modules
 */
module.exports.DisabledHtml = () => [
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		res.send("TERA Shop is currently disabled.");
	}
];

/**
 * @param {modules} modules
 */
module.exports.MainHtml = () => [
	shopStatusHandler,
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		res.render("shopMain");
	}
];

/**
 * @param {modules} modules
 */
module.exports.PartialMenuHtml = ({ i18n, logger, accountModel, shopModel }) => [
	shopStatusHandler,
	authSessionHandler(logger),
	[query("active").isNumeric().optional()],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
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
				return res.status(500).send();
			}

			res.render("partials/shopMenu", { categories, active });
		}).catch(err => {
			logger.error(err);
			res.status(500).send();
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.PartialCatalogHtml = ({ i18n, logger, accountModel, shopModel }) => [
	shopStatusHandler,
	authSessionHandler(logger),
	[
		body("category").optional().isNumeric(),
		body("search").optional().trim().isLength({ max: 128 })
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
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
					[
						shopModel.sequelize.literal(`(
							SELECT COUNT(*)
							FROM shop_product_items AS shop_product_item
							WHERE
								shop_product_item.productId = shop_products.id
						)`),
						"itemsCount"
					],
					[shopModel.productStrings.sequelize.col("title"), "title"],
					[shopModel.productStrings.sequelize.col("description"), "description"]
				]
			},
			order: [
				["sort", "DESC"]
			]
		}).then(products => {
			if (products === null) {
				return res.status(500).send();
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
					itemsCount: product.get("itemsCount"),
					itemCount: null
				});

				promises.push(shopModel.productItems.findOne({
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
					},
					order: [
						["createdAt", "ASC"]
					]
				}));
			});

			return Promise.all(promises).then(productItemsAssoc => {
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

						// Remove unresolved products
						if (!product.icon || (!product.title && !product.description)) {
							productsMap.delete(productItem.get("productId"));
						}
					}
				}

				res.render("partials/shopCatalog", { helpers, products: productsMap, search: search || "" });
			});
		}).catch(err => {
			logger.error(err);
			res.status(500).send();
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.PartialProductHtml = ({ i18n, logger, accountModel, shopModel }) => [
	shopStatusHandler,
	authSessionHandler(logger),
	[
		body("id").isNumeric(),
		body("search").optional()
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		const { id, search, scroll, back } = req.body;

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
				return res.status(500).send();
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
				},
				order: [
					["createdAt", "ASC"]
				]
			}).then(async items => {
				if (items === null) {
					return res.status(500).send();
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

				res.render("partials/shopProduct", { helpers, product: productObj, items, conversions, search, scroll, back });
			});
		}).catch(err => {
			logger.error(err);
			res.status(500).send();
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.PartialWelcomeHtml = ({ logger, accountModel }) => [
	shopStatusHandler,
	authSessionHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res) => {
		try {
			const server = await accountModel.serverInfo.findOne({
				where: { serverId: req.user.lastLoginServer }
			});

			const benefitsData = await accountModel.benefits.findAll({
				where: { accountDBID: req.user.accountDBID }
			});

			if (server === null || benefitsData === null) {
				return res.status(500).send();
			}

			const benefits = {};
			for (const benefitData of benefitsData) {
				benefits[benefitData.get("benefitId")] = benefitData.get("availableUntil");
			}

			const carousel = helpers.requireReload("../../config/shop").welcomeCarousel;

			res.render("partials/shopWelcome", { moment, server, benefits, carousel });
		} catch (err) {
			logger.error(err);
			res.status(500).send();
		}
	}
];

/**
 * @param {modules} modules
 */
module.exports.PartialPromoCodeHtml = ({ i18n, logger, accountModel, shopModel }) => [
	shopStatusHandler,
	authSessionHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		const { tzOffset } = req.query;

		shopModel.promoCodeActivated.belongsTo(shopModel.promoCodes, { foreignKey: "promoCodeId" });
		shopModel.promoCodes.hasOne(shopModel.promoCodeStrings, { foreignKey: "promoCodeId" });

		return shopModel.promoCodeActivated.findAll({
			where: { accountDBID: req.user.accountDBID },
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
			res.render("partials/shopPromoCode", { moment, promoCodesAcrivated, tzOffset: Number(tzOffset) });
		}).catch(err => {
			logger.error(err);
			res.status(500).send();
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.PartialErrorHtml = () => [
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		res.render("partials/shopError");
	}
];

/**
 * @param {modules} modules
 */
module.exports.GetAccountInfo = ({ logger, accountModel, shopModel }) => [
	shopStatusHandler,
	authSessionHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		shopModel.accounts.findOne({
			where: { accountDBID: req.user.accountDBID }
		}).then(shopAccount =>
			resultJson(res, 0, "success", {
				userNo: req.user.accountDBID,
				userName: req.user.userName,
				shopBalance: shopAccount !== null ?
					shopAccount.get("balance") : 0
			})
		).catch(err => {
			logger.error(err);
			resultJson(res, 1, "internal error");
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.PurchaseAction = ({ i18n, logger, fcgi, reportModel, shopModel }) => [
	shopStatusHandler,
	authSessionHandler(logger),
	[body("productId").notEmpty().isNumeric()],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res) => {
		const { productId } = req.body;

		if (!/^true$/i.test(process.env.FCGI_GW_WEBAPI_ENABLE)) {
			return resultJson(res, 2, "fcgi is not configured");
		}

		try {
			/*
			const payLog = await reportModel.shopPay.findOne({ // buying rate limits
				where: {
					accountDBID: req.user.accountDBID"),
					status: "completed",
					updatedAt: { [Op.gt]: shopModel.sequelize.literal("NOW() - INTERVAL 5 second") }
				}
			});

			if (payLog !== null) {
				return resultJson(res, 1010, "denied");
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
				return resultJson(res, 2000, "product not exists");
			}

			const shopProductItems = await shopModel.productItems.findAll({
				where: { productId: shopProduct.get("id") }
			});

			if (shopProductItems === null) {
				return resultJson(res, 3000, "items not exists");
			}

			shopProductItems.forEach(item =>
				items.push({
					item_id: item.get("boxItemId"),
					item_count: item.get("boxItemCount")
				})
			);

			if (items.length === 0) {
				return resultJson(res, 3000, "items not exists");
			}

			const shopAccount = await shopModel.accounts.findOne({
				where: { accountDBID: req.user.accountDBID, active: 1 }
			});

			if (shopAccount === null || shopAccount.get("balance") < shopProduct.get("price")) {
				return resultJson(res, 1000, "low balance");
			}

			const logResult = await reportModel.shopPay.create({
				accountDBID: req.user.accountDBID,
				serverId: req.user.lastLoginServer,
				ip: req.user.lastLoginIP,
				productId: shopProduct.get("id"),
				price: shopProduct.get("price"),
				status: "deposit"
			});

			if (logResult === null) {
				return resultJson(res, 1, "internal error");
			}

			await shopModel.sequelize.transaction(async transaction => {
				await shopModel.accounts.decrement({
					balance: shopProduct.get("price")
				}, {
					where: { accountDBID: shopAccount.get("accountDBID") },
					transaction
				});

				const boxResult = await fcgi.makeBox(
					req.user.lastLoginServer,
					req.user.accountDBID,
					0,
					logResult.get("id"),
					{
						title: i18n.__("_box_title_"),
						content: i18n.__("_box_content_"),
						icon: "GiftBox02.bmp",
						days: 3650,
						items
					}
				);

				return await reportModel.shopPay.update({
					boxId: boxResult.box_id,
					status: "completed"
				}, {
					where: { id: logResult.get("id") }
				});
			});

			resultJson(res, 0);
		} catch (err) {
			logger.error(err);
			resultJson(res, 1, "internal error");
		}
	}
];

/**
 * @param {modules} modules
 */
module.exports.PromoCodeAction = modules => [
	shopStatusHandler,
	authSessionHandler(modules.logger, modules.accountModel),
	[body("promoCode").trim().notEmpty()],
	validationHandler(modules.logger),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		const { promoCode } = req.body;

		return modules.shopModel.promoCodes.findOne({
			where: {
				promoCode: promoCode,
				active: 1,
				validAfter: { [Op.lt]: modules.shopModel.sequelize.fn("NOW") },
				validBefore: { [Op.gt]: modules.shopModel.sequelize.fn("NOW") }
			}
		}).then(promocode => {
			if (promocode === null) {
				return resultJson(res, 1000, { msg: "invalid promocode" });
			}

			return modules.shopModel.promoCodeActivated.findOne({
				where: {
					accountDBID: req.user.accountDBID,
					promoCodeId: promocode.get("promoCodeId")
				}
			}).then(promocodeActivated => {
				if (promocodeActivated !== null) {
					return resultJson(res, 1010, { msg: "invalid promocode" });
				}

				const actions = new PromoCodeActions(
					modules,
					req.user.lastLoginServer,
					req.user.accountDBID
				);

				return actions.execute(promocode.get("function"), promoCode).then(() =>
					modules.shopModel.promoCodeActivated.create({
						promoCodeId: promocode.get("promoCodeId"),
						accountDBID: req.user.accountDBID
					})
				).then(() =>
					resultJson(res, 0, "success")
				);
			});
		}).catch(err => {
			modules.logger.error(err);
			resultJson(res, 1, { msg: "internal error" });
		});
	}
];