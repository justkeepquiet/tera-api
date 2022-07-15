"use strict";

const e = require("express");
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

	findById(id) {
		return this.model.findOne({ where: { id } });
	}

	findByTag(handler, tag, limit = null) {
		return this.model.findAll({
			where: { handler, tag }, ...limit ? { offset: 0, limit } : {}
		});
	}

	findByStatus(status, limit = null) {
		return this.model.findAll({
			where: { status }, ...limit ? { offset: 0, limit } : {}
		});
	}

	insert(handler, args = [], tag = null) {
		if (typeof this.handlers[handler] !== "function") {
			return Promise.reject(new TypeError("Handler is not a function."));
		}

		return this.model.create({
			status: this.status.created,
			tag,
			handler,
			arguments: JSON.stringify(args)
		}).then(task =>
			this.push(task.get("id"), this.handlers, this.handlers[handler], args)
		);
	}

	clear(status = null, handler = null, tag = null) {
		if (status !== null || handler !== null || tag !== null) {
			return this.model.destroy({
				where: {
					status,
					...handler ? { handler } : {},
					...tag ? { tag } : {}
				}
			});
		}

		this.queue.clear();

		return this.model.truncate();
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
		});
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
		);

		this.queue.enqueue(task);
	}
}

module.exports = BackgroundQueue;