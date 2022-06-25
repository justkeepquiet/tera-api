/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.op = (function() {

    /**
     * Namespace op.
     * @exports op
     * @namespace
     */
    var op = {};

    op.OpMsg = (function() {

        /**
         * Properties of an OpMsg.
         * @memberof op
         * @interface IOpMsg
         * @property {number|null} [senderGusid] OpMsg senderGusid
         * @property {number|null} [receiverGusid] OpMsg receiverGusid
         * @property {op.OpMsg.JobType|null} [jobType] OpMsg jobType
         * @property {number|Long|null} [jobId] OpMsg jobId
         * @property {number|null} [gufid] OpMsg gufid
         * @property {op.OpMsg.ExecType|null} [execType] OpMsg execType
         * @property {number|null} [castTargetUserGroupSn] OpMsg castTargetUserGroupSn
         * @property {Uint8Array|null} [sessionKey] OpMsg sessionKey
         * @property {Array.<op.OpMsg.IArgument>|null} ["arguments"] OpMsg arguments
         * @property {number|null} [resultCode] OpMsg resultCode
         * @property {Uint8Array|null} [resultScalar] OpMsg resultScalar
         * @property {Array.<op.OpMsg.IResultSet>|null} [resultSets] OpMsg resultSets
         * @property {Uint8Array|null} [blob] OpMsg blob
         */

        /**
         * Constructs a new OpMsg.
         * @memberof op
         * @classdesc Represents an OpMsg.
         * @implements IOpMsg
         * @constructor
         * @param {op.IOpMsg=} [properties] Properties to set
         */
        function OpMsg(properties) {
            this["arguments"] = [];
            this.resultSets = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * OpMsg senderGusid.
         * @member {number} senderGusid
         * @memberof op.OpMsg
         * @instance
         */
        OpMsg.prototype.senderGusid = 0;

        /**
         * OpMsg receiverGusid.
         * @member {number} receiverGusid
         * @memberof op.OpMsg
         * @instance
         */
        OpMsg.prototype.receiverGusid = 0;

        /**
         * OpMsg jobType.
         * @member {op.OpMsg.JobType} jobType
         * @memberof op.OpMsg
         * @instance
         */
        OpMsg.prototype.jobType = 1;

        /**
         * OpMsg jobId.
         * @member {number|Long} jobId
         * @memberof op.OpMsg
         * @instance
         */
        OpMsg.prototype.jobId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * OpMsg gufid.
         * @member {number} gufid
         * @memberof op.OpMsg
         * @instance
         */
        OpMsg.prototype.gufid = 0;

        /**
         * OpMsg execType.
         * @member {op.OpMsg.ExecType} execType
         * @memberof op.OpMsg
         * @instance
         */
        OpMsg.prototype.execType = 1;

        /**
         * OpMsg castTargetUserGroupSn.
         * @member {number} castTargetUserGroupSn
         * @memberof op.OpMsg
         * @instance
         */
        OpMsg.prototype.castTargetUserGroupSn = 0;

        /**
         * OpMsg sessionKey.
         * @member {Uint8Array} sessionKey
         * @memberof op.OpMsg
         * @instance
         */
        OpMsg.prototype.sessionKey = $util.newBuffer([]);

        /**
         * OpMsg arguments.
         * @member {Array.<op.OpMsg.IArgument>} arguments
         * @memberof op.OpMsg
         * @instance
         */
        OpMsg.prototype["arguments"] = $util.emptyArray;

        /**
         * OpMsg resultCode.
         * @member {number} resultCode
         * @memberof op.OpMsg
         * @instance
         */
        OpMsg.prototype.resultCode = 0;

        /**
         * OpMsg resultScalar.
         * @member {Uint8Array} resultScalar
         * @memberof op.OpMsg
         * @instance
         */
        OpMsg.prototype.resultScalar = $util.newBuffer([]);

        /**
         * OpMsg resultSets.
         * @member {Array.<op.OpMsg.IResultSet>} resultSets
         * @memberof op.OpMsg
         * @instance
         */
        OpMsg.prototype.resultSets = $util.emptyArray;

        /**
         * OpMsg blob.
         * @member {Uint8Array} blob
         * @memberof op.OpMsg
         * @instance
         */
        OpMsg.prototype.blob = $util.newBuffer([]);

        /**
         * Creates a new OpMsg instance using the specified properties.
         * @function create
         * @memberof op.OpMsg
         * @static
         * @param {op.IOpMsg=} [properties] Properties to set
         * @returns {op.OpMsg} OpMsg instance
         */
        OpMsg.create = function create(properties) {
            return new OpMsg(properties);
        };

        /**
         * Encodes the specified OpMsg message. Does not implicitly {@link op.OpMsg.verify|verify} messages.
         * @function encode
         * @memberof op.OpMsg
         * @static
         * @param {op.IOpMsg} message OpMsg message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        OpMsg.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.senderGusid != null && Object.hasOwnProperty.call(message, "senderGusid"))
                writer.uint32(/* id 1, wireType 5 =*/13).fixed32(message.senderGusid);
            if (message.receiverGusid != null && Object.hasOwnProperty.call(message, "receiverGusid"))
                writer.uint32(/* id 2, wireType 5 =*/21).fixed32(message.receiverGusid);
            if (message.jobType != null && Object.hasOwnProperty.call(message, "jobType"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.jobType);
            if (message.jobId != null && Object.hasOwnProperty.call(message, "jobId"))
                writer.uint32(/* id 4, wireType 1 =*/33).fixed64(message.jobId);
            if (message.gufid != null && Object.hasOwnProperty.call(message, "gufid"))
                writer.uint32(/* id 5, wireType 5 =*/45).fixed32(message.gufid);
            if (message.execType != null && Object.hasOwnProperty.call(message, "execType"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.execType);
            if (message.castTargetUserGroupSn != null && Object.hasOwnProperty.call(message, "castTargetUserGroupSn"))
                writer.uint32(/* id 7, wireType 5 =*/61).fixed32(message.castTargetUserGroupSn);
            if (message.sessionKey != null && Object.hasOwnProperty.call(message, "sessionKey"))
                writer.uint32(/* id 8, wireType 2 =*/66).bytes(message.sessionKey);
            if (message["arguments"] != null && message["arguments"].length)
                for (var i = 0; i < message["arguments"].length; ++i)
                    $root.op.OpMsg.Argument.encode(message["arguments"][i], writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
            if (message.resultCode != null && Object.hasOwnProperty.call(message, "resultCode"))
                writer.uint32(/* id 10, wireType 5 =*/85).fixed32(message.resultCode);
            if (message.resultScalar != null && Object.hasOwnProperty.call(message, "resultScalar"))
                writer.uint32(/* id 11, wireType 2 =*/90).bytes(message.resultScalar);
            if (message.resultSets != null && message.resultSets.length)
                for (var i = 0; i < message.resultSets.length; ++i)
                    $root.op.OpMsg.ResultSet.encode(message.resultSets[i], writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
            if (message.blob != null && Object.hasOwnProperty.call(message, "blob"))
                writer.uint32(/* id 13, wireType 2 =*/106).bytes(message.blob);
            return writer;
        };

        /**
         * Encodes the specified OpMsg message, length delimited. Does not implicitly {@link op.OpMsg.verify|verify} messages.
         * @function encodeDelimited
         * @memberof op.OpMsg
         * @static
         * @param {op.IOpMsg} message OpMsg message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        OpMsg.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an OpMsg message from the specified reader or buffer.
         * @function decode
         * @memberof op.OpMsg
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {op.OpMsg} OpMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        OpMsg.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.op.OpMsg();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.senderGusid = reader.fixed32();
                    break;
                case 2:
                    message.receiverGusid = reader.fixed32();
                    break;
                case 3:
                    message.jobType = reader.int32();
                    break;
                case 4:
                    message.jobId = reader.fixed64();
                    break;
                case 5:
                    message.gufid = reader.fixed32();
                    break;
                case 6:
                    message.execType = reader.int32();
                    break;
                case 7:
                    message.castTargetUserGroupSn = reader.fixed32();
                    break;
                case 8:
                    message.sessionKey = reader.bytes();
                    break;
                case 9:
                    if (!(message["arguments"] && message["arguments"].length))
                        message["arguments"] = [];
                    message["arguments"].push($root.op.OpMsg.Argument.decode(reader, reader.uint32()));
                    break;
                case 10:
                    message.resultCode = reader.fixed32();
                    break;
                case 11:
                    message.resultScalar = reader.bytes();
                    break;
                case 12:
                    if (!(message.resultSets && message.resultSets.length))
                        message.resultSets = [];
                    message.resultSets.push($root.op.OpMsg.ResultSet.decode(reader, reader.uint32()));
                    break;
                case 13:
                    message.blob = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an OpMsg message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof op.OpMsg
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {op.OpMsg} OpMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        OpMsg.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an OpMsg message.
         * @function verify
         * @memberof op.OpMsg
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        OpMsg.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.senderGusid != null && message.hasOwnProperty("senderGusid"))
                if (!$util.isInteger(message.senderGusid))
                    return "senderGusid: integer expected";
            if (message.receiverGusid != null && message.hasOwnProperty("receiverGusid"))
                if (!$util.isInteger(message.receiverGusid))
                    return "receiverGusid: integer expected";
            if (message.jobType != null && message.hasOwnProperty("jobType"))
                switch (message.jobType) {
                default:
                    return "jobType: enum value expected";
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.jobId != null && message.hasOwnProperty("jobId"))
                if (!$util.isInteger(message.jobId) && !(message.jobId && $util.isInteger(message.jobId.low) && $util.isInteger(message.jobId.high)))
                    return "jobId: integer|Long expected";
            if (message.gufid != null && message.hasOwnProperty("gufid"))
                if (!$util.isInteger(message.gufid))
                    return "gufid: integer expected";
            if (message.execType != null && message.hasOwnProperty("execType"))
                switch (message.execType) {
                default:
                    return "execType: enum value expected";
                case 1:
                case 2:
                    break;
                }
            if (message.castTargetUserGroupSn != null && message.hasOwnProperty("castTargetUserGroupSn"))
                if (!$util.isInteger(message.castTargetUserGroupSn))
                    return "castTargetUserGroupSn: integer expected";
            if (message.sessionKey != null && message.hasOwnProperty("sessionKey"))
                if (!(message.sessionKey && typeof message.sessionKey.length === "number" || $util.isString(message.sessionKey)))
                    return "sessionKey: buffer expected";
            if (message["arguments"] != null && message.hasOwnProperty("arguments")) {
                if (!Array.isArray(message["arguments"]))
                    return "arguments: array expected";
                for (var i = 0; i < message["arguments"].length; ++i) {
                    var error = $root.op.OpMsg.Argument.verify(message["arguments"][i]);
                    if (error)
                        return "arguments." + error;
                }
            }
            if (message.resultCode != null && message.hasOwnProperty("resultCode"))
                if (!$util.isInteger(message.resultCode))
                    return "resultCode: integer expected";
            if (message.resultScalar != null && message.hasOwnProperty("resultScalar"))
                if (!(message.resultScalar && typeof message.resultScalar.length === "number" || $util.isString(message.resultScalar)))
                    return "resultScalar: buffer expected";
            if (message.resultSets != null && message.hasOwnProperty("resultSets")) {
                if (!Array.isArray(message.resultSets))
                    return "resultSets: array expected";
                for (var i = 0; i < message.resultSets.length; ++i) {
                    var error = $root.op.OpMsg.ResultSet.verify(message.resultSets[i]);
                    if (error)
                        return "resultSets." + error;
                }
            }
            if (message.blob != null && message.hasOwnProperty("blob"))
                if (!(message.blob && typeof message.blob.length === "number" || $util.isString(message.blob)))
                    return "blob: buffer expected";
            return null;
        };

        /**
         * Creates an OpMsg message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof op.OpMsg
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {op.OpMsg} OpMsg
         */
        OpMsg.fromObject = function fromObject(object) {
            if (object instanceof $root.op.OpMsg)
                return object;
            var message = new $root.op.OpMsg();
            if (object.senderGusid != null)
                message.senderGusid = object.senderGusid >>> 0;
            if (object.receiverGusid != null)
                message.receiverGusid = object.receiverGusid >>> 0;
            switch (object.jobType) {
            case "REQUEST":
            case 1:
                message.jobType = 1;
                break;
            case "RESPONSE":
            case 2:
                message.jobType = 2;
                break;
            case "NOTICE":
            case 3:
                message.jobType = 3;
                break;
            }
            if (object.jobId != null)
                if ($util.Long)
                    (message.jobId = $util.Long.fromValue(object.jobId)).unsigned = false;
                else if (typeof object.jobId === "string")
                    message.jobId = parseInt(object.jobId, 10);
                else if (typeof object.jobId === "number")
                    message.jobId = object.jobId;
                else if (typeof object.jobId === "object")
                    message.jobId = new $util.LongBits(object.jobId.low >>> 0, object.jobId.high >>> 0).toNumber();
            if (object.gufid != null)
                message.gufid = object.gufid >>> 0;
            switch (object.execType) {
            case "EXECUTE":
            case 1:
                message.execType = 1;
                break;
            case "CAST":
            case 2:
                message.execType = 2;
                break;
            }
            if (object.castTargetUserGroupSn != null)
                message.castTargetUserGroupSn = object.castTargetUserGroupSn >>> 0;
            if (object.sessionKey != null)
                if (typeof object.sessionKey === "string")
                    $util.base64.decode(object.sessionKey, message.sessionKey = $util.newBuffer($util.base64.length(object.sessionKey)), 0);
                else if (object.sessionKey.length)
                    message.sessionKey = object.sessionKey;
            if (object["arguments"]) {
                if (!Array.isArray(object["arguments"]))
                    throw TypeError(".op.OpMsg.arguments: array expected");
                message["arguments"] = [];
                for (var i = 0; i < object["arguments"].length; ++i) {
                    if (typeof object["arguments"][i] !== "object")
                        throw TypeError(".op.OpMsg.arguments: object expected");
                    message["arguments"][i] = $root.op.OpMsg.Argument.fromObject(object["arguments"][i]);
                }
            }
            if (object.resultCode != null)
                message.resultCode = object.resultCode >>> 0;
            if (object.resultScalar != null)
                if (typeof object.resultScalar === "string")
                    $util.base64.decode(object.resultScalar, message.resultScalar = $util.newBuffer($util.base64.length(object.resultScalar)), 0);
                else if (object.resultScalar.length)
                    message.resultScalar = object.resultScalar;
            if (object.resultSets) {
                if (!Array.isArray(object.resultSets))
                    throw TypeError(".op.OpMsg.resultSets: array expected");
                message.resultSets = [];
                for (var i = 0; i < object.resultSets.length; ++i) {
                    if (typeof object.resultSets[i] !== "object")
                        throw TypeError(".op.OpMsg.resultSets: object expected");
                    message.resultSets[i] = $root.op.OpMsg.ResultSet.fromObject(object.resultSets[i]);
                }
            }
            if (object.blob != null)
                if (typeof object.blob === "string")
                    $util.base64.decode(object.blob, message.blob = $util.newBuffer($util.base64.length(object.blob)), 0);
                else if (object.blob.length)
                    message.blob = object.blob;
            return message;
        };

        /**
         * Creates a plain object from an OpMsg message. Also converts values to other types if specified.
         * @function toObject
         * @memberof op.OpMsg
         * @static
         * @param {op.OpMsg} message OpMsg
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        OpMsg.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object["arguments"] = [];
                object.resultSets = [];
            }
            if (options.defaults) {
                object.senderGusid = 0;
                object.receiverGusid = 0;
                object.jobType = options.enums === String ? "REQUEST" : 1;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.jobId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.jobId = options.longs === String ? "0" : 0;
                object.gufid = 0;
                object.execType = options.enums === String ? "EXECUTE" : 1;
                object.castTargetUserGroupSn = 0;
                if (options.bytes === String)
                    object.sessionKey = "";
                else {
                    object.sessionKey = [];
                    if (options.bytes !== Array)
                        object.sessionKey = $util.newBuffer(object.sessionKey);
                }
                object.resultCode = 0;
                if (options.bytes === String)
                    object.resultScalar = "";
                else {
                    object.resultScalar = [];
                    if (options.bytes !== Array)
                        object.resultScalar = $util.newBuffer(object.resultScalar);
                }
                if (options.bytes === String)
                    object.blob = "";
                else {
                    object.blob = [];
                    if (options.bytes !== Array)
                        object.blob = $util.newBuffer(object.blob);
                }
            }
            if (message.senderGusid != null && message.hasOwnProperty("senderGusid"))
                object.senderGusid = message.senderGusid;
            if (message.receiverGusid != null && message.hasOwnProperty("receiverGusid"))
                object.receiverGusid = message.receiverGusid;
            if (message.jobType != null && message.hasOwnProperty("jobType"))
                object.jobType = options.enums === String ? $root.op.OpMsg.JobType[message.jobType] : message.jobType;
            if (message.jobId != null && message.hasOwnProperty("jobId"))
                if (typeof message.jobId === "number")
                    object.jobId = options.longs === String ? String(message.jobId) : message.jobId;
                else
                    object.jobId = options.longs === String ? $util.Long.prototype.toString.call(message.jobId) : options.longs === Number ? new $util.LongBits(message.jobId.low >>> 0, message.jobId.high >>> 0).toNumber() : message.jobId;
            if (message.gufid != null && message.hasOwnProperty("gufid"))
                object.gufid = message.gufid;
            if (message.execType != null && message.hasOwnProperty("execType"))
                object.execType = options.enums === String ? $root.op.OpMsg.ExecType[message.execType] : message.execType;
            if (message.castTargetUserGroupSn != null && message.hasOwnProperty("castTargetUserGroupSn"))
                object.castTargetUserGroupSn = message.castTargetUserGroupSn;
            if (message.sessionKey != null && message.hasOwnProperty("sessionKey"))
                object.sessionKey = options.bytes === String ? $util.base64.encode(message.sessionKey, 0, message.sessionKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.sessionKey) : message.sessionKey;
            if (message["arguments"] && message["arguments"].length) {
                object["arguments"] = [];
                for (var j = 0; j < message["arguments"].length; ++j)
                    object["arguments"][j] = $root.op.OpMsg.Argument.toObject(message["arguments"][j], options);
            }
            if (message.resultCode != null && message.hasOwnProperty("resultCode"))
                object.resultCode = message.resultCode;
            if (message.resultScalar != null && message.hasOwnProperty("resultScalar"))
                object.resultScalar = options.bytes === String ? $util.base64.encode(message.resultScalar, 0, message.resultScalar.length) : options.bytes === Array ? Array.prototype.slice.call(message.resultScalar) : message.resultScalar;
            if (message.resultSets && message.resultSets.length) {
                object.resultSets = [];
                for (var j = 0; j < message.resultSets.length; ++j)
                    object.resultSets[j] = $root.op.OpMsg.ResultSet.toObject(message.resultSets[j], options);
            }
            if (message.blob != null && message.hasOwnProperty("blob"))
                object.blob = options.bytes === String ? $util.base64.encode(message.blob, 0, message.blob.length) : options.bytes === Array ? Array.prototype.slice.call(message.blob) : message.blob;
            return object;
        };

        /**
         * Converts this OpMsg to JSON.
         * @function toJSON
         * @memberof op.OpMsg
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        OpMsg.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * JobType enum.
         * @name op.OpMsg.JobType
         * @enum {number}
         * @property {number} REQUEST=1 REQUEST value
         * @property {number} RESPONSE=2 RESPONSE value
         * @property {number} NOTICE=3 NOTICE value
         */
        OpMsg.JobType = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[1] = "REQUEST"] = 1;
            values[valuesById[2] = "RESPONSE"] = 2;
            values[valuesById[3] = "NOTICE"] = 3;
            return values;
        })();

        /**
         * ExecType enum.
         * @name op.OpMsg.ExecType
         * @enum {number}
         * @property {number} EXECUTE=1 EXECUTE value
         * @property {number} CAST=2 CAST value
         */
        OpMsg.ExecType = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[1] = "EXECUTE"] = 1;
            values[valuesById[2] = "CAST"] = 2;
            return values;
        })();

        OpMsg.Argument = (function() {

            /**
             * Properties of an Argument.
             * @memberof op.OpMsg
             * @interface IArgument
             * @property {Uint8Array|null} [name] Argument name
             * @property {Uint8Array} value Argument value
             */

            /**
             * Constructs a new Argument.
             * @memberof op.OpMsg
             * @classdesc Represents an Argument.
             * @implements IArgument
             * @constructor
             * @param {op.OpMsg.IArgument=} [properties] Properties to set
             */
            function Argument(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Argument name.
             * @member {Uint8Array} name
             * @memberof op.OpMsg.Argument
             * @instance
             */
            Argument.prototype.name = $util.newBuffer([]);

            /**
             * Argument value.
             * @member {Uint8Array} value
             * @memberof op.OpMsg.Argument
             * @instance
             */
            Argument.prototype.value = $util.newBuffer([]);

            /**
             * Creates a new Argument instance using the specified properties.
             * @function create
             * @memberof op.OpMsg.Argument
             * @static
             * @param {op.OpMsg.IArgument=} [properties] Properties to set
             * @returns {op.OpMsg.Argument} Argument instance
             */
            Argument.create = function create(properties) {
                return new Argument(properties);
            };

            /**
             * Encodes the specified Argument message. Does not implicitly {@link op.OpMsg.Argument.verify|verify} messages.
             * @function encode
             * @memberof op.OpMsg.Argument
             * @static
             * @param {op.OpMsg.IArgument} message Argument message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Argument.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.name);
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.value);
                return writer;
            };

            /**
             * Encodes the specified Argument message, length delimited. Does not implicitly {@link op.OpMsg.Argument.verify|verify} messages.
             * @function encodeDelimited
             * @memberof op.OpMsg.Argument
             * @static
             * @param {op.OpMsg.IArgument} message Argument message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Argument.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Argument message from the specified reader or buffer.
             * @function decode
             * @memberof op.OpMsg.Argument
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {op.OpMsg.Argument} Argument
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Argument.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.op.OpMsg.Argument();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.name = reader.bytes();
                        break;
                    case 2:
                        message.value = reader.bytes();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                if (!message.hasOwnProperty("value"))
                    throw $util.ProtocolError("missing required 'value'", { instance: message });
                return message;
            };

            /**
             * Decodes an Argument message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof op.OpMsg.Argument
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {op.OpMsg.Argument} Argument
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Argument.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Argument message.
             * @function verify
             * @memberof op.OpMsg.Argument
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Argument.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!(message.name && typeof message.name.length === "number" || $util.isString(message.name)))
                        return "name: buffer expected";
                if (!(message.value && typeof message.value.length === "number" || $util.isString(message.value)))
                    return "value: buffer expected";
                return null;
            };

            /**
             * Creates an Argument message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof op.OpMsg.Argument
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {op.OpMsg.Argument} Argument
             */
            Argument.fromObject = function fromObject(object) {
                if (object instanceof $root.op.OpMsg.Argument)
                    return object;
                var message = new $root.op.OpMsg.Argument();
                if (object.name != null)
                    if (typeof object.name === "string")
                        $util.base64.decode(object.name, message.name = $util.newBuffer($util.base64.length(object.name)), 0);
                    else if (object.name.length)
                        message.name = object.name;
                if (object.value != null)
                    if (typeof object.value === "string")
                        $util.base64.decode(object.value, message.value = $util.newBuffer($util.base64.length(object.value)), 0);
                    else if (object.value.length)
                        message.value = object.value;
                return message;
            };

            /**
             * Creates a plain object from an Argument message. Also converts values to other types if specified.
             * @function toObject
             * @memberof op.OpMsg.Argument
             * @static
             * @param {op.OpMsg.Argument} message Argument
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Argument.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    if (options.bytes === String)
                        object.name = "";
                    else {
                        object.name = [];
                        if (options.bytes !== Array)
                            object.name = $util.newBuffer(object.name);
                    }
                    if (options.bytes === String)
                        object.value = "";
                    else {
                        object.value = [];
                        if (options.bytes !== Array)
                            object.value = $util.newBuffer(object.value);
                    }
                }
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = options.bytes === String ? $util.base64.encode(message.name, 0, message.name.length) : options.bytes === Array ? Array.prototype.slice.call(message.name) : message.name;
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = options.bytes === String ? $util.base64.encode(message.value, 0, message.value.length) : options.bytes === Array ? Array.prototype.slice.call(message.value) : message.value;
                return object;
            };

            /**
             * Converts this Argument to JSON.
             * @function toJSON
             * @memberof op.OpMsg.Argument
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Argument.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Argument;
        })();

        OpMsg.ResultSet = (function() {

            /**
             * Properties of a ResultSet.
             * @memberof op.OpMsg
             * @interface IResultSet
             * @property {Array.<Uint8Array>|null} [columnNames] ResultSet columnNames
             * @property {Array.<op.OpMsg.ResultSet.IRow>|null} [rows] ResultSet rows
             * @property {number|null} [totalCount] ResultSet totalCount
             */

            /**
             * Constructs a new ResultSet.
             * @memberof op.OpMsg
             * @classdesc Represents a ResultSet.
             * @implements IResultSet
             * @constructor
             * @param {op.OpMsg.IResultSet=} [properties] Properties to set
             */
            function ResultSet(properties) {
                this.columnNames = [];
                this.rows = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ResultSet columnNames.
             * @member {Array.<Uint8Array>} columnNames
             * @memberof op.OpMsg.ResultSet
             * @instance
             */
            ResultSet.prototype.columnNames = $util.emptyArray;

            /**
             * ResultSet rows.
             * @member {Array.<op.OpMsg.ResultSet.IRow>} rows
             * @memberof op.OpMsg.ResultSet
             * @instance
             */
            ResultSet.prototype.rows = $util.emptyArray;

            /**
             * ResultSet totalCount.
             * @member {number} totalCount
             * @memberof op.OpMsg.ResultSet
             * @instance
             */
            ResultSet.prototype.totalCount = 0;

            /**
             * Creates a new ResultSet instance using the specified properties.
             * @function create
             * @memberof op.OpMsg.ResultSet
             * @static
             * @param {op.OpMsg.IResultSet=} [properties] Properties to set
             * @returns {op.OpMsg.ResultSet} ResultSet instance
             */
            ResultSet.create = function create(properties) {
                return new ResultSet(properties);
            };

            /**
             * Encodes the specified ResultSet message. Does not implicitly {@link op.OpMsg.ResultSet.verify|verify} messages.
             * @function encode
             * @memberof op.OpMsg.ResultSet
             * @static
             * @param {op.OpMsg.IResultSet} message ResultSet message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ResultSet.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.columnNames != null && message.columnNames.length)
                    for (var i = 0; i < message.columnNames.length; ++i)
                        writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.columnNames[i]);
                if (message.rows != null && message.rows.length)
                    for (var i = 0; i < message.rows.length; ++i)
                        $root.op.OpMsg.ResultSet.Row.encode(message.rows[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.totalCount != null && Object.hasOwnProperty.call(message, "totalCount"))
                    writer.uint32(/* id 3, wireType 5 =*/29).fixed32(message.totalCount);
                return writer;
            };

            /**
             * Encodes the specified ResultSet message, length delimited. Does not implicitly {@link op.OpMsg.ResultSet.verify|verify} messages.
             * @function encodeDelimited
             * @memberof op.OpMsg.ResultSet
             * @static
             * @param {op.OpMsg.IResultSet} message ResultSet message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ResultSet.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ResultSet message from the specified reader or buffer.
             * @function decode
             * @memberof op.OpMsg.ResultSet
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {op.OpMsg.ResultSet} ResultSet
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ResultSet.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.op.OpMsg.ResultSet();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        if (!(message.columnNames && message.columnNames.length))
                            message.columnNames = [];
                        message.columnNames.push(reader.bytes());
                        break;
                    case 2:
                        if (!(message.rows && message.rows.length))
                            message.rows = [];
                        message.rows.push($root.op.OpMsg.ResultSet.Row.decode(reader, reader.uint32()));
                        break;
                    case 3:
                        message.totalCount = reader.fixed32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a ResultSet message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof op.OpMsg.ResultSet
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {op.OpMsg.ResultSet} ResultSet
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ResultSet.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ResultSet message.
             * @function verify
             * @memberof op.OpMsg.ResultSet
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ResultSet.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.columnNames != null && message.hasOwnProperty("columnNames")) {
                    if (!Array.isArray(message.columnNames))
                        return "columnNames: array expected";
                    for (var i = 0; i < message.columnNames.length; ++i)
                        if (!(message.columnNames[i] && typeof message.columnNames[i].length === "number" || $util.isString(message.columnNames[i])))
                            return "columnNames: buffer[] expected";
                }
                if (message.rows != null && message.hasOwnProperty("rows")) {
                    if (!Array.isArray(message.rows))
                        return "rows: array expected";
                    for (var i = 0; i < message.rows.length; ++i) {
                        var error = $root.op.OpMsg.ResultSet.Row.verify(message.rows[i]);
                        if (error)
                            return "rows." + error;
                    }
                }
                if (message.totalCount != null && message.hasOwnProperty("totalCount"))
                    if (!$util.isInteger(message.totalCount))
                        return "totalCount: integer expected";
                return null;
            };

            /**
             * Creates a ResultSet message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof op.OpMsg.ResultSet
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {op.OpMsg.ResultSet} ResultSet
             */
            ResultSet.fromObject = function fromObject(object) {
                if (object instanceof $root.op.OpMsg.ResultSet)
                    return object;
                var message = new $root.op.OpMsg.ResultSet();
                if (object.columnNames) {
                    if (!Array.isArray(object.columnNames))
                        throw TypeError(".op.OpMsg.ResultSet.columnNames: array expected");
                    message.columnNames = [];
                    for (var i = 0; i < object.columnNames.length; ++i)
                        if (typeof object.columnNames[i] === "string")
                            $util.base64.decode(object.columnNames[i], message.columnNames[i] = $util.newBuffer($util.base64.length(object.columnNames[i])), 0);
                        else if (object.columnNames[i].length)
                            message.columnNames[i] = object.columnNames[i];
                }
                if (object.rows) {
                    if (!Array.isArray(object.rows))
                        throw TypeError(".op.OpMsg.ResultSet.rows: array expected");
                    message.rows = [];
                    for (var i = 0; i < object.rows.length; ++i) {
                        if (typeof object.rows[i] !== "object")
                            throw TypeError(".op.OpMsg.ResultSet.rows: object expected");
                        message.rows[i] = $root.op.OpMsg.ResultSet.Row.fromObject(object.rows[i]);
                    }
                }
                if (object.totalCount != null)
                    message.totalCount = object.totalCount >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a ResultSet message. Also converts values to other types if specified.
             * @function toObject
             * @memberof op.OpMsg.ResultSet
             * @static
             * @param {op.OpMsg.ResultSet} message ResultSet
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ResultSet.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults) {
                    object.columnNames = [];
                    object.rows = [];
                }
                if (options.defaults)
                    object.totalCount = 0;
                if (message.columnNames && message.columnNames.length) {
                    object.columnNames = [];
                    for (var j = 0; j < message.columnNames.length; ++j)
                        object.columnNames[j] = options.bytes === String ? $util.base64.encode(message.columnNames[j], 0, message.columnNames[j].length) : options.bytes === Array ? Array.prototype.slice.call(message.columnNames[j]) : message.columnNames[j];
                }
                if (message.rows && message.rows.length) {
                    object.rows = [];
                    for (var j = 0; j < message.rows.length; ++j)
                        object.rows[j] = $root.op.OpMsg.ResultSet.Row.toObject(message.rows[j], options);
                }
                if (message.totalCount != null && message.hasOwnProperty("totalCount"))
                    object.totalCount = message.totalCount;
                return object;
            };

            /**
             * Converts this ResultSet to JSON.
             * @function toJSON
             * @memberof op.OpMsg.ResultSet
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ResultSet.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            ResultSet.Row = (function() {

                /**
                 * Properties of a Row.
                 * @memberof op.OpMsg.ResultSet
                 * @interface IRow
                 * @property {Array.<Uint8Array>|null} [values] Row values
                 */

                /**
                 * Constructs a new Row.
                 * @memberof op.OpMsg.ResultSet
                 * @classdesc Represents a Row.
                 * @implements IRow
                 * @constructor
                 * @param {op.OpMsg.ResultSet.IRow=} [properties] Properties to set
                 */
                function Row(properties) {
                    this.values = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Row values.
                 * @member {Array.<Uint8Array>} values
                 * @memberof op.OpMsg.ResultSet.Row
                 * @instance
                 */
                Row.prototype.values = $util.emptyArray;

                /**
                 * Creates a new Row instance using the specified properties.
                 * @function create
                 * @memberof op.OpMsg.ResultSet.Row
                 * @static
                 * @param {op.OpMsg.ResultSet.IRow=} [properties] Properties to set
                 * @returns {op.OpMsg.ResultSet.Row} Row instance
                 */
                Row.create = function create(properties) {
                    return new Row(properties);
                };

                /**
                 * Encodes the specified Row message. Does not implicitly {@link op.OpMsg.ResultSet.Row.verify|verify} messages.
                 * @function encode
                 * @memberof op.OpMsg.ResultSet.Row
                 * @static
                 * @param {op.OpMsg.ResultSet.IRow} message Row message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Row.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.values != null && message.values.length)
                        for (var i = 0; i < message.values.length; ++i)
                            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.values[i]);
                    return writer;
                };

                /**
                 * Encodes the specified Row message, length delimited. Does not implicitly {@link op.OpMsg.ResultSet.Row.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof op.OpMsg.ResultSet.Row
                 * @static
                 * @param {op.OpMsg.ResultSet.IRow} message Row message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Row.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a Row message from the specified reader or buffer.
                 * @function decode
                 * @memberof op.OpMsg.ResultSet.Row
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {op.OpMsg.ResultSet.Row} Row
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Row.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.op.OpMsg.ResultSet.Row();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            if (!(message.values && message.values.length))
                                message.values = [];
                            message.values.push(reader.bytes());
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Row message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof op.OpMsg.ResultSet.Row
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {op.OpMsg.ResultSet.Row} Row
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Row.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Row message.
                 * @function verify
                 * @memberof op.OpMsg.ResultSet.Row
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Row.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.values != null && message.hasOwnProperty("values")) {
                        if (!Array.isArray(message.values))
                            return "values: array expected";
                        for (var i = 0; i < message.values.length; ++i)
                            if (!(message.values[i] && typeof message.values[i].length === "number" || $util.isString(message.values[i])))
                                return "values: buffer[] expected";
                    }
                    return null;
                };

                /**
                 * Creates a Row message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof op.OpMsg.ResultSet.Row
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {op.OpMsg.ResultSet.Row} Row
                 */
                Row.fromObject = function fromObject(object) {
                    if (object instanceof $root.op.OpMsg.ResultSet.Row)
                        return object;
                    var message = new $root.op.OpMsg.ResultSet.Row();
                    if (object.values) {
                        if (!Array.isArray(object.values))
                            throw TypeError(".op.OpMsg.ResultSet.Row.values: array expected");
                        message.values = [];
                        for (var i = 0; i < object.values.length; ++i)
                            if (typeof object.values[i] === "string")
                                $util.base64.decode(object.values[i], message.values[i] = $util.newBuffer($util.base64.length(object.values[i])), 0);
                            else if (object.values[i].length)
                                message.values[i] = object.values[i];
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a Row message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof op.OpMsg.ResultSet.Row
                 * @static
                 * @param {op.OpMsg.ResultSet.Row} message Row
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Row.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.values = [];
                    if (message.values && message.values.length) {
                        object.values = [];
                        for (var j = 0; j < message.values.length; ++j)
                            object.values[j] = options.bytes === String ? $util.base64.encode(message.values[j], 0, message.values[j].length) : options.bytes === Array ? Array.prototype.slice.call(message.values[j]) : message.values[j];
                    }
                    return object;
                };

                /**
                 * Converts this Row to JSON.
                 * @function toJSON
                 * @memberof op.OpMsg.ResultSet.Row
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Row.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return Row;
            })();

            return ResultSet;
        })();

        return OpMsg;
    })();

    return op;
})();

module.exports = $root;
