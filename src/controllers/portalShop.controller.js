"use strict";

/**
 * @typedef {import("express").RequestHandler} RequestHandler
 * @typedef {import("express").ErrorRequestHandler} ErrorRequestHandler
 * @typedef {import("../app").modules} modules
 */

const moment = require("moment-timezone");
const Op = require("sequelize").Op;
const { query, body } = require("express-validator");

const helpers = require("../utils/helpers");
const PromoCodeActions = require("../actions/promoCode.actions");
const ItemClaim = require("../actions/handlers/itemClaim");
const ServiceItem = require("../utils/boxHelper").ServiceItem;
const ApiError = require("../lib/apiError");
const { validationHandler, authSessionHandler, shopStatusHandler } = require("../middlewares/portalShop.middlewares");

/**
 * @param {modules} modules
 */
module.exports.Auth = ({ passport }) => [
	shopStatusHandler,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		if (req.isAuthenticated()) {
			return res.redirect("ShopMain");
		}

		passport.authenticate("custom", (error, user) => {
			if (error) {
				return res.status(401).send(error);
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
	async (req, res, next) => {
		res.render("shopDisabled");
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
	async (req, res, next) => {
		res.render("shopMain");
	}
];

/**
 * @param {modules} modules
 */
module.exports.PartialMenuHtml = ({ i18n, logger, shopModel }) => [
	shopStatusHandler,
	authSessionHandler(logger),
	[query("active").optional().isNumeric()],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { active } = req.query;

		const categories = await shopModel.categories.findAll({
			where: { active: 1 },
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

		res.render("partials/shopMenu", { categories, active });
	}
];

/**
 * @param {modules} modules
 */
module.exports.PartialCatalogHtml = ({ i18n, logger, sequelize, shopModel, datasheetModel }) => [
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
	async (req, res, next) => {
		const { category, search } = req.body;

		if (search !== undefined && search.length < 3) {
			return res.render("partials/shopErrorSearch", {
				message: i18n.__("Enter a search keyword that is at least 3 letters long.")
			});
		}

		const products = new Map();
		const searchParts = search ? search.replace(/[-_+:\\"\\']/g, " ").split(" ") : [];

		const whereProduct = {
			active: 1,
			validAfter: { [Op.lt]: sequelize.fn("NOW") },
			validBefore: { [Op.gt]: sequelize.fn("NOW") },
			...category ? { categoryId: category } : {}
		};

		let whereSearch = {};

		if (searchParts.length !== 0) {
			const foundItems = datasheetModel.strSheetItem[i18n.getLocale()]?.findAll(search);

			const foundProducts = await shopModel.products.findAll({
				where: whereProduct,
				attributes: ["id"],
				include: [{
					as: "item",
					model: shopModel.productItems,
					attributes: ["itemTemplateId"],
					where: [
						{ itemTemplateId: { [Op.in]: foundItems.map(item => item.itemTemplateId) } }
					],
					required: true
				}]
			});

			whereSearch = {
				[Op.or]: [
					{ [Op.and]: searchParts.map(s => sequelize.where(sequelize.fn("lower", sequelize.col("strings.title")), Op.like, `%${s}%`)) },
					{ id: { [Op.in]: foundProducts.map(item => item.get("id")) } }
				]
			};
		}

		(await shopModel.products.findAll({
			where: { ...whereProduct, ...whereSearch },
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
			const productInfo = {
				price: product.get("price"),
				title: product.get("strings")[0]?.get("title"),
				description: product.get("strings")[0]?.get("description"),
				icon: product.get("icon"),
				rareGrade: product.get("rareGrade"),
				itemsCount: product.get("itemsCount"),
				itemCount: product.get("item").length
			};

			product.get("item").forEach(productItem => {
				const itemData = datasheetModel.itemData[i18n.getLocale()]?.getOne(productItem.get("itemTemplateId"));
				const strSheetItem = datasheetModel.strSheetItem[i18n.getLocale()]?.getOne(productItem.get("itemTemplateId"));

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

			if (productInfo.icon && (!search || (search && productInfo.title))) {
				products.set(product.get("id"), productInfo);
			}
		});

		res.render("partials/shopCatalog", { helpers, products, search: search || "" });
	}
];

/**
 * @param {modules} modules
 */
module.exports.PartialProductHtml = ({ i18n, logger, sequelize, shopModel, datasheetModel }) => [
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
	async (req, res, next) => {
		const { id, search, back } = req.body;

		const product = await shopModel.products.findOne({
			where: {
				id,
				active: 1,
				validAfter: { [Op.lt]: sequelize.fn("NOW") },
				validBefore: { [Op.gt]: sequelize.fn("NOW") }
			},
			include: [{
				as: "strings",
				model: shopModel.productStrings,
				where: { language: i18n.getLocale() },
				required: false
			}]
		});

		if (product === null) {
			return res.status(500).send();
		}

		const productObj = {
			id: product.get("id"),
			categoryId: product.get("categoryId"),
			price: product.get("price"),
			title: product.get("strings")[0]?.get("title"),
			description: product.get("strings")[0]?.get("description"),
			icon: product.get("icon"),
			rareGrade: product.get("rareGrade")
		};

		const productItems = await shopModel.productItems.findAll({
			where: { productId: product.get("id") },
			order: [
				["createdAt", "ASC"]
			]
		});

		if (productItems.length === 0) {
			return res.status(500).send();
		}

		const items = [];
		const conversions = [];

		productItems.forEach(item => {
			const itemData = datasheetModel.itemData[i18n.getLocale()]?.getOne(item.get("itemTemplateId"));
			const strSheetItem = datasheetModel.strSheetItem[i18n.getLocale()]?.getOne(item.get("itemTemplateId"));

			items.push({
				itemTemplateId: item.get("itemTemplateId"),
				boxItemId: item.get("boxItemId"),
				boxItemCount: item.get("boxItemCount"),
				icon: itemData?.icon,
				rareGrade: itemData?.rareGrade,
				string: strSheetItem?.string
			});

			const conversion = (datasheetModel.itemConversion[i18n.getLocale()]?.getOne(item.itemTemplateId) || [])
				.map(({ itemTemplateId }) => ({
					...datasheetModel.itemData[i18n.getLocale()]?.getOne(itemTemplateId) || {},
					...datasheetModel.strSheetItem[i18n.getLocale()]?.getOne(itemTemplateId) || {}
				}));

			conversions.push(...conversion);
		});

		const itemData = datasheetModel.itemData[i18n.getLocale()]?.getOne(items[0].itemTemplateId);
		const strSheetItem = datasheetModel.strSheetItem[i18n.getLocale()]?.getOne(items[0].itemTemplateId);

		if (!productObj.title) {
			productObj.title = strSheetItem.string;
		}

		if (!productObj.description) {
			productObj.description = strSheetItem.toolTip;
		}

		if (!productObj.icon) {
			productObj.icon = itemData.icon;
		}

		if (!productObj.rareGrade) {
			productObj.rareGrade = itemData.rareGrade;
		}

		productObj.requiredLevel = itemData.requiredLevel;
		productObj.requiredClass = itemData.requiredClass?.split(";") || [];
		productObj.requiredGender = itemData.requiredGender;
		productObj.requiredRace = (itemData.requiredRace?.split(";") || [])
			.map(race => (race === "popori" && productObj.requiredGender === "female" ? "elin" : race));

		productObj.tradable = itemData.tradable;
		productObj.warehouseStorable = itemData.warehouseStorable;

		res.render("partials/shopProduct", { helpers, product: productObj, items, conversions, search, back });
	}
];

/**
 * @param {modules} modules
 */
module.exports.PartialWelcomeHtml = ({ logger, accountModel, serverModel }) => [
	shopStatusHandler,
	authSessionHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const server = await serverModel.info.findOne({
			where: { serverId: req.user.lastLoginServer }
		});

		const benefits = await accountModel.benefits.findAll({
			where: { accountDBID: req.user.accountDBID }
		});

		res.render("partials/shopWelcome", {
			moment,
			server,
			benefits,
			shopConfig: helpers.requireReload("../../config/shop")
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.PartialPromoCodeHtml = ({ i18n, logger, shopModel }) => [
	shopStatusHandler,
	authSessionHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { tzOffset } = req.query;

		const promoCodesAcrivated = await shopModel.promoCodeActivated.findAll({
			where: { accountDBID: req.user.accountDBID },
			include: [
				{
					as: "info",
					model: shopModel.promoCodes
				},
				{
					as: "strings",
					model: shopModel.promoCodeStrings,
					where: { language: i18n.getLocale() },
					required: false
				}
			],
			order: [
				["createdAt", "DESC"]
			]
		});

		res.render("partials/shopPromoCode", { moment, promoCodesAcrivated, tzOffset: Number(tzOffset) });
	}
];

/**
 * @param {modules} modules
 */
module.exports.PartialErrorHtml = () => [
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		res.render("partials/shopError");
	}
];

/**
 * @param {modules} modules
 */
module.exports.GetAccountInfo = ({ logger, shopModel }) => [
	shopStatusHandler,
	authSessionHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const shopAccount = await shopModel.accounts.findOne({
			where: { accountDBID: req.user.accountDBID }
		});

		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success",
			userNo: req.user.accountDBID,
			userName: req.user.userName,
			shopBalance: shopAccount !== null ?
				shopAccount.get("balance") : 0
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.PurchaseAction = modules => [
	shopStatusHandler,
	authSessionHandler(modules.logger),
	[body("productId").notEmpty().isNumeric()],
	[body("quantity").notEmpty().isInt({ min: 1, max: 99 })],
	validationHandler(modules.logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { productId, quantity } = req.body;
		const serviceItem = new ServiceItem(modules);

		/*
		const payLog = await reportModel.shopPay.findOne({ // buying rate limits
			where: {
				accountDBID: req.user.accountDBID,
				status: "completed",
				updatedAt: { [Op.gt]: sequelize.literal("NOW() - INTERVAL 5 second") }
			}
		});

		if (payLog !== null) {
			throw new ApiError("denied", 1010);
		}
		*/

		const shopProduct = await modules.shopModel.products.findOne({
			where: {
				id: productId,
				active: 1,
				validAfter: { [Op.lt]: modules.sequelize.fn("NOW") },
				validBefore: { [Op.gt]: modules.sequelize.fn("NOW") }
			},
			include: [{
				as: "item",
				model: modules.shopModel.productItems
			}]
		});

		if (shopProduct === null) {
			throw new ApiError("product not exists", 2000);
		}

		let shopAccount = await modules.shopModel.accounts.findOne({
			where: { accountDBID: req.user.accountDBID, active: 1 }
		});

		if (shopAccount === null) {
			shopAccount = await modules.shopModel.accounts.create({
				accountDBID: req.user.accountDBID,
				balance: 0,
				active: true
			});
		}

		if (shopAccount.get("balance") < shopProduct.get("price") * quantity) {
			throw new ApiError("low balance", 1000);
		}

		const logResult = await modules.reportModel.shopPay.create({
			accountDBID: req.user.accountDBID,
			serverId: req.user.lastLoginServer,
			ip: req.user.lastLoginIP,
			productId: shopProduct.get("id"),
			quantity,
			price: shopProduct.get("price"),
			status: "deposit"
		});

		if (logResult === null) {
			throw new ApiError("internal error", 1);
		}

		const promises = [];
		const items = [];

		shopProduct.get("item").forEach(item => {
			const strSheetItem = modules.datasheetModel.strSheetItem[modules.i18n.getLocale()]?.getOne(item.get("itemTemplateId"));

			promises.push(serviceItem.checkCreate(
				item.get("boxItemId"),
				item.get("itemTemplateId"),
				strSheetItem?.string,
				helpers.formatStrsheet(strSheetItem?.toolTip),
				0
			).then(boxItemId => {
				items.push({
					item_id: boxItemId,
					item_count: item.get("boxItemCount") * quantity,
					item_template_id: item.get("itemTemplateId")
				});

				if (boxItemId != item.get("boxItemId")) {
					return modules.shopModel.productItems.update({ boxItemId }, {
						where: { id: item.get("id") }
					});
				}
			}));
		});

		await Promise.all(promises);

		if (items.length === 0) {
			throw new ApiError("items not exists", 3000);
		}

		await modules.shopModel.accounts.decrement({
			balance: shopProduct.get("price") * quantity
		}, {
			where: { accountDBID: shopAccount.get("accountDBID") }
		});

		// no awaiting
		modules.sequelize.transaction(async () => {
			const boxId = await (new ItemClaim(
				modules,
				req.user.accountDBID,
				req.user.lastLoginServer,
				{
					logType: 3,
					logId: logResult.get("id")
				}
			)).makeBox({
				title: modules.i18n.__("_box_title_"),
				content: modules.i18n.__("_box_content_"),
				icon: "GiftBox02.bmp",
				days: 3650,
				items
			});

			return await modules.reportModel.shopPay.update({
				boxId,
				status: "completed"
			}, {
				where: { id: logResult.get("id") }
			});
		}).catch(async err => {
			modules.logger.error(err);

			return modules.shopModel.accounts.increment({
				balance: shopProduct.get("price") * quantity
			}, {
				where: { accountDBID: shopAccount.get("accountDBID") }
			}).then(() =>
				modules.reportModel.shopPay.update({
					status: "rejected"
				}, {
					where: { id: logResult.get("id") }
				})
			);
		});

		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success"
		});
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
	async (req, res, next) => {
		const { promoCode } = req.body;

		const promocode = await modules.shopModel.promoCodes.findOne({
			attributes: [
				"promoCodeId",
				"function",
				"validAfter",
				"validBefore",
				"active",
				"currentActivations",
				"maxActivations",
				[modules.sequelize.fn("NOW"), "dateNow"]
			],
			where: {
				promoCode: promoCode,
				active: 1
			}
		});

		if (promocode === null) {
			throw new ApiError("invalid promocode", 1000);
		}

		if (moment(promocode.get("dateNow")).isBefore(promocode.get("validAfter")) ||
			moment(promocode.get("dateNow")).isAfter(promocode.get("validBefore"))
		) {
			throw new ApiError("expired promocode", 1001);
		}

		if (promocode.get("maxActivations") > 0 &&
			promocode.get("currentActivations") >= promocode.get("maxActivations")
		) {
			throw new ApiError("reached promocode", 1002);
		}

		const promocodeActivated = await modules.shopModel.promoCodeActivated.findOne({
			where: {
				accountDBID: req.user.accountDBID,
				promoCodeId: promocode.get("promoCodeId")
			}
		});

		if (promocodeActivated !== null) {
			throw new ApiError("invalid promocode", 1010);
		}

		await modules.sequelize.transaction(async () => {
			await modules.shopModel.promoCodeActivated.create({
				promoCodeId: promocode.get("promoCodeId"),
				accountDBID: req.user.accountDBID
			});

			await modules.shopModel.promoCodes.increment({
				currentActivations: 1
			}, {
				where: { promoCodeId: promocode.get("promoCodeId") }
			});
		});

		// no awaiting
		modules.sequelize.transaction(async () => {
			const actions = new PromoCodeActions(
				modules,
				req.user.lastLoginServer,
				req.user.accountDBID
			);

			return await actions.execute(promocode.get("function"), promocode.get("promoCodeId"));
		}).catch(err => {
			modules.logger.error(err);

			return modules.shopModel.promoCodeActivated.destroy({
				where: {
					promoCodeId: promocode.get("promoCodeId"),
					accountDBID: req.user.accountDBID
				}
			}).then(() => modules.shopModel.promoCodes.decrement({
				currentActivations: 1
			}, {
				where: { promoCodeId: promocode.get("promoCodeId") }
			}));
		});

		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success"
		});
	}
];