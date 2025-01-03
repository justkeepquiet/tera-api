"use strict";

const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

const MIN_WIDTH = 250;
const MIN_HEIGHT = 110;
const MAX_WIDTH = 360;
const MAX_HEIGHT = 160;

/**
 * This code is taken from the project "Slider Captcha" (https://github.com/ArgoZhang/SliderCaptcha)
 * Original code: Copyright (c) Argo Zhang <argo@163.com>
 * License Apache-2.0 license is available on: http://www.apache.org/licenses/LICENSE-2.0
 */
function drawImage(ctx, x, y, l, r, operation) {
	ctx.beginPath();

	ctx.moveTo(x, y);
	ctx.arc(x + l / 2, y - r + 2, r, 0.72 * Math.PI, 2.26 * Math.PI);
	ctx.lineTo(x + l, y);
	ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * Math.PI, 2.78 * Math.PI);
	ctx.lineTo(x + l, y + l);
	ctx.lineTo(x, y + l);
	ctx.arc(x + r - 2, y + l / 2, r + 0.4, 2.76 * Math.PI, 1.24 * Math.PI, true);
	ctx.lineTo(x, y);

	ctx.lineWidth = 2;
	ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
	ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
	ctx.stroke();

	ctx[operation]();
	ctx.globalCompositeOperation = "destination-over";
}

function getRandomNumberByRange(start, end) {
	return Math.round(Math.random() * (end - start) + start);
}

async function generateCaptcha(imagePath, width, height) {
	const sliderL = 42;
	const sliderR = 9;

	const x = getRandomNumberByRange(sliderL + 10, width - (sliderL + 20));
	const y = getRandomNumberByRange(10 + sliderR * 2, height - (sliderL + 10));

	const canvas = createCanvas(width, height);
	const block = createCanvas(width, height);
	const canvasCtx = canvas.getContext("2d");
	const blockCtx = block.getContext("2d");

	await loadImage(imagePath).then(image => {
		drawImage(canvasCtx, x, y, sliderL, sliderR, "fill");
		drawImage(blockCtx, x, y, sliderL, sliderR, "clip");

		canvasCtx.drawImage(image, 0, 0, width, height);
		blockCtx.drawImage(image, 0, 0, width, height);
	});

	const newBlock = createCanvas(width, height);
	const newBlockCtx = newBlock.getContext("2d");
	const imageData = blockCtx.getImageData(x, 0, width, height);

	newBlockCtx.putImageData(imageData, 0, 1);

	return {
		image: canvas.toDataURL(),
		block: newBlock.toDataURL(),
		question: { x, y }
	};
}

function getRandomImagePath(folderPath) {
	const files = fs.readdirSync(folderPath);
	const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];

	const imageFiles = files.filter(file =>
		imageExtensions.includes(path.extname(file).toLowerCase())
	);

	if (imageFiles.length === 0) {
		throw new Error(`Directory ${folderPath} does not contain files of suitable format.`);
	}

	const randomIndex = Math.floor(Math.random() * imageFiles.length);

	return path.join(folderPath, imageFiles[randomIndex]);
}

class SliderCaptcha {
	constructor(imagesFolderPath, tolerance = 5) {
		this.imagesFolderPath = imagesFolderPath;
		this.tolerance = tolerance;
	}

	render(id, options = {}) {
		return `<div id="${id}"></div><script>sliderCaptcha(${JSON.stringify({ id, ...options })});</script>`;
	}

	async generate(width, height) {
		const w = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, width || MAX_WIDTH));
		const h = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, height || MAX_HEIGHT));

		const imagePath = getRandomImagePath(this.imagesFolderPath);
		const captcha = await generateCaptcha(imagePath, w, h);

		return captcha;
	}

	verify(question, answer) {
		return question > 0 && Math.abs(answer - question) < this.tolerance;
	}
}

module.exports = SliderCaptcha;