"use strict";

module.exports.bool = (parameter, def = undefined) => (
	process.env[parameter] !== undefined ? /^true$/i.test(process.env[parameter]) : def
);

module.exports.string = (parameter, def = undefined) => (
	process.env[parameter] !== undefined ? process.env[parameter].toString() : def
);

module.exports.number = (parameter, def = undefined) => (
	process.env[parameter] !== undefined ? Number(process.env[parameter]) : def
);

module.exports.array = (parameter, def = undefined, separator = ",") => (
	process.env[parameter] !== undefined ? process.env[parameter].split(separator).map(el => el.trim()) : def
);