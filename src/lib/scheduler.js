"use strict";

const cron = require("node-cron");

const expr = {
	EVERY_SECOND: "* * * * * *",
	EVERY_FIVE_SECONDS: "*/5 * * * * *",
	EVERY_TEN_SECONDS: "*/10 * * * * *",
	EVERY_THIRTY_SECONDS: "*/30 * * * * *",

	EVERY_MINUTE: "* * * * *",
	EVERY_FIVE_MINUTES: "*/5 * * * *",
	EVERY_TEN_MINUTES: "*/10 * * * *",
	EVERY_THIRTY_MINUTES: "*/30 * * * *",

	EVERY_HOUR: "0 * * * *",
	EVERY_DAY_AT_MIDNIGHT: "0 0 * * *",
	EVERY_MONDAY_AT_MIDNIGHT: "0 0 * * 1",
	EVERY_FIRST_DAY_OF_MONTH: "0 0 1 * *",
	EVERY_SUNDAY_AT_NOON: "0 12 * * 0",
	EVERY_FRIDAY_AT_NOON: "0 12 * * 5"
};

class Scheduler {
	constructor(logger = null) {
		this.logger = logger;
		this.scheduled = [];
	}

	startTasks(tasks, controller, ...args) {
		tasks.forEach(task =>
			this.start(task, controller[task.name], args)
		);
	}

	stopAllTasks() {
		this.scheduled.forEach(number => this.stop(number));
	}

	start(task, func, args) {
		const taskInternal = {
			id: null,
			callback: () => {
				if (typeof func === "function") {
					if (this.logger !== null) {
						this.logger.debug(`Executing (${taskInternal.id}): ${task.name}`);
					}

					func(...args);
				} else if (this.logger !== null) {
					this.logger.warn(`Error (${taskInternal.id}): ${task.name} is not a function.`);
				}
			}
		};

		taskInternal.id = this.scheduled.push(
			cron.schedule(task.schedule, taskInternal.callback)
		);

		if (this.logger) {
			const schedule = Object.keys(expr)
				.find(key => expr[key] === task.schedule)
				.toLowerCase() || task.schedule;

			this.logger.debug(`Added (${taskInternal.id}): ${task.name}, schedule: ${schedule}`);
		}

		return taskInternal.id;
	}

	stop(number) {
		const schedule = this.scheduled[number];

		if (schedule !== undefined) {
			schedule.stop();
			delete this.scheduled[number];

			this.logger.debug(`Removed (${number})`);
		}
	}
}

module.exports = { Scheduler, expr };
