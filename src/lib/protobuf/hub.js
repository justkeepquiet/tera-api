/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.proto_hub = (function() {

    /**
     * Namespace proto_hub.
     * @exports proto_hub
     * @namespace
     */
    var proto_hub = {};

    proto_hub.RegisterReq = (function() {

        /**
         * Properties of a RegisterReq.
         * @memberof proto_hub
         * @interface IRegisterReq
         * @property {number} serverId RegisterReq serverId
         * @property {Array.<number>|null} [eventSub] RegisterReq eventSub
         */

        /**
         * Constructs a new RegisterReq.
         * @memberof proto_hub
         * @classdesc Represents a RegisterReq.
         * @implements IRegisterReq
         * @constructor
         * @param {proto_hub.IRegisterReq=} [properties] Properties to set
         */
        function RegisterReq(properties) {
            this.eventSub = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RegisterReq serverId.
         * @member {number} serverId
         * @memberof proto_hub.RegisterReq
         * @instance
         */
        RegisterReq.prototype.serverId = 0;

        /**
         * RegisterReq eventSub.
         * @member {Array.<number>} eventSub
         * @memberof proto_hub.RegisterReq
         * @instance
         */
        RegisterReq.prototype.eventSub = $util.emptyArray;

        /**
         * Creates a new RegisterReq instance using the specified properties.
         * @function create
         * @memberof proto_hub.RegisterReq
         * @static
         * @param {proto_hub.IRegisterReq=} [properties] Properties to set
         * @returns {proto_hub.RegisterReq} RegisterReq instance
         */
        RegisterReq.create = function create(properties) {
            return new RegisterReq(properties);
        };

        /**
         * Encodes the specified RegisterReq message. Does not implicitly {@link proto_hub.RegisterReq.verify|verify} messages.
         * @function encode
         * @memberof proto_hub.RegisterReq
         * @static
         * @param {proto_hub.IRegisterReq} message RegisterReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RegisterReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 5 =*/13).fixed32(message.serverId);
            if (message.eventSub != null && message.eventSub.length)
                for (var i = 0; i < message.eventSub.length; ++i)
                    writer.uint32(/* id 2, wireType 5 =*/21).fixed32(message.eventSub[i]);
            return writer;
        };

        /**
         * Encodes the specified RegisterReq message, length delimited. Does not implicitly {@link proto_hub.RegisterReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_hub.RegisterReq
         * @static
         * @param {proto_hub.IRegisterReq} message RegisterReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RegisterReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RegisterReq message from the specified reader or buffer.
         * @function decode
         * @memberof proto_hub.RegisterReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_hub.RegisterReq} RegisterReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RegisterReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_hub.RegisterReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.serverId = reader.fixed32();
                    break;
                case 2:
                    if (!(message.eventSub && message.eventSub.length))
                        message.eventSub = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.eventSub.push(reader.fixed32());
                    } else
                        message.eventSub.push(reader.fixed32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("serverId"))
                throw $util.ProtocolError("missing required 'serverId'", { instance: message });
            return message;
        };

        /**
         * Decodes a RegisterReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_hub.RegisterReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_hub.RegisterReq} RegisterReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RegisterReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RegisterReq message.
         * @function verify
         * @memberof proto_hub.RegisterReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RegisterReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.serverId))
                return "serverId: integer expected";
            if (message.eventSub != null && message.hasOwnProperty("eventSub")) {
                if (!Array.isArray(message.eventSub))
                    return "eventSub: array expected";
                for (var i = 0; i < message.eventSub.length; ++i)
                    if (!$util.isInteger(message.eventSub[i]))
                        return "eventSub: integer[] expected";
            }
            return null;
        };

        /**
         * Creates a RegisterReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_hub.RegisterReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_hub.RegisterReq} RegisterReq
         */
        RegisterReq.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_hub.RegisterReq)
                return object;
            var message = new $root.proto_hub.RegisterReq();
            if (object.serverId != null)
                message.serverId = object.serverId >>> 0;
            if (object.eventSub) {
                if (!Array.isArray(object.eventSub))
                    throw TypeError(".proto_hub.RegisterReq.eventSub: array expected");
                message.eventSub = [];
                for (var i = 0; i < object.eventSub.length; ++i)
                    message.eventSub[i] = object.eventSub[i] >>> 0;
            }
            return message;
        };

        /**
         * Creates a plain object from a RegisterReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_hub.RegisterReq
         * @static
         * @param {proto_hub.RegisterReq} message RegisterReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RegisterReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.eventSub = [];
            if (options.defaults)
                object.serverId = 0;
            if (message.serverId != null && message.hasOwnProperty("serverId"))
                object.serverId = message.serverId;
            if (message.eventSub && message.eventSub.length) {
                object.eventSub = [];
                for (var j = 0; j < message.eventSub.length; ++j)
                    object.eventSub[j] = message.eventSub[j];
            }
            return object;
        };

        /**
         * Converts this RegisterReq to JSON.
         * @function toJSON
         * @memberof proto_hub.RegisterReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RegisterReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RegisterReq;
    })();

    proto_hub.RegisterAns = (function() {

        /**
         * Properties of a RegisterAns.
         * @memberof proto_hub
         * @interface IRegisterAns
         * @property {boolean} result RegisterAns result
         * @property {Array.<number>|null} [serverList] RegisterAns serverList
         */

        /**
         * Constructs a new RegisterAns.
         * @memberof proto_hub
         * @classdesc Represents a RegisterAns.
         * @implements IRegisterAns
         * @constructor
         * @param {proto_hub.IRegisterAns=} [properties] Properties to set
         */
        function RegisterAns(properties) {
            this.serverList = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RegisterAns result.
         * @member {boolean} result
         * @memberof proto_hub.RegisterAns
         * @instance
         */
        RegisterAns.prototype.result = false;

        /**
         * RegisterAns serverList.
         * @member {Array.<number>} serverList
         * @memberof proto_hub.RegisterAns
         * @instance
         */
        RegisterAns.prototype.serverList = $util.emptyArray;

        /**
         * Creates a new RegisterAns instance using the specified properties.
         * @function create
         * @memberof proto_hub.RegisterAns
         * @static
         * @param {proto_hub.IRegisterAns=} [properties] Properties to set
         * @returns {proto_hub.RegisterAns} RegisterAns instance
         */
        RegisterAns.create = function create(properties) {
            return new RegisterAns(properties);
        };

        /**
         * Encodes the specified RegisterAns message. Does not implicitly {@link proto_hub.RegisterAns.verify|verify} messages.
         * @function encode
         * @memberof proto_hub.RegisterAns
         * @static
         * @param {proto_hub.IRegisterAns} message RegisterAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RegisterAns.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 0 =*/8).bool(message.result);
            if (message.serverList != null && message.serverList.length)
                for (var i = 0; i < message.serverList.length; ++i)
                    writer.uint32(/* id 2, wireType 5 =*/21).fixed32(message.serverList[i]);
            return writer;
        };

        /**
         * Encodes the specified RegisterAns message, length delimited. Does not implicitly {@link proto_hub.RegisterAns.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_hub.RegisterAns
         * @static
         * @param {proto_hub.IRegisterAns} message RegisterAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RegisterAns.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RegisterAns message from the specified reader or buffer.
         * @function decode
         * @memberof proto_hub.RegisterAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_hub.RegisterAns} RegisterAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RegisterAns.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_hub.RegisterAns();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.result = reader.bool();
                    break;
                case 2:
                    if (!(message.serverList && message.serverList.length))
                        message.serverList = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.serverList.push(reader.fixed32());
                    } else
                        message.serverList.push(reader.fixed32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("result"))
                throw $util.ProtocolError("missing required 'result'", { instance: message });
            return message;
        };

        /**
         * Decodes a RegisterAns message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_hub.RegisterAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_hub.RegisterAns} RegisterAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RegisterAns.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RegisterAns message.
         * @function verify
         * @memberof proto_hub.RegisterAns
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RegisterAns.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (typeof message.result !== "boolean")
                return "result: boolean expected";
            if (message.serverList != null && message.hasOwnProperty("serverList")) {
                if (!Array.isArray(message.serverList))
                    return "serverList: array expected";
                for (var i = 0; i < message.serverList.length; ++i)
                    if (!$util.isInteger(message.serverList[i]))
                        return "serverList: integer[] expected";
            }
            return null;
        };

        /**
         * Creates a RegisterAns message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_hub.RegisterAns
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_hub.RegisterAns} RegisterAns
         */
        RegisterAns.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_hub.RegisterAns)
                return object;
            var message = new $root.proto_hub.RegisterAns();
            if (object.result != null)
                message.result = Boolean(object.result);
            if (object.serverList) {
                if (!Array.isArray(object.serverList))
                    throw TypeError(".proto_hub.RegisterAns.serverList: array expected");
                message.serverList = [];
                for (var i = 0; i < object.serverList.length; ++i)
                    message.serverList[i] = object.serverList[i] >>> 0;
            }
            return message;
        };

        /**
         * Creates a plain object from a RegisterAns message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_hub.RegisterAns
         * @static
         * @param {proto_hub.RegisterAns} message RegisterAns
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RegisterAns.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.serverList = [];
            if (options.defaults)
                object.result = false;
            if (message.result != null && message.hasOwnProperty("result"))
                object.result = message.result;
            if (message.serverList && message.serverList.length) {
                object.serverList = [];
                for (var j = 0; j < message.serverList.length; ++j)
                    object.serverList[j] = message.serverList[j];
            }
            return object;
        };

        /**
         * Converts this RegisterAns to JSON.
         * @function toJSON
         * @memberof proto_hub.RegisterAns
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RegisterAns.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RegisterAns;
    })();

    proto_hub.SendMessageReq = (function() {

        /**
         * Properties of a SendMessageReq.
         * @memberof proto_hub
         * @interface ISendMessageReq
         * @property {number|Long} jobId SendMessageReq jobId
         * @property {number} serverId SendMessageReq serverId
         * @property {Uint8Array} msgBuf SendMessageReq msgBuf
         */

        /**
         * Constructs a new SendMessageReq.
         * @memberof proto_hub
         * @classdesc Represents a SendMessageReq.
         * @implements ISendMessageReq
         * @constructor
         * @param {proto_hub.ISendMessageReq=} [properties] Properties to set
         */
        function SendMessageReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SendMessageReq jobId.
         * @member {number|Long} jobId
         * @memberof proto_hub.SendMessageReq
         * @instance
         */
        SendMessageReq.prototype.jobId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * SendMessageReq serverId.
         * @member {number} serverId
         * @memberof proto_hub.SendMessageReq
         * @instance
         */
        SendMessageReq.prototype.serverId = 0;

        /**
         * SendMessageReq msgBuf.
         * @member {Uint8Array} msgBuf
         * @memberof proto_hub.SendMessageReq
         * @instance
         */
        SendMessageReq.prototype.msgBuf = $util.newBuffer([]);

        /**
         * Creates a new SendMessageReq instance using the specified properties.
         * @function create
         * @memberof proto_hub.SendMessageReq
         * @static
         * @param {proto_hub.ISendMessageReq=} [properties] Properties to set
         * @returns {proto_hub.SendMessageReq} SendMessageReq instance
         */
        SendMessageReq.create = function create(properties) {
            return new SendMessageReq(properties);
        };

        /**
         * Encodes the specified SendMessageReq message. Does not implicitly {@link proto_hub.SendMessageReq.verify|verify} messages.
         * @function encode
         * @memberof proto_hub.SendMessageReq
         * @static
         * @param {proto_hub.ISendMessageReq} message SendMessageReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SendMessageReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 1 =*/9).fixed64(message.jobId);
            writer.uint32(/* id 2, wireType 5 =*/21).fixed32(message.serverId);
            writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.msgBuf);
            return writer;
        };

        /**
         * Encodes the specified SendMessageReq message, length delimited. Does not implicitly {@link proto_hub.SendMessageReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_hub.SendMessageReq
         * @static
         * @param {proto_hub.ISendMessageReq} message SendMessageReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SendMessageReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SendMessageReq message from the specified reader or buffer.
         * @function decode
         * @memberof proto_hub.SendMessageReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_hub.SendMessageReq} SendMessageReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SendMessageReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_hub.SendMessageReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.jobId = reader.fixed64();
                    break;
                case 2:
                    message.serverId = reader.fixed32();
                    break;
                case 3:
                    message.msgBuf = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("jobId"))
                throw $util.ProtocolError("missing required 'jobId'", { instance: message });
            if (!message.hasOwnProperty("serverId"))
                throw $util.ProtocolError("missing required 'serverId'", { instance: message });
            if (!message.hasOwnProperty("msgBuf"))
                throw $util.ProtocolError("missing required 'msgBuf'", { instance: message });
            return message;
        };

        /**
         * Decodes a SendMessageReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_hub.SendMessageReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_hub.SendMessageReq} SendMessageReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SendMessageReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SendMessageReq message.
         * @function verify
         * @memberof proto_hub.SendMessageReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SendMessageReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.jobId) && !(message.jobId && $util.isInteger(message.jobId.low) && $util.isInteger(message.jobId.high)))
                return "jobId: integer|Long expected";
            if (!$util.isInteger(message.serverId))
                return "serverId: integer expected";
            if (!(message.msgBuf && typeof message.msgBuf.length === "number" || $util.isString(message.msgBuf)))
                return "msgBuf: buffer expected";
            return null;
        };

        /**
         * Creates a SendMessageReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_hub.SendMessageReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_hub.SendMessageReq} SendMessageReq
         */
        SendMessageReq.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_hub.SendMessageReq)
                return object;
            var message = new $root.proto_hub.SendMessageReq();
            if (object.jobId != null)
                if ($util.Long)
                    (message.jobId = $util.Long.fromValue(object.jobId)).unsigned = false;
                else if (typeof object.jobId === "string")
                    message.jobId = parseInt(object.jobId, 10);
                else if (typeof object.jobId === "number")
                    message.jobId = object.jobId;
                else if (typeof object.jobId === "object")
                    message.jobId = new $util.LongBits(object.jobId.low >>> 0, object.jobId.high >>> 0).toNumber();
            if (object.serverId != null)
                message.serverId = object.serverId >>> 0;
            if (object.msgBuf != null)
                if (typeof object.msgBuf === "string")
                    $util.base64.decode(object.msgBuf, message.msgBuf = $util.newBuffer($util.base64.length(object.msgBuf)), 0);
                else if (object.msgBuf.length)
                    message.msgBuf = object.msgBuf;
            return message;
        };

        /**
         * Creates a plain object from a SendMessageReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_hub.SendMessageReq
         * @static
         * @param {proto_hub.SendMessageReq} message SendMessageReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SendMessageReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.jobId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.jobId = options.longs === String ? "0" : 0;
                object.serverId = 0;
                if (options.bytes === String)
                    object.msgBuf = "";
                else {
                    object.msgBuf = [];
                    if (options.bytes !== Array)
                        object.msgBuf = $util.newBuffer(object.msgBuf);
                }
            }
            if (message.jobId != null && message.hasOwnProperty("jobId"))
                if (typeof message.jobId === "number")
                    object.jobId = options.longs === String ? String(message.jobId) : message.jobId;
                else
                    object.jobId = options.longs === String ? $util.Long.prototype.toString.call(message.jobId) : options.longs === Number ? new $util.LongBits(message.jobId.low >>> 0, message.jobId.high >>> 0).toNumber() : message.jobId;
            if (message.serverId != null && message.hasOwnProperty("serverId"))
                object.serverId = message.serverId;
            if (message.msgBuf != null && message.hasOwnProperty("msgBuf"))
                object.msgBuf = options.bytes === String ? $util.base64.encode(message.msgBuf, 0, message.msgBuf.length) : options.bytes === Array ? Array.prototype.slice.call(message.msgBuf) : message.msgBuf;
            return object;
        };

        /**
         * Converts this SendMessageReq to JSON.
         * @function toJSON
         * @memberof proto_hub.SendMessageReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SendMessageReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return SendMessageReq;
    })();

    proto_hub.SendMessageAns = (function() {

        /**
         * Properties of a SendMessageAns.
         * @memberof proto_hub
         * @interface ISendMessageAns
         * @property {number|Long} jobId SendMessageAns jobId
         * @property {number} serverId SendMessageAns serverId
         * @property {number} destCount SendMessageAns destCount
         * @property {boolean} result SendMessageAns result
         */

        /**
         * Constructs a new SendMessageAns.
         * @memberof proto_hub
         * @classdesc Represents a SendMessageAns.
         * @implements ISendMessageAns
         * @constructor
         * @param {proto_hub.ISendMessageAns=} [properties] Properties to set
         */
        function SendMessageAns(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SendMessageAns jobId.
         * @member {number|Long} jobId
         * @memberof proto_hub.SendMessageAns
         * @instance
         */
        SendMessageAns.prototype.jobId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * SendMessageAns serverId.
         * @member {number} serverId
         * @memberof proto_hub.SendMessageAns
         * @instance
         */
        SendMessageAns.prototype.serverId = 0;

        /**
         * SendMessageAns destCount.
         * @member {number} destCount
         * @memberof proto_hub.SendMessageAns
         * @instance
         */
        SendMessageAns.prototype.destCount = 0;

        /**
         * SendMessageAns result.
         * @member {boolean} result
         * @memberof proto_hub.SendMessageAns
         * @instance
         */
        SendMessageAns.prototype.result = false;

        /**
         * Creates a new SendMessageAns instance using the specified properties.
         * @function create
         * @memberof proto_hub.SendMessageAns
         * @static
         * @param {proto_hub.ISendMessageAns=} [properties] Properties to set
         * @returns {proto_hub.SendMessageAns} SendMessageAns instance
         */
        SendMessageAns.create = function create(properties) {
            return new SendMessageAns(properties);
        };

        /**
         * Encodes the specified SendMessageAns message. Does not implicitly {@link proto_hub.SendMessageAns.verify|verify} messages.
         * @function encode
         * @memberof proto_hub.SendMessageAns
         * @static
         * @param {proto_hub.ISendMessageAns} message SendMessageAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SendMessageAns.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 1 =*/9).fixed64(message.jobId);
            writer.uint32(/* id 2, wireType 5 =*/21).fixed32(message.serverId);
            writer.uint32(/* id 3, wireType 5 =*/29).fixed32(message.destCount);
            writer.uint32(/* id 4, wireType 0 =*/32).bool(message.result);
            return writer;
        };

        /**
         * Encodes the specified SendMessageAns message, length delimited. Does not implicitly {@link proto_hub.SendMessageAns.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_hub.SendMessageAns
         * @static
         * @param {proto_hub.ISendMessageAns} message SendMessageAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SendMessageAns.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SendMessageAns message from the specified reader or buffer.
         * @function decode
         * @memberof proto_hub.SendMessageAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_hub.SendMessageAns} SendMessageAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SendMessageAns.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_hub.SendMessageAns();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.jobId = reader.fixed64();
                    break;
                case 2:
                    message.serverId = reader.fixed32();
                    break;
                case 3:
                    message.destCount = reader.fixed32();
                    break;
                case 4:
                    message.result = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("jobId"))
                throw $util.ProtocolError("missing required 'jobId'", { instance: message });
            if (!message.hasOwnProperty("serverId"))
                throw $util.ProtocolError("missing required 'serverId'", { instance: message });
            if (!message.hasOwnProperty("destCount"))
                throw $util.ProtocolError("missing required 'destCount'", { instance: message });
            if (!message.hasOwnProperty("result"))
                throw $util.ProtocolError("missing required 'result'", { instance: message });
            return message;
        };

        /**
         * Decodes a SendMessageAns message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_hub.SendMessageAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_hub.SendMessageAns} SendMessageAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SendMessageAns.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SendMessageAns message.
         * @function verify
         * @memberof proto_hub.SendMessageAns
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SendMessageAns.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.jobId) && !(message.jobId && $util.isInteger(message.jobId.low) && $util.isInteger(message.jobId.high)))
                return "jobId: integer|Long expected";
            if (!$util.isInteger(message.serverId))
                return "serverId: integer expected";
            if (!$util.isInteger(message.destCount))
                return "destCount: integer expected";
            if (typeof message.result !== "boolean")
                return "result: boolean expected";
            return null;
        };

        /**
         * Creates a SendMessageAns message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_hub.SendMessageAns
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_hub.SendMessageAns} SendMessageAns
         */
        SendMessageAns.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_hub.SendMessageAns)
                return object;
            var message = new $root.proto_hub.SendMessageAns();
            if (object.jobId != null)
                if ($util.Long)
                    (message.jobId = $util.Long.fromValue(object.jobId)).unsigned = false;
                else if (typeof object.jobId === "string")
                    message.jobId = parseInt(object.jobId, 10);
                else if (typeof object.jobId === "number")
                    message.jobId = object.jobId;
                else if (typeof object.jobId === "object")
                    message.jobId = new $util.LongBits(object.jobId.low >>> 0, object.jobId.high >>> 0).toNumber();
            if (object.serverId != null)
                message.serverId = object.serverId >>> 0;
            if (object.destCount != null)
                message.destCount = object.destCount >>> 0;
            if (object.result != null)
                message.result = Boolean(object.result);
            return message;
        };

        /**
         * Creates a plain object from a SendMessageAns message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_hub.SendMessageAns
         * @static
         * @param {proto_hub.SendMessageAns} message SendMessageAns
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SendMessageAns.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.jobId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.jobId = options.longs === String ? "0" : 0;
                object.serverId = 0;
                object.destCount = 0;
                object.result = false;
            }
            if (message.jobId != null && message.hasOwnProperty("jobId"))
                if (typeof message.jobId === "number")
                    object.jobId = options.longs === String ? String(message.jobId) : message.jobId;
                else
                    object.jobId = options.longs === String ? $util.Long.prototype.toString.call(message.jobId) : options.longs === Number ? new $util.LongBits(message.jobId.low >>> 0, message.jobId.high >>> 0).toNumber() : message.jobId;
            if (message.serverId != null && message.hasOwnProperty("serverId"))
                object.serverId = message.serverId;
            if (message.destCount != null && message.hasOwnProperty("destCount"))
                object.destCount = message.destCount;
            if (message.result != null && message.hasOwnProperty("result"))
                object.result = message.result;
            return object;
        };

        /**
         * Converts this SendMessageAns to JSON.
         * @function toJSON
         * @memberof proto_hub.SendMessageAns
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SendMessageAns.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return SendMessageAns;
    })();

    proto_hub.RecvMessageReq = (function() {

        /**
         * Properties of a RecvMessageReq.
         * @memberof proto_hub
         * @interface IRecvMessageReq
         * @property {number} serverId RecvMessageReq serverId
         * @property {number|Long} jobId RecvMessageReq jobId
         * @property {Uint8Array} msgBuf RecvMessageReq msgBuf
         */

        /**
         * Constructs a new RecvMessageReq.
         * @memberof proto_hub
         * @classdesc Represents a RecvMessageReq.
         * @implements IRecvMessageReq
         * @constructor
         * @param {proto_hub.IRecvMessageReq=} [properties] Properties to set
         */
        function RecvMessageReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RecvMessageReq serverId.
         * @member {number} serverId
         * @memberof proto_hub.RecvMessageReq
         * @instance
         */
        RecvMessageReq.prototype.serverId = 0;

        /**
         * RecvMessageReq jobId.
         * @member {number|Long} jobId
         * @memberof proto_hub.RecvMessageReq
         * @instance
         */
        RecvMessageReq.prototype.jobId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * RecvMessageReq msgBuf.
         * @member {Uint8Array} msgBuf
         * @memberof proto_hub.RecvMessageReq
         * @instance
         */
        RecvMessageReq.prototype.msgBuf = $util.newBuffer([]);

        /**
         * Creates a new RecvMessageReq instance using the specified properties.
         * @function create
         * @memberof proto_hub.RecvMessageReq
         * @static
         * @param {proto_hub.IRecvMessageReq=} [properties] Properties to set
         * @returns {proto_hub.RecvMessageReq} RecvMessageReq instance
         */
        RecvMessageReq.create = function create(properties) {
            return new RecvMessageReq(properties);
        };

        /**
         * Encodes the specified RecvMessageReq message. Does not implicitly {@link proto_hub.RecvMessageReq.verify|verify} messages.
         * @function encode
         * @memberof proto_hub.RecvMessageReq
         * @static
         * @param {proto_hub.IRecvMessageReq} message RecvMessageReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RecvMessageReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 5 =*/13).fixed32(message.serverId);
            writer.uint32(/* id 2, wireType 1 =*/17).fixed64(message.jobId);
            writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.msgBuf);
            return writer;
        };

        /**
         * Encodes the specified RecvMessageReq message, length delimited. Does not implicitly {@link proto_hub.RecvMessageReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_hub.RecvMessageReq
         * @static
         * @param {proto_hub.IRecvMessageReq} message RecvMessageReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RecvMessageReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RecvMessageReq message from the specified reader or buffer.
         * @function decode
         * @memberof proto_hub.RecvMessageReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_hub.RecvMessageReq} RecvMessageReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RecvMessageReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_hub.RecvMessageReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.serverId = reader.fixed32();
                    break;
                case 2:
                    message.jobId = reader.fixed64();
                    break;
                case 3:
                    message.msgBuf = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("serverId"))
                throw $util.ProtocolError("missing required 'serverId'", { instance: message });
            if (!message.hasOwnProperty("jobId"))
                throw $util.ProtocolError("missing required 'jobId'", { instance: message });
            if (!message.hasOwnProperty("msgBuf"))
                throw $util.ProtocolError("missing required 'msgBuf'", { instance: message });
            return message;
        };

        /**
         * Decodes a RecvMessageReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_hub.RecvMessageReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_hub.RecvMessageReq} RecvMessageReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RecvMessageReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RecvMessageReq message.
         * @function verify
         * @memberof proto_hub.RecvMessageReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RecvMessageReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.serverId))
                return "serverId: integer expected";
            if (!$util.isInteger(message.jobId) && !(message.jobId && $util.isInteger(message.jobId.low) && $util.isInteger(message.jobId.high)))
                return "jobId: integer|Long expected";
            if (!(message.msgBuf && typeof message.msgBuf.length === "number" || $util.isString(message.msgBuf)))
                return "msgBuf: buffer expected";
            return null;
        };

        /**
         * Creates a RecvMessageReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_hub.RecvMessageReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_hub.RecvMessageReq} RecvMessageReq
         */
        RecvMessageReq.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_hub.RecvMessageReq)
                return object;
            var message = new $root.proto_hub.RecvMessageReq();
            if (object.serverId != null)
                message.serverId = object.serverId >>> 0;
            if (object.jobId != null)
                if ($util.Long)
                    (message.jobId = $util.Long.fromValue(object.jobId)).unsigned = false;
                else if (typeof object.jobId === "string")
                    message.jobId = parseInt(object.jobId, 10);
                else if (typeof object.jobId === "number")
                    message.jobId = object.jobId;
                else if (typeof object.jobId === "object")
                    message.jobId = new $util.LongBits(object.jobId.low >>> 0, object.jobId.high >>> 0).toNumber();
            if (object.msgBuf != null)
                if (typeof object.msgBuf === "string")
                    $util.base64.decode(object.msgBuf, message.msgBuf = $util.newBuffer($util.base64.length(object.msgBuf)), 0);
                else if (object.msgBuf.length)
                    message.msgBuf = object.msgBuf;
            return message;
        };

        /**
         * Creates a plain object from a RecvMessageReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_hub.RecvMessageReq
         * @static
         * @param {proto_hub.RecvMessageReq} message RecvMessageReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RecvMessageReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.serverId = 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.jobId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.jobId = options.longs === String ? "0" : 0;
                if (options.bytes === String)
                    object.msgBuf = "";
                else {
                    object.msgBuf = [];
                    if (options.bytes !== Array)
                        object.msgBuf = $util.newBuffer(object.msgBuf);
                }
            }
            if (message.serverId != null && message.hasOwnProperty("serverId"))
                object.serverId = message.serverId;
            if (message.jobId != null && message.hasOwnProperty("jobId"))
                if (typeof message.jobId === "number")
                    object.jobId = options.longs === String ? String(message.jobId) : message.jobId;
                else
                    object.jobId = options.longs === String ? $util.Long.prototype.toString.call(message.jobId) : options.longs === Number ? new $util.LongBits(message.jobId.low >>> 0, message.jobId.high >>> 0).toNumber() : message.jobId;
            if (message.msgBuf != null && message.hasOwnProperty("msgBuf"))
                object.msgBuf = options.bytes === String ? $util.base64.encode(message.msgBuf, 0, message.msgBuf.length) : options.bytes === Array ? Array.prototype.slice.call(message.msgBuf) : message.msgBuf;
            return object;
        };

        /**
         * Converts this RecvMessageReq to JSON.
         * @function toJSON
         * @memberof proto_hub.RecvMessageReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RecvMessageReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RecvMessageReq;
    })();

    proto_hub.PingReq = (function() {

        /**
         * Properties of a PingReq.
         * @memberof proto_hub
         * @interface IPingReq
         */

        /**
         * Constructs a new PingReq.
         * @memberof proto_hub
         * @classdesc Represents a PingReq.
         * @implements IPingReq
         * @constructor
         * @param {proto_hub.IPingReq=} [properties] Properties to set
         */
        function PingReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new PingReq instance using the specified properties.
         * @function create
         * @memberof proto_hub.PingReq
         * @static
         * @param {proto_hub.IPingReq=} [properties] Properties to set
         * @returns {proto_hub.PingReq} PingReq instance
         */
        PingReq.create = function create(properties) {
            return new PingReq(properties);
        };

        /**
         * Encodes the specified PingReq message. Does not implicitly {@link proto_hub.PingReq.verify|verify} messages.
         * @function encode
         * @memberof proto_hub.PingReq
         * @static
         * @param {proto_hub.IPingReq} message PingReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PingReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified PingReq message, length delimited. Does not implicitly {@link proto_hub.PingReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_hub.PingReq
         * @static
         * @param {proto_hub.IPingReq} message PingReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PingReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PingReq message from the specified reader or buffer.
         * @function decode
         * @memberof proto_hub.PingReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_hub.PingReq} PingReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PingReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_hub.PingReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PingReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_hub.PingReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_hub.PingReq} PingReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PingReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PingReq message.
         * @function verify
         * @memberof proto_hub.PingReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PingReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates a PingReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_hub.PingReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_hub.PingReq} PingReq
         */
        PingReq.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_hub.PingReq)
                return object;
            return new $root.proto_hub.PingReq();
        };

        /**
         * Creates a plain object from a PingReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_hub.PingReq
         * @static
         * @param {proto_hub.PingReq} message PingReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PingReq.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this PingReq to JSON.
         * @function toJSON
         * @memberof proto_hub.PingReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PingReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PingReq;
    })();

    proto_hub.PingAns = (function() {

        /**
         * Properties of a PingAns.
         * @memberof proto_hub
         * @interface IPingAns
         */

        /**
         * Constructs a new PingAns.
         * @memberof proto_hub
         * @classdesc Represents a PingAns.
         * @implements IPingAns
         * @constructor
         * @param {proto_hub.IPingAns=} [properties] Properties to set
         */
        function PingAns(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new PingAns instance using the specified properties.
         * @function create
         * @memberof proto_hub.PingAns
         * @static
         * @param {proto_hub.IPingAns=} [properties] Properties to set
         * @returns {proto_hub.PingAns} PingAns instance
         */
        PingAns.create = function create(properties) {
            return new PingAns(properties);
        };

        /**
         * Encodes the specified PingAns message. Does not implicitly {@link proto_hub.PingAns.verify|verify} messages.
         * @function encode
         * @memberof proto_hub.PingAns
         * @static
         * @param {proto_hub.IPingAns} message PingAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PingAns.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified PingAns message, length delimited. Does not implicitly {@link proto_hub.PingAns.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_hub.PingAns
         * @static
         * @param {proto_hub.IPingAns} message PingAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PingAns.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PingAns message from the specified reader or buffer.
         * @function decode
         * @memberof proto_hub.PingAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_hub.PingAns} PingAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PingAns.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_hub.PingAns();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PingAns message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_hub.PingAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_hub.PingAns} PingAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PingAns.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PingAns message.
         * @function verify
         * @memberof proto_hub.PingAns
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PingAns.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates a PingAns message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_hub.PingAns
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_hub.PingAns} PingAns
         */
        PingAns.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_hub.PingAns)
                return object;
            return new $root.proto_hub.PingAns();
        };

        /**
         * Creates a plain object from a PingAns message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_hub.PingAns
         * @static
         * @param {proto_hub.PingAns} message PingAns
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PingAns.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this PingAns to JSON.
         * @function toJSON
         * @memberof proto_hub.PingAns
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PingAns.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PingAns;
    })();

    proto_hub.ServerEvent = (function() {

        /**
         * Properties of a ServerEvent.
         * @memberof proto_hub
         * @interface IServerEvent
         * @property {number} serverId ServerEvent serverId
         * @property {proto_hub.ServerEvent.event_type} event ServerEvent event
         */

        /**
         * Constructs a new ServerEvent.
         * @memberof proto_hub
         * @classdesc Represents a ServerEvent.
         * @implements IServerEvent
         * @constructor
         * @param {proto_hub.IServerEvent=} [properties] Properties to set
         */
        function ServerEvent(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ServerEvent serverId.
         * @member {number} serverId
         * @memberof proto_hub.ServerEvent
         * @instance
         */
        ServerEvent.prototype.serverId = 0;

        /**
         * ServerEvent event.
         * @member {proto_hub.ServerEvent.event_type} event
         * @memberof proto_hub.ServerEvent
         * @instance
         */
        ServerEvent.prototype.event = 0;

        /**
         * Creates a new ServerEvent instance using the specified properties.
         * @function create
         * @memberof proto_hub.ServerEvent
         * @static
         * @param {proto_hub.IServerEvent=} [properties] Properties to set
         * @returns {proto_hub.ServerEvent} ServerEvent instance
         */
        ServerEvent.create = function create(properties) {
            return new ServerEvent(properties);
        };

        /**
         * Encodes the specified ServerEvent message. Does not implicitly {@link proto_hub.ServerEvent.verify|verify} messages.
         * @function encode
         * @memberof proto_hub.ServerEvent
         * @static
         * @param {proto_hub.IServerEvent} message ServerEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ServerEvent.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 5 =*/13).fixed32(message.serverId);
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.event);
            return writer;
        };

        /**
         * Encodes the specified ServerEvent message, length delimited. Does not implicitly {@link proto_hub.ServerEvent.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_hub.ServerEvent
         * @static
         * @param {proto_hub.IServerEvent} message ServerEvent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ServerEvent.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ServerEvent message from the specified reader or buffer.
         * @function decode
         * @memberof proto_hub.ServerEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_hub.ServerEvent} ServerEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ServerEvent.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_hub.ServerEvent();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.serverId = reader.fixed32();
                    break;
                case 2:
                    message.event = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("serverId"))
                throw $util.ProtocolError("missing required 'serverId'", { instance: message });
            if (!message.hasOwnProperty("event"))
                throw $util.ProtocolError("missing required 'event'", { instance: message });
            return message;
        };

        /**
         * Decodes a ServerEvent message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_hub.ServerEvent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_hub.ServerEvent} ServerEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ServerEvent.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ServerEvent message.
         * @function verify
         * @memberof proto_hub.ServerEvent
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ServerEvent.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.serverId))
                return "serverId: integer expected";
            switch (message.event) {
            default:
                return "event: enum value expected";
            case 0:
            case 1:
                break;
            }
            return null;
        };

        /**
         * Creates a ServerEvent message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_hub.ServerEvent
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_hub.ServerEvent} ServerEvent
         */
        ServerEvent.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_hub.ServerEvent)
                return object;
            var message = new $root.proto_hub.ServerEvent();
            if (object.serverId != null)
                message.serverId = object.serverId >>> 0;
            switch (object.event) {
            case "CONNECTED":
            case 0:
                message.event = 0;
                break;
            case "DISCONNECTED":
            case 1:
                message.event = 1;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a ServerEvent message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_hub.ServerEvent
         * @static
         * @param {proto_hub.ServerEvent} message ServerEvent
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ServerEvent.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.serverId = 0;
                object.event = options.enums === String ? "CONNECTED" : 0;
            }
            if (message.serverId != null && message.hasOwnProperty("serverId"))
                object.serverId = message.serverId;
            if (message.event != null && message.hasOwnProperty("event"))
                object.event = options.enums === String ? $root.proto_hub.ServerEvent.event_type[message.event] : message.event;
            return object;
        };

        /**
         * Converts this ServerEvent to JSON.
         * @function toJSON
         * @memberof proto_hub.ServerEvent
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ServerEvent.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * event_type enum.
         * @name proto_hub.ServerEvent.event_type
         * @enum {number}
         * @property {number} CONNECTED=0 CONNECTED value
         * @property {number} DISCONNECTED=1 DISCONNECTED value
         */
        ServerEvent.event_type = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "CONNECTED"] = 0;
            values[valuesById[1] = "DISCONNECTED"] = 1;
            return values;
        })();

        return ServerEvent;
    })();

    return proto_hub;
})();

module.exports = $root;
