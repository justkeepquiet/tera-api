"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const MAX_SLIDE_SIZE = 5; // MB
const SLIDE_WIDTH = 740;
const SLIDE_HEIGHT = 300;

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const imageSize = require("image-size");
const expressLayouts = require("express-ejs-layouts");
const { query, body } = require("express-validator");
const moment = require("moment-timezone");

const { getFilenamesFromDirectory, isSafePath } = require("../utils/helpers");
const {
	accessFunctionHandler,
	validationHandler,
	formValidationHandler,
	formResultErrorHandler,
	formResultSuccessHandler,
	writeOperationReport
} = require("../middlewares/admin.middlewares");

const imagesPath = path.join(__dirname, "../../data/shop-slides-bg");

const fileUpload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: MAX_SLIDE_SIZE * 1024 * 1024
	},
	fileFilter: (req, file, cb) => {
		const allowedMimeTypes = ["image/jpeg", "image/png"];

		if (allowedMimeTypes.includes(file.mimetype)) {
			cb(null, true);
		} else {
			cb(new Error("Only JPG and PNG files are allowed"));
		}
	}
});

/**
 * @param {modules} modules
 */
module.exports.index = ({ i18n, datasheetModel, shopModel }) => [
	accessFunctionHandler,
	expressLayouts,
	async (req, res, next) => {
		const shopSlides = await shopModel.slides.findAll({
			include: [
				{
					as: "product",
					model: shopModel.products,
					required: false
				},
				{
					as: "productStrings",
					model: shopModel.productStrings,
					where: { language: i18n.getLocale() },
					required: false
				},
				{
					as: "productItems",
					model: shopModel.productItems,
					required: false
				}
			],
			order: [
				["priority", "DESC"]
			]
		});

		const slides = [];

		shopSlides.forEach(shopSlide => {
			const slide = {
				id: shopSlide.get("id"),
				priority: shopSlide.get("priority"),
				image: shopSlide.get("image"),
				active: shopSlide.get("active"),
				published: shopSlide.active &&
					moment().isSameOrAfter(moment(shopSlide.get("displayDateStart"))) &&
					moment().isSameOrBefore(moment(shopSlide.get("displayDateEnd"))),
				productId: shopSlide.get("productId"),
				product: {
					id: shopSlide.get("product")?.get("id"),
					title: shopSlide.get("productStrings")[0]?.get("title"),
					icon: shopSlide.get("product")?.get("icon"),
					rareGrade: shopSlide.get("product")?.get("rareGrade")
				}
			};

			shopSlide.get("productItems").forEach(productItem => {
				const itemData = datasheetModel.itemData.get(i18n.getLocale())?.getOne(productItem.get("itemTemplateId"));
				const strSheetItem = datasheetModel.strSheetItem.get(i18n.getLocale())?.getOne(productItem.get("itemTemplateId"));

				if (strSheetItem && !slide.product.title) {
					slide.product.title = strSheetItem.string;
				}

				if (itemData) {
					if (!slide.product.icon) {
						slide.product.icon = itemData.icon;
					}

					if (slide.product.rareGrade === null) {
						slide.product.rareGrade = itemData.rareGrade;
					}
				}
			});

			slides.push(slide);
		});

		res.render("adminShopSlides", {
			layout: "adminLayout",
			slides
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.add = ({ shopModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { id, removeImage } = req.query;

		if (removeImage) {
			const slidesCount = await shopModel.slides.count({
				where: { image: removeImage }
			});

			if (slidesCount !== 0) {
				res.json({ result_code: 1000, msg: "image used" });
			} else {
				const filePath = path.join(imagesPath, removeImage);

				if (!isSafePath(imagesPath, removeImage) || !fs.existsSync(filePath)) {
					throw Error("File not found");
				}

				fs.unlinkSync(filePath);
				res.json({ result_code: 0, msg: "success" });
			}
			return;
		}

		const imagesFromFolder = getFilenamesFromDirectory(imagesPath);
		const images = [];

		for (const imageFromFolder of imagesFromFolder) {
			const slidesCount = await shopModel.slides.count({
				where: { image: imageFromFolder }
			});

			images.push({
				name: imageFromFolder,
				used: slidesCount !== 0
			});
		}

		res.render("adminShopSlidesAdd", {
			layout: "adminLayout",
			moment,
			images,
			MAX_SLIDE_SIZE,
			SLIDE_WIDTH,
			SLIDE_HEIGHT
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.addAction = ({ i18n, logger, reportModel, shopModel }) => [
	accessFunctionHandler,
	fileUpload.single("imageFile"),
	[
		body("priority").trim()
			.isInt({ min: -1e8, max: 1e8 }).withMessage(i18n.__("The field must contain the value as a number.")),
		body("active").optional().trim()
			.isIn(["on"]).withMessage(i18n.__("The field has invalid value.")),
		body("displayDateStart").trim()
			.isISO8601().withMessage(i18n.__("The field must contain a valid date.")),
		body("displayDateEnd").trim()
			.isISO8601().withMessage(i18n.__("The field must contain a valid date."))
			.custom((value, { req }) => {
				if (moment(value).isSameOrBefore(req.body.displayDateStart)) {
					return Promise.reject(`${i18n.__("The field must contain a valid date.")}`);
				}
				return true;
			}),
		body("image").optional({ checkFalsy: true }).trim()
			.isLength({ min: 1, max: 2048 }).withMessage(i18n.__("The field must be between 1 and 2048 characters.")),
		body("productId").trim()
			.isInt({ min: 0 }).withMessage(i18n.__("The field must contain a valid number."))
	],
	formValidationHandler(logger),
	/**
	 * @type {ErrorRequestHandler}
	 */
	(err, req, res, next) => {
		if (err instanceof multer.MulterError) {
			return res.json({ result_code: 2, msg: i18n.__(err.message) });
		}

		next();
	},
	async (req, res, next) => {
		const { priority, active, displayDateStart, displayDateEnd, productId } = req.body;

		let image = req.body.image;

		if (req.file) {
			const fileHash = crypto.createHash("md5").update(req.file.buffer).digest("hex");
			const fileName = `${fileHash.substring(0, 16)}.jpg`;
			const filePath = path.join(imagesPath, fileName);

			try {
				const dimensions = imageSize(req.file.buffer);

				if (dimensions.width !== SLIDE_WIDTH || dimensions.height !== SLIDE_HEIGHT) {
					res.json({
						result_code: 2,
						msg: i18n.__("The resolution must be: %sx%s", SLIDE_WIDTH, SLIDE_HEIGHT)
					});
					return;
				}

				if (!fs.existsSync(filePath)) {
					fs.writeFileSync(filePath, req.file.buffer);
				}

				image = fileName;
			} catch (err) {
				throw Error(err);
			}
		}

		if (!image) {
			res.json({ result_code: 2, msg: "Invalid parameter",
				errors: [{
					msg: i18n.__("Background image file not selected."),
					param: "imageFile"
				}]
			});
			return;
		}

		await shopModel.slides.create({
			priority,
			active: active == "on",
			displayDateStart: moment.tz(displayDateStart, req.user.tz).toDate(),
			displayDateEnd: moment.tz(displayDateEnd, req.user.tz).toDate(),
			image,
			productId
		});

		next();
	},
	writeOperationReport(reportModel),
	formResultErrorHandler(logger),
	formResultSuccessHandler("/shop_slides")
];

/**
 * @param {modules} modules
 */
module.exports.edit = ({ logger, shopModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("id").trim().notEmpty()
	],
	validationHandler(logger),
	async (req, res, next) => {
		const { id, removeImage } = req.query;

		if (removeImage) {
			const slidesCount = await shopModel.slides.count({
				where: { image: removeImage }
			});

			if (slidesCount !== 0) {
				res.json({ result_code: 1000, msg: "image used" });
			} else {
				const filePath = path.join(imagesPath, removeImage);

				if (!isSafePath(imagesPath, removeImage) || !fs.existsSync(filePath)) {
					throw Error("File not found");
				}

				fs.unlinkSync(filePath);
				res.json({ result_code: 0, msg: "success" });
			}
			return;
		}

		const slide = await shopModel.slides.findOne({
			where: { id }
		});

		if (slide === null) {
			throw Error("Object not found");
		}

		const imagesFromFolder = getFilenamesFromDirectory(imagesPath);
		const images = [];

		for (const imageFromFolder of imagesFromFolder) {
			const slidesCount = await shopModel.slides.count({
				where: { image: imageFromFolder }
			});

			images.push({
				name: imageFromFolder,
				used: slidesCount !== 0
			});
		}

		res.render("adminShopSlidesEdit", {
			layout: "adminLayout",
			id: slide.get("id"),
			priority: slide.get("priority"),
			active: slide.get("active"),
			displayDateStart: moment(slide.get("displayDateStart")),
			displayDateEnd: moment(slide.get("displayDateEnd")),
			productId: slide.get("productId"),
			image: slide.get("image"),
			images,
			MAX_SLIDE_SIZE,
			SLIDE_WIDTH,
			SLIDE_HEIGHT
		});
	}
],

/**
 * @param {modules} modules
 */
module.exports.editAction = ({ i18n, logger, reportModel, shopModel }) => [
	accessFunctionHandler,
	fileUpload.single("imageFile"),
	[
		body("priority").trim()
			.isInt({ min: -1e8, max: 1e8 }).withMessage(i18n.__("The field must contain the value as a number.")),
		body("active").optional().trim()
			.isIn(["on"]).withMessage(i18n.__("The field has invalid value.")),
		body("displayDateStart").trim()
			.isISO8601().withMessage(i18n.__("The field must contain a valid date.")),
		body("displayDateEnd").trim()
			.isISO8601().withMessage(i18n.__("The field must contain a valid date."))
			.custom((value, { req }) => {
				if (moment(value).isSameOrBefore(req.body.displayDateStart)) {
					return Promise.reject(`${i18n.__("The field must contain a valid date.")}`);
				}
				return true;
			}),
		body("image").optional({ checkFalsy: true }).trim()
			.isLength({ min: 1, max: 2048 }).withMessage(i18n.__("The field must be between 1 and 2048 characters.")),
		body("productId").trim()
			.isInt({ min: 0 }).withMessage(i18n.__("The field must contain a valid number."))
	],
	formValidationHandler(logger),
	/**
	 * @type {ErrorRequestHandler}
	 */
	(err, req, res, next) => {
		if (err instanceof multer.MulterError) {
			return res.json({ result_code: 2, msg: i18n.__(err.message) });
		}

		next();
	},
	async (req, res, next) => {
		const { id } = req.query;
		const { priority, active, displayDateStart, displayDateEnd, productId } = req.body;

		let image = req.body.image;

		if (req.file) {
			const fileHash = crypto.createHash("md5").update(req.file.buffer).digest("hex");
			const fileName = `${fileHash.substring(0, 16)}.jpg`;
			const filePath = path.join(imagesPath, fileName);

			try {
				const dimensions = imageSize(req.file.buffer);

				if (dimensions.width !== SLIDE_WIDTH || dimensions.height !== SLIDE_HEIGHT) {
					res.json({
						result_code: 2,
						msg: i18n.__("The resolution must be: %sx%s", SLIDE_WIDTH, SLIDE_HEIGHT)
					});
					return;
				}

				if (!fs.existsSync(filePath)) {
					fs.writeFileSync(filePath, req.file.buffer);
				}

				image = fileName;
			} catch (err) {
				throw Error(err);
			}
		}

		if (!image) {
			res.json({ result_code: 2, msg: "Invalid parameter",
				errors: [{
					msg: i18n.__("Background image file not selected."),
					param: "imageFile"
				}]
			});
			return;
		}

		const slide = await shopModel.slides.findOne({
			where: { id }
		});

		if (slide === null) {
			throw Error("Object not found");
		}

		await shopModel.slides.update({
			priority,
			active: active == "on",
			displayDateStart: moment.tz(displayDateStart, req.user.tz).toDate(),
			displayDateEnd: moment.tz(displayDateEnd, req.user.tz).toDate(),
			image,
			productId
		}, {
			where: { id }
		});

		next();
	},
	writeOperationReport(reportModel),
	formResultErrorHandler(logger),
	formResultSuccessHandler("/shop_slides")
];

/**
 * @param {modules} modules
 */
module.exports.deleteAction = ({ logger, reportModel, shopModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("id").trim().notEmpty()
	],
	validationHandler(logger),
	async (req, res, next) => {
		const { id } = req.query;

		await shopModel.slides.destroy({
			where: { id }
		});

		next();
	},
	writeOperationReport(reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		res.redirect("/shop_slides");
	}
];