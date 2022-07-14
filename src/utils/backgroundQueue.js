"use strict";

/**
 * @typedef {import("sequelize").ModelCtor<Model<any, any>>} model
 */

const Queue = require("queue-promise");

class BackgroundQueue {
	constructor(params) {
		this.status = {
			created: 0,
			pending: 1,
			rejected: 2
		};

		/**
		 * @type {model}
		 */
		this.model = null;
		this.handlers = null;
		this.logger = params.logger || console;

		this.queue = new Queue({
			concurrent: params.concurrent || 1,
			interval: params.interval || 100
		});

		this.queue.on("start", () => this.logger.info("Started."));
		this.queue.on("end", () => this.logger.info("Done."));
	}

	setModel(model) {
		this.model = model;
	}

	setHandlers(handlers) {
		this.handlers = handlers;
	}

	insert(handler, args = []) {
		if (typeof this.handlers[handler] !== "function") {
			return Promise.reject(new TypeError("Handler is not a function."));
		}

		return this.model.create({
			status: this.status.created,
			handler,
			arguments: JSON.stringify(args)
		}).then(task =>
			this.push(task.get("id"), this.handlers, this.handlers[handler], args)
		).catch(err =>
			this.logger.error(err)
		);
	}

	clear() {
		this.queue.clear();

		return this.model.truncate().catch(err =>
			this.logger.error(err)
		);
	}

	start() {
		if (this.queue.shouldRun) {
			return Promise.resolve();
		}

		return this.model.findAll().then(tasks => {
			if (tasks === null) return;

			tasks.forEach(task =>
				this.push(
					task.get("id"),
					this.handlers,
					this.handlers[task.get("handler")],
					JSON.parse(task.get("arguments"))
				)
			);
		}).catch(err =>
			this.logger.error(err)
		);
	}

	push(id, instance, handler, args) {
		const task = () => this.model.update({
			status: this.status.pending
		}, {
			where: { id }
		}).then(() =>
			handler.call(instance, ...args).then(() =>
				this.model.destroy({ where: { id } })
			).catch(err => {
				this.logger.warn(`Task ${id} has error: ${err}`);

				return this.model.update({
					status: this.status.rejected,
					message: err.toString()
				}, {
					where: { id }
				});
			})
		).catch(err =>
			this.logger.error(err)
		);

		this.queue.enqueue(task);
	}
}

module.exports = BackgroundQueue;