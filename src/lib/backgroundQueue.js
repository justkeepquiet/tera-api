"use strict";

/**
 * @typedef {import("sequelize").ModelCtor<Model<any, any>>} model
 */

const Queue = require("queue-promise");
const Op = require("sequelize").Op;

class BackgroundQueue {
	constructor(params) {
		this.status = {
			created: 0,
			pending: 1,
			rejected: 2,
			cancelled: 3, // logs only
			completed: 4 // logs only
		};

		/**
		 * @type {model}
		 */
		this.model = null;

		/**
		 * @type {model}
		 */
		this.logsModel = null;

		this.handlers = null;
		this.logger = params?.logger || console;

		this.queue = new Queue({
			concurrent: params?.concurrent || 1,
			interval: params?.interval || 100
		});

		this.queue.on("start", () => this.logger.info("Started."));
		this.queue.on("end", () => this.logger.info("Done."));
	}

	setModel(model) {
		this.model = model;
	}

	setLogsModel(model) {
		this.logsModel = model;
	}

	setHandlers(handlers) {
		this.handlers = handlers;
	}

	async findById(id) {
		return await this.model.findOne({ where: { id } });
	}

	async findByTag(handler, tag, limit = null) {
		return await this.model.findAll({
			where: { handler, tag }, ...limit ? { offset: 0, limit } : {}
		});
	}

	async findByStatus(status, limit = null) {
		return await this.model.findAll({
			where: { status }, ...limit ? { offset: 0, limit } : {}
		});
	}

	async insert(handler, args = [], tag = null) {
		if (typeof this.handlers[handler] !== "function") {
			throw new TypeError("Handler is not a function.");
		}

		const task = await this.model.create({
			status: this.status.created,
			tag,
			handler,
			arguments: JSON.stringify(args)
		});

		if (this.logsModel) {
			this.addToLog(task, this.status.created);
		}

		return this.push(task, this.handlers, this.handlers[handler], args);
	}

	async clear(status = null, handler = null, tag = null) {
		if (status !== null || handler !== null || tag !== null) {
			const where = { status, ...handler ? { handler } : {}, ...tag ? { tag } : {} };

			if (this.logsModel) {
				const tasks = await this.model.findAll({ where });

				for (const task of tasks) {
					this.addToLog(task, this.status.cancelled);
				}
			}

			return await this.model.destroy({ where });
		}

		this.queue.clear();

		return await this.model.truncate();
	}

	async start(rejected = false) {
		if (this.queue.shouldRun) {
			return;
		}

		const tasks = await this.model.findAll({
			where: { ...!rejected ? { status: { [Op.ne]: this.status.rejected } } : {} }
		});

		if (tasks === null) {
			return;
		}

		// no awaiting
		tasks.forEach(task =>
			this.push(
				task,
				this.handlers,
				this.handlers[task.get("handler")],
				JSON.parse(task.get("arguments"))
			)
		);
	}

	async push(task, instance, handler, args) {
		const id = task.get("id");

		const taskFn = async () => {
			try {
				await this.model.update({
					status: this.status.pending
				}, {
					where: { id }
				});

				await handler.call(instance, ...args);
				await this.model.destroy({ where: { id } });

				if (this.logsModel) {
					this.addToLog(task, this.status.completed);
				}
			} catch (err) {
				this.logger.warn(`Task ${id} has error: ${err}`);

				await this.model.update({
					status: this.status.rejected,
					message: err.toString()
				}, {
					where: { id }
				});

				if (this.logsModel) {
					this.addToLog(task, this.status.rejected);
				}
			}
		};

		this.queue.enqueue(taskFn);
	}

	async addToLog(task, status) {
		await this.logsModel.create({
			status,
			taskId: task.get("id"),
			tag: task.get("tag"),
			handler: task.get("handler"),
			arguments: task.get("arguments"),
			message: task.get("message")
		});
	}
}

module.exports = BackgroundQueue;