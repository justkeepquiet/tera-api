"use strict";

/**
 * @typedef {import("express").RequestHandler} RequestHandler
 * @typedef {import("express").ErrorRequestHandler} ErrorRequestHandler
 * @typedef {import("../app").modules} modules
 */

const moment = require("moment-timezone");
const Op = require("sequelize").Op;
const { query, body } = require("express-validator");

const ApiError = require("../lib/apiError");
const PromoCodeActions = require("../actions/promoCode.actions");
const ItemClaim = require("../actions/handlers/itemClaim");
const ServiceItem = require("../utils/boxHelper").ServiceItem;
const helpers = require("../utils/helpers");

const {
	validationHandler,
	authSessionHandler,
	shopStatusHandler,
	rateLimitterHandler
} = require("../middlewares/portalShop.middlewares");

/**
 * @type {Map<number, Map<number, object>>}
 */
const lockedCoupons = new Map(); // <couponId, accounts>

const lockLockedCoupon = (req, couponId, expiriesTime) => {
	if (!lockedCoupons.has(couponId)) {
		lockedCoupons.set(couponId, new Map()); // <accountDBID, params>
	}

	lockedCoupons.get(couponId).set(req.user.accountDBID, {
		accountDBID: req.user.accountDBID,
		expiriesTime
	});
};

const unlockLockedCoupon = req => {
	if (!req.session.lastProduct) {
		return;
	}

	const lockedCoupon = lockedCoupons.get(req.session.lastProduct.couponId);

	if (lockedCoupon) {
		lockedCoupon.delete(req.user.accountDBID);
	}
};

const checkLockedCoupon = (req, couponId, maxActivations, currentActivations) => {
	const lockedCoupon = lockedCoupons.get(couponId);

	if (lockedCoupon) {
		lockedCoupon.forEach((coupon, accountDBID) => {
			// delete expired
			if (coupon.expiriesTime < Date.now() || accountDBID === req.user.accountDBID) {
				lockedCoupon.delete(accountDBID);
			}
		});

		if (maxActivations === 0) {
			return false;
		}

		return lockedCoupon.size >= (maxActivations - currentActivations);
	}

	return false;
};

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
			return res.redirect("Main");
		}

		passport.authenticate("custom", (error, user) => {
			if (error) {
				return res.status(401).send(error);
			}

			req.login(user, () => {
				res.redirect("Main");
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
		unlockLockedCoupon(req);
		req.session.lastProduct = undefined;

		res.render("shopMain");
	}
];

/**
 * @param {modules} modules
 */
module.exports.PartialMenuHtml = ({ i18n, logger, shopModel }) => [
	shopStatusHandler,
	authSessionHandler(logger),
	[query("active").optional().trim().isNumeric()],
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
	},
	/**
	 * @type {ErrorRequestHandler}
	 */
	(err, req, res, next) => {
		logger.error(err);
		res.render("partials/shopError");
	}
];

/**
 * @param {modules} modules
 */
module.exports.PartialCatalogHtml = ({ i18n, logger, sequelize, shopModel, datasheetModel }) => [
	shopStatusHandler,
	authSessionHandler(logger),
	[
		body("category").optional().trim().isNumeric(),
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
			const foundItems = datasheetModel.strSheetItem.get(i18n.getLocale())?.findAll(search);

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

		const shopProducts = await shopModel.products.findAll({
			where: { ...whereProduct, ...whereSearch },
			attributes: {
				include: [[sequelize.fn("NOW"), "dateNow"]]
			},
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
		});

		shopProducts.forEach(shopProduct => {
			let finalPrice = shopProduct.get("price");
			let productDiscount = 0;

			if (shopProduct.get("discount") > 0 &&
				shopProduct.get("discountValidAfter") &&
				shopProduct.get("discountValidBefore") &&
				moment(shopProduct.get("dateNow")).isSameOrAfter(shopProduct.get("discountValidAfter")) &&
				moment(shopProduct.get("dateNow")).isSameOrBefore(shopProduct.get("discountValidBefore"))
			) {
				productDiscount = shopProduct.get("discount");
				finalPrice = helpers.subtractPercentage(finalPrice, shopProduct.get("discount"));
			}

			let tag = null;

			if (shopProduct.get("tag") !== null &&
				shopProduct.get("tagValidAfter") &&
				shopProduct.get("tagValidBefore") &&
				moment(shopProduct.get("dateNow")).isSameOrAfter(shopProduct.get("tagValidAfter")) &&
				moment(shopProduct.get("dateNow")).isSameOrBefore(shopProduct.get("tagValidBefore"))
			) {
				tag = shopProduct.get("tag");
			}

			const productInfo = {
				price: finalPrice,
				productDiscount: productDiscount,
				title: shopProduct.get("strings")[0]?.get("title"),
				description: shopProduct.get("strings")[0]?.get("description"),
				icon: shopProduct.get("icon"),
				rareGrade: shopProduct.get("rareGrade"),
				tag,
				itemsCount: shopProduct.get("itemsCount"), // TODO
				itemCount: shopProduct.get("item").length
			};

			shopProduct.get("item").forEach(productItem => {
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

			if (productInfo.icon && (!search || (search && productInfo.title))) {
				products.set(shopProduct.get("id"), productInfo);
			}
		});

		unlockLockedCoupon(req);
		req.session.lastProduct = undefined;

		res.render("partials/shopCatalog", { helpers, products, search: search || "" });
	},
	/**
	 * @type {ErrorRequestHandler}
	 */
	(err, req, res, next) => {
		logger.error(err);
		res.render("partials/shopError");
	}
];

/**
 * @param {modules} modules
 */
module.exports.PartialProductHtml = ({ i18n, logger, sequelize, shopModel, datasheetModel }) => [
	shopStatusHandler,
	authSessionHandler(logger),
	[
		body("id").trim().isNumeric(),
		body("search").optional().trim()
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { id, search, back } = req.body;

		const shopProduct = await shopModel.products.findOne({
			where: {
				id,
				active: 1,
				validAfter: { [Op.lt]: sequelize.fn("NOW") },
				validBefore: { [Op.gt]: sequelize.fn("NOW") }
			},
			attributes: {
				include: [[sequelize.fn("NOW"), "dateNow"]]
			},
			include: [{
				as: "strings",
				model: shopModel.productStrings,
				where: { language: i18n.getLocale() },
				required: false
			}]
		});

		if (shopProduct === null) {
			return res.status(500).send();
		}

		const shopAccount = await shopModel.accounts.findOne({
			where: { accountDBID: req.user.accountDBID }
		});

		let accountDiscount = 0;
		if (shopAccount !== null) {
			accountDiscount = shopAccount.get("discount");
		}

		let productDiscount = 0;
		if (shopProduct.get("discount") > 0 &&
			shopProduct.get("discountValidAfter") &&
			shopProduct.get("discountValidBefore") &&
			moment(shopProduct.get("dateNow")).isSameOrAfter(shopProduct.get("discountValidAfter")) &&
			moment(shopProduct.get("dateNow")).isSameOrBefore(shopProduct.get("discountValidBefore"))
		) {
			productDiscount = shopProduct.get("discount");
		}

		let tag = null;
		if (shopProduct.get("tag") !== null &&
			shopProduct.get("tagValidAfter") &&
			shopProduct.get("tagValidBefore") &&
			moment(shopProduct.get("dateNow")).isSameOrAfter(shopProduct.get("tagValidAfter")) &&
			moment(shopProduct.get("dateNow")).isSameOrBefore(shopProduct.get("tagValidBefore"))
		) {
			tag = shopProduct.get("tag");
		}

		const product = {
			id: shopProduct.get("id"),
			categoryId: shopProduct.get("categoryId"),
			title: shopProduct.get("strings")[0]?.get("title"),
			description: shopProduct.get("strings")[0]?.get("description"),
			icon: shopProduct.get("icon"),
			rareGrade: shopProduct.get("rareGrade"),
			price: shopProduct.get("price"),
			couponId: null,
			couponDiscount: 0,
			accountDiscount,
			productDiscount,
			tag,
			items: [],
			conversions: []
		};

		const productItems = await shopModel.productItems.findAll({
			where: { productId: shopProduct.get("id") },
			order: [
				["createdAt", "ASC"]
			]
		});

		if (productItems.length === 0) {
			return res.status(500).send();
		}

		productItems.forEach(item => {
			const itemData = datasheetModel.itemData.get(i18n.getLocale())?.getOne(item.get("itemTemplateId"));
			const strSheetItem = datasheetModel.strSheetItem.get(i18n.getLocale())?.getOne(item.get("itemTemplateId"));

			product.items.push({
				id: item.get("id"),
				itemTemplateId: item.get("itemTemplateId"),
				boxItemId: item.get("boxItemId"),
				boxItemCount: item.get("boxItemCount"),
				icon: itemData?.icon,
				rareGrade: itemData?.rareGrade,
				string: strSheetItem?.string
			});

			const conversion = (datasheetModel.itemConversion.get(i18n.getLocale())?.getOne(item.itemTemplateId) || [])
				.map(({ itemTemplateId }) => ({
					...datasheetModel.itemData.get(i18n.getLocale())?.getOne(itemTemplateId) || {},
					...datasheetModel.strSheetItem.get(i18n.getLocale())?.getOne(itemTemplateId) || {}
				}));

			product.conversions.push(...conversion);
		});

		const itemData = datasheetModel.itemData.get(i18n.getLocale())?.getOne(product.items[0].itemTemplateId);
		const strSheetItem = datasheetModel.strSheetItem.get(i18n.getLocale())?.getOne(product.items[0].itemTemplateId);

		if (!product.title) {
			product.title = strSheetItem.string;
		}

		if (!product.description) {
			product.description = strSheetItem.toolTip;
		}

		if (!product.icon) {
			product.icon = itemData.icon;
		}

		if (!product.rareGrade) {
			product.rareGrade = itemData.rareGrade;
		}

		product.requiredLevel = itemData.requiredLevel;
		product.requiredClass = itemData.requiredClass?.split(";") || [];
		product.requiredGender = itemData.requiredGender;
		product.requiredRace = (itemData.requiredRace?.split(";") || [])
			.map(race => (race === "popori" && product.requiredGender === "female" ? "elin" : race));

		product.tradable = itemData.tradable;
		product.warehouseStorable = itemData.warehouseStorable;

		unlockLockedCoupon(req);
		req.session.lastProduct = product; // add product to session

		res.render("partials/shopProduct", { helpers, product, search, back });
	},
	/**
	 * @type {ErrorRequestHandler}
	 */
	(err, req, res, next) => {
		logger.error(err);
		res.render("partials/shopError");
	}
];

/**
 * @param {modules} modules
 */
module.exports.PartialWelcomeHtml = ({ config, logger, accountModel, serverModel }) => [
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
			shopConfig: config.get("shop")
		});
	},
	/**
	 * @type {ErrorRequestHandler}
	 */
	(err, req, res, next) => {
		logger.error(err);
		res.render("partials/shopError");
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

		const promoCodesActivated = await shopModel.promoCodeActivated.findAll({
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

		unlockLockedCoupon(req);
		req.session.lastProduct = undefined;

		res.render("partials/shopPromoCode", { moment, promoCodesActivated, tzOffset: Number(tzOffset) });
	},
	/**
	 * @type {ErrorRequestHandler}
	 */
	(err, req, res, next) => {
		logger.error(err);
		res.render("partials/shopError");
	}
];

/**
 * @param {modules} modules
 */
module.exports.PartialCouponsHtml = ({ sequelize, logger, shopModel }) => [
	shopStatusHandler,
	authSessionHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { tzOffset } = req.query;

		const couponsActivated = await shopModel.couponActivated.findAll({
			where: { accountDBID: req.user.accountDBID },
			include: [{
				as: "info",
				model: shopModel.coupons
			}]
		});

		const activatedCouponIds = couponsActivated.map(coupon => coupon.couponId);
		const coupons = await shopModel.coupons.findAll({
			where: {
				accountDBID: req.user.accountDBID,
				active: 1,
				validAfter: { [Op.lte]: sequelize.fn("NOW") },
				validBefore: { [Op.gte]: sequelize.fn("NOW") },
				couponId: { [Op.notIn]: activatedCouponIds },
				[Op.or]: [
					{ maxActivations: { [Op.lte]: 0 } },
					sequelize.where(
						sequelize.col("currentActivations"),
						{ [Op.lt]: sequelize.col("maxActivations") }
					)
				]
			}
		});

		unlockLockedCoupon(req);
		req.session.lastProduct = undefined;

		res.render("partials/shopCoupons", { moment, couponsActivated, coupons, tzOffset: Number(tzOffset) });
	},
	/**
	 * @type {ErrorRequestHandler}
	 */
	(err, req, res, next) => {
		logger.error(err);
		res.render("partials/shopError");
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
		unlockLockedCoupon(req);
		req.session.lastProduct = undefined;

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
			shopBalance: shopAccount !== null ? shopAccount.get("balance") : 0,
			shopDiscount: shopAccount !== null ? shopAccount.get("discount") : 0
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.PurchaseAction = modules => [
	shopStatusHandler,
	authSessionHandler(modules.logger),
	[
		body("productId").trim().notEmpty().isNumeric(),
		body("quantity").trim().notEmpty().isInt({ min: 1, max: 99 }),
		body("recipientUserId").optional({ checkFalsy: true }).trim().isInt()
	],
	validationHandler(modules.logger),
	rateLimitterHandler(modules.rateLimitter, "portalApi.shop.purchaseAction"),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { productId, recipientUserId } = req.body;
		let quantity = req.body.quantity;

		if (!req.session.lastProduct || req.session.lastProduct.id !== parseInt(productId)) {
			throw new ApiError("Product request invalidated", 2000);
		}

		const shopProduct = await modules.shopModel.products.findOne({
			where: {
				id: req.session.lastProduct.id,
				active: 1,
				validAfter: { [Op.lt]: modules.sequelize.fn("NOW") },
				validBefore: { [Op.gt]: modules.sequelize.fn("NOW") }
			}
		});

		if (shopProduct === null) {
			throw new ApiError("Product was not found", 2001);
		}

		let shopAccount = await modules.shopModel.accounts.findOne({
			where: {
				accountDBID: req.user.accountDBID,
				active: 1
			}
		});

		if (shopAccount === null) {
			shopAccount = await modules.shopModel.accounts.create({
				accountDBID: req.user.accountDBID,
				balance: 0,
				active: true
			});
		}

		const recipientAccount = await modules.accountModel.info.findOne({
			where: { accountDBID: recipientUserId || req.user.accountDBID }
		});

		if (recipientAccount === null) {
			throw new ApiError("Recipient account was not found", 5000);
		}

		// re-validate coupon
		if (req.session.lastProduct.couponId) {
			const shopCoupon = await modules.shopModel.coupons.findOne({
				where: {
					couponId: req.session.lastProduct.couponId,
					active: 1
				}
			});

			if (shopCoupon === null) {
				throw new ApiError("This coupon was not found", 1000);
			}

			if (moment(shopCoupon.get("dateNow")).isBefore(shopCoupon.get("validAfter")) ||
				moment(shopCoupon.get("dateNow")).isAfter(shopCoupon.get("validBefore"))
			) {
				throw new ApiError("Coupon has expired or has not started yet", 1001);
			}

			if (shopCoupon.get("maxActivations") > 0 &&
				shopCoupon.get("currentActivations") >= shopCoupon.get("maxActivations")
			) {
				throw new ApiError("Activation limit for this coupon has been exceeded", 1002);
			}

			const couponActivated = await modules.shopModel.couponActivated.findOne({
				where: {
					couponId: req.session.lastProduct.couponId
				}
			});

			if (couponActivated !== null) {
				throw new ApiError("This coupon has already been activated", 1010);
			}

			// check locking
			if (checkLockedCoupon(req, shopCoupon.get("couponId"), shopCoupon.get("maxActivations"), shopCoupon.get("currentActivations"))) {
				throw new ApiError("This coupon has already been activated", 1010);
			}

			quantity = 1;
		}

		const serviceItem = new ServiceItem(modules);
		const items = [];

		for (const item of req.session.lastProduct.items) {
			const strSheetItem = modules.datasheetModel.strSheetItem.get(modules.i18n.getLocale())?.getOne(item.itemTemplateId);

			const boxItemId = await serviceItem.checkCreate(
				item.boxItemId,
				item.itemTemplateId,
				strSheetItem?.string,
				helpers.formatStrsheet(strSheetItem?.toolTip),
				0
			);

			items.push({
				item_id: boxItemId,
				item_count: item.boxItemCount * quantity,
				item_template_id: item.itemTemplateId
			});

			if (boxItemId != item.boxItemId) {
				await modules.shopModel.productItems.update({ boxItemId }, {
					where: { id: item.id }
				});
			}
		}

		if (items.length === 0) {
			throw new ApiError("Product does not contain any items", 3000);
		}

		// calculate final price
		let finalPrice = req.session.lastProduct.price;

		if (req.session.lastProduct.productDiscount > 0) {
			finalPrice = helpers.subtractPercentage(finalPrice, req.session.lastProduct.productDiscount);
		}

		let isPriceChangedByCoupon = false;

		if (req.session.lastProduct.couponDiscount > 0) {
			const beforePrice = finalPrice;
			finalPrice = helpers.subtractPercentage(finalPrice, req.session.lastProduct.couponDiscount);
			isPriceChangedByCoupon = finalPrice < beforePrice;
		}

		if (req.session.lastProduct.accountDiscount > 0) {
			finalPrice = helpers.subtractPercentage(finalPrice, req.session.lastProduct.accountDiscount);
		}

		const currentBalance = shopAccount.get("balance"); // current balance
		const finalCost = finalPrice * quantity; // final cost

		const logResult = await modules.reportModel.shopPay.create({
			accountDBID: req.user.accountDBID,
			serverId: req.user.lastLoginServer,
			ip: req.ip,
			productId: req.session.lastProduct.id,
			quantity,
			price: finalPrice,
			status: "deposit"
		});

		await modules.reportModel.shopFund.create({
			accountDBID: req.user.accountDBID,
			amount: -finalCost,
			balance: currentBalance - finalCost,
			description: `Buy,ID: ${req.session.lastProduct.id},Log ID: ${logResult.get("id")}`
		});

		// no awaiting
		modules.sequelize.transaction(async () => {
			await modules.shopModel.accounts.decrement({
				balance: finalCost
			}, {
				where: { accountDBID: req.user.accountDBID }
			});

			if (isPriceChangedByCoupon && req.session.lastProduct.couponId) {
				await modules.shopModel.couponActivated.create({
					couponId: req.session.lastProduct.couponId,
					accountDBID: req.user.accountDBID,
					logId: logResult.get("id")
				});

				await modules.shopModel.coupons.increment({
					currentActivations: 1
				}, {
					where: { couponId: req.session.lastProduct.couponId }
				});
			}

			const itemClaim = new ItemClaim(
				modules,
				recipientAccount.get("accountDBID"),
				recipientAccount.get("lastLoginServer"), // TODO
				{
					logType: 3,
					logId: logResult.get("id")
				}
			);

			const boxId = await itemClaim.makeBox({
				title: modules.i18n.__("_box_title_"),
				content: modules.i18n.__("_box_content_"),
				icon: "GiftBox02.bmp",
				days: 3650,
				items
			});

			await modules.reportModel.shopPay.update({
				boxId,
				status: "completed"
			}, {
				where: { id: logResult.get("id") }
			});

			unlockLockedCoupon(req);
			req.session.lastProduct = undefined;
		}).catch(async err => {
			modules.logger.error(err);

			try {
				await modules.reportModel.shopPay.update({
					status: "rejected"
				}, {
					where: { id: logResult.get("id") }
				});

				await modules.reportModel.shopFund.create({
					accountDBID: req.user.accountDBID,
					amount: finalCost,
					balance: currentBalance,
					description: `BuyCancel,ID: ${req.session.lastProduct.id},Log ID: ${logResult.get("id")}`
				});
			} catch (e) {
				modules.logger.error(e);
			}

			unlockLockedCoupon(req);
			req.session.lastProduct = undefined;
		});

		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success",
			LogId: logResult.get("id")
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.PurchaseStatusAction = modules => [
	shopStatusHandler,
	authSessionHandler(modules.logger),
	[body("logId").trim().notEmpty().isNumeric()],
	validationHandler(modules.logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { logId } = req.body;

		const logResult = await modules.reportModel.shopPay.findOne({
			where: { id: logId }
		});

		if (logResult === null) {
			throw new ApiError("Transaction was not found", 2000);
		}

		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success",
			Status: logResult.get("status")
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.CouponAcceptAction = modules => [
	shopStatusHandler,
	authSessionHandler(modules.logger, modules.accountModel),
	[
		body("coupon").trim().notEmpty(),
		body("productId").trim().notEmpty().isNumeric()
	],
	validationHandler(modules.logger),
	rateLimitterHandler(modules.rateLimitter, "portalApi.shop.couponAcceptAction"),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { coupon, productId } = req.body;

		if (!req.session.lastProduct || req.session.lastProduct.id !== parseInt(productId)) {
			throw new ApiError("Product request invalidated", 2000);
		}

		const shopCoupon = await modules.shopModel.coupons.findOne({
			attributes: {
				include: [[modules.sequelize.fn("NOW"), "dateNow"]]
			},
			where: {
				coupon,
				active: 1
			}
		});

		if (shopCoupon === null) {
			throw new ApiError("This coupon was not found", 1000);
		}

		if (moment(shopCoupon.get("dateNow")).isBefore(shopCoupon.get("validAfter")) ||
			moment(shopCoupon.get("dateNow")).isAfter(shopCoupon.get("validBefore"))
		) {
			throw new ApiError("Coupon has expired or has not started yet", 1001);
		}

		if (shopCoupon.get("maxActivations") > 0 &&
			shopCoupon.get("currentActivations") >= shopCoupon.get("maxActivations")
		) {
			throw new ApiError("Activation limit for this coupon has been exceeded", 1002);
		}

		const couponActivated = await modules.shopModel.couponActivated.findOne({
			where: {
				accountDBID: req.user.accountDBID,
				couponId: shopCoupon.get("couponId")
			}
		});

		if (couponActivated !== null) {
			throw new ApiError("This coupon has already been activated", 1010);
		}

		if (checkLockedCoupon(req, shopCoupon.get("couponId"), shopCoupon.get("maxActivations"), shopCoupon.get("currentActivations"))) {
			throw new ApiError("This coupon has already been activated", 1010);
		}

		lockLockedCoupon(req, shopCoupon.get("couponId"), Date.now() + 3600000); // 1 hour

		req.session.lastProduct.couponId = shopCoupon.get("couponId");
		req.session.lastProduct.couponDiscount = shopCoupon.get("discount");

		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success",
			Discount: shopCoupon.get("discount")
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.CouponCancelAction = modules => [
	shopStatusHandler,
	authSessionHandler(modules.logger, modules.accountModel),
	validationHandler(modules.logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		if (req.session.lastProduct) {
			lockedCoupons.delete(req.session.lastProduct.couponId);

			req.session.lastProduct.couponId = null;
			req.session.lastProduct.couponDiscount = 0;
		}

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
	rateLimitterHandler(modules.rateLimitter, "portalApi.shop.promoCodeAction"),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { promoCode } = req.body;

		const promocode = await modules.shopModel.promoCodes.findOne({
			attributes: {
				include: [[modules.sequelize.fn("NOW"), "dateNow"]]
			},
			where: {
				promoCode,
				active: 1
			}
		});

		if (promocode === null) {
			throw new ApiError("Promo code was not found", 1000);
		}

		if (moment(promocode.get("dateNow")).isBefore(promocode.get("validAfter")) ||
			moment(promocode.get("dateNow")).isAfter(promocode.get("validBefore"))
		) {
			throw new ApiError("Promo code has expired or has not started yet", 1001);
		}

		if (promocode.get("maxActivations") > 0 &&
			promocode.get("currentActivations") >= promocode.get("maxActivations")
		) {
			throw new ApiError("Activation limit for this promo code has been exceeded", 1002);
		}

		const promocodeActivated = await modules.shopModel.promoCodeActivated.findOne({
			where: {
				accountDBID: req.user.accountDBID,
				promoCodeId: promocode.get("promoCodeId")
			}
		});

		if (promocodeActivated !== null) {
			throw new ApiError("Promo code has already been activated", 1010);
		}

		// no awaiting
		modules.sequelize.transaction(async () => {
			await modules.shopModel.promoCodeActivated.create({
				promoCodeId: promocode.get("promoCodeId"),
				accountDBID: req.user.accountDBID
			});

			await modules.shopModel.promoCodes.increment({
				currentActivations: 1
			}, {
				where: { promoCodeId: promocode.get("promoCodeId") }
			});

			const actions = new PromoCodeActions(
				modules,
				req.user.lastLoginServer,
				req.user.accountDBID
			);

			await actions.execute(promocode.get("function"), promocode.get("promoCodeId"));
		}).catch(async err =>
			modules.logger.error(err)
		);

		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success",
			PromoCodeId: promocode.get("promoCodeId")
		});
	}
];

module.exports.PromoCodeStatusAction = modules => [
	shopStatusHandler,
	authSessionHandler(modules.logger, modules.accountModel),
	[body("promoCodeId").trim().notEmpty()],
	validationHandler(modules.logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { promoCodeId } = req.body;

		const promocodeActivatedCount = await modules.shopModel.promoCodeActivated.count({
			where: {
				promoCodeId,
				accountDBID: req.user.accountDBID
			}
		});

		const status = promocodeActivatedCount !== 0 ? "activated" : "notfound";

		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success",
			Status: status
		});
	}
];