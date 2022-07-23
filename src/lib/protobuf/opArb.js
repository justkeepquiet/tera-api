/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.proto_oparb = (function() {

    /**
     * Namespace proto_oparb.
     * @exports proto_oparb
     * @namespace
     */
    var proto_oparb = {};

    proto_oparb.opmsg = (function() {

        /**
         * Properties of an opmsg.
         * @memberof proto_oparb
         * @interface Iopmsg
         * @property {number|null} [senderGusid] opmsg senderGusid
         * @property {number|null} [receiverGusid] opmsg receiverGusid
         * @property {proto_oparb.opmsg.JobType|null} [jobType] opmsg jobType
         * @property {number|Long|null} [jobId] opmsg jobId
         * @property {number|null} [gufid] opmsg gufid
         * @property {proto_oparb.opmsg.ExecType|null} [execType] opmsg execType
         * @property {number|null} [castTargetUserGroupSn] opmsg castTargetUserGroupSn
         * @property {Uint8Array|null} [sessionKey] opmsg sessionKey
         * @property {Array.<proto_oparb.opmsg.IArgument>|null} ["arguments"] opmsg arguments
         * @property {number|null} [resultCode] opmsg resultCode
         * @property {Uint8Array|null} [resultScalar] opmsg resultScalar
         * @property {Array.<proto_oparb.opmsg.IResultSet>|null} [resultSets] opmsg resultSets
         * @property {Uint8Array|null} [blob] opmsg blob
         */

        /**
         * Constructs a new opmsg.
         * @memberof proto_oparb
         * @classdesc Represents an opmsg.
         * @implements Iopmsg
         * @constructor
         * @param {proto_oparb.Iopmsg=} [properties] Properties to set
         */
        function opmsg(properties) {
            this["arguments"] = [];
            this.resultSets = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * opmsg senderGusid.
         * @member {number} senderGusid
         * @memberof proto_oparb.opmsg
         * @instance
         */
        opmsg.prototype.senderGusid = 0;

        /**
         * opmsg receiverGusid.
         * @member {number} receiverGusid
         * @memberof proto_oparb.opmsg
         * @instance
         */
        opmsg.prototype.receiverGusid = 0;

        /**
         * opmsg jobType.
         * @member {proto_oparb.opmsg.JobType} jobType
         * @memberof proto_oparb.opmsg
         * @instance
         */
        opmsg.prototype.jobType = 1;

        /**
         * opmsg jobId.
         * @member {number|Long} jobId
         * @memberof proto_oparb.opmsg
         * @instance
         */
        opmsg.prototype.jobId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * opmsg gufid.
         * @member {number} gufid
         * @memberof proto_oparb.opmsg
         * @instance
         */
        opmsg.prototype.gufid = 0;

        /**
         * opmsg execType.
         * @member {proto_oparb.opmsg.ExecType} execType
         * @memberof proto_oparb.opmsg
         * @instance
         */
        opmsg.prototype.execType = 1;

        /**
         * opmsg castTargetUserGroupSn.
         * @member {number} castTargetUserGroupSn
         * @memberof proto_oparb.opmsg
         * @instance
         */
        opmsg.prototype.castTargetUserGroupSn = 0;

        /**
         * opmsg sessionKey.
         * @member {Uint8Array} sessionKey
         * @memberof proto_oparb.opmsg
         * @instance
         */
        opmsg.prototype.sessionKey = $util.newBuffer([]);

        /**
         * opmsg arguments.
         * @member {Array.<proto_oparb.opmsg.IArgument>} arguments
         * @memberof proto_oparb.opmsg
         * @instance
         */
        opmsg.prototype["arguments"] = $util.emptyArray;

        /**
         * opmsg resultCode.
         * @member {number} resultCode
         * @memberof proto_oparb.opmsg
         * @instance
         */
        opmsg.prototype.resultCode = 0;

        /**
         * opmsg resultScalar.
         * @member {Uint8Array} resultScalar
         * @memberof proto_oparb.opmsg
         * @instance
         */
        opmsg.prototype.resultScalar = $util.newBuffer([]);

        /**
         * opmsg resultSets.
         * @member {Array.<proto_oparb.opmsg.IResultSet>} resultSets
         * @memberof proto_oparb.opmsg
         * @instance
         */
        opmsg.prototype.resultSets = $util.emptyArray;

        /**
         * opmsg blob.
         * @member {Uint8Array} blob
         * @memberof proto_oparb.opmsg
         * @instance
         */
        opmsg.prototype.blob = $util.newBuffer([]);

        /**
         * Creates a new opmsg instance using the specified properties.
         * @function create
         * @memberof proto_oparb.opmsg
         * @static
         * @param {proto_oparb.Iopmsg=} [properties] Properties to set
         * @returns {proto_oparb.opmsg} opmsg instance
         */
        opmsg.create = function create(properties) {
            return new opmsg(properties);
        };

        /**
         * Encodes the specified opmsg message. Does not implicitly {@link proto_oparb.opmsg.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.opmsg
         * @static
         * @param {proto_oparb.Iopmsg} message opmsg message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        opmsg.encode = function encode(message, writer) {
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
                    $root.proto_oparb.opmsg.Argument.encode(message["arguments"][i], writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
            if (message.resultCode != null && Object.hasOwnProperty.call(message, "resultCode"))
                writer.uint32(/* id 10, wireType 5 =*/85).fixed32(message.resultCode);
            if (message.resultScalar != null && Object.hasOwnProperty.call(message, "resultScalar"))
                writer.uint32(/* id 11, wireType 2 =*/90).bytes(message.resultScalar);
            if (message.resultSets != null && message.resultSets.length)
                for (var i = 0; i < message.resultSets.length; ++i)
                    $root.proto_oparb.opmsg.ResultSet.encode(message.resultSets[i], writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
            if (message.blob != null && Object.hasOwnProperty.call(message, "blob"))
                writer.uint32(/* id 13, wireType 2 =*/106).bytes(message.blob);
            return writer;
        };

        /**
         * Encodes the specified opmsg message, length delimited. Does not implicitly {@link proto_oparb.opmsg.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.opmsg
         * @static
         * @param {proto_oparb.Iopmsg} message opmsg message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        opmsg.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an opmsg message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.opmsg
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.opmsg} opmsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        opmsg.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.opmsg();
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
                    message["arguments"].push($root.proto_oparb.opmsg.Argument.decode(reader, reader.uint32()));
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
                    message.resultSets.push($root.proto_oparb.opmsg.ResultSet.decode(reader, reader.uint32()));
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
         * Decodes an opmsg message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.opmsg
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.opmsg} opmsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        opmsg.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an opmsg message.
         * @function verify
         * @memberof proto_oparb.opmsg
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        opmsg.verify = function verify(message) {
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
                    var error = $root.proto_oparb.opmsg.Argument.verify(message["arguments"][i]);
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
                    var error = $root.proto_oparb.opmsg.ResultSet.verify(message.resultSets[i]);
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
         * Creates an opmsg message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.opmsg
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.opmsg} opmsg
         */
        opmsg.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.opmsg)
                return object;
            var message = new $root.proto_oparb.opmsg();
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
                    throw TypeError(".proto_oparb.opmsg.arguments: array expected");
                message["arguments"] = [];
                for (var i = 0; i < object["arguments"].length; ++i) {
                    if (typeof object["arguments"][i] !== "object")
                        throw TypeError(".proto_oparb.opmsg.arguments: object expected");
                    message["arguments"][i] = $root.proto_oparb.opmsg.Argument.fromObject(object["arguments"][i]);
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
                    throw TypeError(".proto_oparb.opmsg.resultSets: array expected");
                message.resultSets = [];
                for (var i = 0; i < object.resultSets.length; ++i) {
                    if (typeof object.resultSets[i] !== "object")
                        throw TypeError(".proto_oparb.opmsg.resultSets: object expected");
                    message.resultSets[i] = $root.proto_oparb.opmsg.ResultSet.fromObject(object.resultSets[i]);
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
         * Creates a plain object from an opmsg message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.opmsg
         * @static
         * @param {proto_oparb.opmsg} message opmsg
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        opmsg.toObject = function toObject(message, options) {
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
                object.jobType = options.enums === String ? $root.proto_oparb.opmsg.JobType[message.jobType] : message.jobType;
            if (message.jobId != null && message.hasOwnProperty("jobId"))
                if (typeof message.jobId === "number")
                    object.jobId = options.longs === String ? String(message.jobId) : message.jobId;
                else
                    object.jobId = options.longs === String ? $util.Long.prototype.toString.call(message.jobId) : options.longs === Number ? new $util.LongBits(message.jobId.low >>> 0, message.jobId.high >>> 0).toNumber() : message.jobId;
            if (message.gufid != null && message.hasOwnProperty("gufid"))
                object.gufid = message.gufid;
            if (message.execType != null && message.hasOwnProperty("execType"))
                object.execType = options.enums === String ? $root.proto_oparb.opmsg.ExecType[message.execType] : message.execType;
            if (message.castTargetUserGroupSn != null && message.hasOwnProperty("castTargetUserGroupSn"))
                object.castTargetUserGroupSn = message.castTargetUserGroupSn;
            if (message.sessionKey != null && message.hasOwnProperty("sessionKey"))
                object.sessionKey = options.bytes === String ? $util.base64.encode(message.sessionKey, 0, message.sessionKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.sessionKey) : message.sessionKey;
            if (message["arguments"] && message["arguments"].length) {
                object["arguments"] = [];
                for (var j = 0; j < message["arguments"].length; ++j)
                    object["arguments"][j] = $root.proto_oparb.opmsg.Argument.toObject(message["arguments"][j], options);
            }
            if (message.resultCode != null && message.hasOwnProperty("resultCode"))
                object.resultCode = message.resultCode;
            if (message.resultScalar != null && message.hasOwnProperty("resultScalar"))
                object.resultScalar = options.bytes === String ? $util.base64.encode(message.resultScalar, 0, message.resultScalar.length) : options.bytes === Array ? Array.prototype.slice.call(message.resultScalar) : message.resultScalar;
            if (message.resultSets && message.resultSets.length) {
                object.resultSets = [];
                for (var j = 0; j < message.resultSets.length; ++j)
                    object.resultSets[j] = $root.proto_oparb.opmsg.ResultSet.toObject(message.resultSets[j], options);
            }
            if (message.blob != null && message.hasOwnProperty("blob"))
                object.blob = options.bytes === String ? $util.base64.encode(message.blob, 0, message.blob.length) : options.bytes === Array ? Array.prototype.slice.call(message.blob) : message.blob;
            return object;
        };

        /**
         * Converts this opmsg to JSON.
         * @function toJSON
         * @memberof proto_oparb.opmsg
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        opmsg.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * JobType enum.
         * @name proto_oparb.opmsg.JobType
         * @enum {number}
         * @property {number} REQUEST=1 REQUEST value
         * @property {number} RESPONSE=2 RESPONSE value
         * @property {number} NOTICE=3 NOTICE value
         */
        opmsg.JobType = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[1] = "REQUEST"] = 1;
            values[valuesById[2] = "RESPONSE"] = 2;
            values[valuesById[3] = "NOTICE"] = 3;
            return values;
        })();

        /**
         * ExecType enum.
         * @name proto_oparb.opmsg.ExecType
         * @enum {number}
         * @property {number} EXECUTE=1 EXECUTE value
         * @property {number} CAST=2 CAST value
         */
        opmsg.ExecType = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[1] = "EXECUTE"] = 1;
            values[valuesById[2] = "CAST"] = 2;
            return values;
        })();

        opmsg.Argument = (function() {

            /**
             * Properties of an Argument.
             * @memberof proto_oparb.opmsg
             * @interface IArgument
             * @property {Uint8Array|null} [name] Argument name
             * @property {Uint8Array} value Argument value
             */

            /**
             * Constructs a new Argument.
             * @memberof proto_oparb.opmsg
             * @classdesc Represents an Argument.
             * @implements IArgument
             * @constructor
             * @param {proto_oparb.opmsg.IArgument=} [properties] Properties to set
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
             * @memberof proto_oparb.opmsg.Argument
             * @instance
             */
            Argument.prototype.name = $util.newBuffer([]);

            /**
             * Argument value.
             * @member {Uint8Array} value
             * @memberof proto_oparb.opmsg.Argument
             * @instance
             */
            Argument.prototype.value = $util.newBuffer([]);

            /**
             * Creates a new Argument instance using the specified properties.
             * @function create
             * @memberof proto_oparb.opmsg.Argument
             * @static
             * @param {proto_oparb.opmsg.IArgument=} [properties] Properties to set
             * @returns {proto_oparb.opmsg.Argument} Argument instance
             */
            Argument.create = function create(properties) {
                return new Argument(properties);
            };

            /**
             * Encodes the specified Argument message. Does not implicitly {@link proto_oparb.opmsg.Argument.verify|verify} messages.
             * @function encode
             * @memberof proto_oparb.opmsg.Argument
             * @static
             * @param {proto_oparb.opmsg.IArgument} message Argument message or plain object to encode
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
             * Encodes the specified Argument message, length delimited. Does not implicitly {@link proto_oparb.opmsg.Argument.verify|verify} messages.
             * @function encodeDelimited
             * @memberof proto_oparb.opmsg.Argument
             * @static
             * @param {proto_oparb.opmsg.IArgument} message Argument message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Argument.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Argument message from the specified reader or buffer.
             * @function decode
             * @memberof proto_oparb.opmsg.Argument
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {proto_oparb.opmsg.Argument} Argument
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Argument.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.opmsg.Argument();
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
             * @memberof proto_oparb.opmsg.Argument
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {proto_oparb.opmsg.Argument} Argument
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
             * @memberof proto_oparb.opmsg.Argument
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
             * @memberof proto_oparb.opmsg.Argument
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {proto_oparb.opmsg.Argument} Argument
             */
            Argument.fromObject = function fromObject(object) {
                if (object instanceof $root.proto_oparb.opmsg.Argument)
                    return object;
                var message = new $root.proto_oparb.opmsg.Argument();
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
             * @memberof proto_oparb.opmsg.Argument
             * @static
             * @param {proto_oparb.opmsg.Argument} message Argument
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
             * @memberof proto_oparb.opmsg.Argument
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Argument.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Argument;
        })();

        opmsg.ResultSet = (function() {

            /**
             * Properties of a ResultSet.
             * @memberof proto_oparb.opmsg
             * @interface IResultSet
             * @property {Array.<Uint8Array>|null} [columnNames] ResultSet columnNames
             * @property {Array.<proto_oparb.opmsg.ResultSet.IRow>|null} [rows] ResultSet rows
             * @property {number|null} [totalCount] ResultSet totalCount
             */

            /**
             * Constructs a new ResultSet.
             * @memberof proto_oparb.opmsg
             * @classdesc Represents a ResultSet.
             * @implements IResultSet
             * @constructor
             * @param {proto_oparb.opmsg.IResultSet=} [properties] Properties to set
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
             * @memberof proto_oparb.opmsg.ResultSet
             * @instance
             */
            ResultSet.prototype.columnNames = $util.emptyArray;

            /**
             * ResultSet rows.
             * @member {Array.<proto_oparb.opmsg.ResultSet.IRow>} rows
             * @memberof proto_oparb.opmsg.ResultSet
             * @instance
             */
            ResultSet.prototype.rows = $util.emptyArray;

            /**
             * ResultSet totalCount.
             * @member {number} totalCount
             * @memberof proto_oparb.opmsg.ResultSet
             * @instance
             */
            ResultSet.prototype.totalCount = 0;

            /**
             * Creates a new ResultSet instance using the specified properties.
             * @function create
             * @memberof proto_oparb.opmsg.ResultSet
             * @static
             * @param {proto_oparb.opmsg.IResultSet=} [properties] Properties to set
             * @returns {proto_oparb.opmsg.ResultSet} ResultSet instance
             */
            ResultSet.create = function create(properties) {
                return new ResultSet(properties);
            };

            /**
             * Encodes the specified ResultSet message. Does not implicitly {@link proto_oparb.opmsg.ResultSet.verify|verify} messages.
             * @function encode
             * @memberof proto_oparb.opmsg.ResultSet
             * @static
             * @param {proto_oparb.opmsg.IResultSet} message ResultSet message or plain object to encode
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
                        $root.proto_oparb.opmsg.ResultSet.Row.encode(message.rows[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.totalCount != null && Object.hasOwnProperty.call(message, "totalCount"))
                    writer.uint32(/* id 3, wireType 5 =*/29).fixed32(message.totalCount);
                return writer;
            };

            /**
             * Encodes the specified ResultSet message, length delimited. Does not implicitly {@link proto_oparb.opmsg.ResultSet.verify|verify} messages.
             * @function encodeDelimited
             * @memberof proto_oparb.opmsg.ResultSet
             * @static
             * @param {proto_oparb.opmsg.IResultSet} message ResultSet message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ResultSet.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ResultSet message from the specified reader or buffer.
             * @function decode
             * @memberof proto_oparb.opmsg.ResultSet
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {proto_oparb.opmsg.ResultSet} ResultSet
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ResultSet.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.opmsg.ResultSet();
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
                        message.rows.push($root.proto_oparb.opmsg.ResultSet.Row.decode(reader, reader.uint32()));
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
             * @memberof proto_oparb.opmsg.ResultSet
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {proto_oparb.opmsg.ResultSet} ResultSet
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
             * @memberof proto_oparb.opmsg.ResultSet
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
                        var error = $root.proto_oparb.opmsg.ResultSet.Row.verify(message.rows[i]);
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
             * @memberof proto_oparb.opmsg.ResultSet
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {proto_oparb.opmsg.ResultSet} ResultSet
             */
            ResultSet.fromObject = function fromObject(object) {
                if (object instanceof $root.proto_oparb.opmsg.ResultSet)
                    return object;
                var message = new $root.proto_oparb.opmsg.ResultSet();
                if (object.columnNames) {
                    if (!Array.isArray(object.columnNames))
                        throw TypeError(".proto_oparb.opmsg.ResultSet.columnNames: array expected");
                    message.columnNames = [];
                    for (var i = 0; i < object.columnNames.length; ++i)
                        if (typeof object.columnNames[i] === "string")
                            $util.base64.decode(object.columnNames[i], message.columnNames[i] = $util.newBuffer($util.base64.length(object.columnNames[i])), 0);
                        else if (object.columnNames[i].length)
                            message.columnNames[i] = object.columnNames[i];
                }
                if (object.rows) {
                    if (!Array.isArray(object.rows))
                        throw TypeError(".proto_oparb.opmsg.ResultSet.rows: array expected");
                    message.rows = [];
                    for (var i = 0; i < object.rows.length; ++i) {
                        if (typeof object.rows[i] !== "object")
                            throw TypeError(".proto_oparb.opmsg.ResultSet.rows: object expected");
                        message.rows[i] = $root.proto_oparb.opmsg.ResultSet.Row.fromObject(object.rows[i]);
                    }
                }
                if (object.totalCount != null)
                    message.totalCount = object.totalCount >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a ResultSet message. Also converts values to other types if specified.
             * @function toObject
             * @memberof proto_oparb.opmsg.ResultSet
             * @static
             * @param {proto_oparb.opmsg.ResultSet} message ResultSet
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
                        object.rows[j] = $root.proto_oparb.opmsg.ResultSet.Row.toObject(message.rows[j], options);
                }
                if (message.totalCount != null && message.hasOwnProperty("totalCount"))
                    object.totalCount = message.totalCount;
                return object;
            };

            /**
             * Converts this ResultSet to JSON.
             * @function toJSON
             * @memberof proto_oparb.opmsg.ResultSet
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ResultSet.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            ResultSet.Row = (function() {

                /**
                 * Properties of a Row.
                 * @memberof proto_oparb.opmsg.ResultSet
                 * @interface IRow
                 * @property {Array.<Uint8Array>|null} [values] Row values
                 */

                /**
                 * Constructs a new Row.
                 * @memberof proto_oparb.opmsg.ResultSet
                 * @classdesc Represents a Row.
                 * @implements IRow
                 * @constructor
                 * @param {proto_oparb.opmsg.ResultSet.IRow=} [properties] Properties to set
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
                 * @memberof proto_oparb.opmsg.ResultSet.Row
                 * @instance
                 */
                Row.prototype.values = $util.emptyArray;

                /**
                 * Creates a new Row instance using the specified properties.
                 * @function create
                 * @memberof proto_oparb.opmsg.ResultSet.Row
                 * @static
                 * @param {proto_oparb.opmsg.ResultSet.IRow=} [properties] Properties to set
                 * @returns {proto_oparb.opmsg.ResultSet.Row} Row instance
                 */
                Row.create = function create(properties) {
                    return new Row(properties);
                };

                /**
                 * Encodes the specified Row message. Does not implicitly {@link proto_oparb.opmsg.ResultSet.Row.verify|verify} messages.
                 * @function encode
                 * @memberof proto_oparb.opmsg.ResultSet.Row
                 * @static
                 * @param {proto_oparb.opmsg.ResultSet.IRow} message Row message or plain object to encode
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
                 * Encodes the specified Row message, length delimited. Does not implicitly {@link proto_oparb.opmsg.ResultSet.Row.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof proto_oparb.opmsg.ResultSet.Row
                 * @static
                 * @param {proto_oparb.opmsg.ResultSet.IRow} message Row message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Row.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a Row message from the specified reader or buffer.
                 * @function decode
                 * @memberof proto_oparb.opmsg.ResultSet.Row
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {proto_oparb.opmsg.ResultSet.Row} Row
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Row.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.opmsg.ResultSet.Row();
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
                 * @memberof proto_oparb.opmsg.ResultSet.Row
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {proto_oparb.opmsg.ResultSet.Row} Row
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
                 * @memberof proto_oparb.opmsg.ResultSet.Row
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
                 * @memberof proto_oparb.opmsg.ResultSet.Row
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {proto_oparb.opmsg.ResultSet.Row} Row
                 */
                Row.fromObject = function fromObject(object) {
                    if (object instanceof $root.proto_oparb.opmsg.ResultSet.Row)
                        return object;
                    var message = new $root.proto_oparb.opmsg.ResultSet.Row();
                    if (object.values) {
                        if (!Array.isArray(object.values))
                            throw TypeError(".proto_oparb.opmsg.ResultSet.Row.values: array expected");
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
                 * @memberof proto_oparb.opmsg.ResultSet.Row
                 * @static
                 * @param {proto_oparb.opmsg.ResultSet.Row} message Row
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
                 * @memberof proto_oparb.opmsg.ResultSet.Row
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

        return opmsg;
    })();

    proto_oparb.KickUserReq = (function() {

        /**
         * Properties of a KickUserReq.
         * @memberof proto_oparb
         * @interface IKickUserReq
         * @property {number|Long} userSrl KickUserReq userSrl
         * @property {number} kickCode KickUserReq kickCode
         */

        /**
         * Constructs a new KickUserReq.
         * @memberof proto_oparb
         * @classdesc Represents a KickUserReq.
         * @implements IKickUserReq
         * @constructor
         * @param {proto_oparb.IKickUserReq=} [properties] Properties to set
         */
        function KickUserReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * KickUserReq userSrl.
         * @member {number|Long} userSrl
         * @memberof proto_oparb.KickUserReq
         * @instance
         */
        KickUserReq.prototype.userSrl = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * KickUserReq kickCode.
         * @member {number} kickCode
         * @memberof proto_oparb.KickUserReq
         * @instance
         */
        KickUserReq.prototype.kickCode = 0;

        /**
         * Creates a new KickUserReq instance using the specified properties.
         * @function create
         * @memberof proto_oparb.KickUserReq
         * @static
         * @param {proto_oparb.IKickUserReq=} [properties] Properties to set
         * @returns {proto_oparb.KickUserReq} KickUserReq instance
         */
        KickUserReq.create = function create(properties) {
            return new KickUserReq(properties);
        };

        /**
         * Encodes the specified KickUserReq message. Does not implicitly {@link proto_oparb.KickUserReq.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.KickUserReq
         * @static
         * @param {proto_oparb.IKickUserReq} message KickUserReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        KickUserReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 1 =*/9).fixed64(message.userSrl);
            writer.uint32(/* id 2, wireType 5 =*/21).fixed32(message.kickCode);
            return writer;
        };

        /**
         * Encodes the specified KickUserReq message, length delimited. Does not implicitly {@link proto_oparb.KickUserReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.KickUserReq
         * @static
         * @param {proto_oparb.IKickUserReq} message KickUserReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        KickUserReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a KickUserReq message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.KickUserReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.KickUserReq} KickUserReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        KickUserReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.KickUserReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.userSrl = reader.fixed64();
                    break;
                case 2:
                    message.kickCode = reader.fixed32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("userSrl"))
                throw $util.ProtocolError("missing required 'userSrl'", { instance: message });
            if (!message.hasOwnProperty("kickCode"))
                throw $util.ProtocolError("missing required 'kickCode'", { instance: message });
            return message;
        };

        /**
         * Decodes a KickUserReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.KickUserReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.KickUserReq} KickUserReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        KickUserReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a KickUserReq message.
         * @function verify
         * @memberof proto_oparb.KickUserReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        KickUserReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.userSrl) && !(message.userSrl && $util.isInteger(message.userSrl.low) && $util.isInteger(message.userSrl.high)))
                return "userSrl: integer|Long expected";
            if (!$util.isInteger(message.kickCode))
                return "kickCode: integer expected";
            return null;
        };

        /**
         * Creates a KickUserReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.KickUserReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.KickUserReq} KickUserReq
         */
        KickUserReq.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.KickUserReq)
                return object;
            var message = new $root.proto_oparb.KickUserReq();
            if (object.userSrl != null)
                if ($util.Long)
                    (message.userSrl = $util.Long.fromValue(object.userSrl)).unsigned = false;
                else if (typeof object.userSrl === "string")
                    message.userSrl = parseInt(object.userSrl, 10);
                else if (typeof object.userSrl === "number")
                    message.userSrl = object.userSrl;
                else if (typeof object.userSrl === "object")
                    message.userSrl = new $util.LongBits(object.userSrl.low >>> 0, object.userSrl.high >>> 0).toNumber();
            if (object.kickCode != null)
                message.kickCode = object.kickCode >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a KickUserReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.KickUserReq
         * @static
         * @param {proto_oparb.KickUserReq} message KickUserReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        KickUserReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.userSrl = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.userSrl = options.longs === String ? "0" : 0;
                object.kickCode = 0;
            }
            if (message.userSrl != null && message.hasOwnProperty("userSrl"))
                if (typeof message.userSrl === "number")
                    object.userSrl = options.longs === String ? String(message.userSrl) : message.userSrl;
                else
                    object.userSrl = options.longs === String ? $util.Long.prototype.toString.call(message.userSrl) : options.longs === Number ? new $util.LongBits(message.userSrl.low >>> 0, message.userSrl.high >>> 0).toNumber() : message.userSrl;
            if (message.kickCode != null && message.hasOwnProperty("kickCode"))
                object.kickCode = message.kickCode;
            return object;
        };

        /**
         * Converts this KickUserReq to JSON.
         * @function toJSON
         * @memberof proto_oparb.KickUserReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        KickUserReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return KickUserReq;
    })();

    proto_oparb.KickUserAns = (function() {

        /**
         * Properties of a KickUserAns.
         * @memberof proto_oparb
         * @interface IKickUserAns
         * @property {proto_oparb.KickUserAns.result_type} result KickUserAns result
         */

        /**
         * Constructs a new KickUserAns.
         * @memberof proto_oparb
         * @classdesc Represents a KickUserAns.
         * @implements IKickUserAns
         * @constructor
         * @param {proto_oparb.IKickUserAns=} [properties] Properties to set
         */
        function KickUserAns(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * KickUserAns result.
         * @member {proto_oparb.KickUserAns.result_type} result
         * @memberof proto_oparb.KickUserAns
         * @instance
         */
        KickUserAns.prototype.result = 0;

        /**
         * Creates a new KickUserAns instance using the specified properties.
         * @function create
         * @memberof proto_oparb.KickUserAns
         * @static
         * @param {proto_oparb.IKickUserAns=} [properties] Properties to set
         * @returns {proto_oparb.KickUserAns} KickUserAns instance
         */
        KickUserAns.create = function create(properties) {
            return new KickUserAns(properties);
        };

        /**
         * Encodes the specified KickUserAns message. Does not implicitly {@link proto_oparb.KickUserAns.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.KickUserAns
         * @static
         * @param {proto_oparb.IKickUserAns} message KickUserAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        KickUserAns.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.result);
            return writer;
        };

        /**
         * Encodes the specified KickUserAns message, length delimited. Does not implicitly {@link proto_oparb.KickUserAns.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.KickUserAns
         * @static
         * @param {proto_oparb.IKickUserAns} message KickUserAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        KickUserAns.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a KickUserAns message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.KickUserAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.KickUserAns} KickUserAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        KickUserAns.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.KickUserAns();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.result = reader.int32();
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
         * Decodes a KickUserAns message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.KickUserAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.KickUserAns} KickUserAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        KickUserAns.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a KickUserAns message.
         * @function verify
         * @memberof proto_oparb.KickUserAns
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        KickUserAns.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            switch (message.result) {
            default:
                return "result: enum value expected";
            case 0:
            case 1:
            case 2:
                break;
            }
            return null;
        };

        /**
         * Creates a KickUserAns message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.KickUserAns
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.KickUserAns} KickUserAns
         */
        KickUserAns.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.KickUserAns)
                return object;
            var message = new $root.proto_oparb.KickUserAns();
            switch (object.result) {
            case "SUCCESS":
            case 0:
                message.result = 0;
                break;
            case "FAILED":
            case 1:
                message.result = 1;
                break;
            case "NOT_EXIST":
            case 2:
                message.result = 2;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a KickUserAns message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.KickUserAns
         * @static
         * @param {proto_oparb.KickUserAns} message KickUserAns
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        KickUserAns.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.result = options.enums === String ? "SUCCESS" : 0;
            if (message.result != null && message.hasOwnProperty("result"))
                object.result = options.enums === String ? $root.proto_oparb.KickUserAns.result_type[message.result] : message.result;
            return object;
        };

        /**
         * Converts this KickUserAns to JSON.
         * @function toJSON
         * @memberof proto_oparb.KickUserAns
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        KickUserAns.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * result_type enum.
         * @name proto_oparb.KickUserAns.result_type
         * @enum {number}
         * @property {number} SUCCESS=0 SUCCESS value
         * @property {number} FAILED=1 FAILED value
         * @property {number} NOT_EXIST=2 NOT_EXIST value
         */
        KickUserAns.result_type = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "SUCCESS"] = 0;
            values[valuesById[1] = "FAILED"] = 1;
            values[valuesById[2] = "NOT_EXIST"] = 2;
            return values;
        })();

        return KickUserAns;
    })();

    proto_oparb.SendMessageReq = (function() {

        /**
         * Properties of a SendMessageReq.
         * @memberof proto_oparb
         * @interface ISendMessageReq
         * @property {number|Long} userSrl SendMessageReq userSrl
         * @property {Uint8Array} message SendMessageReq message
         */

        /**
         * Constructs a new SendMessageReq.
         * @memberof proto_oparb
         * @classdesc Represents a SendMessageReq.
         * @implements ISendMessageReq
         * @constructor
         * @param {proto_oparb.ISendMessageReq=} [properties] Properties to set
         */
        function SendMessageReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SendMessageReq userSrl.
         * @member {number|Long} userSrl
         * @memberof proto_oparb.SendMessageReq
         * @instance
         */
        SendMessageReq.prototype.userSrl = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * SendMessageReq message.
         * @member {Uint8Array} message
         * @memberof proto_oparb.SendMessageReq
         * @instance
         */
        SendMessageReq.prototype.message = $util.newBuffer([]);

        /**
         * Creates a new SendMessageReq instance using the specified properties.
         * @function create
         * @memberof proto_oparb.SendMessageReq
         * @static
         * @param {proto_oparb.ISendMessageReq=} [properties] Properties to set
         * @returns {proto_oparb.SendMessageReq} SendMessageReq instance
         */
        SendMessageReq.create = function create(properties) {
            return new SendMessageReq(properties);
        };

        /**
         * Encodes the specified SendMessageReq message. Does not implicitly {@link proto_oparb.SendMessageReq.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.SendMessageReq
         * @static
         * @param {proto_oparb.ISendMessageReq} message SendMessageReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SendMessageReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 1 =*/9).fixed64(message.userSrl);
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.message);
            return writer;
        };

        /**
         * Encodes the specified SendMessageReq message, length delimited. Does not implicitly {@link proto_oparb.SendMessageReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.SendMessageReq
         * @static
         * @param {proto_oparb.ISendMessageReq} message SendMessageReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SendMessageReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SendMessageReq message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.SendMessageReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.SendMessageReq} SendMessageReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SendMessageReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.SendMessageReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.userSrl = reader.fixed64();
                    break;
                case 2:
                    message.message = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("userSrl"))
                throw $util.ProtocolError("missing required 'userSrl'", { instance: message });
            if (!message.hasOwnProperty("message"))
                throw $util.ProtocolError("missing required 'message'", { instance: message });
            return message;
        };

        /**
         * Decodes a SendMessageReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.SendMessageReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.SendMessageReq} SendMessageReq
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
         * @memberof proto_oparb.SendMessageReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SendMessageReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.userSrl) && !(message.userSrl && $util.isInteger(message.userSrl.low) && $util.isInteger(message.userSrl.high)))
                return "userSrl: integer|Long expected";
            if (!(message.message && typeof message.message.length === "number" || $util.isString(message.message)))
                return "message: buffer expected";
            return null;
        };

        /**
         * Creates a SendMessageReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.SendMessageReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.SendMessageReq} SendMessageReq
         */
        SendMessageReq.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.SendMessageReq)
                return object;
            var message = new $root.proto_oparb.SendMessageReq();
            if (object.userSrl != null)
                if ($util.Long)
                    (message.userSrl = $util.Long.fromValue(object.userSrl)).unsigned = false;
                else if (typeof object.userSrl === "string")
                    message.userSrl = parseInt(object.userSrl, 10);
                else if (typeof object.userSrl === "number")
                    message.userSrl = object.userSrl;
                else if (typeof object.userSrl === "object")
                    message.userSrl = new $util.LongBits(object.userSrl.low >>> 0, object.userSrl.high >>> 0).toNumber();
            if (object.message != null)
                if (typeof object.message === "string")
                    $util.base64.decode(object.message, message.message = $util.newBuffer($util.base64.length(object.message)), 0);
                else if (object.message.length)
                    message.message = object.message;
            return message;
        };

        /**
         * Creates a plain object from a SendMessageReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.SendMessageReq
         * @static
         * @param {proto_oparb.SendMessageReq} message SendMessageReq
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
                    object.userSrl = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.userSrl = options.longs === String ? "0" : 0;
                if (options.bytes === String)
                    object.message = "";
                else {
                    object.message = [];
                    if (options.bytes !== Array)
                        object.message = $util.newBuffer(object.message);
                }
            }
            if (message.userSrl != null && message.hasOwnProperty("userSrl"))
                if (typeof message.userSrl === "number")
                    object.userSrl = options.longs === String ? String(message.userSrl) : message.userSrl;
                else
                    object.userSrl = options.longs === String ? $util.Long.prototype.toString.call(message.userSrl) : options.longs === Number ? new $util.LongBits(message.userSrl.low >>> 0, message.userSrl.high >>> 0).toNumber() : message.userSrl;
            if (message.message != null && message.hasOwnProperty("message"))
                object.message = options.bytes === String ? $util.base64.encode(message.message, 0, message.message.length) : options.bytes === Array ? Array.prototype.slice.call(message.message) : message.message;
            return object;
        };

        /**
         * Converts this SendMessageReq to JSON.
         * @function toJSON
         * @memberof proto_oparb.SendMessageReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SendMessageReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return SendMessageReq;
    })();

    proto_oparb.SendMessageAns = (function() {

        /**
         * Properties of a SendMessageAns.
         * @memberof proto_oparb
         * @interface ISendMessageAns
         * @property {proto_oparb.SendMessageAns.result_type} result SendMessageAns result
         */

        /**
         * Constructs a new SendMessageAns.
         * @memberof proto_oparb
         * @classdesc Represents a SendMessageAns.
         * @implements ISendMessageAns
         * @constructor
         * @param {proto_oparb.ISendMessageAns=} [properties] Properties to set
         */
        function SendMessageAns(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SendMessageAns result.
         * @member {proto_oparb.SendMessageAns.result_type} result
         * @memberof proto_oparb.SendMessageAns
         * @instance
         */
        SendMessageAns.prototype.result = 0;

        /**
         * Creates a new SendMessageAns instance using the specified properties.
         * @function create
         * @memberof proto_oparb.SendMessageAns
         * @static
         * @param {proto_oparb.ISendMessageAns=} [properties] Properties to set
         * @returns {proto_oparb.SendMessageAns} SendMessageAns instance
         */
        SendMessageAns.create = function create(properties) {
            return new SendMessageAns(properties);
        };

        /**
         * Encodes the specified SendMessageAns message. Does not implicitly {@link proto_oparb.SendMessageAns.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.SendMessageAns
         * @static
         * @param {proto_oparb.ISendMessageAns} message SendMessageAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SendMessageAns.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.result);
            return writer;
        };

        /**
         * Encodes the specified SendMessageAns message, length delimited. Does not implicitly {@link proto_oparb.SendMessageAns.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.SendMessageAns
         * @static
         * @param {proto_oparb.ISendMessageAns} message SendMessageAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SendMessageAns.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SendMessageAns message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.SendMessageAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.SendMessageAns} SendMessageAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SendMessageAns.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.SendMessageAns();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.result = reader.int32();
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
         * Decodes a SendMessageAns message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.SendMessageAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.SendMessageAns} SendMessageAns
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
         * @memberof proto_oparb.SendMessageAns
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SendMessageAns.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            switch (message.result) {
            default:
                return "result: enum value expected";
            case 0:
            case 1:
            case 2:
                break;
            }
            return null;
        };

        /**
         * Creates a SendMessageAns message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.SendMessageAns
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.SendMessageAns} SendMessageAns
         */
        SendMessageAns.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.SendMessageAns)
                return object;
            var message = new $root.proto_oparb.SendMessageAns();
            switch (object.result) {
            case "SUCCESS":
            case 0:
                message.result = 0;
                break;
            case "FAILED":
            case 1:
                message.result = 1;
                break;
            case "NOT_EXIST":
            case 2:
                message.result = 2;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a SendMessageAns message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.SendMessageAns
         * @static
         * @param {proto_oparb.SendMessageAns} message SendMessageAns
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SendMessageAns.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.result = options.enums === String ? "SUCCESS" : 0;
            if (message.result != null && message.hasOwnProperty("result"))
                object.result = options.enums === String ? $root.proto_oparb.SendMessageAns.result_type[message.result] : message.result;
            return object;
        };

        /**
         * Converts this SendMessageAns to JSON.
         * @function toJSON
         * @memberof proto_oparb.SendMessageAns
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SendMessageAns.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * result_type enum.
         * @name proto_oparb.SendMessageAns.result_type
         * @enum {number}
         * @property {number} SUCCESS=0 SUCCESS value
         * @property {number} FAILED=1 FAILED value
         * @property {number} NOT_EXIST=2 NOT_EXIST value
         */
        SendMessageAns.result_type = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "SUCCESS"] = 0;
            values[valuesById[1] = "FAILED"] = 1;
            values[valuesById[2] = "NOT_EXIST"] = 2;
            return values;
        })();

        return SendMessageAns;
    })();

    proto_oparb.BulkKickReq = (function() {

        /**
         * Properties of a BulkKickReq.
         * @memberof proto_oparb
         * @interface IBulkKickReq
         * @property {number} kickCode BulkKickReq kickCode
         * @property {number} filter BulkKickReq filter
         * @property {number} filterMask BulkKickReq filterMask
         */

        /**
         * Constructs a new BulkKickReq.
         * @memberof proto_oparb
         * @classdesc Represents a BulkKickReq.
         * @implements IBulkKickReq
         * @constructor
         * @param {proto_oparb.IBulkKickReq=} [properties] Properties to set
         */
        function BulkKickReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * BulkKickReq kickCode.
         * @member {number} kickCode
         * @memberof proto_oparb.BulkKickReq
         * @instance
         */
        BulkKickReq.prototype.kickCode = 0;

        /**
         * BulkKickReq filter.
         * @member {number} filter
         * @memberof proto_oparb.BulkKickReq
         * @instance
         */
        BulkKickReq.prototype.filter = 0;

        /**
         * BulkKickReq filterMask.
         * @member {number} filterMask
         * @memberof proto_oparb.BulkKickReq
         * @instance
         */
        BulkKickReq.prototype.filterMask = 0;

        /**
         * Creates a new BulkKickReq instance using the specified properties.
         * @function create
         * @memberof proto_oparb.BulkKickReq
         * @static
         * @param {proto_oparb.IBulkKickReq=} [properties] Properties to set
         * @returns {proto_oparb.BulkKickReq} BulkKickReq instance
         */
        BulkKickReq.create = function create(properties) {
            return new BulkKickReq(properties);
        };

        /**
         * Encodes the specified BulkKickReq message. Does not implicitly {@link proto_oparb.BulkKickReq.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.BulkKickReq
         * @static
         * @param {proto_oparb.IBulkKickReq} message BulkKickReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BulkKickReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 5 =*/13).fixed32(message.kickCode);
            writer.uint32(/* id 2, wireType 5 =*/21).fixed32(message.filter);
            writer.uint32(/* id 3, wireType 5 =*/29).fixed32(message.filterMask);
            return writer;
        };

        /**
         * Encodes the specified BulkKickReq message, length delimited. Does not implicitly {@link proto_oparb.BulkKickReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.BulkKickReq
         * @static
         * @param {proto_oparb.IBulkKickReq} message BulkKickReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BulkKickReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a BulkKickReq message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.BulkKickReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.BulkKickReq} BulkKickReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BulkKickReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.BulkKickReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.kickCode = reader.fixed32();
                    break;
                case 2:
                    message.filter = reader.fixed32();
                    break;
                case 3:
                    message.filterMask = reader.fixed32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("kickCode"))
                throw $util.ProtocolError("missing required 'kickCode'", { instance: message });
            if (!message.hasOwnProperty("filter"))
                throw $util.ProtocolError("missing required 'filter'", { instance: message });
            if (!message.hasOwnProperty("filterMask"))
                throw $util.ProtocolError("missing required 'filterMask'", { instance: message });
            return message;
        };

        /**
         * Decodes a BulkKickReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.BulkKickReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.BulkKickReq} BulkKickReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BulkKickReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a BulkKickReq message.
         * @function verify
         * @memberof proto_oparb.BulkKickReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        BulkKickReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.kickCode))
                return "kickCode: integer expected";
            if (!$util.isInteger(message.filter))
                return "filter: integer expected";
            if (!$util.isInteger(message.filterMask))
                return "filterMask: integer expected";
            return null;
        };

        /**
         * Creates a BulkKickReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.BulkKickReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.BulkKickReq} BulkKickReq
         */
        BulkKickReq.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.BulkKickReq)
                return object;
            var message = new $root.proto_oparb.BulkKickReq();
            if (object.kickCode != null)
                message.kickCode = object.kickCode >>> 0;
            if (object.filter != null)
                message.filter = object.filter >>> 0;
            if (object.filterMask != null)
                message.filterMask = object.filterMask >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a BulkKickReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.BulkKickReq
         * @static
         * @param {proto_oparb.BulkKickReq} message BulkKickReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        BulkKickReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.kickCode = 0;
                object.filter = 0;
                object.filterMask = 0;
            }
            if (message.kickCode != null && message.hasOwnProperty("kickCode"))
                object.kickCode = message.kickCode;
            if (message.filter != null && message.hasOwnProperty("filter"))
                object.filter = message.filter;
            if (message.filterMask != null && message.hasOwnProperty("filterMask"))
                object.filterMask = message.filterMask;
            return object;
        };

        /**
         * Converts this BulkKickReq to JSON.
         * @function toJSON
         * @memberof proto_oparb.BulkKickReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        BulkKickReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return BulkKickReq;
    })();

    proto_oparb.BulkKickAns = (function() {

        /**
         * Properties of a BulkKickAns.
         * @memberof proto_oparb
         * @interface IBulkKickAns
         * @property {number} userCnt BulkKickAns userCnt
         */

        /**
         * Constructs a new BulkKickAns.
         * @memberof proto_oparb
         * @classdesc Represents a BulkKickAns.
         * @implements IBulkKickAns
         * @constructor
         * @param {proto_oparb.IBulkKickAns=} [properties] Properties to set
         */
        function BulkKickAns(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * BulkKickAns userCnt.
         * @member {number} userCnt
         * @memberof proto_oparb.BulkKickAns
         * @instance
         */
        BulkKickAns.prototype.userCnt = 0;

        /**
         * Creates a new BulkKickAns instance using the specified properties.
         * @function create
         * @memberof proto_oparb.BulkKickAns
         * @static
         * @param {proto_oparb.IBulkKickAns=} [properties] Properties to set
         * @returns {proto_oparb.BulkKickAns} BulkKickAns instance
         */
        BulkKickAns.create = function create(properties) {
            return new BulkKickAns(properties);
        };

        /**
         * Encodes the specified BulkKickAns message. Does not implicitly {@link proto_oparb.BulkKickAns.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.BulkKickAns
         * @static
         * @param {proto_oparb.IBulkKickAns} message BulkKickAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BulkKickAns.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 5 =*/13).fixed32(message.userCnt);
            return writer;
        };

        /**
         * Encodes the specified BulkKickAns message, length delimited. Does not implicitly {@link proto_oparb.BulkKickAns.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.BulkKickAns
         * @static
         * @param {proto_oparb.IBulkKickAns} message BulkKickAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BulkKickAns.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a BulkKickAns message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.BulkKickAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.BulkKickAns} BulkKickAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BulkKickAns.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.BulkKickAns();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.userCnt = reader.fixed32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("userCnt"))
                throw $util.ProtocolError("missing required 'userCnt'", { instance: message });
            return message;
        };

        /**
         * Decodes a BulkKickAns message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.BulkKickAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.BulkKickAns} BulkKickAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BulkKickAns.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a BulkKickAns message.
         * @function verify
         * @memberof proto_oparb.BulkKickAns
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        BulkKickAns.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.userCnt))
                return "userCnt: integer expected";
            return null;
        };

        /**
         * Creates a BulkKickAns message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.BulkKickAns
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.BulkKickAns} BulkKickAns
         */
        BulkKickAns.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.BulkKickAns)
                return object;
            var message = new $root.proto_oparb.BulkKickAns();
            if (object.userCnt != null)
                message.userCnt = object.userCnt >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a BulkKickAns message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.BulkKickAns
         * @static
         * @param {proto_oparb.BulkKickAns} message BulkKickAns
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        BulkKickAns.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.userCnt = 0;
            if (message.userCnt != null && message.hasOwnProperty("userCnt"))
                object.userCnt = message.userCnt;
            return object;
        };

        /**
         * Converts this BulkKickAns to JSON.
         * @function toJSON
         * @memberof proto_oparb.BulkKickAns
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        BulkKickAns.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return BulkKickAns;
    })();

    proto_oparb.DeniedChatUserReq = (function() {

        /**
         * Properties of a DeniedChatUserReq.
         * @memberof proto_oparb
         * @interface IDeniedChatUserReq
         * @property {number|Long} userSrl DeniedChatUserReq userSrl
         * @property {number} endDatetime DeniedChatUserReq endDatetime
         */

        /**
         * Constructs a new DeniedChatUserReq.
         * @memberof proto_oparb
         * @classdesc Represents a DeniedChatUserReq.
         * @implements IDeniedChatUserReq
         * @constructor
         * @param {proto_oparb.IDeniedChatUserReq=} [properties] Properties to set
         */
        function DeniedChatUserReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DeniedChatUserReq userSrl.
         * @member {number|Long} userSrl
         * @memberof proto_oparb.DeniedChatUserReq
         * @instance
         */
        DeniedChatUserReq.prototype.userSrl = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * DeniedChatUserReq endDatetime.
         * @member {number} endDatetime
         * @memberof proto_oparb.DeniedChatUserReq
         * @instance
         */
        DeniedChatUserReq.prototype.endDatetime = 0;

        /**
         * Creates a new DeniedChatUserReq instance using the specified properties.
         * @function create
         * @memberof proto_oparb.DeniedChatUserReq
         * @static
         * @param {proto_oparb.IDeniedChatUserReq=} [properties] Properties to set
         * @returns {proto_oparb.DeniedChatUserReq} DeniedChatUserReq instance
         */
        DeniedChatUserReq.create = function create(properties) {
            return new DeniedChatUserReq(properties);
        };

        /**
         * Encodes the specified DeniedChatUserReq message. Does not implicitly {@link proto_oparb.DeniedChatUserReq.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.DeniedChatUserReq
         * @static
         * @param {proto_oparb.IDeniedChatUserReq} message DeniedChatUserReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DeniedChatUserReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 1 =*/9).fixed64(message.userSrl);
            writer.uint32(/* id 2, wireType 5 =*/21).fixed32(message.endDatetime);
            return writer;
        };

        /**
         * Encodes the specified DeniedChatUserReq message, length delimited. Does not implicitly {@link proto_oparb.DeniedChatUserReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.DeniedChatUserReq
         * @static
         * @param {proto_oparb.IDeniedChatUserReq} message DeniedChatUserReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DeniedChatUserReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DeniedChatUserReq message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.DeniedChatUserReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.DeniedChatUserReq} DeniedChatUserReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DeniedChatUserReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.DeniedChatUserReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.userSrl = reader.fixed64();
                    break;
                case 2:
                    message.endDatetime = reader.fixed32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("userSrl"))
                throw $util.ProtocolError("missing required 'userSrl'", { instance: message });
            if (!message.hasOwnProperty("endDatetime"))
                throw $util.ProtocolError("missing required 'endDatetime'", { instance: message });
            return message;
        };

        /**
         * Decodes a DeniedChatUserReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.DeniedChatUserReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.DeniedChatUserReq} DeniedChatUserReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DeniedChatUserReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DeniedChatUserReq message.
         * @function verify
         * @memberof proto_oparb.DeniedChatUserReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DeniedChatUserReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.userSrl) && !(message.userSrl && $util.isInteger(message.userSrl.low) && $util.isInteger(message.userSrl.high)))
                return "userSrl: integer|Long expected";
            if (!$util.isInteger(message.endDatetime))
                return "endDatetime: integer expected";
            return null;
        };

        /**
         * Creates a DeniedChatUserReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.DeniedChatUserReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.DeniedChatUserReq} DeniedChatUserReq
         */
        DeniedChatUserReq.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.DeniedChatUserReq)
                return object;
            var message = new $root.proto_oparb.DeniedChatUserReq();
            if (object.userSrl != null)
                if ($util.Long)
                    (message.userSrl = $util.Long.fromValue(object.userSrl)).unsigned = false;
                else if (typeof object.userSrl === "string")
                    message.userSrl = parseInt(object.userSrl, 10);
                else if (typeof object.userSrl === "number")
                    message.userSrl = object.userSrl;
                else if (typeof object.userSrl === "object")
                    message.userSrl = new $util.LongBits(object.userSrl.low >>> 0, object.userSrl.high >>> 0).toNumber();
            if (object.endDatetime != null)
                message.endDatetime = object.endDatetime >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a DeniedChatUserReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.DeniedChatUserReq
         * @static
         * @param {proto_oparb.DeniedChatUserReq} message DeniedChatUserReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DeniedChatUserReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.userSrl = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.userSrl = options.longs === String ? "0" : 0;
                object.endDatetime = 0;
            }
            if (message.userSrl != null && message.hasOwnProperty("userSrl"))
                if (typeof message.userSrl === "number")
                    object.userSrl = options.longs === String ? String(message.userSrl) : message.userSrl;
                else
                    object.userSrl = options.longs === String ? $util.Long.prototype.toString.call(message.userSrl) : options.longs === Number ? new $util.LongBits(message.userSrl.low >>> 0, message.userSrl.high >>> 0).toNumber() : message.userSrl;
            if (message.endDatetime != null && message.hasOwnProperty("endDatetime"))
                object.endDatetime = message.endDatetime;
            return object;
        };

        /**
         * Converts this DeniedChatUserReq to JSON.
         * @function toJSON
         * @memberof proto_oparb.DeniedChatUserReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DeniedChatUserReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return DeniedChatUserReq;
    })();

    proto_oparb.DeniedChatUserAns = (function() {

        /**
         * Properties of a DeniedChatUserAns.
         * @memberof proto_oparb
         * @interface IDeniedChatUserAns
         * @property {proto_oparb.DeniedChatUserAns.result_type} result DeniedChatUserAns result
         */

        /**
         * Constructs a new DeniedChatUserAns.
         * @memberof proto_oparb
         * @classdesc Represents a DeniedChatUserAns.
         * @implements IDeniedChatUserAns
         * @constructor
         * @param {proto_oparb.IDeniedChatUserAns=} [properties] Properties to set
         */
        function DeniedChatUserAns(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DeniedChatUserAns result.
         * @member {proto_oparb.DeniedChatUserAns.result_type} result
         * @memberof proto_oparb.DeniedChatUserAns
         * @instance
         */
        DeniedChatUserAns.prototype.result = 0;

        /**
         * Creates a new DeniedChatUserAns instance using the specified properties.
         * @function create
         * @memberof proto_oparb.DeniedChatUserAns
         * @static
         * @param {proto_oparb.IDeniedChatUserAns=} [properties] Properties to set
         * @returns {proto_oparb.DeniedChatUserAns} DeniedChatUserAns instance
         */
        DeniedChatUserAns.create = function create(properties) {
            return new DeniedChatUserAns(properties);
        };

        /**
         * Encodes the specified DeniedChatUserAns message. Does not implicitly {@link proto_oparb.DeniedChatUserAns.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.DeniedChatUserAns
         * @static
         * @param {proto_oparb.IDeniedChatUserAns} message DeniedChatUserAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DeniedChatUserAns.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.result);
            return writer;
        };

        /**
         * Encodes the specified DeniedChatUserAns message, length delimited. Does not implicitly {@link proto_oparb.DeniedChatUserAns.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.DeniedChatUserAns
         * @static
         * @param {proto_oparb.IDeniedChatUserAns} message DeniedChatUserAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DeniedChatUserAns.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DeniedChatUserAns message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.DeniedChatUserAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.DeniedChatUserAns} DeniedChatUserAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DeniedChatUserAns.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.DeniedChatUserAns();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.result = reader.int32();
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
         * Decodes a DeniedChatUserAns message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.DeniedChatUserAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.DeniedChatUserAns} DeniedChatUserAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DeniedChatUserAns.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DeniedChatUserAns message.
         * @function verify
         * @memberof proto_oparb.DeniedChatUserAns
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DeniedChatUserAns.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            switch (message.result) {
            default:
                return "result: enum value expected";
            case 0:
            case 1:
            case 2:
                break;
            }
            return null;
        };

        /**
         * Creates a DeniedChatUserAns message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.DeniedChatUserAns
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.DeniedChatUserAns} DeniedChatUserAns
         */
        DeniedChatUserAns.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.DeniedChatUserAns)
                return object;
            var message = new $root.proto_oparb.DeniedChatUserAns();
            switch (object.result) {
            case "SUCCESS":
            case 0:
                message.result = 0;
                break;
            case "FAILED":
            case 1:
                message.result = 1;
                break;
            case "NOT_EXIST":
            case 2:
                message.result = 2;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a DeniedChatUserAns message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.DeniedChatUserAns
         * @static
         * @param {proto_oparb.DeniedChatUserAns} message DeniedChatUserAns
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DeniedChatUserAns.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.result = options.enums === String ? "SUCCESS" : 0;
            if (message.result != null && message.hasOwnProperty("result"))
                object.result = options.enums === String ? $root.proto_oparb.DeniedChatUserAns.result_type[message.result] : message.result;
            return object;
        };

        /**
         * Converts this DeniedChatUserAns to JSON.
         * @function toJSON
         * @memberof proto_oparb.DeniedChatUserAns
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DeniedChatUserAns.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * result_type enum.
         * @name proto_oparb.DeniedChatUserAns.result_type
         * @enum {number}
         * @property {number} SUCCESS=0 SUCCESS value
         * @property {number} FAILED=1 FAILED value
         * @property {number} NOT_EXIST=2 NOT_EXIST value
         */
        DeniedChatUserAns.result_type = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "SUCCESS"] = 0;
            values[valuesById[1] = "FAILED"] = 1;
            values[valuesById[2] = "NOT_EXIST"] = 2;
            return values;
        })();

        return DeniedChatUserAns;
    })();

    proto_oparb.AddRemainingMinReq = (function() {

        /**
         * Properties of an AddRemainingMinReq.
         * @memberof proto_oparb
         * @interface IAddRemainingMinReq
         * @property {number|Long} userSrl AddRemainingMinReq userSrl
         * @property {number} remainingMin AddRemainingMinReq remainingMin
         */

        /**
         * Constructs a new AddRemainingMinReq.
         * @memberof proto_oparb
         * @classdesc Represents an AddRemainingMinReq.
         * @implements IAddRemainingMinReq
         * @constructor
         * @param {proto_oparb.IAddRemainingMinReq=} [properties] Properties to set
         */
        function AddRemainingMinReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * AddRemainingMinReq userSrl.
         * @member {number|Long} userSrl
         * @memberof proto_oparb.AddRemainingMinReq
         * @instance
         */
        AddRemainingMinReq.prototype.userSrl = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * AddRemainingMinReq remainingMin.
         * @member {number} remainingMin
         * @memberof proto_oparb.AddRemainingMinReq
         * @instance
         */
        AddRemainingMinReq.prototype.remainingMin = 0;

        /**
         * Creates a new AddRemainingMinReq instance using the specified properties.
         * @function create
         * @memberof proto_oparb.AddRemainingMinReq
         * @static
         * @param {proto_oparb.IAddRemainingMinReq=} [properties] Properties to set
         * @returns {proto_oparb.AddRemainingMinReq} AddRemainingMinReq instance
         */
        AddRemainingMinReq.create = function create(properties) {
            return new AddRemainingMinReq(properties);
        };

        /**
         * Encodes the specified AddRemainingMinReq message. Does not implicitly {@link proto_oparb.AddRemainingMinReq.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.AddRemainingMinReq
         * @static
         * @param {proto_oparb.IAddRemainingMinReq} message AddRemainingMinReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AddRemainingMinReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 1 =*/9).fixed64(message.userSrl);
            writer.uint32(/* id 2, wireType 5 =*/21).fixed32(message.remainingMin);
            return writer;
        };

        /**
         * Encodes the specified AddRemainingMinReq message, length delimited. Does not implicitly {@link proto_oparb.AddRemainingMinReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.AddRemainingMinReq
         * @static
         * @param {proto_oparb.IAddRemainingMinReq} message AddRemainingMinReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AddRemainingMinReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AddRemainingMinReq message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.AddRemainingMinReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.AddRemainingMinReq} AddRemainingMinReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AddRemainingMinReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.AddRemainingMinReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.userSrl = reader.fixed64();
                    break;
                case 2:
                    message.remainingMin = reader.fixed32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("userSrl"))
                throw $util.ProtocolError("missing required 'userSrl'", { instance: message });
            if (!message.hasOwnProperty("remainingMin"))
                throw $util.ProtocolError("missing required 'remainingMin'", { instance: message });
            return message;
        };

        /**
         * Decodes an AddRemainingMinReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.AddRemainingMinReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.AddRemainingMinReq} AddRemainingMinReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AddRemainingMinReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an AddRemainingMinReq message.
         * @function verify
         * @memberof proto_oparb.AddRemainingMinReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AddRemainingMinReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.userSrl) && !(message.userSrl && $util.isInteger(message.userSrl.low) && $util.isInteger(message.userSrl.high)))
                return "userSrl: integer|Long expected";
            if (!$util.isInteger(message.remainingMin))
                return "remainingMin: integer expected";
            return null;
        };

        /**
         * Creates an AddRemainingMinReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.AddRemainingMinReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.AddRemainingMinReq} AddRemainingMinReq
         */
        AddRemainingMinReq.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.AddRemainingMinReq)
                return object;
            var message = new $root.proto_oparb.AddRemainingMinReq();
            if (object.userSrl != null)
                if ($util.Long)
                    (message.userSrl = $util.Long.fromValue(object.userSrl)).unsigned = false;
                else if (typeof object.userSrl === "string")
                    message.userSrl = parseInt(object.userSrl, 10);
                else if (typeof object.userSrl === "number")
                    message.userSrl = object.userSrl;
                else if (typeof object.userSrl === "object")
                    message.userSrl = new $util.LongBits(object.userSrl.low >>> 0, object.userSrl.high >>> 0).toNumber();
            if (object.remainingMin != null)
                message.remainingMin = object.remainingMin >>> 0;
            return message;
        };

        /**
         * Creates a plain object from an AddRemainingMinReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.AddRemainingMinReq
         * @static
         * @param {proto_oparb.AddRemainingMinReq} message AddRemainingMinReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AddRemainingMinReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.userSrl = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.userSrl = options.longs === String ? "0" : 0;
                object.remainingMin = 0;
            }
            if (message.userSrl != null && message.hasOwnProperty("userSrl"))
                if (typeof message.userSrl === "number")
                    object.userSrl = options.longs === String ? String(message.userSrl) : message.userSrl;
                else
                    object.userSrl = options.longs === String ? $util.Long.prototype.toString.call(message.userSrl) : options.longs === Number ? new $util.LongBits(message.userSrl.low >>> 0, message.userSrl.high >>> 0).toNumber() : message.userSrl;
            if (message.remainingMin != null && message.hasOwnProperty("remainingMin"))
                object.remainingMin = message.remainingMin;
            return object;
        };

        /**
         * Converts this AddRemainingMinReq to JSON.
         * @function toJSON
         * @memberof proto_oparb.AddRemainingMinReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AddRemainingMinReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return AddRemainingMinReq;
    })();

    proto_oparb.AddRemainingMinAns = (function() {

        /**
         * Properties of an AddRemainingMinAns.
         * @memberof proto_oparb
         * @interface IAddRemainingMinAns
         * @property {proto_oparb.AddRemainingMinAns.result_type} result AddRemainingMinAns result
         */

        /**
         * Constructs a new AddRemainingMinAns.
         * @memberof proto_oparb
         * @classdesc Represents an AddRemainingMinAns.
         * @implements IAddRemainingMinAns
         * @constructor
         * @param {proto_oparb.IAddRemainingMinAns=} [properties] Properties to set
         */
        function AddRemainingMinAns(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * AddRemainingMinAns result.
         * @member {proto_oparb.AddRemainingMinAns.result_type} result
         * @memberof proto_oparb.AddRemainingMinAns
         * @instance
         */
        AddRemainingMinAns.prototype.result = 0;

        /**
         * Creates a new AddRemainingMinAns instance using the specified properties.
         * @function create
         * @memberof proto_oparb.AddRemainingMinAns
         * @static
         * @param {proto_oparb.IAddRemainingMinAns=} [properties] Properties to set
         * @returns {proto_oparb.AddRemainingMinAns} AddRemainingMinAns instance
         */
        AddRemainingMinAns.create = function create(properties) {
            return new AddRemainingMinAns(properties);
        };

        /**
         * Encodes the specified AddRemainingMinAns message. Does not implicitly {@link proto_oparb.AddRemainingMinAns.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.AddRemainingMinAns
         * @static
         * @param {proto_oparb.IAddRemainingMinAns} message AddRemainingMinAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AddRemainingMinAns.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.result);
            return writer;
        };

        /**
         * Encodes the specified AddRemainingMinAns message, length delimited. Does not implicitly {@link proto_oparb.AddRemainingMinAns.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.AddRemainingMinAns
         * @static
         * @param {proto_oparb.IAddRemainingMinAns} message AddRemainingMinAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AddRemainingMinAns.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AddRemainingMinAns message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.AddRemainingMinAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.AddRemainingMinAns} AddRemainingMinAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AddRemainingMinAns.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.AddRemainingMinAns();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.result = reader.int32();
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
         * Decodes an AddRemainingMinAns message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.AddRemainingMinAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.AddRemainingMinAns} AddRemainingMinAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AddRemainingMinAns.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an AddRemainingMinAns message.
         * @function verify
         * @memberof proto_oparb.AddRemainingMinAns
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AddRemainingMinAns.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            switch (message.result) {
            default:
                return "result: enum value expected";
            case 0:
            case 1:
            case 2:
                break;
            }
            return null;
        };

        /**
         * Creates an AddRemainingMinAns message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.AddRemainingMinAns
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.AddRemainingMinAns} AddRemainingMinAns
         */
        AddRemainingMinAns.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.AddRemainingMinAns)
                return object;
            var message = new $root.proto_oparb.AddRemainingMinAns();
            switch (object.result) {
            case "SUCCESS":
            case 0:
                message.result = 0;
                break;
            case "FAILED":
            case 1:
                message.result = 1;
                break;
            case "NOT_EXIST":
            case 2:
                message.result = 2;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from an AddRemainingMinAns message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.AddRemainingMinAns
         * @static
         * @param {proto_oparb.AddRemainingMinAns} message AddRemainingMinAns
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AddRemainingMinAns.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.result = options.enums === String ? "SUCCESS" : 0;
            if (message.result != null && message.hasOwnProperty("result"))
                object.result = options.enums === String ? $root.proto_oparb.AddRemainingMinAns.result_type[message.result] : message.result;
            return object;
        };

        /**
         * Converts this AddRemainingMinAns to JSON.
         * @function toJSON
         * @memberof proto_oparb.AddRemainingMinAns
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AddRemainingMinAns.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * result_type enum.
         * @name proto_oparb.AddRemainingMinAns.result_type
         * @enum {number}
         * @property {number} SUCCESS=0 SUCCESS value
         * @property {number} FAILED=1 FAILED value
         * @property {number} NOT_EXIST=2 NOT_EXIST value
         */
        AddRemainingMinAns.result_type = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "SUCCESS"] = 0;
            values[valuesById[1] = "FAILED"] = 1;
            values[valuesById[2] = "NOT_EXIST"] = 2;
            return values;
        })();

        return AddRemainingMinAns;
    })();

    proto_oparb.PingReq = (function() {

        /**
         * Properties of a PingReq.
         * @memberof proto_oparb
         * @interface IPingReq
         */

        /**
         * Constructs a new PingReq.
         * @memberof proto_oparb
         * @classdesc Represents a PingReq.
         * @implements IPingReq
         * @constructor
         * @param {proto_oparb.IPingReq=} [properties] Properties to set
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
         * @memberof proto_oparb.PingReq
         * @static
         * @param {proto_oparb.IPingReq=} [properties] Properties to set
         * @returns {proto_oparb.PingReq} PingReq instance
         */
        PingReq.create = function create(properties) {
            return new PingReq(properties);
        };

        /**
         * Encodes the specified PingReq message. Does not implicitly {@link proto_oparb.PingReq.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.PingReq
         * @static
         * @param {proto_oparb.IPingReq} message PingReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PingReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified PingReq message, length delimited. Does not implicitly {@link proto_oparb.PingReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.PingReq
         * @static
         * @param {proto_oparb.IPingReq} message PingReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PingReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PingReq message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.PingReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.PingReq} PingReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PingReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.PingReq();
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
         * @memberof proto_oparb.PingReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.PingReq} PingReq
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
         * @memberof proto_oparb.PingReq
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
         * @memberof proto_oparb.PingReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.PingReq} PingReq
         */
        PingReq.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.PingReq)
                return object;
            return new $root.proto_oparb.PingReq();
        };

        /**
         * Creates a plain object from a PingReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.PingReq
         * @static
         * @param {proto_oparb.PingReq} message PingReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PingReq.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this PingReq to JSON.
         * @function toJSON
         * @memberof proto_oparb.PingReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PingReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PingReq;
    })();

    proto_oparb.PingAns = (function() {

        /**
         * Properties of a PingAns.
         * @memberof proto_oparb
         * @interface IPingAns
         * @property {number} time PingAns time
         * @property {number} value1 PingAns value1
         * @property {number} value2 PingAns value2
         * @property {Array.<number>|null} [optValues] PingAns optValues
         */

        /**
         * Constructs a new PingAns.
         * @memberof proto_oparb
         * @classdesc Represents a PingAns.
         * @implements IPingAns
         * @constructor
         * @param {proto_oparb.IPingAns=} [properties] Properties to set
         */
        function PingAns(properties) {
            this.optValues = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PingAns time.
         * @member {number} time
         * @memberof proto_oparb.PingAns
         * @instance
         */
        PingAns.prototype.time = 0;

        /**
         * PingAns value1.
         * @member {number} value1
         * @memberof proto_oparb.PingAns
         * @instance
         */
        PingAns.prototype.value1 = 0;

        /**
         * PingAns value2.
         * @member {number} value2
         * @memberof proto_oparb.PingAns
         * @instance
         */
        PingAns.prototype.value2 = 0;

        /**
         * PingAns optValues.
         * @member {Array.<number>} optValues
         * @memberof proto_oparb.PingAns
         * @instance
         */
        PingAns.prototype.optValues = $util.emptyArray;

        /**
         * Creates a new PingAns instance using the specified properties.
         * @function create
         * @memberof proto_oparb.PingAns
         * @static
         * @param {proto_oparb.IPingAns=} [properties] Properties to set
         * @returns {proto_oparb.PingAns} PingAns instance
         */
        PingAns.create = function create(properties) {
            return new PingAns(properties);
        };

        /**
         * Encodes the specified PingAns message. Does not implicitly {@link proto_oparb.PingAns.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.PingAns
         * @static
         * @param {proto_oparb.IPingAns} message PingAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PingAns.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 5 =*/13).fixed32(message.time);
            writer.uint32(/* id 2, wireType 5 =*/21).fixed32(message.value1);
            writer.uint32(/* id 3, wireType 5 =*/29).fixed32(message.value2);
            if (message.optValues != null && message.optValues.length)
                for (var i = 0; i < message.optValues.length; ++i)
                    writer.uint32(/* id 4, wireType 5 =*/37).fixed32(message.optValues[i]);
            return writer;
        };

        /**
         * Encodes the specified PingAns message, length delimited. Does not implicitly {@link proto_oparb.PingAns.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.PingAns
         * @static
         * @param {proto_oparb.IPingAns} message PingAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PingAns.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PingAns message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.PingAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.PingAns} PingAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PingAns.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.PingAns();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.time = reader.fixed32();
                    break;
                case 2:
                    message.value1 = reader.fixed32();
                    break;
                case 3:
                    message.value2 = reader.fixed32();
                    break;
                case 4:
                    if (!(message.optValues && message.optValues.length))
                        message.optValues = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.optValues.push(reader.fixed32());
                    } else
                        message.optValues.push(reader.fixed32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("time"))
                throw $util.ProtocolError("missing required 'time'", { instance: message });
            if (!message.hasOwnProperty("value1"))
                throw $util.ProtocolError("missing required 'value1'", { instance: message });
            if (!message.hasOwnProperty("value2"))
                throw $util.ProtocolError("missing required 'value2'", { instance: message });
            return message;
        };

        /**
         * Decodes a PingAns message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.PingAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.PingAns} PingAns
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
         * @memberof proto_oparb.PingAns
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PingAns.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.time))
                return "time: integer expected";
            if (!$util.isInteger(message.value1))
                return "value1: integer expected";
            if (!$util.isInteger(message.value2))
                return "value2: integer expected";
            if (message.optValues != null && message.hasOwnProperty("optValues")) {
                if (!Array.isArray(message.optValues))
                    return "optValues: array expected";
                for (var i = 0; i < message.optValues.length; ++i)
                    if (!$util.isInteger(message.optValues[i]))
                        return "optValues: integer[] expected";
            }
            return null;
        };

        /**
         * Creates a PingAns message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.PingAns
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.PingAns} PingAns
         */
        PingAns.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.PingAns)
                return object;
            var message = new $root.proto_oparb.PingAns();
            if (object.time != null)
                message.time = object.time >>> 0;
            if (object.value1 != null)
                message.value1 = object.value1 >>> 0;
            if (object.value2 != null)
                message.value2 = object.value2 >>> 0;
            if (object.optValues) {
                if (!Array.isArray(object.optValues))
                    throw TypeError(".proto_oparb.PingAns.optValues: array expected");
                message.optValues = [];
                for (var i = 0; i < object.optValues.length; ++i)
                    message.optValues[i] = object.optValues[i] >>> 0;
            }
            return message;
        };

        /**
         * Creates a plain object from a PingAns message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.PingAns
         * @static
         * @param {proto_oparb.PingAns} message PingAns
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PingAns.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.optValues = [];
            if (options.defaults) {
                object.time = 0;
                object.value1 = 0;
                object.value2 = 0;
            }
            if (message.time != null && message.hasOwnProperty("time"))
                object.time = message.time;
            if (message.value1 != null && message.hasOwnProperty("value1"))
                object.value1 = message.value1;
            if (message.value2 != null && message.hasOwnProperty("value2"))
                object.value2 = message.value2;
            if (message.optValues && message.optValues.length) {
                object.optValues = [];
                for (var j = 0; j < message.optValues.length; ++j)
                    object.optValues[j] = message.optValues[j];
            }
            return object;
        };

        /**
         * Converts this PingAns to JSON.
         * @function toJSON
         * @memberof proto_oparb.PingAns
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PingAns.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PingAns;
    })();

    proto_oparb.UpdateServerStatNoti = (function() {

        /**
         * Properties of an UpdateServerStatNoti.
         * @memberof proto_oparb
         * @interface IUpdateServerStatNoti
         */

        /**
         * Constructs a new UpdateServerStatNoti.
         * @memberof proto_oparb
         * @classdesc Represents an UpdateServerStatNoti.
         * @implements IUpdateServerStatNoti
         * @constructor
         * @param {proto_oparb.IUpdateServerStatNoti=} [properties] Properties to set
         */
        function UpdateServerStatNoti(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new UpdateServerStatNoti instance using the specified properties.
         * @function create
         * @memberof proto_oparb.UpdateServerStatNoti
         * @static
         * @param {proto_oparb.IUpdateServerStatNoti=} [properties] Properties to set
         * @returns {proto_oparb.UpdateServerStatNoti} UpdateServerStatNoti instance
         */
        UpdateServerStatNoti.create = function create(properties) {
            return new UpdateServerStatNoti(properties);
        };

        /**
         * Encodes the specified UpdateServerStatNoti message. Does not implicitly {@link proto_oparb.UpdateServerStatNoti.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.UpdateServerStatNoti
         * @static
         * @param {proto_oparb.IUpdateServerStatNoti} message UpdateServerStatNoti message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateServerStatNoti.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified UpdateServerStatNoti message, length delimited. Does not implicitly {@link proto_oparb.UpdateServerStatNoti.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.UpdateServerStatNoti
         * @static
         * @param {proto_oparb.IUpdateServerStatNoti} message UpdateServerStatNoti message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateServerStatNoti.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an UpdateServerStatNoti message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.UpdateServerStatNoti
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.UpdateServerStatNoti} UpdateServerStatNoti
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateServerStatNoti.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.UpdateServerStatNoti();
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
         * Decodes an UpdateServerStatNoti message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.UpdateServerStatNoti
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.UpdateServerStatNoti} UpdateServerStatNoti
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateServerStatNoti.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an UpdateServerStatNoti message.
         * @function verify
         * @memberof proto_oparb.UpdateServerStatNoti
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        UpdateServerStatNoti.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates an UpdateServerStatNoti message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.UpdateServerStatNoti
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.UpdateServerStatNoti} UpdateServerStatNoti
         */
        UpdateServerStatNoti.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.UpdateServerStatNoti)
                return object;
            return new $root.proto_oparb.UpdateServerStatNoti();
        };

        /**
         * Creates a plain object from an UpdateServerStatNoti message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.UpdateServerStatNoti
         * @static
         * @param {proto_oparb.UpdateServerStatNoti} message UpdateServerStatNoti
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        UpdateServerStatNoti.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this UpdateServerStatNoti to JSON.
         * @function toJSON
         * @memberof proto_oparb.UpdateServerStatNoti
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UpdateServerStatNoti.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return UpdateServerStatNoti;
    })();

    proto_oparb.BoxNotiUserReq = (function() {

        /**
         * Properties of a BoxNotiUserReq.
         * @memberof proto_oparb
         * @interface IBoxNotiUserReq
         * @property {number|Long} userSrl BoxNotiUserReq userSrl
         * @property {number} charSrl BoxNotiUserReq charSrl
         */

        /**
         * Constructs a new BoxNotiUserReq.
         * @memberof proto_oparb
         * @classdesc Represents a BoxNotiUserReq.
         * @implements IBoxNotiUserReq
         * @constructor
         * @param {proto_oparb.IBoxNotiUserReq=} [properties] Properties to set
         */
        function BoxNotiUserReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * BoxNotiUserReq userSrl.
         * @member {number|Long} userSrl
         * @memberof proto_oparb.BoxNotiUserReq
         * @instance
         */
        BoxNotiUserReq.prototype.userSrl = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * BoxNotiUserReq charSrl.
         * @member {number} charSrl
         * @memberof proto_oparb.BoxNotiUserReq
         * @instance
         */
        BoxNotiUserReq.prototype.charSrl = 0;

        /**
         * Creates a new BoxNotiUserReq instance using the specified properties.
         * @function create
         * @memberof proto_oparb.BoxNotiUserReq
         * @static
         * @param {proto_oparb.IBoxNotiUserReq=} [properties] Properties to set
         * @returns {proto_oparb.BoxNotiUserReq} BoxNotiUserReq instance
         */
        BoxNotiUserReq.create = function create(properties) {
            return new BoxNotiUserReq(properties);
        };

        /**
         * Encodes the specified BoxNotiUserReq message. Does not implicitly {@link proto_oparb.BoxNotiUserReq.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.BoxNotiUserReq
         * @static
         * @param {proto_oparb.IBoxNotiUserReq} message BoxNotiUserReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BoxNotiUserReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 1 =*/9).fixed64(message.userSrl);
            writer.uint32(/* id 2, wireType 5 =*/21).fixed32(message.charSrl);
            return writer;
        };

        /**
         * Encodes the specified BoxNotiUserReq message, length delimited. Does not implicitly {@link proto_oparb.BoxNotiUserReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.BoxNotiUserReq
         * @static
         * @param {proto_oparb.IBoxNotiUserReq} message BoxNotiUserReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BoxNotiUserReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a BoxNotiUserReq message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.BoxNotiUserReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.BoxNotiUserReq} BoxNotiUserReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BoxNotiUserReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.BoxNotiUserReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.userSrl = reader.fixed64();
                    break;
                case 2:
                    message.charSrl = reader.fixed32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("userSrl"))
                throw $util.ProtocolError("missing required 'userSrl'", { instance: message });
            if (!message.hasOwnProperty("charSrl"))
                throw $util.ProtocolError("missing required 'charSrl'", { instance: message });
            return message;
        };

        /**
         * Decodes a BoxNotiUserReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.BoxNotiUserReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.BoxNotiUserReq} BoxNotiUserReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BoxNotiUserReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a BoxNotiUserReq message.
         * @function verify
         * @memberof proto_oparb.BoxNotiUserReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        BoxNotiUserReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.userSrl) && !(message.userSrl && $util.isInteger(message.userSrl.low) && $util.isInteger(message.userSrl.high)))
                return "userSrl: integer|Long expected";
            if (!$util.isInteger(message.charSrl))
                return "charSrl: integer expected";
            return null;
        };

        /**
         * Creates a BoxNotiUserReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.BoxNotiUserReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.BoxNotiUserReq} BoxNotiUserReq
         */
        BoxNotiUserReq.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.BoxNotiUserReq)
                return object;
            var message = new $root.proto_oparb.BoxNotiUserReq();
            if (object.userSrl != null)
                if ($util.Long)
                    (message.userSrl = $util.Long.fromValue(object.userSrl)).unsigned = false;
                else if (typeof object.userSrl === "string")
                    message.userSrl = parseInt(object.userSrl, 10);
                else if (typeof object.userSrl === "number")
                    message.userSrl = object.userSrl;
                else if (typeof object.userSrl === "object")
                    message.userSrl = new $util.LongBits(object.userSrl.low >>> 0, object.userSrl.high >>> 0).toNumber();
            if (object.charSrl != null)
                message.charSrl = object.charSrl >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a BoxNotiUserReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.BoxNotiUserReq
         * @static
         * @param {proto_oparb.BoxNotiUserReq} message BoxNotiUserReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        BoxNotiUserReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.userSrl = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.userSrl = options.longs === String ? "0" : 0;
                object.charSrl = 0;
            }
            if (message.userSrl != null && message.hasOwnProperty("userSrl"))
                if (typeof message.userSrl === "number")
                    object.userSrl = options.longs === String ? String(message.userSrl) : message.userSrl;
                else
                    object.userSrl = options.longs === String ? $util.Long.prototype.toString.call(message.userSrl) : options.longs === Number ? new $util.LongBits(message.userSrl.low >>> 0, message.userSrl.high >>> 0).toNumber() : message.userSrl;
            if (message.charSrl != null && message.hasOwnProperty("charSrl"))
                object.charSrl = message.charSrl;
            return object;
        };

        /**
         * Converts this BoxNotiUserReq to JSON.
         * @function toJSON
         * @memberof proto_oparb.BoxNotiUserReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        BoxNotiUserReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return BoxNotiUserReq;
    })();

    proto_oparb.BoxNotiUserAns = (function() {

        /**
         * Properties of a BoxNotiUserAns.
         * @memberof proto_oparb
         * @interface IBoxNotiUserAns
         * @property {proto_oparb.BoxNotiUserAns.result_type} result BoxNotiUserAns result
         */

        /**
         * Constructs a new BoxNotiUserAns.
         * @memberof proto_oparb
         * @classdesc Represents a BoxNotiUserAns.
         * @implements IBoxNotiUserAns
         * @constructor
         * @param {proto_oparb.IBoxNotiUserAns=} [properties] Properties to set
         */
        function BoxNotiUserAns(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * BoxNotiUserAns result.
         * @member {proto_oparb.BoxNotiUserAns.result_type} result
         * @memberof proto_oparb.BoxNotiUserAns
         * @instance
         */
        BoxNotiUserAns.prototype.result = 0;

        /**
         * Creates a new BoxNotiUserAns instance using the specified properties.
         * @function create
         * @memberof proto_oparb.BoxNotiUserAns
         * @static
         * @param {proto_oparb.IBoxNotiUserAns=} [properties] Properties to set
         * @returns {proto_oparb.BoxNotiUserAns} BoxNotiUserAns instance
         */
        BoxNotiUserAns.create = function create(properties) {
            return new BoxNotiUserAns(properties);
        };

        /**
         * Encodes the specified BoxNotiUserAns message. Does not implicitly {@link proto_oparb.BoxNotiUserAns.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.BoxNotiUserAns
         * @static
         * @param {proto_oparb.IBoxNotiUserAns} message BoxNotiUserAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BoxNotiUserAns.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.result);
            return writer;
        };

        /**
         * Encodes the specified BoxNotiUserAns message, length delimited. Does not implicitly {@link proto_oparb.BoxNotiUserAns.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.BoxNotiUserAns
         * @static
         * @param {proto_oparb.IBoxNotiUserAns} message BoxNotiUserAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BoxNotiUserAns.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a BoxNotiUserAns message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.BoxNotiUserAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.BoxNotiUserAns} BoxNotiUserAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BoxNotiUserAns.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.BoxNotiUserAns();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.result = reader.int32();
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
         * Decodes a BoxNotiUserAns message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.BoxNotiUserAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.BoxNotiUserAns} BoxNotiUserAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BoxNotiUserAns.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a BoxNotiUserAns message.
         * @function verify
         * @memberof proto_oparb.BoxNotiUserAns
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        BoxNotiUserAns.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            switch (message.result) {
            default:
                return "result: enum value expected";
            case 0:
            case 1:
            case 2:
                break;
            }
            return null;
        };

        /**
         * Creates a BoxNotiUserAns message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.BoxNotiUserAns
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.BoxNotiUserAns} BoxNotiUserAns
         */
        BoxNotiUserAns.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.BoxNotiUserAns)
                return object;
            var message = new $root.proto_oparb.BoxNotiUserAns();
            switch (object.result) {
            case "SUCCESS":
            case 0:
                message.result = 0;
                break;
            case "FAILED":
            case 1:
                message.result = 1;
                break;
            case "NOT_EXIST":
            case 2:
                message.result = 2;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a BoxNotiUserAns message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.BoxNotiUserAns
         * @static
         * @param {proto_oparb.BoxNotiUserAns} message BoxNotiUserAns
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        BoxNotiUserAns.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.result = options.enums === String ? "SUCCESS" : 0;
            if (message.result != null && message.hasOwnProperty("result"))
                object.result = options.enums === String ? $root.proto_oparb.BoxNotiUserAns.result_type[message.result] : message.result;
            return object;
        };

        /**
         * Converts this BoxNotiUserAns to JSON.
         * @function toJSON
         * @memberof proto_oparb.BoxNotiUserAns
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        BoxNotiUserAns.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * result_type enum.
         * @name proto_oparb.BoxNotiUserAns.result_type
         * @enum {number}
         * @property {number} SUCCESS=0 SUCCESS value
         * @property {number} FAILED=1 FAILED value
         * @property {number} NOT_EXIST=2 NOT_EXIST value
         */
        BoxNotiUserAns.result_type = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "SUCCESS"] = 0;
            values[valuesById[1] = "FAILED"] = 1;
            values[valuesById[2] = "NOT_EXIST"] = 2;
            return values;
        })();

        return BoxNotiUserAns;
    })();

    proto_oparb.SvrMsgReq = (function() {

        /**
         * Properties of a SvrMsgReq.
         * @memberof proto_oparb
         * @interface ISvrMsgReq
         * @property {Uint8Array} contents SvrMsgReq contents
         */

        /**
         * Constructs a new SvrMsgReq.
         * @memberof proto_oparb
         * @classdesc Represents a SvrMsgReq.
         * @implements ISvrMsgReq
         * @constructor
         * @param {proto_oparb.ISvrMsgReq=} [properties] Properties to set
         */
        function SvrMsgReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SvrMsgReq contents.
         * @member {Uint8Array} contents
         * @memberof proto_oparb.SvrMsgReq
         * @instance
         */
        SvrMsgReq.prototype.contents = $util.newBuffer([]);

        /**
         * Creates a new SvrMsgReq instance using the specified properties.
         * @function create
         * @memberof proto_oparb.SvrMsgReq
         * @static
         * @param {proto_oparb.ISvrMsgReq=} [properties] Properties to set
         * @returns {proto_oparb.SvrMsgReq} SvrMsgReq instance
         */
        SvrMsgReq.create = function create(properties) {
            return new SvrMsgReq(properties);
        };

        /**
         * Encodes the specified SvrMsgReq message. Does not implicitly {@link proto_oparb.SvrMsgReq.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.SvrMsgReq
         * @static
         * @param {proto_oparb.ISvrMsgReq} message SvrMsgReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SvrMsgReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.contents);
            return writer;
        };

        /**
         * Encodes the specified SvrMsgReq message, length delimited. Does not implicitly {@link proto_oparb.SvrMsgReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.SvrMsgReq
         * @static
         * @param {proto_oparb.ISvrMsgReq} message SvrMsgReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SvrMsgReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SvrMsgReq message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.SvrMsgReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.SvrMsgReq} SvrMsgReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SvrMsgReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.SvrMsgReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 2:
                    message.contents = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("contents"))
                throw $util.ProtocolError("missing required 'contents'", { instance: message });
            return message;
        };

        /**
         * Decodes a SvrMsgReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.SvrMsgReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.SvrMsgReq} SvrMsgReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SvrMsgReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SvrMsgReq message.
         * @function verify
         * @memberof proto_oparb.SvrMsgReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SvrMsgReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!(message.contents && typeof message.contents.length === "number" || $util.isString(message.contents)))
                return "contents: buffer expected";
            return null;
        };

        /**
         * Creates a SvrMsgReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.SvrMsgReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.SvrMsgReq} SvrMsgReq
         */
        SvrMsgReq.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.SvrMsgReq)
                return object;
            var message = new $root.proto_oparb.SvrMsgReq();
            if (object.contents != null)
                if (typeof object.contents === "string")
                    $util.base64.decode(object.contents, message.contents = $util.newBuffer($util.base64.length(object.contents)), 0);
                else if (object.contents.length)
                    message.contents = object.contents;
            return message;
        };

        /**
         * Creates a plain object from a SvrMsgReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.SvrMsgReq
         * @static
         * @param {proto_oparb.SvrMsgReq} message SvrMsgReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SvrMsgReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                if (options.bytes === String)
                    object.contents = "";
                else {
                    object.contents = [];
                    if (options.bytes !== Array)
                        object.contents = $util.newBuffer(object.contents);
                }
            if (message.contents != null && message.hasOwnProperty("contents"))
                object.contents = options.bytes === String ? $util.base64.encode(message.contents, 0, message.contents.length) : options.bytes === Array ? Array.prototype.slice.call(message.contents) : message.contents;
            return object;
        };

        /**
         * Converts this SvrMsgReq to JSON.
         * @function toJSON
         * @memberof proto_oparb.SvrMsgReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SvrMsgReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return SvrMsgReq;
    })();

    proto_oparb.SvrMsgAns = (function() {

        /**
         * Properties of a SvrMsgAns.
         * @memberof proto_oparb
         * @interface ISvrMsgAns
         * @property {boolean} result SvrMsgAns result
         */

        /**
         * Constructs a new SvrMsgAns.
         * @memberof proto_oparb
         * @classdesc Represents a SvrMsgAns.
         * @implements ISvrMsgAns
         * @constructor
         * @param {proto_oparb.ISvrMsgAns=} [properties] Properties to set
         */
        function SvrMsgAns(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SvrMsgAns result.
         * @member {boolean} result
         * @memberof proto_oparb.SvrMsgAns
         * @instance
         */
        SvrMsgAns.prototype.result = false;

        /**
         * Creates a new SvrMsgAns instance using the specified properties.
         * @function create
         * @memberof proto_oparb.SvrMsgAns
         * @static
         * @param {proto_oparb.ISvrMsgAns=} [properties] Properties to set
         * @returns {proto_oparb.SvrMsgAns} SvrMsgAns instance
         */
        SvrMsgAns.create = function create(properties) {
            return new SvrMsgAns(properties);
        };

        /**
         * Encodes the specified SvrMsgAns message. Does not implicitly {@link proto_oparb.SvrMsgAns.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.SvrMsgAns
         * @static
         * @param {proto_oparb.ISvrMsgAns} message SvrMsgAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SvrMsgAns.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 0 =*/8).bool(message.result);
            return writer;
        };

        /**
         * Encodes the specified SvrMsgAns message, length delimited. Does not implicitly {@link proto_oparb.SvrMsgAns.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.SvrMsgAns
         * @static
         * @param {proto_oparb.ISvrMsgAns} message SvrMsgAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SvrMsgAns.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SvrMsgAns message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.SvrMsgAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.SvrMsgAns} SvrMsgAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SvrMsgAns.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.SvrMsgAns();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.result = reader.bool();
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
         * Decodes a SvrMsgAns message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.SvrMsgAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.SvrMsgAns} SvrMsgAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SvrMsgAns.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SvrMsgAns message.
         * @function verify
         * @memberof proto_oparb.SvrMsgAns
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SvrMsgAns.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (typeof message.result !== "boolean")
                return "result: boolean expected";
            return null;
        };

        /**
         * Creates a SvrMsgAns message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.SvrMsgAns
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.SvrMsgAns} SvrMsgAns
         */
        SvrMsgAns.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.SvrMsgAns)
                return object;
            var message = new $root.proto_oparb.SvrMsgAns();
            if (object.result != null)
                message.result = Boolean(object.result);
            return message;
        };

        /**
         * Creates a plain object from a SvrMsgAns message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.SvrMsgAns
         * @static
         * @param {proto_oparb.SvrMsgAns} message SvrMsgAns
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SvrMsgAns.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.result = false;
            if (message.result != null && message.hasOwnProperty("result"))
                object.result = message.result;
            return object;
        };

        /**
         * Converts this SvrMsgAns to JSON.
         * @function toJSON
         * @memberof proto_oparb.SvrMsgAns
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SvrMsgAns.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return SvrMsgAns;
    })();

    proto_oparb.CharTransQueryReq = (function() {

        /**
         * Properties of a CharTransQueryReq.
         * @memberof proto_oparb
         * @interface ICharTransQueryReq
         * @property {number} charSrl CharTransQueryReq charSrl
         */

        /**
         * Constructs a new CharTransQueryReq.
         * @memberof proto_oparb
         * @classdesc Represents a CharTransQueryReq.
         * @implements ICharTransQueryReq
         * @constructor
         * @param {proto_oparb.ICharTransQueryReq=} [properties] Properties to set
         */
        function CharTransQueryReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CharTransQueryReq charSrl.
         * @member {number} charSrl
         * @memberof proto_oparb.CharTransQueryReq
         * @instance
         */
        CharTransQueryReq.prototype.charSrl = 0;

        /**
         * Creates a new CharTransQueryReq instance using the specified properties.
         * @function create
         * @memberof proto_oparb.CharTransQueryReq
         * @static
         * @param {proto_oparb.ICharTransQueryReq=} [properties] Properties to set
         * @returns {proto_oparb.CharTransQueryReq} CharTransQueryReq instance
         */
        CharTransQueryReq.create = function create(properties) {
            return new CharTransQueryReq(properties);
        };

        /**
         * Encodes the specified CharTransQueryReq message. Does not implicitly {@link proto_oparb.CharTransQueryReq.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.CharTransQueryReq
         * @static
         * @param {proto_oparb.ICharTransQueryReq} message CharTransQueryReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CharTransQueryReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 5 =*/13).fixed32(message.charSrl);
            return writer;
        };

        /**
         * Encodes the specified CharTransQueryReq message, length delimited. Does not implicitly {@link proto_oparb.CharTransQueryReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.CharTransQueryReq
         * @static
         * @param {proto_oparb.ICharTransQueryReq} message CharTransQueryReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CharTransQueryReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CharTransQueryReq message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.CharTransQueryReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.CharTransQueryReq} CharTransQueryReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CharTransQueryReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.CharTransQueryReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.charSrl = reader.fixed32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("charSrl"))
                throw $util.ProtocolError("missing required 'charSrl'", { instance: message });
            return message;
        };

        /**
         * Decodes a CharTransQueryReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.CharTransQueryReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.CharTransQueryReq} CharTransQueryReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CharTransQueryReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CharTransQueryReq message.
         * @function verify
         * @memberof proto_oparb.CharTransQueryReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CharTransQueryReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.charSrl))
                return "charSrl: integer expected";
            return null;
        };

        /**
         * Creates a CharTransQueryReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.CharTransQueryReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.CharTransQueryReq} CharTransQueryReq
         */
        CharTransQueryReq.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.CharTransQueryReq)
                return object;
            var message = new $root.proto_oparb.CharTransQueryReq();
            if (object.charSrl != null)
                message.charSrl = object.charSrl >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a CharTransQueryReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.CharTransQueryReq
         * @static
         * @param {proto_oparb.CharTransQueryReq} message CharTransQueryReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CharTransQueryReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.charSrl = 0;
            if (message.charSrl != null && message.hasOwnProperty("charSrl"))
                object.charSrl = message.charSrl;
            return object;
        };

        /**
         * Converts this CharTransQueryReq to JSON.
         * @function toJSON
         * @memberof proto_oparb.CharTransQueryReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CharTransQueryReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CharTransQueryReq;
    })();

    proto_oparb.CharTransQueryAns = (function() {

        /**
         * Properties of a CharTransQueryAns.
         * @memberof proto_oparb
         * @interface ICharTransQueryAns
         * @property {number|Long} money CharTransQueryAns money
         * @property {number} level CharTransQueryAns level
         * @property {number} code CharTransQueryAns code
         */

        /**
         * Constructs a new CharTransQueryAns.
         * @memberof proto_oparb
         * @classdesc Represents a CharTransQueryAns.
         * @implements ICharTransQueryAns
         * @constructor
         * @param {proto_oparb.ICharTransQueryAns=} [properties] Properties to set
         */
        function CharTransQueryAns(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CharTransQueryAns money.
         * @member {number|Long} money
         * @memberof proto_oparb.CharTransQueryAns
         * @instance
         */
        CharTransQueryAns.prototype.money = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * CharTransQueryAns level.
         * @member {number} level
         * @memberof proto_oparb.CharTransQueryAns
         * @instance
         */
        CharTransQueryAns.prototype.level = 0;

        /**
         * CharTransQueryAns code.
         * @member {number} code
         * @memberof proto_oparb.CharTransQueryAns
         * @instance
         */
        CharTransQueryAns.prototype.code = 0;

        /**
         * Creates a new CharTransQueryAns instance using the specified properties.
         * @function create
         * @memberof proto_oparb.CharTransQueryAns
         * @static
         * @param {proto_oparb.ICharTransQueryAns=} [properties] Properties to set
         * @returns {proto_oparb.CharTransQueryAns} CharTransQueryAns instance
         */
        CharTransQueryAns.create = function create(properties) {
            return new CharTransQueryAns(properties);
        };

        /**
         * Encodes the specified CharTransQueryAns message. Does not implicitly {@link proto_oparb.CharTransQueryAns.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.CharTransQueryAns
         * @static
         * @param {proto_oparb.ICharTransQueryAns} message CharTransQueryAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CharTransQueryAns.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 1 =*/9).fixed64(message.money);
            writer.uint32(/* id 2, wireType 5 =*/21).fixed32(message.level);
            writer.uint32(/* id 3, wireType 5 =*/29).fixed32(message.code);
            return writer;
        };

        /**
         * Encodes the specified CharTransQueryAns message, length delimited. Does not implicitly {@link proto_oparb.CharTransQueryAns.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.CharTransQueryAns
         * @static
         * @param {proto_oparb.ICharTransQueryAns} message CharTransQueryAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CharTransQueryAns.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CharTransQueryAns message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.CharTransQueryAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.CharTransQueryAns} CharTransQueryAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CharTransQueryAns.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.CharTransQueryAns();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.money = reader.fixed64();
                    break;
                case 2:
                    message.level = reader.fixed32();
                    break;
                case 3:
                    message.code = reader.fixed32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("money"))
                throw $util.ProtocolError("missing required 'money'", { instance: message });
            if (!message.hasOwnProperty("level"))
                throw $util.ProtocolError("missing required 'level'", { instance: message });
            if (!message.hasOwnProperty("code"))
                throw $util.ProtocolError("missing required 'code'", { instance: message });
            return message;
        };

        /**
         * Decodes a CharTransQueryAns message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.CharTransQueryAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.CharTransQueryAns} CharTransQueryAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CharTransQueryAns.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CharTransQueryAns message.
         * @function verify
         * @memberof proto_oparb.CharTransQueryAns
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CharTransQueryAns.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.money) && !(message.money && $util.isInteger(message.money.low) && $util.isInteger(message.money.high)))
                return "money: integer|Long expected";
            if (!$util.isInteger(message.level))
                return "level: integer expected";
            if (!$util.isInteger(message.code))
                return "code: integer expected";
            return null;
        };

        /**
         * Creates a CharTransQueryAns message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.CharTransQueryAns
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.CharTransQueryAns} CharTransQueryAns
         */
        CharTransQueryAns.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.CharTransQueryAns)
                return object;
            var message = new $root.proto_oparb.CharTransQueryAns();
            if (object.money != null)
                if ($util.Long)
                    (message.money = $util.Long.fromValue(object.money)).unsigned = false;
                else if (typeof object.money === "string")
                    message.money = parseInt(object.money, 10);
                else if (typeof object.money === "number")
                    message.money = object.money;
                else if (typeof object.money === "object")
                    message.money = new $util.LongBits(object.money.low >>> 0, object.money.high >>> 0).toNumber();
            if (object.level != null)
                message.level = object.level >>> 0;
            if (object.code != null)
                message.code = object.code >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a CharTransQueryAns message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.CharTransQueryAns
         * @static
         * @param {proto_oparb.CharTransQueryAns} message CharTransQueryAns
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CharTransQueryAns.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.money = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.money = options.longs === String ? "0" : 0;
                object.level = 0;
                object.code = 0;
            }
            if (message.money != null && message.hasOwnProperty("money"))
                if (typeof message.money === "number")
                    object.money = options.longs === String ? String(message.money) : message.money;
                else
                    object.money = options.longs === String ? $util.Long.prototype.toString.call(message.money) : options.longs === Number ? new $util.LongBits(message.money.low >>> 0, message.money.high >>> 0).toNumber() : message.money;
            if (message.level != null && message.hasOwnProperty("level"))
                object.level = message.level;
            if (message.code != null && message.hasOwnProperty("code"))
                object.code = message.code;
            return object;
        };

        /**
         * Converts this CharTransQueryAns to JSON.
         * @function toJSON
         * @memberof proto_oparb.CharTransQueryAns
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CharTransQueryAns.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CharTransQueryAns;
    })();

    proto_oparb.CharTransExecReq = (function() {

        /**
         * Properties of a CharTransExecReq.
         * @memberof proto_oparb
         * @interface ICharTransExecReq
         * @property {number} charSrl CharTransExecReq charSrl
         * @property {number} destArb CharTransExecReq destArb
         * @property {number|Long} moneyMax CharTransExecReq moneyMax
         * @property {number} levelMin CharTransExecReq levelMin
         */

        /**
         * Constructs a new CharTransExecReq.
         * @memberof proto_oparb
         * @classdesc Represents a CharTransExecReq.
         * @implements ICharTransExecReq
         * @constructor
         * @param {proto_oparb.ICharTransExecReq=} [properties] Properties to set
         */
        function CharTransExecReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CharTransExecReq charSrl.
         * @member {number} charSrl
         * @memberof proto_oparb.CharTransExecReq
         * @instance
         */
        CharTransExecReq.prototype.charSrl = 0;

        /**
         * CharTransExecReq destArb.
         * @member {number} destArb
         * @memberof proto_oparb.CharTransExecReq
         * @instance
         */
        CharTransExecReq.prototype.destArb = 0;

        /**
         * CharTransExecReq moneyMax.
         * @member {number|Long} moneyMax
         * @memberof proto_oparb.CharTransExecReq
         * @instance
         */
        CharTransExecReq.prototype.moneyMax = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * CharTransExecReq levelMin.
         * @member {number} levelMin
         * @memberof proto_oparb.CharTransExecReq
         * @instance
         */
        CharTransExecReq.prototype.levelMin = 0;

        /**
         * Creates a new CharTransExecReq instance using the specified properties.
         * @function create
         * @memberof proto_oparb.CharTransExecReq
         * @static
         * @param {proto_oparb.ICharTransExecReq=} [properties] Properties to set
         * @returns {proto_oparb.CharTransExecReq} CharTransExecReq instance
         */
        CharTransExecReq.create = function create(properties) {
            return new CharTransExecReq(properties);
        };

        /**
         * Encodes the specified CharTransExecReq message. Does not implicitly {@link proto_oparb.CharTransExecReq.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.CharTransExecReq
         * @static
         * @param {proto_oparb.ICharTransExecReq} message CharTransExecReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CharTransExecReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 5 =*/13).fixed32(message.charSrl);
            writer.uint32(/* id 2, wireType 5 =*/21).fixed32(message.destArb);
            writer.uint32(/* id 3, wireType 1 =*/25).fixed64(message.moneyMax);
            writer.uint32(/* id 4, wireType 5 =*/37).fixed32(message.levelMin);
            return writer;
        };

        /**
         * Encodes the specified CharTransExecReq message, length delimited. Does not implicitly {@link proto_oparb.CharTransExecReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.CharTransExecReq
         * @static
         * @param {proto_oparb.ICharTransExecReq} message CharTransExecReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CharTransExecReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CharTransExecReq message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.CharTransExecReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.CharTransExecReq} CharTransExecReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CharTransExecReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.CharTransExecReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.charSrl = reader.fixed32();
                    break;
                case 2:
                    message.destArb = reader.fixed32();
                    break;
                case 3:
                    message.moneyMax = reader.fixed64();
                    break;
                case 4:
                    message.levelMin = reader.fixed32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("charSrl"))
                throw $util.ProtocolError("missing required 'charSrl'", { instance: message });
            if (!message.hasOwnProperty("destArb"))
                throw $util.ProtocolError("missing required 'destArb'", { instance: message });
            if (!message.hasOwnProperty("moneyMax"))
                throw $util.ProtocolError("missing required 'moneyMax'", { instance: message });
            if (!message.hasOwnProperty("levelMin"))
                throw $util.ProtocolError("missing required 'levelMin'", { instance: message });
            return message;
        };

        /**
         * Decodes a CharTransExecReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.CharTransExecReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.CharTransExecReq} CharTransExecReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CharTransExecReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CharTransExecReq message.
         * @function verify
         * @memberof proto_oparb.CharTransExecReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CharTransExecReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.charSrl))
                return "charSrl: integer expected";
            if (!$util.isInteger(message.destArb))
                return "destArb: integer expected";
            if (!$util.isInteger(message.moneyMax) && !(message.moneyMax && $util.isInteger(message.moneyMax.low) && $util.isInteger(message.moneyMax.high)))
                return "moneyMax: integer|Long expected";
            if (!$util.isInteger(message.levelMin))
                return "levelMin: integer expected";
            return null;
        };

        /**
         * Creates a CharTransExecReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.CharTransExecReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.CharTransExecReq} CharTransExecReq
         */
        CharTransExecReq.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.CharTransExecReq)
                return object;
            var message = new $root.proto_oparb.CharTransExecReq();
            if (object.charSrl != null)
                message.charSrl = object.charSrl >>> 0;
            if (object.destArb != null)
                message.destArb = object.destArb >>> 0;
            if (object.moneyMax != null)
                if ($util.Long)
                    (message.moneyMax = $util.Long.fromValue(object.moneyMax)).unsigned = false;
                else if (typeof object.moneyMax === "string")
                    message.moneyMax = parseInt(object.moneyMax, 10);
                else if (typeof object.moneyMax === "number")
                    message.moneyMax = object.moneyMax;
                else if (typeof object.moneyMax === "object")
                    message.moneyMax = new $util.LongBits(object.moneyMax.low >>> 0, object.moneyMax.high >>> 0).toNumber();
            if (object.levelMin != null)
                message.levelMin = object.levelMin >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a CharTransExecReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.CharTransExecReq
         * @static
         * @param {proto_oparb.CharTransExecReq} message CharTransExecReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CharTransExecReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.charSrl = 0;
                object.destArb = 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.moneyMax = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.moneyMax = options.longs === String ? "0" : 0;
                object.levelMin = 0;
            }
            if (message.charSrl != null && message.hasOwnProperty("charSrl"))
                object.charSrl = message.charSrl;
            if (message.destArb != null && message.hasOwnProperty("destArb"))
                object.destArb = message.destArb;
            if (message.moneyMax != null && message.hasOwnProperty("moneyMax"))
                if (typeof message.moneyMax === "number")
                    object.moneyMax = options.longs === String ? String(message.moneyMax) : message.moneyMax;
                else
                    object.moneyMax = options.longs === String ? $util.Long.prototype.toString.call(message.moneyMax) : options.longs === Number ? new $util.LongBits(message.moneyMax.low >>> 0, message.moneyMax.high >>> 0).toNumber() : message.moneyMax;
            if (message.levelMin != null && message.hasOwnProperty("levelMin"))
                object.levelMin = message.levelMin;
            return object;
        };

        /**
         * Converts this CharTransExecReq to JSON.
         * @function toJSON
         * @memberof proto_oparb.CharTransExecReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CharTransExecReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CharTransExecReq;
    })();

    proto_oparb.CharTransExecAns = (function() {

        /**
         * Properties of a CharTransExecAns.
         * @memberof proto_oparb
         * @interface ICharTransExecAns
         * @property {number} newCharSrl CharTransExecAns newCharSrl
         * @property {number} code CharTransExecAns code
         */

        /**
         * Constructs a new CharTransExecAns.
         * @memberof proto_oparb
         * @classdesc Represents a CharTransExecAns.
         * @implements ICharTransExecAns
         * @constructor
         * @param {proto_oparb.ICharTransExecAns=} [properties] Properties to set
         */
        function CharTransExecAns(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CharTransExecAns newCharSrl.
         * @member {number} newCharSrl
         * @memberof proto_oparb.CharTransExecAns
         * @instance
         */
        CharTransExecAns.prototype.newCharSrl = 0;

        /**
         * CharTransExecAns code.
         * @member {number} code
         * @memberof proto_oparb.CharTransExecAns
         * @instance
         */
        CharTransExecAns.prototype.code = 0;

        /**
         * Creates a new CharTransExecAns instance using the specified properties.
         * @function create
         * @memberof proto_oparb.CharTransExecAns
         * @static
         * @param {proto_oparb.ICharTransExecAns=} [properties] Properties to set
         * @returns {proto_oparb.CharTransExecAns} CharTransExecAns instance
         */
        CharTransExecAns.create = function create(properties) {
            return new CharTransExecAns(properties);
        };

        /**
         * Encodes the specified CharTransExecAns message. Does not implicitly {@link proto_oparb.CharTransExecAns.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.CharTransExecAns
         * @static
         * @param {proto_oparb.ICharTransExecAns} message CharTransExecAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CharTransExecAns.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 5 =*/13).fixed32(message.newCharSrl);
            writer.uint32(/* id 2, wireType 5 =*/21).fixed32(message.code);
            return writer;
        };

        /**
         * Encodes the specified CharTransExecAns message, length delimited. Does not implicitly {@link proto_oparb.CharTransExecAns.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.CharTransExecAns
         * @static
         * @param {proto_oparb.ICharTransExecAns} message CharTransExecAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CharTransExecAns.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CharTransExecAns message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.CharTransExecAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.CharTransExecAns} CharTransExecAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CharTransExecAns.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.CharTransExecAns();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.newCharSrl = reader.fixed32();
                    break;
                case 2:
                    message.code = reader.fixed32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("newCharSrl"))
                throw $util.ProtocolError("missing required 'newCharSrl'", { instance: message });
            if (!message.hasOwnProperty("code"))
                throw $util.ProtocolError("missing required 'code'", { instance: message });
            return message;
        };

        /**
         * Decodes a CharTransExecAns message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.CharTransExecAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.CharTransExecAns} CharTransExecAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CharTransExecAns.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CharTransExecAns message.
         * @function verify
         * @memberof proto_oparb.CharTransExecAns
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CharTransExecAns.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.newCharSrl))
                return "newCharSrl: integer expected";
            if (!$util.isInteger(message.code))
                return "code: integer expected";
            return null;
        };

        /**
         * Creates a CharTransExecAns message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.CharTransExecAns
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.CharTransExecAns} CharTransExecAns
         */
        CharTransExecAns.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.CharTransExecAns)
                return object;
            var message = new $root.proto_oparb.CharTransExecAns();
            if (object.newCharSrl != null)
                message.newCharSrl = object.newCharSrl >>> 0;
            if (object.code != null)
                message.code = object.code >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a CharTransExecAns message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.CharTransExecAns
         * @static
         * @param {proto_oparb.CharTransExecAns} message CharTransExecAns
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CharTransExecAns.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.newCharSrl = 0;
                object.code = 0;
            }
            if (message.newCharSrl != null && message.hasOwnProperty("newCharSrl"))
                object.newCharSrl = message.newCharSrl;
            if (message.code != null && message.hasOwnProperty("code"))
                object.code = message.code;
            return object;
        };

        /**
         * Converts this CharTransExecAns to JSON.
         * @function toJSON
         * @memberof proto_oparb.CharTransExecAns
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CharTransExecAns.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CharTransExecAns;
    })();

    proto_oparb.SendRefreshBillNoti = (function() {

        /**
         * Properties of a SendRefreshBillNoti.
         * @memberof proto_oparb
         * @interface ISendRefreshBillNoti
         * @property {number|Long} userSrl SendRefreshBillNoti userSrl
         */

        /**
         * Constructs a new SendRefreshBillNoti.
         * @memberof proto_oparb
         * @classdesc Represents a SendRefreshBillNoti.
         * @implements ISendRefreshBillNoti
         * @constructor
         * @param {proto_oparb.ISendRefreshBillNoti=} [properties] Properties to set
         */
        function SendRefreshBillNoti(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SendRefreshBillNoti userSrl.
         * @member {number|Long} userSrl
         * @memberof proto_oparb.SendRefreshBillNoti
         * @instance
         */
        SendRefreshBillNoti.prototype.userSrl = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new SendRefreshBillNoti instance using the specified properties.
         * @function create
         * @memberof proto_oparb.SendRefreshBillNoti
         * @static
         * @param {proto_oparb.ISendRefreshBillNoti=} [properties] Properties to set
         * @returns {proto_oparb.SendRefreshBillNoti} SendRefreshBillNoti instance
         */
        SendRefreshBillNoti.create = function create(properties) {
            return new SendRefreshBillNoti(properties);
        };

        /**
         * Encodes the specified SendRefreshBillNoti message. Does not implicitly {@link proto_oparb.SendRefreshBillNoti.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.SendRefreshBillNoti
         * @static
         * @param {proto_oparb.ISendRefreshBillNoti} message SendRefreshBillNoti message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SendRefreshBillNoti.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 1 =*/9).fixed64(message.userSrl);
            return writer;
        };

        /**
         * Encodes the specified SendRefreshBillNoti message, length delimited. Does not implicitly {@link proto_oparb.SendRefreshBillNoti.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.SendRefreshBillNoti
         * @static
         * @param {proto_oparb.ISendRefreshBillNoti} message SendRefreshBillNoti message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SendRefreshBillNoti.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SendRefreshBillNoti message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.SendRefreshBillNoti
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.SendRefreshBillNoti} SendRefreshBillNoti
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SendRefreshBillNoti.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.SendRefreshBillNoti();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.userSrl = reader.fixed64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("userSrl"))
                throw $util.ProtocolError("missing required 'userSrl'", { instance: message });
            return message;
        };

        /**
         * Decodes a SendRefreshBillNoti message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.SendRefreshBillNoti
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.SendRefreshBillNoti} SendRefreshBillNoti
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SendRefreshBillNoti.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SendRefreshBillNoti message.
         * @function verify
         * @memberof proto_oparb.SendRefreshBillNoti
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SendRefreshBillNoti.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.userSrl) && !(message.userSrl && $util.isInteger(message.userSrl.low) && $util.isInteger(message.userSrl.high)))
                return "userSrl: integer|Long expected";
            return null;
        };

        /**
         * Creates a SendRefreshBillNoti message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.SendRefreshBillNoti
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.SendRefreshBillNoti} SendRefreshBillNoti
         */
        SendRefreshBillNoti.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.SendRefreshBillNoti)
                return object;
            var message = new $root.proto_oparb.SendRefreshBillNoti();
            if (object.userSrl != null)
                if ($util.Long)
                    (message.userSrl = $util.Long.fromValue(object.userSrl)).unsigned = false;
                else if (typeof object.userSrl === "string")
                    message.userSrl = parseInt(object.userSrl, 10);
                else if (typeof object.userSrl === "number")
                    message.userSrl = object.userSrl;
                else if (typeof object.userSrl === "object")
                    message.userSrl = new $util.LongBits(object.userSrl.low >>> 0, object.userSrl.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a SendRefreshBillNoti message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.SendRefreshBillNoti
         * @static
         * @param {proto_oparb.SendRefreshBillNoti} message SendRefreshBillNoti
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SendRefreshBillNoti.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.userSrl = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.userSrl = options.longs === String ? "0" : 0;
            if (message.userSrl != null && message.hasOwnProperty("userSrl"))
                if (typeof message.userSrl === "number")
                    object.userSrl = options.longs === String ? String(message.userSrl) : message.userSrl;
                else
                    object.userSrl = options.longs === String ? $util.Long.prototype.toString.call(message.userSrl) : options.longs === Number ? new $util.LongBits(message.userSrl.low >>> 0, message.userSrl.high >>> 0).toNumber() : message.userSrl;
            return object;
        };

        /**
         * Converts this SendRefreshBillNoti to JSON.
         * @function toJSON
         * @memberof proto_oparb.SendRefreshBillNoti
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SendRefreshBillNoti.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return SendRefreshBillNoti;
    })();

    proto_oparb.SendCommandNoti = (function() {

        /**
         * Properties of a SendCommandNoti.
         * @memberof proto_oparb
         * @interface ISendCommandNoti
         * @property {number|Long} userSrl SendCommandNoti userSrl
         * @property {number} command SendCommandNoti command
         * @property {number} value SendCommandNoti value
         * @property {number|null} [value2] SendCommandNoti value2
         */

        /**
         * Constructs a new SendCommandNoti.
         * @memberof proto_oparb
         * @classdesc Represents a SendCommandNoti.
         * @implements ISendCommandNoti
         * @constructor
         * @param {proto_oparb.ISendCommandNoti=} [properties] Properties to set
         */
        function SendCommandNoti(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SendCommandNoti userSrl.
         * @member {number|Long} userSrl
         * @memberof proto_oparb.SendCommandNoti
         * @instance
         */
        SendCommandNoti.prototype.userSrl = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * SendCommandNoti command.
         * @member {number} command
         * @memberof proto_oparb.SendCommandNoti
         * @instance
         */
        SendCommandNoti.prototype.command = 0;

        /**
         * SendCommandNoti value.
         * @member {number} value
         * @memberof proto_oparb.SendCommandNoti
         * @instance
         */
        SendCommandNoti.prototype.value = 0;

        /**
         * SendCommandNoti value2.
         * @member {number} value2
         * @memberof proto_oparb.SendCommandNoti
         * @instance
         */
        SendCommandNoti.prototype.value2 = 0;

        /**
         * Creates a new SendCommandNoti instance using the specified properties.
         * @function create
         * @memberof proto_oparb.SendCommandNoti
         * @static
         * @param {proto_oparb.ISendCommandNoti=} [properties] Properties to set
         * @returns {proto_oparb.SendCommandNoti} SendCommandNoti instance
         */
        SendCommandNoti.create = function create(properties) {
            return new SendCommandNoti(properties);
        };

        /**
         * Encodes the specified SendCommandNoti message. Does not implicitly {@link proto_oparb.SendCommandNoti.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.SendCommandNoti
         * @static
         * @param {proto_oparb.ISendCommandNoti} message SendCommandNoti message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SendCommandNoti.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 1 =*/9).fixed64(message.userSrl);
            writer.uint32(/* id 2, wireType 5 =*/21).fixed32(message.command);
            writer.uint32(/* id 3, wireType 5 =*/29).fixed32(message.value);
            if (message.value2 != null && Object.hasOwnProperty.call(message, "value2"))
                writer.uint32(/* id 4, wireType 5 =*/37).fixed32(message.value2);
            return writer;
        };

        /**
         * Encodes the specified SendCommandNoti message, length delimited. Does not implicitly {@link proto_oparb.SendCommandNoti.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.SendCommandNoti
         * @static
         * @param {proto_oparb.ISendCommandNoti} message SendCommandNoti message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SendCommandNoti.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SendCommandNoti message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.SendCommandNoti
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.SendCommandNoti} SendCommandNoti
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SendCommandNoti.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.SendCommandNoti();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.userSrl = reader.fixed64();
                    break;
                case 2:
                    message.command = reader.fixed32();
                    break;
                case 3:
                    message.value = reader.fixed32();
                    break;
                case 4:
                    message.value2 = reader.fixed32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("userSrl"))
                throw $util.ProtocolError("missing required 'userSrl'", { instance: message });
            if (!message.hasOwnProperty("command"))
                throw $util.ProtocolError("missing required 'command'", { instance: message });
            if (!message.hasOwnProperty("value"))
                throw $util.ProtocolError("missing required 'value'", { instance: message });
            return message;
        };

        /**
         * Decodes a SendCommandNoti message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.SendCommandNoti
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.SendCommandNoti} SendCommandNoti
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SendCommandNoti.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SendCommandNoti message.
         * @function verify
         * @memberof proto_oparb.SendCommandNoti
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SendCommandNoti.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.userSrl) && !(message.userSrl && $util.isInteger(message.userSrl.low) && $util.isInteger(message.userSrl.high)))
                return "userSrl: integer|Long expected";
            if (!$util.isInteger(message.command))
                return "command: integer expected";
            if (!$util.isInteger(message.value))
                return "value: integer expected";
            if (message.value2 != null && message.hasOwnProperty("value2"))
                if (!$util.isInteger(message.value2))
                    return "value2: integer expected";
            return null;
        };

        /**
         * Creates a SendCommandNoti message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.SendCommandNoti
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.SendCommandNoti} SendCommandNoti
         */
        SendCommandNoti.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.SendCommandNoti)
                return object;
            var message = new $root.proto_oparb.SendCommandNoti();
            if (object.userSrl != null)
                if ($util.Long)
                    (message.userSrl = $util.Long.fromValue(object.userSrl)).unsigned = false;
                else if (typeof object.userSrl === "string")
                    message.userSrl = parseInt(object.userSrl, 10);
                else if (typeof object.userSrl === "number")
                    message.userSrl = object.userSrl;
                else if (typeof object.userSrl === "object")
                    message.userSrl = new $util.LongBits(object.userSrl.low >>> 0, object.userSrl.high >>> 0).toNumber();
            if (object.command != null)
                message.command = object.command >>> 0;
            if (object.value != null)
                message.value = object.value >>> 0;
            if (object.value2 != null)
                message.value2 = object.value2 >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a SendCommandNoti message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.SendCommandNoti
         * @static
         * @param {proto_oparb.SendCommandNoti} message SendCommandNoti
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SendCommandNoti.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.userSrl = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.userSrl = options.longs === String ? "0" : 0;
                object.command = 0;
                object.value = 0;
                object.value2 = 0;
            }
            if (message.userSrl != null && message.hasOwnProperty("userSrl"))
                if (typeof message.userSrl === "number")
                    object.userSrl = options.longs === String ? String(message.userSrl) : message.userSrl;
                else
                    object.userSrl = options.longs === String ? $util.Long.prototype.toString.call(message.userSrl) : options.longs === Number ? new $util.LongBits(message.userSrl.low >>> 0, message.userSrl.high >>> 0).toNumber() : message.userSrl;
            if (message.command != null && message.hasOwnProperty("command"))
                object.command = message.command;
            if (message.value != null && message.hasOwnProperty("value"))
                object.value = message.value;
            if (message.value2 != null && message.hasOwnProperty("value2"))
                object.value2 = message.value2;
            return object;
        };

        /**
         * Converts this SendCommandNoti to JSON.
         * @function toJSON
         * @memberof proto_oparb.SendCommandNoti
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SendCommandNoti.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return SendCommandNoti;
    })();

    proto_oparb.CharNameBanReq = (function() {

        /**
         * Properties of a CharNameBanReq.
         * @memberof proto_oparb
         * @interface ICharNameBanReq
         * @property {number} charSrl CharNameBanReq charSrl
         * @property {number} code CharNameBanReq code
         */

        /**
         * Constructs a new CharNameBanReq.
         * @memberof proto_oparb
         * @classdesc Represents a CharNameBanReq.
         * @implements ICharNameBanReq
         * @constructor
         * @param {proto_oparb.ICharNameBanReq=} [properties] Properties to set
         */
        function CharNameBanReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CharNameBanReq charSrl.
         * @member {number} charSrl
         * @memberof proto_oparb.CharNameBanReq
         * @instance
         */
        CharNameBanReq.prototype.charSrl = 0;

        /**
         * CharNameBanReq code.
         * @member {number} code
         * @memberof proto_oparb.CharNameBanReq
         * @instance
         */
        CharNameBanReq.prototype.code = 0;

        /**
         * Creates a new CharNameBanReq instance using the specified properties.
         * @function create
         * @memberof proto_oparb.CharNameBanReq
         * @static
         * @param {proto_oparb.ICharNameBanReq=} [properties] Properties to set
         * @returns {proto_oparb.CharNameBanReq} CharNameBanReq instance
         */
        CharNameBanReq.create = function create(properties) {
            return new CharNameBanReq(properties);
        };

        /**
         * Encodes the specified CharNameBanReq message. Does not implicitly {@link proto_oparb.CharNameBanReq.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.CharNameBanReq
         * @static
         * @param {proto_oparb.ICharNameBanReq} message CharNameBanReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CharNameBanReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 5 =*/13).fixed32(message.charSrl);
            writer.uint32(/* id 2, wireType 5 =*/21).fixed32(message.code);
            return writer;
        };

        /**
         * Encodes the specified CharNameBanReq message, length delimited. Does not implicitly {@link proto_oparb.CharNameBanReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.CharNameBanReq
         * @static
         * @param {proto_oparb.ICharNameBanReq} message CharNameBanReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CharNameBanReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CharNameBanReq message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.CharNameBanReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.CharNameBanReq} CharNameBanReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CharNameBanReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.CharNameBanReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.charSrl = reader.fixed32();
                    break;
                case 2:
                    message.code = reader.fixed32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("charSrl"))
                throw $util.ProtocolError("missing required 'charSrl'", { instance: message });
            if (!message.hasOwnProperty("code"))
                throw $util.ProtocolError("missing required 'code'", { instance: message });
            return message;
        };

        /**
         * Decodes a CharNameBanReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.CharNameBanReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.CharNameBanReq} CharNameBanReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CharNameBanReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CharNameBanReq message.
         * @function verify
         * @memberof proto_oparb.CharNameBanReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CharNameBanReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.charSrl))
                return "charSrl: integer expected";
            if (!$util.isInteger(message.code))
                return "code: integer expected";
            return null;
        };

        /**
         * Creates a CharNameBanReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.CharNameBanReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.CharNameBanReq} CharNameBanReq
         */
        CharNameBanReq.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.CharNameBanReq)
                return object;
            var message = new $root.proto_oparb.CharNameBanReq();
            if (object.charSrl != null)
                message.charSrl = object.charSrl >>> 0;
            if (object.code != null)
                message.code = object.code >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a CharNameBanReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.CharNameBanReq
         * @static
         * @param {proto_oparb.CharNameBanReq} message CharNameBanReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CharNameBanReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.charSrl = 0;
                object.code = 0;
            }
            if (message.charSrl != null && message.hasOwnProperty("charSrl"))
                object.charSrl = message.charSrl;
            if (message.code != null && message.hasOwnProperty("code"))
                object.code = message.code;
            return object;
        };

        /**
         * Converts this CharNameBanReq to JSON.
         * @function toJSON
         * @memberof proto_oparb.CharNameBanReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CharNameBanReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CharNameBanReq;
    })();

    proto_oparb.CharNameBanAns = (function() {

        /**
         * Properties of a CharNameBanAns.
         * @memberof proto_oparb
         * @interface ICharNameBanAns
         * @property {proto_oparb.CharNameBanAns.result_type} result CharNameBanAns result
         */

        /**
         * Constructs a new CharNameBanAns.
         * @memberof proto_oparb
         * @classdesc Represents a CharNameBanAns.
         * @implements ICharNameBanAns
         * @constructor
         * @param {proto_oparb.ICharNameBanAns=} [properties] Properties to set
         */
        function CharNameBanAns(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CharNameBanAns result.
         * @member {proto_oparb.CharNameBanAns.result_type} result
         * @memberof proto_oparb.CharNameBanAns
         * @instance
         */
        CharNameBanAns.prototype.result = 0;

        /**
         * Creates a new CharNameBanAns instance using the specified properties.
         * @function create
         * @memberof proto_oparb.CharNameBanAns
         * @static
         * @param {proto_oparb.ICharNameBanAns=} [properties] Properties to set
         * @returns {proto_oparb.CharNameBanAns} CharNameBanAns instance
         */
        CharNameBanAns.create = function create(properties) {
            return new CharNameBanAns(properties);
        };

        /**
         * Encodes the specified CharNameBanAns message. Does not implicitly {@link proto_oparb.CharNameBanAns.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.CharNameBanAns
         * @static
         * @param {proto_oparb.ICharNameBanAns} message CharNameBanAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CharNameBanAns.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.result);
            return writer;
        };

        /**
         * Encodes the specified CharNameBanAns message, length delimited. Does not implicitly {@link proto_oparb.CharNameBanAns.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.CharNameBanAns
         * @static
         * @param {proto_oparb.ICharNameBanAns} message CharNameBanAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CharNameBanAns.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CharNameBanAns message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.CharNameBanAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.CharNameBanAns} CharNameBanAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CharNameBanAns.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.CharNameBanAns();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.result = reader.int32();
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
         * Decodes a CharNameBanAns message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.CharNameBanAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.CharNameBanAns} CharNameBanAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CharNameBanAns.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CharNameBanAns message.
         * @function verify
         * @memberof proto_oparb.CharNameBanAns
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CharNameBanAns.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            switch (message.result) {
            default:
                return "result: enum value expected";
            case 0:
            case 1:
            case 2:
                break;
            }
            return null;
        };

        /**
         * Creates a CharNameBanAns message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.CharNameBanAns
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.CharNameBanAns} CharNameBanAns
         */
        CharNameBanAns.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.CharNameBanAns)
                return object;
            var message = new $root.proto_oparb.CharNameBanAns();
            switch (object.result) {
            case "SUCCESS":
            case 0:
                message.result = 0;
                break;
            case "FAILED":
            case 1:
                message.result = 1;
                break;
            case "NOT_EXIST":
            case 2:
                message.result = 2;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a CharNameBanAns message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.CharNameBanAns
         * @static
         * @param {proto_oparb.CharNameBanAns} message CharNameBanAns
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CharNameBanAns.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.result = options.enums === String ? "SUCCESS" : 0;
            if (message.result != null && message.hasOwnProperty("result"))
                object.result = options.enums === String ? $root.proto_oparb.CharNameBanAns.result_type[message.result] : message.result;
            return object;
        };

        /**
         * Converts this CharNameBanAns to JSON.
         * @function toJSON
         * @memberof proto_oparb.CharNameBanAns
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CharNameBanAns.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * result_type enum.
         * @name proto_oparb.CharNameBanAns.result_type
         * @enum {number}
         * @property {number} SUCCESS=0 SUCCESS value
         * @property {number} FAILED=1 FAILED value
         * @property {number} NOT_EXIST=2 NOT_EXIST value
         */
        CharNameBanAns.result_type = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "SUCCESS"] = 0;
            values[valuesById[1] = "FAILED"] = 1;
            values[valuesById[2] = "NOT_EXIST"] = 2;
            return values;
        })();

        return CharNameBanAns;
    })();

    proto_oparb.GuildNameBanReq = (function() {

        /**
         * Properties of a GuildNameBanReq.
         * @memberof proto_oparb
         * @interface IGuildNameBanReq
         * @property {number} guildSrl GuildNameBanReq guildSrl
         */

        /**
         * Constructs a new GuildNameBanReq.
         * @memberof proto_oparb
         * @classdesc Represents a GuildNameBanReq.
         * @implements IGuildNameBanReq
         * @constructor
         * @param {proto_oparb.IGuildNameBanReq=} [properties] Properties to set
         */
        function GuildNameBanReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GuildNameBanReq guildSrl.
         * @member {number} guildSrl
         * @memberof proto_oparb.GuildNameBanReq
         * @instance
         */
        GuildNameBanReq.prototype.guildSrl = 0;

        /**
         * Creates a new GuildNameBanReq instance using the specified properties.
         * @function create
         * @memberof proto_oparb.GuildNameBanReq
         * @static
         * @param {proto_oparb.IGuildNameBanReq=} [properties] Properties to set
         * @returns {proto_oparb.GuildNameBanReq} GuildNameBanReq instance
         */
        GuildNameBanReq.create = function create(properties) {
            return new GuildNameBanReq(properties);
        };

        /**
         * Encodes the specified GuildNameBanReq message. Does not implicitly {@link proto_oparb.GuildNameBanReq.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.GuildNameBanReq
         * @static
         * @param {proto_oparb.IGuildNameBanReq} message GuildNameBanReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GuildNameBanReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 5 =*/13).fixed32(message.guildSrl);
            return writer;
        };

        /**
         * Encodes the specified GuildNameBanReq message, length delimited. Does not implicitly {@link proto_oparb.GuildNameBanReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.GuildNameBanReq
         * @static
         * @param {proto_oparb.IGuildNameBanReq} message GuildNameBanReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GuildNameBanReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GuildNameBanReq message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.GuildNameBanReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.GuildNameBanReq} GuildNameBanReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GuildNameBanReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.GuildNameBanReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.guildSrl = reader.fixed32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("guildSrl"))
                throw $util.ProtocolError("missing required 'guildSrl'", { instance: message });
            return message;
        };

        /**
         * Decodes a GuildNameBanReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.GuildNameBanReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.GuildNameBanReq} GuildNameBanReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GuildNameBanReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GuildNameBanReq message.
         * @function verify
         * @memberof proto_oparb.GuildNameBanReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GuildNameBanReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.guildSrl))
                return "guildSrl: integer expected";
            return null;
        };

        /**
         * Creates a GuildNameBanReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.GuildNameBanReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.GuildNameBanReq} GuildNameBanReq
         */
        GuildNameBanReq.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.GuildNameBanReq)
                return object;
            var message = new $root.proto_oparb.GuildNameBanReq();
            if (object.guildSrl != null)
                message.guildSrl = object.guildSrl >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a GuildNameBanReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.GuildNameBanReq
         * @static
         * @param {proto_oparb.GuildNameBanReq} message GuildNameBanReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GuildNameBanReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.guildSrl = 0;
            if (message.guildSrl != null && message.hasOwnProperty("guildSrl"))
                object.guildSrl = message.guildSrl;
            return object;
        };

        /**
         * Converts this GuildNameBanReq to JSON.
         * @function toJSON
         * @memberof proto_oparb.GuildNameBanReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GuildNameBanReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return GuildNameBanReq;
    })();

    proto_oparb.GuildNameBanAns = (function() {

        /**
         * Properties of a GuildNameBanAns.
         * @memberof proto_oparb
         * @interface IGuildNameBanAns
         * @property {proto_oparb.GuildNameBanAns.result_type} result GuildNameBanAns result
         */

        /**
         * Constructs a new GuildNameBanAns.
         * @memberof proto_oparb
         * @classdesc Represents a GuildNameBanAns.
         * @implements IGuildNameBanAns
         * @constructor
         * @param {proto_oparb.IGuildNameBanAns=} [properties] Properties to set
         */
        function GuildNameBanAns(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GuildNameBanAns result.
         * @member {proto_oparb.GuildNameBanAns.result_type} result
         * @memberof proto_oparb.GuildNameBanAns
         * @instance
         */
        GuildNameBanAns.prototype.result = 0;

        /**
         * Creates a new GuildNameBanAns instance using the specified properties.
         * @function create
         * @memberof proto_oparb.GuildNameBanAns
         * @static
         * @param {proto_oparb.IGuildNameBanAns=} [properties] Properties to set
         * @returns {proto_oparb.GuildNameBanAns} GuildNameBanAns instance
         */
        GuildNameBanAns.create = function create(properties) {
            return new GuildNameBanAns(properties);
        };

        /**
         * Encodes the specified GuildNameBanAns message. Does not implicitly {@link proto_oparb.GuildNameBanAns.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.GuildNameBanAns
         * @static
         * @param {proto_oparb.IGuildNameBanAns} message GuildNameBanAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GuildNameBanAns.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.result);
            return writer;
        };

        /**
         * Encodes the specified GuildNameBanAns message, length delimited. Does not implicitly {@link proto_oparb.GuildNameBanAns.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.GuildNameBanAns
         * @static
         * @param {proto_oparb.IGuildNameBanAns} message GuildNameBanAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GuildNameBanAns.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GuildNameBanAns message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.GuildNameBanAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.GuildNameBanAns} GuildNameBanAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GuildNameBanAns.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.GuildNameBanAns();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.result = reader.int32();
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
         * Decodes a GuildNameBanAns message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.GuildNameBanAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.GuildNameBanAns} GuildNameBanAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GuildNameBanAns.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GuildNameBanAns message.
         * @function verify
         * @memberof proto_oparb.GuildNameBanAns
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GuildNameBanAns.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            switch (message.result) {
            default:
                return "result: enum value expected";
            case 0:
            case 1:
            case 2:
                break;
            }
            return null;
        };

        /**
         * Creates a GuildNameBanAns message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.GuildNameBanAns
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.GuildNameBanAns} GuildNameBanAns
         */
        GuildNameBanAns.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.GuildNameBanAns)
                return object;
            var message = new $root.proto_oparb.GuildNameBanAns();
            switch (object.result) {
            case "SUCCESS":
            case 0:
                message.result = 0;
                break;
            case "FAILED":
            case 1:
                message.result = 1;
                break;
            case "NOT_EXIST":
            case 2:
                message.result = 2;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a GuildNameBanAns message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.GuildNameBanAns
         * @static
         * @param {proto_oparb.GuildNameBanAns} message GuildNameBanAns
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GuildNameBanAns.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.result = options.enums === String ? "SUCCESS" : 0;
            if (message.result != null && message.hasOwnProperty("result"))
                object.result = options.enums === String ? $root.proto_oparb.GuildNameBanAns.result_type[message.result] : message.result;
            return object;
        };

        /**
         * Converts this GuildNameBanAns to JSON.
         * @function toJSON
         * @memberof proto_oparb.GuildNameBanAns
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GuildNameBanAns.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * result_type enum.
         * @name proto_oparb.GuildNameBanAns.result_type
         * @enum {number}
         * @property {number} SUCCESS=0 SUCCESS value
         * @property {number} FAILED=1 FAILED value
         * @property {number} NOT_EXIST=2 NOT_EXIST value
         */
        GuildNameBanAns.result_type = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "SUCCESS"] = 0;
            values[valuesById[1] = "FAILED"] = 1;
            values[valuesById[2] = "NOT_EXIST"] = 2;
            return values;
        })();

        return GuildNameBanAns;
    })();

    proto_oparb.CreateBoxReq = (function() {

        /**
         * Properties of a CreateBoxReq.
         * @memberof proto_oparb
         * @interface ICreateBoxReq
         * @property {number|Long} userSrl CreateBoxReq userSrl
         * @property {number|null} [svrId] CreateBoxReq svrId
         * @property {number|null} [charSrl] CreateBoxReq charSrl
         * @property {number|null} [validDuration] CreateBoxReq validDuration
         * @property {string|null} [title] CreateBoxReq title
         * @property {string|null} [content] CreateBoxReq content
         * @property {string|null} [icon] CreateBoxReq icon
         * @property {number|Long|null} [transactionId] CreateBoxReq transactionId
         * @property {number|null} [startValid] CreateBoxReq startValid
         * @property {Array.<proto_oparb.CreateBoxReq.IItemList>|null} [items] CreateBoxReq items
         */

        /**
         * Constructs a new CreateBoxReq.
         * @memberof proto_oparb
         * @classdesc Represents a CreateBoxReq.
         * @implements ICreateBoxReq
         * @constructor
         * @param {proto_oparb.ICreateBoxReq=} [properties] Properties to set
         */
        function CreateBoxReq(properties) {
            this.items = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CreateBoxReq userSrl.
         * @member {number|Long} userSrl
         * @memberof proto_oparb.CreateBoxReq
         * @instance
         */
        CreateBoxReq.prototype.userSrl = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * CreateBoxReq svrId.
         * @member {number} svrId
         * @memberof proto_oparb.CreateBoxReq
         * @instance
         */
        CreateBoxReq.prototype.svrId = 0;

        /**
         * CreateBoxReq charSrl.
         * @member {number} charSrl
         * @memberof proto_oparb.CreateBoxReq
         * @instance
         */
        CreateBoxReq.prototype.charSrl = 0;

        /**
         * CreateBoxReq validDuration.
         * @member {number} validDuration
         * @memberof proto_oparb.CreateBoxReq
         * @instance
         */
        CreateBoxReq.prototype.validDuration = 0;

        /**
         * CreateBoxReq title.
         * @member {string} title
         * @memberof proto_oparb.CreateBoxReq
         * @instance
         */
        CreateBoxReq.prototype.title = "";

        /**
         * CreateBoxReq content.
         * @member {string} content
         * @memberof proto_oparb.CreateBoxReq
         * @instance
         */
        CreateBoxReq.prototype.content = "";

        /**
         * CreateBoxReq icon.
         * @member {string} icon
         * @memberof proto_oparb.CreateBoxReq
         * @instance
         */
        CreateBoxReq.prototype.icon = "";

        /**
         * CreateBoxReq transactionId.
         * @member {number|Long} transactionId
         * @memberof proto_oparb.CreateBoxReq
         * @instance
         */
        CreateBoxReq.prototype.transactionId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * CreateBoxReq startValid.
         * @member {number} startValid
         * @memberof proto_oparb.CreateBoxReq
         * @instance
         */
        CreateBoxReq.prototype.startValid = 0;

        /**
         * CreateBoxReq items.
         * @member {Array.<proto_oparb.CreateBoxReq.IItemList>} items
         * @memberof proto_oparb.CreateBoxReq
         * @instance
         */
        CreateBoxReq.prototype.items = $util.emptyArray;

        /**
         * Creates a new CreateBoxReq instance using the specified properties.
         * @function create
         * @memberof proto_oparb.CreateBoxReq
         * @static
         * @param {proto_oparb.ICreateBoxReq=} [properties] Properties to set
         * @returns {proto_oparb.CreateBoxReq} CreateBoxReq instance
         */
        CreateBoxReq.create = function create(properties) {
            return new CreateBoxReq(properties);
        };

        /**
         * Encodes the specified CreateBoxReq message. Does not implicitly {@link proto_oparb.CreateBoxReq.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.CreateBoxReq
         * @static
         * @param {proto_oparb.ICreateBoxReq} message CreateBoxReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CreateBoxReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 1 =*/9).fixed64(message.userSrl);
            if (message.svrId != null && Object.hasOwnProperty.call(message, "svrId"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.svrId);
            if (message.charSrl != null && Object.hasOwnProperty.call(message, "charSrl"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.charSrl);
            if (message.validDuration != null && Object.hasOwnProperty.call(message, "validDuration"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.validDuration);
            if (message.title != null && Object.hasOwnProperty.call(message, "title"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.title);
            if (message.content != null && Object.hasOwnProperty.call(message, "content"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.content);
            if (message.icon != null && Object.hasOwnProperty.call(message, "icon"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.icon);
            if (message.transactionId != null && Object.hasOwnProperty.call(message, "transactionId"))
                writer.uint32(/* id 8, wireType 1 =*/65).fixed64(message.transactionId);
            if (message.startValid != null && Object.hasOwnProperty.call(message, "startValid"))
                writer.uint32(/* id 9, wireType 0 =*/72).int32(message.startValid);
            if (message.items != null && message.items.length)
                for (var i = 0; i < message.items.length; ++i)
                    $root.proto_oparb.CreateBoxReq.ItemList.encode(message.items[i], writer.uint32(/* id 100, wireType 2 =*/802).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified CreateBoxReq message, length delimited. Does not implicitly {@link proto_oparb.CreateBoxReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.CreateBoxReq
         * @static
         * @param {proto_oparb.ICreateBoxReq} message CreateBoxReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CreateBoxReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CreateBoxReq message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.CreateBoxReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.CreateBoxReq} CreateBoxReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CreateBoxReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.CreateBoxReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.userSrl = reader.fixed64();
                    break;
                case 2:
                    message.svrId = reader.int32();
                    break;
                case 3:
                    message.charSrl = reader.int32();
                    break;
                case 4:
                    message.validDuration = reader.int32();
                    break;
                case 5:
                    message.title = reader.string();
                    break;
                case 6:
                    message.content = reader.string();
                    break;
                case 7:
                    message.icon = reader.string();
                    break;
                case 8:
                    message.transactionId = reader.fixed64();
                    break;
                case 9:
                    message.startValid = reader.int32();
                    break;
                case 100:
                    if (!(message.items && message.items.length))
                        message.items = [];
                    message.items.push($root.proto_oparb.CreateBoxReq.ItemList.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("userSrl"))
                throw $util.ProtocolError("missing required 'userSrl'", { instance: message });
            return message;
        };

        /**
         * Decodes a CreateBoxReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.CreateBoxReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.CreateBoxReq} CreateBoxReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CreateBoxReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CreateBoxReq message.
         * @function verify
         * @memberof proto_oparb.CreateBoxReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CreateBoxReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.userSrl) && !(message.userSrl && $util.isInteger(message.userSrl.low) && $util.isInteger(message.userSrl.high)))
                return "userSrl: integer|Long expected";
            if (message.svrId != null && message.hasOwnProperty("svrId"))
                if (!$util.isInteger(message.svrId))
                    return "svrId: integer expected";
            if (message.charSrl != null && message.hasOwnProperty("charSrl"))
                if (!$util.isInteger(message.charSrl))
                    return "charSrl: integer expected";
            if (message.validDuration != null && message.hasOwnProperty("validDuration"))
                if (!$util.isInteger(message.validDuration))
                    return "validDuration: integer expected";
            if (message.title != null && message.hasOwnProperty("title"))
                if (!$util.isString(message.title))
                    return "title: string expected";
            if (message.content != null && message.hasOwnProperty("content"))
                if (!$util.isString(message.content))
                    return "content: string expected";
            if (message.icon != null && message.hasOwnProperty("icon"))
                if (!$util.isString(message.icon))
                    return "icon: string expected";
            if (message.transactionId != null && message.hasOwnProperty("transactionId"))
                if (!$util.isInteger(message.transactionId) && !(message.transactionId && $util.isInteger(message.transactionId.low) && $util.isInteger(message.transactionId.high)))
                    return "transactionId: integer|Long expected";
            if (message.startValid != null && message.hasOwnProperty("startValid"))
                if (!$util.isInteger(message.startValid))
                    return "startValid: integer expected";
            if (message.items != null && message.hasOwnProperty("items")) {
                if (!Array.isArray(message.items))
                    return "items: array expected";
                for (var i = 0; i < message.items.length; ++i) {
                    var error = $root.proto_oparb.CreateBoxReq.ItemList.verify(message.items[i]);
                    if (error)
                        return "items." + error;
                }
            }
            return null;
        };

        /**
         * Creates a CreateBoxReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.CreateBoxReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.CreateBoxReq} CreateBoxReq
         */
        CreateBoxReq.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.CreateBoxReq)
                return object;
            var message = new $root.proto_oparb.CreateBoxReq();
            if (object.userSrl != null)
                if ($util.Long)
                    (message.userSrl = $util.Long.fromValue(object.userSrl)).unsigned = false;
                else if (typeof object.userSrl === "string")
                    message.userSrl = parseInt(object.userSrl, 10);
                else if (typeof object.userSrl === "number")
                    message.userSrl = object.userSrl;
                else if (typeof object.userSrl === "object")
                    message.userSrl = new $util.LongBits(object.userSrl.low >>> 0, object.userSrl.high >>> 0).toNumber();
            if (object.svrId != null)
                message.svrId = object.svrId | 0;
            if (object.charSrl != null)
                message.charSrl = object.charSrl | 0;
            if (object.validDuration != null)
                message.validDuration = object.validDuration | 0;
            if (object.title != null)
                message.title = String(object.title);
            if (object.content != null)
                message.content = String(object.content);
            if (object.icon != null)
                message.icon = String(object.icon);
            if (object.transactionId != null)
                if ($util.Long)
                    (message.transactionId = $util.Long.fromValue(object.transactionId)).unsigned = false;
                else if (typeof object.transactionId === "string")
                    message.transactionId = parseInt(object.transactionId, 10);
                else if (typeof object.transactionId === "number")
                    message.transactionId = object.transactionId;
                else if (typeof object.transactionId === "object")
                    message.transactionId = new $util.LongBits(object.transactionId.low >>> 0, object.transactionId.high >>> 0).toNumber();
            if (object.startValid != null)
                message.startValid = object.startValid | 0;
            if (object.items) {
                if (!Array.isArray(object.items))
                    throw TypeError(".proto_oparb.CreateBoxReq.items: array expected");
                message.items = [];
                for (var i = 0; i < object.items.length; ++i) {
                    if (typeof object.items[i] !== "object")
                        throw TypeError(".proto_oparb.CreateBoxReq.items: object expected");
                    message.items[i] = $root.proto_oparb.CreateBoxReq.ItemList.fromObject(object.items[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a CreateBoxReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.CreateBoxReq
         * @static
         * @param {proto_oparb.CreateBoxReq} message CreateBoxReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CreateBoxReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.items = [];
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.userSrl = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.userSrl = options.longs === String ? "0" : 0;
                object.svrId = 0;
                object.charSrl = 0;
                object.validDuration = 0;
                object.title = "";
                object.content = "";
                object.icon = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.transactionId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.transactionId = options.longs === String ? "0" : 0;
                object.startValid = 0;
            }
            if (message.userSrl != null && message.hasOwnProperty("userSrl"))
                if (typeof message.userSrl === "number")
                    object.userSrl = options.longs === String ? String(message.userSrl) : message.userSrl;
                else
                    object.userSrl = options.longs === String ? $util.Long.prototype.toString.call(message.userSrl) : options.longs === Number ? new $util.LongBits(message.userSrl.low >>> 0, message.userSrl.high >>> 0).toNumber() : message.userSrl;
            if (message.svrId != null && message.hasOwnProperty("svrId"))
                object.svrId = message.svrId;
            if (message.charSrl != null && message.hasOwnProperty("charSrl"))
                object.charSrl = message.charSrl;
            if (message.validDuration != null && message.hasOwnProperty("validDuration"))
                object.validDuration = message.validDuration;
            if (message.title != null && message.hasOwnProperty("title"))
                object.title = message.title;
            if (message.content != null && message.hasOwnProperty("content"))
                object.content = message.content;
            if (message.icon != null && message.hasOwnProperty("icon"))
                object.icon = message.icon;
            if (message.transactionId != null && message.hasOwnProperty("transactionId"))
                if (typeof message.transactionId === "number")
                    object.transactionId = options.longs === String ? String(message.transactionId) : message.transactionId;
                else
                    object.transactionId = options.longs === String ? $util.Long.prototype.toString.call(message.transactionId) : options.longs === Number ? new $util.LongBits(message.transactionId.low >>> 0, message.transactionId.high >>> 0).toNumber() : message.transactionId;
            if (message.startValid != null && message.hasOwnProperty("startValid"))
                object.startValid = message.startValid;
            if (message.items && message.items.length) {
                object.items = [];
                for (var j = 0; j < message.items.length; ++j)
                    object.items[j] = $root.proto_oparb.CreateBoxReq.ItemList.toObject(message.items[j], options);
            }
            return object;
        };

        /**
         * Converts this CreateBoxReq to JSON.
         * @function toJSON
         * @memberof proto_oparb.CreateBoxReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CreateBoxReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        CreateBoxReq.ItemList = (function() {

            /**
             * Properties of an ItemList.
             * @memberof proto_oparb.CreateBoxReq
             * @interface IItemList
             * @property {number} itemId ItemList itemId
             * @property {number} count ItemList count
             */

            /**
             * Constructs a new ItemList.
             * @memberof proto_oparb.CreateBoxReq
             * @classdesc Represents an ItemList.
             * @implements IItemList
             * @constructor
             * @param {proto_oparb.CreateBoxReq.IItemList=} [properties] Properties to set
             */
            function ItemList(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ItemList itemId.
             * @member {number} itemId
             * @memberof proto_oparb.CreateBoxReq.ItemList
             * @instance
             */
            ItemList.prototype.itemId = 0;

            /**
             * ItemList count.
             * @member {number} count
             * @memberof proto_oparb.CreateBoxReq.ItemList
             * @instance
             */
            ItemList.prototype.count = 0;

            /**
             * Creates a new ItemList instance using the specified properties.
             * @function create
             * @memberof proto_oparb.CreateBoxReq.ItemList
             * @static
             * @param {proto_oparb.CreateBoxReq.IItemList=} [properties] Properties to set
             * @returns {proto_oparb.CreateBoxReq.ItemList} ItemList instance
             */
            ItemList.create = function create(properties) {
                return new ItemList(properties);
            };

            /**
             * Encodes the specified ItemList message. Does not implicitly {@link proto_oparb.CreateBoxReq.ItemList.verify|verify} messages.
             * @function encode
             * @memberof proto_oparb.CreateBoxReq.ItemList
             * @static
             * @param {proto_oparb.CreateBoxReq.IItemList} message ItemList message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ItemList.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.itemId);
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.count);
                return writer;
            };

            /**
             * Encodes the specified ItemList message, length delimited. Does not implicitly {@link proto_oparb.CreateBoxReq.ItemList.verify|verify} messages.
             * @function encodeDelimited
             * @memberof proto_oparb.CreateBoxReq.ItemList
             * @static
             * @param {proto_oparb.CreateBoxReq.IItemList} message ItemList message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ItemList.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an ItemList message from the specified reader or buffer.
             * @function decode
             * @memberof proto_oparb.CreateBoxReq.ItemList
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {proto_oparb.CreateBoxReq.ItemList} ItemList
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ItemList.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.CreateBoxReq.ItemList();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.itemId = reader.int32();
                        break;
                    case 2:
                        message.count = reader.int32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                if (!message.hasOwnProperty("itemId"))
                    throw $util.ProtocolError("missing required 'itemId'", { instance: message });
                if (!message.hasOwnProperty("count"))
                    throw $util.ProtocolError("missing required 'count'", { instance: message });
                return message;
            };

            /**
             * Decodes an ItemList message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof proto_oparb.CreateBoxReq.ItemList
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {proto_oparb.CreateBoxReq.ItemList} ItemList
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ItemList.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an ItemList message.
             * @function verify
             * @memberof proto_oparb.CreateBoxReq.ItemList
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ItemList.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (!$util.isInteger(message.itemId))
                    return "itemId: integer expected";
                if (!$util.isInteger(message.count))
                    return "count: integer expected";
                return null;
            };

            /**
             * Creates an ItemList message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof proto_oparb.CreateBoxReq.ItemList
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {proto_oparb.CreateBoxReq.ItemList} ItemList
             */
            ItemList.fromObject = function fromObject(object) {
                if (object instanceof $root.proto_oparb.CreateBoxReq.ItemList)
                    return object;
                var message = new $root.proto_oparb.CreateBoxReq.ItemList();
                if (object.itemId != null)
                    message.itemId = object.itemId | 0;
                if (object.count != null)
                    message.count = object.count | 0;
                return message;
            };

            /**
             * Creates a plain object from an ItemList message. Also converts values to other types if specified.
             * @function toObject
             * @memberof proto_oparb.CreateBoxReq.ItemList
             * @static
             * @param {proto_oparb.CreateBoxReq.ItemList} message ItemList
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ItemList.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.itemId = 0;
                    object.count = 0;
                }
                if (message.itemId != null && message.hasOwnProperty("itemId"))
                    object.itemId = message.itemId;
                if (message.count != null && message.hasOwnProperty("count"))
                    object.count = message.count;
                return object;
            };

            /**
             * Converts this ItemList to JSON.
             * @function toJSON
             * @memberof proto_oparb.CreateBoxReq.ItemList
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ItemList.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return ItemList;
        })();

        return CreateBoxReq;
    })();

    proto_oparb.CreateBoxAns = (function() {

        /**
         * Properties of a CreateBoxAns.
         * @memberof proto_oparb
         * @interface ICreateBoxAns
         * @property {number|Long} boxId CreateBoxAns boxId
         * @property {string|null} [message] CreateBoxAns message
         * @property {number|Long|null} [logId] CreateBoxAns logId
         */

        /**
         * Constructs a new CreateBoxAns.
         * @memberof proto_oparb
         * @classdesc Represents a CreateBoxAns.
         * @implements ICreateBoxAns
         * @constructor
         * @param {proto_oparb.ICreateBoxAns=} [properties] Properties to set
         */
        function CreateBoxAns(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CreateBoxAns boxId.
         * @member {number|Long} boxId
         * @memberof proto_oparb.CreateBoxAns
         * @instance
         */
        CreateBoxAns.prototype.boxId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * CreateBoxAns message.
         * @member {string} message
         * @memberof proto_oparb.CreateBoxAns
         * @instance
         */
        CreateBoxAns.prototype.message = "";

        /**
         * CreateBoxAns logId.
         * @member {number|Long} logId
         * @memberof proto_oparb.CreateBoxAns
         * @instance
         */
        CreateBoxAns.prototype.logId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new CreateBoxAns instance using the specified properties.
         * @function create
         * @memberof proto_oparb.CreateBoxAns
         * @static
         * @param {proto_oparb.ICreateBoxAns=} [properties] Properties to set
         * @returns {proto_oparb.CreateBoxAns} CreateBoxAns instance
         */
        CreateBoxAns.create = function create(properties) {
            return new CreateBoxAns(properties);
        };

        /**
         * Encodes the specified CreateBoxAns message. Does not implicitly {@link proto_oparb.CreateBoxAns.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.CreateBoxAns
         * @static
         * @param {proto_oparb.ICreateBoxAns} message CreateBoxAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CreateBoxAns.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 1 =*/9).fixed64(message.boxId);
            if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.message);
            if (message.logId != null && Object.hasOwnProperty.call(message, "logId"))
                writer.uint32(/* id 3, wireType 1 =*/25).fixed64(message.logId);
            return writer;
        };

        /**
         * Encodes the specified CreateBoxAns message, length delimited. Does not implicitly {@link proto_oparb.CreateBoxAns.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.CreateBoxAns
         * @static
         * @param {proto_oparb.ICreateBoxAns} message CreateBoxAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CreateBoxAns.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CreateBoxAns message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.CreateBoxAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.CreateBoxAns} CreateBoxAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CreateBoxAns.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.CreateBoxAns();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.boxId = reader.fixed64();
                    break;
                case 2:
                    message.message = reader.string();
                    break;
                case 3:
                    message.logId = reader.fixed64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("boxId"))
                throw $util.ProtocolError("missing required 'boxId'", { instance: message });
            return message;
        };

        /**
         * Decodes a CreateBoxAns message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.CreateBoxAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.CreateBoxAns} CreateBoxAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CreateBoxAns.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CreateBoxAns message.
         * @function verify
         * @memberof proto_oparb.CreateBoxAns
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CreateBoxAns.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.boxId) && !(message.boxId && $util.isInteger(message.boxId.low) && $util.isInteger(message.boxId.high)))
                return "boxId: integer|Long expected";
            if (message.message != null && message.hasOwnProperty("message"))
                if (!$util.isString(message.message))
                    return "message: string expected";
            if (message.logId != null && message.hasOwnProperty("logId"))
                if (!$util.isInteger(message.logId) && !(message.logId && $util.isInteger(message.logId.low) && $util.isInteger(message.logId.high)))
                    return "logId: integer|Long expected";
            return null;
        };

        /**
         * Creates a CreateBoxAns message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.CreateBoxAns
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.CreateBoxAns} CreateBoxAns
         */
        CreateBoxAns.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.CreateBoxAns)
                return object;
            var message = new $root.proto_oparb.CreateBoxAns();
            if (object.boxId != null)
                if ($util.Long)
                    (message.boxId = $util.Long.fromValue(object.boxId)).unsigned = false;
                else if (typeof object.boxId === "string")
                    message.boxId = parseInt(object.boxId, 10);
                else if (typeof object.boxId === "number")
                    message.boxId = object.boxId;
                else if (typeof object.boxId === "object")
                    message.boxId = new $util.LongBits(object.boxId.low >>> 0, object.boxId.high >>> 0).toNumber();
            if (object.message != null)
                message.message = String(object.message);
            if (object.logId != null)
                if ($util.Long)
                    (message.logId = $util.Long.fromValue(object.logId)).unsigned = false;
                else if (typeof object.logId === "string")
                    message.logId = parseInt(object.logId, 10);
                else if (typeof object.logId === "number")
                    message.logId = object.logId;
                else if (typeof object.logId === "object")
                    message.logId = new $util.LongBits(object.logId.low >>> 0, object.logId.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a CreateBoxAns message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.CreateBoxAns
         * @static
         * @param {proto_oparb.CreateBoxAns} message CreateBoxAns
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CreateBoxAns.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.boxId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.boxId = options.longs === String ? "0" : 0;
                object.message = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.logId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.logId = options.longs === String ? "0" : 0;
            }
            if (message.boxId != null && message.hasOwnProperty("boxId"))
                if (typeof message.boxId === "number")
                    object.boxId = options.longs === String ? String(message.boxId) : message.boxId;
                else
                    object.boxId = options.longs === String ? $util.Long.prototype.toString.call(message.boxId) : options.longs === Number ? new $util.LongBits(message.boxId.low >>> 0, message.boxId.high >>> 0).toNumber() : message.boxId;
            if (message.message != null && message.hasOwnProperty("message"))
                object.message = message.message;
            if (message.logId != null && message.hasOwnProperty("logId"))
                if (typeof message.logId === "number")
                    object.logId = options.longs === String ? String(message.logId) : message.logId;
                else
                    object.logId = options.longs === String ? $util.Long.prototype.toString.call(message.logId) : options.longs === Number ? new $util.LongBits(message.logId.low >>> 0, message.logId.high >>> 0).toNumber() : message.logId;
            return object;
        };

        /**
         * Converts this CreateBoxAns to JSON.
         * @function toJSON
         * @memberof proto_oparb.CreateBoxAns
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CreateBoxAns.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CreateBoxAns;
    })();

    proto_oparb.DisableBoxNoti = (function() {

        /**
         * Properties of a DisableBoxNoti.
         * @memberof proto_oparb
         * @interface IDisableBoxNoti
         * @property {number|Long} boxId DisableBoxNoti boxId
         */

        /**
         * Constructs a new DisableBoxNoti.
         * @memberof proto_oparb
         * @classdesc Represents a DisableBoxNoti.
         * @implements IDisableBoxNoti
         * @constructor
         * @param {proto_oparb.IDisableBoxNoti=} [properties] Properties to set
         */
        function DisableBoxNoti(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DisableBoxNoti boxId.
         * @member {number|Long} boxId
         * @memberof proto_oparb.DisableBoxNoti
         * @instance
         */
        DisableBoxNoti.prototype.boxId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new DisableBoxNoti instance using the specified properties.
         * @function create
         * @memberof proto_oparb.DisableBoxNoti
         * @static
         * @param {proto_oparb.IDisableBoxNoti=} [properties] Properties to set
         * @returns {proto_oparb.DisableBoxNoti} DisableBoxNoti instance
         */
        DisableBoxNoti.create = function create(properties) {
            return new DisableBoxNoti(properties);
        };

        /**
         * Encodes the specified DisableBoxNoti message. Does not implicitly {@link proto_oparb.DisableBoxNoti.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.DisableBoxNoti
         * @static
         * @param {proto_oparb.IDisableBoxNoti} message DisableBoxNoti message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DisableBoxNoti.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 1 =*/9).fixed64(message.boxId);
            return writer;
        };

        /**
         * Encodes the specified DisableBoxNoti message, length delimited. Does not implicitly {@link proto_oparb.DisableBoxNoti.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.DisableBoxNoti
         * @static
         * @param {proto_oparb.IDisableBoxNoti} message DisableBoxNoti message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DisableBoxNoti.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DisableBoxNoti message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.DisableBoxNoti
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.DisableBoxNoti} DisableBoxNoti
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DisableBoxNoti.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.DisableBoxNoti();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.boxId = reader.fixed64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("boxId"))
                throw $util.ProtocolError("missing required 'boxId'", { instance: message });
            return message;
        };

        /**
         * Decodes a DisableBoxNoti message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.DisableBoxNoti
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.DisableBoxNoti} DisableBoxNoti
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DisableBoxNoti.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DisableBoxNoti message.
         * @function verify
         * @memberof proto_oparb.DisableBoxNoti
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DisableBoxNoti.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.boxId) && !(message.boxId && $util.isInteger(message.boxId.low) && $util.isInteger(message.boxId.high)))
                return "boxId: integer|Long expected";
            return null;
        };

        /**
         * Creates a DisableBoxNoti message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.DisableBoxNoti
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.DisableBoxNoti} DisableBoxNoti
         */
        DisableBoxNoti.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.DisableBoxNoti)
                return object;
            var message = new $root.proto_oparb.DisableBoxNoti();
            if (object.boxId != null)
                if ($util.Long)
                    (message.boxId = $util.Long.fromValue(object.boxId)).unsigned = false;
                else if (typeof object.boxId === "string")
                    message.boxId = parseInt(object.boxId, 10);
                else if (typeof object.boxId === "number")
                    message.boxId = object.boxId;
                else if (typeof object.boxId === "object")
                    message.boxId = new $util.LongBits(object.boxId.low >>> 0, object.boxId.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a DisableBoxNoti message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.DisableBoxNoti
         * @static
         * @param {proto_oparb.DisableBoxNoti} message DisableBoxNoti
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DisableBoxNoti.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.boxId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.boxId = options.longs === String ? "0" : 0;
            if (message.boxId != null && message.hasOwnProperty("boxId"))
                if (typeof message.boxId === "number")
                    object.boxId = options.longs === String ? String(message.boxId) : message.boxId;
                else
                    object.boxId = options.longs === String ? $util.Long.prototype.toString.call(message.boxId) : options.longs === Number ? new $util.LongBits(message.boxId.low >>> 0, message.boxId.high >>> 0).toNumber() : message.boxId;
            return object;
        };

        /**
         * Converts this DisableBoxNoti to JSON.
         * @function toJSON
         * @memberof proto_oparb.DisableBoxNoti
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DisableBoxNoti.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return DisableBoxNoti;
    })();

    proto_oparb.CheckBoxExternalKeyReq = (function() {

        /**
         * Properties of a CheckBoxExternalKeyReq.
         * @memberof proto_oparb
         * @interface ICheckBoxExternalKeyReq
         * @property {Array.<number|Long>|null} [logId] CheckBoxExternalKeyReq logId
         */

        /**
         * Constructs a new CheckBoxExternalKeyReq.
         * @memberof proto_oparb
         * @classdesc Represents a CheckBoxExternalKeyReq.
         * @implements ICheckBoxExternalKeyReq
         * @constructor
         * @param {proto_oparb.ICheckBoxExternalKeyReq=} [properties] Properties to set
         */
        function CheckBoxExternalKeyReq(properties) {
            this.logId = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CheckBoxExternalKeyReq logId.
         * @member {Array.<number|Long>} logId
         * @memberof proto_oparb.CheckBoxExternalKeyReq
         * @instance
         */
        CheckBoxExternalKeyReq.prototype.logId = $util.emptyArray;

        /**
         * Creates a new CheckBoxExternalKeyReq instance using the specified properties.
         * @function create
         * @memberof proto_oparb.CheckBoxExternalKeyReq
         * @static
         * @param {proto_oparb.ICheckBoxExternalKeyReq=} [properties] Properties to set
         * @returns {proto_oparb.CheckBoxExternalKeyReq} CheckBoxExternalKeyReq instance
         */
        CheckBoxExternalKeyReq.create = function create(properties) {
            return new CheckBoxExternalKeyReq(properties);
        };

        /**
         * Encodes the specified CheckBoxExternalKeyReq message. Does not implicitly {@link proto_oparb.CheckBoxExternalKeyReq.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.CheckBoxExternalKeyReq
         * @static
         * @param {proto_oparb.ICheckBoxExternalKeyReq} message CheckBoxExternalKeyReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CheckBoxExternalKeyReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.logId != null && message.logId.length)
                for (var i = 0; i < message.logId.length; ++i)
                    writer.uint32(/* id 1, wireType 1 =*/9).fixed64(message.logId[i]);
            return writer;
        };

        /**
         * Encodes the specified CheckBoxExternalKeyReq message, length delimited. Does not implicitly {@link proto_oparb.CheckBoxExternalKeyReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.CheckBoxExternalKeyReq
         * @static
         * @param {proto_oparb.ICheckBoxExternalKeyReq} message CheckBoxExternalKeyReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CheckBoxExternalKeyReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CheckBoxExternalKeyReq message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.CheckBoxExternalKeyReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.CheckBoxExternalKeyReq} CheckBoxExternalKeyReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CheckBoxExternalKeyReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.CheckBoxExternalKeyReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.logId && message.logId.length))
                        message.logId = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.logId.push(reader.fixed64());
                    } else
                        message.logId.push(reader.fixed64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CheckBoxExternalKeyReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.CheckBoxExternalKeyReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.CheckBoxExternalKeyReq} CheckBoxExternalKeyReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CheckBoxExternalKeyReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CheckBoxExternalKeyReq message.
         * @function verify
         * @memberof proto_oparb.CheckBoxExternalKeyReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CheckBoxExternalKeyReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.logId != null && message.hasOwnProperty("logId")) {
                if (!Array.isArray(message.logId))
                    return "logId: array expected";
                for (var i = 0; i < message.logId.length; ++i)
                    if (!$util.isInteger(message.logId[i]) && !(message.logId[i] && $util.isInteger(message.logId[i].low) && $util.isInteger(message.logId[i].high)))
                        return "logId: integer|Long[] expected";
            }
            return null;
        };

        /**
         * Creates a CheckBoxExternalKeyReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.CheckBoxExternalKeyReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.CheckBoxExternalKeyReq} CheckBoxExternalKeyReq
         */
        CheckBoxExternalKeyReq.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.CheckBoxExternalKeyReq)
                return object;
            var message = new $root.proto_oparb.CheckBoxExternalKeyReq();
            if (object.logId) {
                if (!Array.isArray(object.logId))
                    throw TypeError(".proto_oparb.CheckBoxExternalKeyReq.logId: array expected");
                message.logId = [];
                for (var i = 0; i < object.logId.length; ++i)
                    if ($util.Long)
                        (message.logId[i] = $util.Long.fromValue(object.logId[i])).unsigned = false;
                    else if (typeof object.logId[i] === "string")
                        message.logId[i] = parseInt(object.logId[i], 10);
                    else if (typeof object.logId[i] === "number")
                        message.logId[i] = object.logId[i];
                    else if (typeof object.logId[i] === "object")
                        message.logId[i] = new $util.LongBits(object.logId[i].low >>> 0, object.logId[i].high >>> 0).toNumber();
            }
            return message;
        };

        /**
         * Creates a plain object from a CheckBoxExternalKeyReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.CheckBoxExternalKeyReq
         * @static
         * @param {proto_oparb.CheckBoxExternalKeyReq} message CheckBoxExternalKeyReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CheckBoxExternalKeyReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.logId = [];
            if (message.logId && message.logId.length) {
                object.logId = [];
                for (var j = 0; j < message.logId.length; ++j)
                    if (typeof message.logId[j] === "number")
                        object.logId[j] = options.longs === String ? String(message.logId[j]) : message.logId[j];
                    else
                        object.logId[j] = options.longs === String ? $util.Long.prototype.toString.call(message.logId[j]) : options.longs === Number ? new $util.LongBits(message.logId[j].low >>> 0, message.logId[j].high >>> 0).toNumber() : message.logId[j];
            }
            return object;
        };

        /**
         * Converts this CheckBoxExternalKeyReq to JSON.
         * @function toJSON
         * @memberof proto_oparb.CheckBoxExternalKeyReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CheckBoxExternalKeyReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CheckBoxExternalKeyReq;
    })();

    proto_oparb.CheckBoxExternalKeyAns = (function() {

        /**
         * Properties of a CheckBoxExternalKeyAns.
         * @memberof proto_oparb
         * @interface ICheckBoxExternalKeyAns
         * @property {Array.<number|Long>|null} [logId] CheckBoxExternalKeyAns logId
         * @property {Array.<number|Long>|null} [boxId] CheckBoxExternalKeyAns boxId
         * @property {number|Long} lastId CheckBoxExternalKeyAns lastId
         */

        /**
         * Constructs a new CheckBoxExternalKeyAns.
         * @memberof proto_oparb
         * @classdesc Represents a CheckBoxExternalKeyAns.
         * @implements ICheckBoxExternalKeyAns
         * @constructor
         * @param {proto_oparb.ICheckBoxExternalKeyAns=} [properties] Properties to set
         */
        function CheckBoxExternalKeyAns(properties) {
            this.logId = [];
            this.boxId = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CheckBoxExternalKeyAns logId.
         * @member {Array.<number|Long>} logId
         * @memberof proto_oparb.CheckBoxExternalKeyAns
         * @instance
         */
        CheckBoxExternalKeyAns.prototype.logId = $util.emptyArray;

        /**
         * CheckBoxExternalKeyAns boxId.
         * @member {Array.<number|Long>} boxId
         * @memberof proto_oparb.CheckBoxExternalKeyAns
         * @instance
         */
        CheckBoxExternalKeyAns.prototype.boxId = $util.emptyArray;

        /**
         * CheckBoxExternalKeyAns lastId.
         * @member {number|Long} lastId
         * @memberof proto_oparb.CheckBoxExternalKeyAns
         * @instance
         */
        CheckBoxExternalKeyAns.prototype.lastId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new CheckBoxExternalKeyAns instance using the specified properties.
         * @function create
         * @memberof proto_oparb.CheckBoxExternalKeyAns
         * @static
         * @param {proto_oparb.ICheckBoxExternalKeyAns=} [properties] Properties to set
         * @returns {proto_oparb.CheckBoxExternalKeyAns} CheckBoxExternalKeyAns instance
         */
        CheckBoxExternalKeyAns.create = function create(properties) {
            return new CheckBoxExternalKeyAns(properties);
        };

        /**
         * Encodes the specified CheckBoxExternalKeyAns message. Does not implicitly {@link proto_oparb.CheckBoxExternalKeyAns.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.CheckBoxExternalKeyAns
         * @static
         * @param {proto_oparb.ICheckBoxExternalKeyAns} message CheckBoxExternalKeyAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CheckBoxExternalKeyAns.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.logId != null && message.logId.length)
                for (var i = 0; i < message.logId.length; ++i)
                    writer.uint32(/* id 1, wireType 1 =*/9).fixed64(message.logId[i]);
            if (message.boxId != null && message.boxId.length)
                for (var i = 0; i < message.boxId.length; ++i)
                    writer.uint32(/* id 2, wireType 1 =*/17).fixed64(message.boxId[i]);
            writer.uint32(/* id 3, wireType 1 =*/25).fixed64(message.lastId);
            return writer;
        };

        /**
         * Encodes the specified CheckBoxExternalKeyAns message, length delimited. Does not implicitly {@link proto_oparb.CheckBoxExternalKeyAns.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.CheckBoxExternalKeyAns
         * @static
         * @param {proto_oparb.ICheckBoxExternalKeyAns} message CheckBoxExternalKeyAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CheckBoxExternalKeyAns.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CheckBoxExternalKeyAns message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.CheckBoxExternalKeyAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.CheckBoxExternalKeyAns} CheckBoxExternalKeyAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CheckBoxExternalKeyAns.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.CheckBoxExternalKeyAns();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.logId && message.logId.length))
                        message.logId = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.logId.push(reader.fixed64());
                    } else
                        message.logId.push(reader.fixed64());
                    break;
                case 2:
                    if (!(message.boxId && message.boxId.length))
                        message.boxId = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.boxId.push(reader.fixed64());
                    } else
                        message.boxId.push(reader.fixed64());
                    break;
                case 3:
                    message.lastId = reader.fixed64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("lastId"))
                throw $util.ProtocolError("missing required 'lastId'", { instance: message });
            return message;
        };

        /**
         * Decodes a CheckBoxExternalKeyAns message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.CheckBoxExternalKeyAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.CheckBoxExternalKeyAns} CheckBoxExternalKeyAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CheckBoxExternalKeyAns.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CheckBoxExternalKeyAns message.
         * @function verify
         * @memberof proto_oparb.CheckBoxExternalKeyAns
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CheckBoxExternalKeyAns.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.logId != null && message.hasOwnProperty("logId")) {
                if (!Array.isArray(message.logId))
                    return "logId: array expected";
                for (var i = 0; i < message.logId.length; ++i)
                    if (!$util.isInteger(message.logId[i]) && !(message.logId[i] && $util.isInteger(message.logId[i].low) && $util.isInteger(message.logId[i].high)))
                        return "logId: integer|Long[] expected";
            }
            if (message.boxId != null && message.hasOwnProperty("boxId")) {
                if (!Array.isArray(message.boxId))
                    return "boxId: array expected";
                for (var i = 0; i < message.boxId.length; ++i)
                    if (!$util.isInteger(message.boxId[i]) && !(message.boxId[i] && $util.isInteger(message.boxId[i].low) && $util.isInteger(message.boxId[i].high)))
                        return "boxId: integer|Long[] expected";
            }
            if (!$util.isInteger(message.lastId) && !(message.lastId && $util.isInteger(message.lastId.low) && $util.isInteger(message.lastId.high)))
                return "lastId: integer|Long expected";
            return null;
        };

        /**
         * Creates a CheckBoxExternalKeyAns message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.CheckBoxExternalKeyAns
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.CheckBoxExternalKeyAns} CheckBoxExternalKeyAns
         */
        CheckBoxExternalKeyAns.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.CheckBoxExternalKeyAns)
                return object;
            var message = new $root.proto_oparb.CheckBoxExternalKeyAns();
            if (object.logId) {
                if (!Array.isArray(object.logId))
                    throw TypeError(".proto_oparb.CheckBoxExternalKeyAns.logId: array expected");
                message.logId = [];
                for (var i = 0; i < object.logId.length; ++i)
                    if ($util.Long)
                        (message.logId[i] = $util.Long.fromValue(object.logId[i])).unsigned = false;
                    else if (typeof object.logId[i] === "string")
                        message.logId[i] = parseInt(object.logId[i], 10);
                    else if (typeof object.logId[i] === "number")
                        message.logId[i] = object.logId[i];
                    else if (typeof object.logId[i] === "object")
                        message.logId[i] = new $util.LongBits(object.logId[i].low >>> 0, object.logId[i].high >>> 0).toNumber();
            }
            if (object.boxId) {
                if (!Array.isArray(object.boxId))
                    throw TypeError(".proto_oparb.CheckBoxExternalKeyAns.boxId: array expected");
                message.boxId = [];
                for (var i = 0; i < object.boxId.length; ++i)
                    if ($util.Long)
                        (message.boxId[i] = $util.Long.fromValue(object.boxId[i])).unsigned = false;
                    else if (typeof object.boxId[i] === "string")
                        message.boxId[i] = parseInt(object.boxId[i], 10);
                    else if (typeof object.boxId[i] === "number")
                        message.boxId[i] = object.boxId[i];
                    else if (typeof object.boxId[i] === "object")
                        message.boxId[i] = new $util.LongBits(object.boxId[i].low >>> 0, object.boxId[i].high >>> 0).toNumber();
            }
            if (object.lastId != null)
                if ($util.Long)
                    (message.lastId = $util.Long.fromValue(object.lastId)).unsigned = false;
                else if (typeof object.lastId === "string")
                    message.lastId = parseInt(object.lastId, 10);
                else if (typeof object.lastId === "number")
                    message.lastId = object.lastId;
                else if (typeof object.lastId === "object")
                    message.lastId = new $util.LongBits(object.lastId.low >>> 0, object.lastId.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a CheckBoxExternalKeyAns message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.CheckBoxExternalKeyAns
         * @static
         * @param {proto_oparb.CheckBoxExternalKeyAns} message CheckBoxExternalKeyAns
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CheckBoxExternalKeyAns.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.logId = [];
                object.boxId = [];
            }
            if (options.defaults)
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.lastId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.lastId = options.longs === String ? "0" : 0;
            if (message.logId && message.logId.length) {
                object.logId = [];
                for (var j = 0; j < message.logId.length; ++j)
                    if (typeof message.logId[j] === "number")
                        object.logId[j] = options.longs === String ? String(message.logId[j]) : message.logId[j];
                    else
                        object.logId[j] = options.longs === String ? $util.Long.prototype.toString.call(message.logId[j]) : options.longs === Number ? new $util.LongBits(message.logId[j].low >>> 0, message.logId[j].high >>> 0).toNumber() : message.logId[j];
            }
            if (message.boxId && message.boxId.length) {
                object.boxId = [];
                for (var j = 0; j < message.boxId.length; ++j)
                    if (typeof message.boxId[j] === "number")
                        object.boxId[j] = options.longs === String ? String(message.boxId[j]) : message.boxId[j];
                    else
                        object.boxId[j] = options.longs === String ? $util.Long.prototype.toString.call(message.boxId[j]) : options.longs === Number ? new $util.LongBits(message.boxId[j].low >>> 0, message.boxId[j].high >>> 0).toNumber() : message.boxId[j];
            }
            if (message.lastId != null && message.hasOwnProperty("lastId"))
                if (typeof message.lastId === "number")
                    object.lastId = options.longs === String ? String(message.lastId) : message.lastId;
                else
                    object.lastId = options.longs === String ? $util.Long.prototype.toString.call(message.lastId) : options.longs === Number ? new $util.LongBits(message.lastId.low >>> 0, message.lastId.high >>> 0).toNumber() : message.lastId;
            return object;
        };

        /**
         * Converts this CheckBoxExternalKeyAns to JSON.
         * @function toJSON
         * @memberof proto_oparb.CheckBoxExternalKeyAns
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CheckBoxExternalKeyAns.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CheckBoxExternalKeyAns;
    })();

    proto_oparb.CountBoxReq = (function() {

        /**
         * Properties of a CountBoxReq.
         * @memberof proto_oparb
         * @interface ICountBoxReq
         * @property {number|Long} userSrl CountBoxReq userSrl
         * @property {number|null} [svrId] CountBoxReq svrId
         * @property {number|null} [charSrl] CountBoxReq charSrl
         */

        /**
         * Constructs a new CountBoxReq.
         * @memberof proto_oparb
         * @classdesc Represents a CountBoxReq.
         * @implements ICountBoxReq
         * @constructor
         * @param {proto_oparb.ICountBoxReq=} [properties] Properties to set
         */
        function CountBoxReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CountBoxReq userSrl.
         * @member {number|Long} userSrl
         * @memberof proto_oparb.CountBoxReq
         * @instance
         */
        CountBoxReq.prototype.userSrl = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * CountBoxReq svrId.
         * @member {number} svrId
         * @memberof proto_oparb.CountBoxReq
         * @instance
         */
        CountBoxReq.prototype.svrId = 0;

        /**
         * CountBoxReq charSrl.
         * @member {number} charSrl
         * @memberof proto_oparb.CountBoxReq
         * @instance
         */
        CountBoxReq.prototype.charSrl = 0;

        /**
         * Creates a new CountBoxReq instance using the specified properties.
         * @function create
         * @memberof proto_oparb.CountBoxReq
         * @static
         * @param {proto_oparb.ICountBoxReq=} [properties] Properties to set
         * @returns {proto_oparb.CountBoxReq} CountBoxReq instance
         */
        CountBoxReq.create = function create(properties) {
            return new CountBoxReq(properties);
        };

        /**
         * Encodes the specified CountBoxReq message. Does not implicitly {@link proto_oparb.CountBoxReq.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.CountBoxReq
         * @static
         * @param {proto_oparb.ICountBoxReq} message CountBoxReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CountBoxReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 1 =*/9).fixed64(message.userSrl);
            if (message.svrId != null && Object.hasOwnProperty.call(message, "svrId"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.svrId);
            if (message.charSrl != null && Object.hasOwnProperty.call(message, "charSrl"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.charSrl);
            return writer;
        };

        /**
         * Encodes the specified CountBoxReq message, length delimited. Does not implicitly {@link proto_oparb.CountBoxReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.CountBoxReq
         * @static
         * @param {proto_oparb.ICountBoxReq} message CountBoxReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CountBoxReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CountBoxReq message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.CountBoxReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.CountBoxReq} CountBoxReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CountBoxReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.CountBoxReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.userSrl = reader.fixed64();
                    break;
                case 2:
                    message.svrId = reader.int32();
                    break;
                case 3:
                    message.charSrl = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("userSrl"))
                throw $util.ProtocolError("missing required 'userSrl'", { instance: message });
            return message;
        };

        /**
         * Decodes a CountBoxReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.CountBoxReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.CountBoxReq} CountBoxReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CountBoxReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CountBoxReq message.
         * @function verify
         * @memberof proto_oparb.CountBoxReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CountBoxReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.userSrl) && !(message.userSrl && $util.isInteger(message.userSrl.low) && $util.isInteger(message.userSrl.high)))
                return "userSrl: integer|Long expected";
            if (message.svrId != null && message.hasOwnProperty("svrId"))
                if (!$util.isInteger(message.svrId))
                    return "svrId: integer expected";
            if (message.charSrl != null && message.hasOwnProperty("charSrl"))
                if (!$util.isInteger(message.charSrl))
                    return "charSrl: integer expected";
            return null;
        };

        /**
         * Creates a CountBoxReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.CountBoxReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.CountBoxReq} CountBoxReq
         */
        CountBoxReq.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.CountBoxReq)
                return object;
            var message = new $root.proto_oparb.CountBoxReq();
            if (object.userSrl != null)
                if ($util.Long)
                    (message.userSrl = $util.Long.fromValue(object.userSrl)).unsigned = false;
                else if (typeof object.userSrl === "string")
                    message.userSrl = parseInt(object.userSrl, 10);
                else if (typeof object.userSrl === "number")
                    message.userSrl = object.userSrl;
                else if (typeof object.userSrl === "object")
                    message.userSrl = new $util.LongBits(object.userSrl.low >>> 0, object.userSrl.high >>> 0).toNumber();
            if (object.svrId != null)
                message.svrId = object.svrId | 0;
            if (object.charSrl != null)
                message.charSrl = object.charSrl | 0;
            return message;
        };

        /**
         * Creates a plain object from a CountBoxReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.CountBoxReq
         * @static
         * @param {proto_oparb.CountBoxReq} message CountBoxReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CountBoxReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.userSrl = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.userSrl = options.longs === String ? "0" : 0;
                object.svrId = 0;
                object.charSrl = 0;
            }
            if (message.userSrl != null && message.hasOwnProperty("userSrl"))
                if (typeof message.userSrl === "number")
                    object.userSrl = options.longs === String ? String(message.userSrl) : message.userSrl;
                else
                    object.userSrl = options.longs === String ? $util.Long.prototype.toString.call(message.userSrl) : options.longs === Number ? new $util.LongBits(message.userSrl.low >>> 0, message.userSrl.high >>> 0).toNumber() : message.userSrl;
            if (message.svrId != null && message.hasOwnProperty("svrId"))
                object.svrId = message.svrId;
            if (message.charSrl != null && message.hasOwnProperty("charSrl"))
                object.charSrl = message.charSrl;
            return object;
        };

        /**
         * Converts this CountBoxReq to JSON.
         * @function toJSON
         * @memberof proto_oparb.CountBoxReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CountBoxReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CountBoxReq;
    })();

    proto_oparb.CountBoxAns = (function() {

        /**
         * Properties of a CountBoxAns.
         * @memberof proto_oparb
         * @interface ICountBoxAns
         * @property {number} count CountBoxAns count
         */

        /**
         * Constructs a new CountBoxAns.
         * @memberof proto_oparb
         * @classdesc Represents a CountBoxAns.
         * @implements ICountBoxAns
         * @constructor
         * @param {proto_oparb.ICountBoxAns=} [properties] Properties to set
         */
        function CountBoxAns(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CountBoxAns count.
         * @member {number} count
         * @memberof proto_oparb.CountBoxAns
         * @instance
         */
        CountBoxAns.prototype.count = 0;

        /**
         * Creates a new CountBoxAns instance using the specified properties.
         * @function create
         * @memberof proto_oparb.CountBoxAns
         * @static
         * @param {proto_oparb.ICountBoxAns=} [properties] Properties to set
         * @returns {proto_oparb.CountBoxAns} CountBoxAns instance
         */
        CountBoxAns.create = function create(properties) {
            return new CountBoxAns(properties);
        };

        /**
         * Encodes the specified CountBoxAns message. Does not implicitly {@link proto_oparb.CountBoxAns.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.CountBoxAns
         * @static
         * @param {proto_oparb.ICountBoxAns} message CountBoxAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CountBoxAns.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.count);
            return writer;
        };

        /**
         * Encodes the specified CountBoxAns message, length delimited. Does not implicitly {@link proto_oparb.CountBoxAns.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.CountBoxAns
         * @static
         * @param {proto_oparb.ICountBoxAns} message CountBoxAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CountBoxAns.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CountBoxAns message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.CountBoxAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.CountBoxAns} CountBoxAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CountBoxAns.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.CountBoxAns();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.count = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("count"))
                throw $util.ProtocolError("missing required 'count'", { instance: message });
            return message;
        };

        /**
         * Decodes a CountBoxAns message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.CountBoxAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.CountBoxAns} CountBoxAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CountBoxAns.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CountBoxAns message.
         * @function verify
         * @memberof proto_oparb.CountBoxAns
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CountBoxAns.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.count))
                return "count: integer expected";
            return null;
        };

        /**
         * Creates a CountBoxAns message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.CountBoxAns
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.CountBoxAns} CountBoxAns
         */
        CountBoxAns.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.CountBoxAns)
                return object;
            var message = new $root.proto_oparb.CountBoxAns();
            if (object.count != null)
                message.count = object.count | 0;
            return message;
        };

        /**
         * Creates a plain object from a CountBoxAns message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.CountBoxAns
         * @static
         * @param {proto_oparb.CountBoxAns} message CountBoxAns
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CountBoxAns.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.count = 0;
            if (message.count != null && message.hasOwnProperty("count"))
                object.count = message.count;
            return object;
        };

        /**
         * Converts this CountBoxAns to JSON.
         * @function toJSON
         * @memberof proto_oparb.CountBoxAns
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CountBoxAns.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CountBoxAns;
    })();

    proto_oparb.UpdateVIPPubExpReq = (function() {

        /**
         * Properties of an UpdateVIPPubExpReq.
         * @memberof proto_oparb
         * @interface IUpdateVIPPubExpReq
         * @property {number|Long} userSrl UpdateVIPPubExpReq userSrl
         * @property {number} pubExp UpdateVIPPubExpReq pubExp
         */

        /**
         * Constructs a new UpdateVIPPubExpReq.
         * @memberof proto_oparb
         * @classdesc Represents an UpdateVIPPubExpReq.
         * @implements IUpdateVIPPubExpReq
         * @constructor
         * @param {proto_oparb.IUpdateVIPPubExpReq=} [properties] Properties to set
         */
        function UpdateVIPPubExpReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * UpdateVIPPubExpReq userSrl.
         * @member {number|Long} userSrl
         * @memberof proto_oparb.UpdateVIPPubExpReq
         * @instance
         */
        UpdateVIPPubExpReq.prototype.userSrl = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * UpdateVIPPubExpReq pubExp.
         * @member {number} pubExp
         * @memberof proto_oparb.UpdateVIPPubExpReq
         * @instance
         */
        UpdateVIPPubExpReq.prototype.pubExp = 0;

        /**
         * Creates a new UpdateVIPPubExpReq instance using the specified properties.
         * @function create
         * @memberof proto_oparb.UpdateVIPPubExpReq
         * @static
         * @param {proto_oparb.IUpdateVIPPubExpReq=} [properties] Properties to set
         * @returns {proto_oparb.UpdateVIPPubExpReq} UpdateVIPPubExpReq instance
         */
        UpdateVIPPubExpReq.create = function create(properties) {
            return new UpdateVIPPubExpReq(properties);
        };

        /**
         * Encodes the specified UpdateVIPPubExpReq message. Does not implicitly {@link proto_oparb.UpdateVIPPubExpReq.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.UpdateVIPPubExpReq
         * @static
         * @param {proto_oparb.IUpdateVIPPubExpReq} message UpdateVIPPubExpReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateVIPPubExpReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 1 =*/9).fixed64(message.userSrl);
            writer.uint32(/* id 2, wireType 5 =*/21).fixed32(message.pubExp);
            return writer;
        };

        /**
         * Encodes the specified UpdateVIPPubExpReq message, length delimited. Does not implicitly {@link proto_oparb.UpdateVIPPubExpReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.UpdateVIPPubExpReq
         * @static
         * @param {proto_oparb.IUpdateVIPPubExpReq} message UpdateVIPPubExpReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateVIPPubExpReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an UpdateVIPPubExpReq message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.UpdateVIPPubExpReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.UpdateVIPPubExpReq} UpdateVIPPubExpReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateVIPPubExpReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.UpdateVIPPubExpReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.userSrl = reader.fixed64();
                    break;
                case 2:
                    message.pubExp = reader.fixed32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("userSrl"))
                throw $util.ProtocolError("missing required 'userSrl'", { instance: message });
            if (!message.hasOwnProperty("pubExp"))
                throw $util.ProtocolError("missing required 'pubExp'", { instance: message });
            return message;
        };

        /**
         * Decodes an UpdateVIPPubExpReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.UpdateVIPPubExpReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.UpdateVIPPubExpReq} UpdateVIPPubExpReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateVIPPubExpReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an UpdateVIPPubExpReq message.
         * @function verify
         * @memberof proto_oparb.UpdateVIPPubExpReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        UpdateVIPPubExpReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.userSrl) && !(message.userSrl && $util.isInteger(message.userSrl.low) && $util.isInteger(message.userSrl.high)))
                return "userSrl: integer|Long expected";
            if (!$util.isInteger(message.pubExp))
                return "pubExp: integer expected";
            return null;
        };

        /**
         * Creates an UpdateVIPPubExpReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.UpdateVIPPubExpReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.UpdateVIPPubExpReq} UpdateVIPPubExpReq
         */
        UpdateVIPPubExpReq.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.UpdateVIPPubExpReq)
                return object;
            var message = new $root.proto_oparb.UpdateVIPPubExpReq();
            if (object.userSrl != null)
                if ($util.Long)
                    (message.userSrl = $util.Long.fromValue(object.userSrl)).unsigned = false;
                else if (typeof object.userSrl === "string")
                    message.userSrl = parseInt(object.userSrl, 10);
                else if (typeof object.userSrl === "number")
                    message.userSrl = object.userSrl;
                else if (typeof object.userSrl === "object")
                    message.userSrl = new $util.LongBits(object.userSrl.low >>> 0, object.userSrl.high >>> 0).toNumber();
            if (object.pubExp != null)
                message.pubExp = object.pubExp >>> 0;
            return message;
        };

        /**
         * Creates a plain object from an UpdateVIPPubExpReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.UpdateVIPPubExpReq
         * @static
         * @param {proto_oparb.UpdateVIPPubExpReq} message UpdateVIPPubExpReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        UpdateVIPPubExpReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.userSrl = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.userSrl = options.longs === String ? "0" : 0;
                object.pubExp = 0;
            }
            if (message.userSrl != null && message.hasOwnProperty("userSrl"))
                if (typeof message.userSrl === "number")
                    object.userSrl = options.longs === String ? String(message.userSrl) : message.userSrl;
                else
                    object.userSrl = options.longs === String ? $util.Long.prototype.toString.call(message.userSrl) : options.longs === Number ? new $util.LongBits(message.userSrl.low >>> 0, message.userSrl.high >>> 0).toNumber() : message.userSrl;
            if (message.pubExp != null && message.hasOwnProperty("pubExp"))
                object.pubExp = message.pubExp;
            return object;
        };

        /**
         * Converts this UpdateVIPPubExpReq to JSON.
         * @function toJSON
         * @memberof proto_oparb.UpdateVIPPubExpReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UpdateVIPPubExpReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return UpdateVIPPubExpReq;
    })();

    proto_oparb.UpdateVIPPubExpAns = (function() {

        /**
         * Properties of an UpdateVIPPubExpAns.
         * @memberof proto_oparb
         * @interface IUpdateVIPPubExpAns
         * @property {proto_oparb.UpdateVIPPubExpAns.result_type} result UpdateVIPPubExpAns result
         */

        /**
         * Constructs a new UpdateVIPPubExpAns.
         * @memberof proto_oparb
         * @classdesc Represents an UpdateVIPPubExpAns.
         * @implements IUpdateVIPPubExpAns
         * @constructor
         * @param {proto_oparb.IUpdateVIPPubExpAns=} [properties] Properties to set
         */
        function UpdateVIPPubExpAns(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * UpdateVIPPubExpAns result.
         * @member {proto_oparb.UpdateVIPPubExpAns.result_type} result
         * @memberof proto_oparb.UpdateVIPPubExpAns
         * @instance
         */
        UpdateVIPPubExpAns.prototype.result = 0;

        /**
         * Creates a new UpdateVIPPubExpAns instance using the specified properties.
         * @function create
         * @memberof proto_oparb.UpdateVIPPubExpAns
         * @static
         * @param {proto_oparb.IUpdateVIPPubExpAns=} [properties] Properties to set
         * @returns {proto_oparb.UpdateVIPPubExpAns} UpdateVIPPubExpAns instance
         */
        UpdateVIPPubExpAns.create = function create(properties) {
            return new UpdateVIPPubExpAns(properties);
        };

        /**
         * Encodes the specified UpdateVIPPubExpAns message. Does not implicitly {@link proto_oparb.UpdateVIPPubExpAns.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.UpdateVIPPubExpAns
         * @static
         * @param {proto_oparb.IUpdateVIPPubExpAns} message UpdateVIPPubExpAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateVIPPubExpAns.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.result);
            return writer;
        };

        /**
         * Encodes the specified UpdateVIPPubExpAns message, length delimited. Does not implicitly {@link proto_oparb.UpdateVIPPubExpAns.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.UpdateVIPPubExpAns
         * @static
         * @param {proto_oparb.IUpdateVIPPubExpAns} message UpdateVIPPubExpAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateVIPPubExpAns.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an UpdateVIPPubExpAns message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.UpdateVIPPubExpAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.UpdateVIPPubExpAns} UpdateVIPPubExpAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateVIPPubExpAns.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.UpdateVIPPubExpAns();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.result = reader.int32();
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
         * Decodes an UpdateVIPPubExpAns message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.UpdateVIPPubExpAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.UpdateVIPPubExpAns} UpdateVIPPubExpAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateVIPPubExpAns.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an UpdateVIPPubExpAns message.
         * @function verify
         * @memberof proto_oparb.UpdateVIPPubExpAns
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        UpdateVIPPubExpAns.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            switch (message.result) {
            default:
                return "result: enum value expected";
            case 0:
            case 1:
            case 2:
                break;
            }
            return null;
        };

        /**
         * Creates an UpdateVIPPubExpAns message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.UpdateVIPPubExpAns
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.UpdateVIPPubExpAns} UpdateVIPPubExpAns
         */
        UpdateVIPPubExpAns.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.UpdateVIPPubExpAns)
                return object;
            var message = new $root.proto_oparb.UpdateVIPPubExpAns();
            switch (object.result) {
            case "SUCCESS":
            case 0:
                message.result = 0;
                break;
            case "FAILED":
            case 1:
                message.result = 1;
                break;
            case "NOT_EXIST":
            case 2:
                message.result = 2;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from an UpdateVIPPubExpAns message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.UpdateVIPPubExpAns
         * @static
         * @param {proto_oparb.UpdateVIPPubExpAns} message UpdateVIPPubExpAns
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        UpdateVIPPubExpAns.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.result = options.enums === String ? "SUCCESS" : 0;
            if (message.result != null && message.hasOwnProperty("result"))
                object.result = options.enums === String ? $root.proto_oparb.UpdateVIPPubExpAns.result_type[message.result] : message.result;
            return object;
        };

        /**
         * Converts this UpdateVIPPubExpAns to JSON.
         * @function toJSON
         * @memberof proto_oparb.UpdateVIPPubExpAns
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UpdateVIPPubExpAns.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * result_type enum.
         * @name proto_oparb.UpdateVIPPubExpAns.result_type
         * @enum {number}
         * @property {number} SUCCESS=0 SUCCESS value
         * @property {number} FAILED=1 FAILED value
         * @property {number} NOT_EXIST=2 NOT_EXIST value
         */
        UpdateVIPPubExpAns.result_type = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "SUCCESS"] = 0;
            values[valuesById[1] = "FAILED"] = 1;
            values[valuesById[2] = "NOT_EXIST"] = 2;
            return values;
        })();

        return UpdateVIPPubExpAns;
    })();

    proto_oparb.AddBenefitReq = (function() {

        /**
         * Properties of an AddBenefitReq.
         * @memberof proto_oparb
         * @interface IAddBenefitReq
         * @property {number|Long} userSrl AddBenefitReq userSrl
         * @property {number} benefitId AddBenefitReq benefitId
         * @property {number} remainSec AddBenefitReq remainSec
         */

        /**
         * Constructs a new AddBenefitReq.
         * @memberof proto_oparb
         * @classdesc Represents an AddBenefitReq.
         * @implements IAddBenefitReq
         * @constructor
         * @param {proto_oparb.IAddBenefitReq=} [properties] Properties to set
         */
        function AddBenefitReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * AddBenefitReq userSrl.
         * @member {number|Long} userSrl
         * @memberof proto_oparb.AddBenefitReq
         * @instance
         */
        AddBenefitReq.prototype.userSrl = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * AddBenefitReq benefitId.
         * @member {number} benefitId
         * @memberof proto_oparb.AddBenefitReq
         * @instance
         */
        AddBenefitReq.prototype.benefitId = 0;

        /**
         * AddBenefitReq remainSec.
         * @member {number} remainSec
         * @memberof proto_oparb.AddBenefitReq
         * @instance
         */
        AddBenefitReq.prototype.remainSec = 0;

        /**
         * Creates a new AddBenefitReq instance using the specified properties.
         * @function create
         * @memberof proto_oparb.AddBenefitReq
         * @static
         * @param {proto_oparb.IAddBenefitReq=} [properties] Properties to set
         * @returns {proto_oparb.AddBenefitReq} AddBenefitReq instance
         */
        AddBenefitReq.create = function create(properties) {
            return new AddBenefitReq(properties);
        };

        /**
         * Encodes the specified AddBenefitReq message. Does not implicitly {@link proto_oparb.AddBenefitReq.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.AddBenefitReq
         * @static
         * @param {proto_oparb.IAddBenefitReq} message AddBenefitReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AddBenefitReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 1 =*/9).fixed64(message.userSrl);
            writer.uint32(/* id 2, wireType 5 =*/21).fixed32(message.benefitId);
            writer.uint32(/* id 3, wireType 5 =*/29).fixed32(message.remainSec);
            return writer;
        };

        /**
         * Encodes the specified AddBenefitReq message, length delimited. Does not implicitly {@link proto_oparb.AddBenefitReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.AddBenefitReq
         * @static
         * @param {proto_oparb.IAddBenefitReq} message AddBenefitReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AddBenefitReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AddBenefitReq message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.AddBenefitReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.AddBenefitReq} AddBenefitReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AddBenefitReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.AddBenefitReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.userSrl = reader.fixed64();
                    break;
                case 2:
                    message.benefitId = reader.fixed32();
                    break;
                case 3:
                    message.remainSec = reader.fixed32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("userSrl"))
                throw $util.ProtocolError("missing required 'userSrl'", { instance: message });
            if (!message.hasOwnProperty("benefitId"))
                throw $util.ProtocolError("missing required 'benefitId'", { instance: message });
            if (!message.hasOwnProperty("remainSec"))
                throw $util.ProtocolError("missing required 'remainSec'", { instance: message });
            return message;
        };

        /**
         * Decodes an AddBenefitReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.AddBenefitReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.AddBenefitReq} AddBenefitReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AddBenefitReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an AddBenefitReq message.
         * @function verify
         * @memberof proto_oparb.AddBenefitReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AddBenefitReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.userSrl) && !(message.userSrl && $util.isInteger(message.userSrl.low) && $util.isInteger(message.userSrl.high)))
                return "userSrl: integer|Long expected";
            if (!$util.isInteger(message.benefitId))
                return "benefitId: integer expected";
            if (!$util.isInteger(message.remainSec))
                return "remainSec: integer expected";
            return null;
        };

        /**
         * Creates an AddBenefitReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.AddBenefitReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.AddBenefitReq} AddBenefitReq
         */
        AddBenefitReq.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.AddBenefitReq)
                return object;
            var message = new $root.proto_oparb.AddBenefitReq();
            if (object.userSrl != null)
                if ($util.Long)
                    (message.userSrl = $util.Long.fromValue(object.userSrl)).unsigned = false;
                else if (typeof object.userSrl === "string")
                    message.userSrl = parseInt(object.userSrl, 10);
                else if (typeof object.userSrl === "number")
                    message.userSrl = object.userSrl;
                else if (typeof object.userSrl === "object")
                    message.userSrl = new $util.LongBits(object.userSrl.low >>> 0, object.userSrl.high >>> 0).toNumber();
            if (object.benefitId != null)
                message.benefitId = object.benefitId >>> 0;
            if (object.remainSec != null)
                message.remainSec = object.remainSec >>> 0;
            return message;
        };

        /**
         * Creates a plain object from an AddBenefitReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.AddBenefitReq
         * @static
         * @param {proto_oparb.AddBenefitReq} message AddBenefitReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AddBenefitReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.userSrl = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.userSrl = options.longs === String ? "0" : 0;
                object.benefitId = 0;
                object.remainSec = 0;
            }
            if (message.userSrl != null && message.hasOwnProperty("userSrl"))
                if (typeof message.userSrl === "number")
                    object.userSrl = options.longs === String ? String(message.userSrl) : message.userSrl;
                else
                    object.userSrl = options.longs === String ? $util.Long.prototype.toString.call(message.userSrl) : options.longs === Number ? new $util.LongBits(message.userSrl.low >>> 0, message.userSrl.high >>> 0).toNumber() : message.userSrl;
            if (message.benefitId != null && message.hasOwnProperty("benefitId"))
                object.benefitId = message.benefitId;
            if (message.remainSec != null && message.hasOwnProperty("remainSec"))
                object.remainSec = message.remainSec;
            return object;
        };

        /**
         * Converts this AddBenefitReq to JSON.
         * @function toJSON
         * @memberof proto_oparb.AddBenefitReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AddBenefitReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return AddBenefitReq;
    })();

    proto_oparb.AddBenefitAns = (function() {

        /**
         * Properties of an AddBenefitAns.
         * @memberof proto_oparb
         * @interface IAddBenefitAns
         * @property {proto_oparb.AddBenefitAns.result_type} result AddBenefitAns result
         */

        /**
         * Constructs a new AddBenefitAns.
         * @memberof proto_oparb
         * @classdesc Represents an AddBenefitAns.
         * @implements IAddBenefitAns
         * @constructor
         * @param {proto_oparb.IAddBenefitAns=} [properties] Properties to set
         */
        function AddBenefitAns(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * AddBenefitAns result.
         * @member {proto_oparb.AddBenefitAns.result_type} result
         * @memberof proto_oparb.AddBenefitAns
         * @instance
         */
        AddBenefitAns.prototype.result = 0;

        /**
         * Creates a new AddBenefitAns instance using the specified properties.
         * @function create
         * @memberof proto_oparb.AddBenefitAns
         * @static
         * @param {proto_oparb.IAddBenefitAns=} [properties] Properties to set
         * @returns {proto_oparb.AddBenefitAns} AddBenefitAns instance
         */
        AddBenefitAns.create = function create(properties) {
            return new AddBenefitAns(properties);
        };

        /**
         * Encodes the specified AddBenefitAns message. Does not implicitly {@link proto_oparb.AddBenefitAns.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.AddBenefitAns
         * @static
         * @param {proto_oparb.IAddBenefitAns} message AddBenefitAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AddBenefitAns.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.result);
            return writer;
        };

        /**
         * Encodes the specified AddBenefitAns message, length delimited. Does not implicitly {@link proto_oparb.AddBenefitAns.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.AddBenefitAns
         * @static
         * @param {proto_oparb.IAddBenefitAns} message AddBenefitAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AddBenefitAns.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AddBenefitAns message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.AddBenefitAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.AddBenefitAns} AddBenefitAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AddBenefitAns.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.AddBenefitAns();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.result = reader.int32();
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
         * Decodes an AddBenefitAns message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.AddBenefitAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.AddBenefitAns} AddBenefitAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AddBenefitAns.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an AddBenefitAns message.
         * @function verify
         * @memberof proto_oparb.AddBenefitAns
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AddBenefitAns.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            switch (message.result) {
            default:
                return "result: enum value expected";
            case 0:
            case 1:
            case 2:
                break;
            }
            return null;
        };

        /**
         * Creates an AddBenefitAns message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.AddBenefitAns
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.AddBenefitAns} AddBenefitAns
         */
        AddBenefitAns.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.AddBenefitAns)
                return object;
            var message = new $root.proto_oparb.AddBenefitAns();
            switch (object.result) {
            case "SUCCESS":
            case 0:
                message.result = 0;
                break;
            case "FAILED":
            case 1:
                message.result = 1;
                break;
            case "NOT_EXIST":
            case 2:
                message.result = 2;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from an AddBenefitAns message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.AddBenefitAns
         * @static
         * @param {proto_oparb.AddBenefitAns} message AddBenefitAns
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AddBenefitAns.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.result = options.enums === String ? "SUCCESS" : 0;
            if (message.result != null && message.hasOwnProperty("result"))
                object.result = options.enums === String ? $root.proto_oparb.AddBenefitAns.result_type[message.result] : message.result;
            return object;
        };

        /**
         * Converts this AddBenefitAns to JSON.
         * @function toJSON
         * @memberof proto_oparb.AddBenefitAns
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AddBenefitAns.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * result_type enum.
         * @name proto_oparb.AddBenefitAns.result_type
         * @enum {number}
         * @property {number} SUCCESS=0 SUCCESS value
         * @property {number} FAILED=1 FAILED value
         * @property {number} NOT_EXIST=2 NOT_EXIST value
         */
        AddBenefitAns.result_type = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "SUCCESS"] = 0;
            values[valuesById[1] = "FAILED"] = 1;
            values[valuesById[2] = "NOT_EXIST"] = 2;
            return values;
        })();

        return AddBenefitAns;
    })();

    proto_oparb.RemoveBenefitReq = (function() {

        /**
         * Properties of a RemoveBenefitReq.
         * @memberof proto_oparb
         * @interface IRemoveBenefitReq
         * @property {number|Long} userSrl RemoveBenefitReq userSrl
         * @property {number} benefitId RemoveBenefitReq benefitId
         */

        /**
         * Constructs a new RemoveBenefitReq.
         * @memberof proto_oparb
         * @classdesc Represents a RemoveBenefitReq.
         * @implements IRemoveBenefitReq
         * @constructor
         * @param {proto_oparb.IRemoveBenefitReq=} [properties] Properties to set
         */
        function RemoveBenefitReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RemoveBenefitReq userSrl.
         * @member {number|Long} userSrl
         * @memberof proto_oparb.RemoveBenefitReq
         * @instance
         */
        RemoveBenefitReq.prototype.userSrl = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * RemoveBenefitReq benefitId.
         * @member {number} benefitId
         * @memberof proto_oparb.RemoveBenefitReq
         * @instance
         */
        RemoveBenefitReq.prototype.benefitId = 0;

        /**
         * Creates a new RemoveBenefitReq instance using the specified properties.
         * @function create
         * @memberof proto_oparb.RemoveBenefitReq
         * @static
         * @param {proto_oparb.IRemoveBenefitReq=} [properties] Properties to set
         * @returns {proto_oparb.RemoveBenefitReq} RemoveBenefitReq instance
         */
        RemoveBenefitReq.create = function create(properties) {
            return new RemoveBenefitReq(properties);
        };

        /**
         * Encodes the specified RemoveBenefitReq message. Does not implicitly {@link proto_oparb.RemoveBenefitReq.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.RemoveBenefitReq
         * @static
         * @param {proto_oparb.IRemoveBenefitReq} message RemoveBenefitReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RemoveBenefitReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 1 =*/9).fixed64(message.userSrl);
            writer.uint32(/* id 2, wireType 5 =*/21).fixed32(message.benefitId);
            return writer;
        };

        /**
         * Encodes the specified RemoveBenefitReq message, length delimited. Does not implicitly {@link proto_oparb.RemoveBenefitReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.RemoveBenefitReq
         * @static
         * @param {proto_oparb.IRemoveBenefitReq} message RemoveBenefitReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RemoveBenefitReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RemoveBenefitReq message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.RemoveBenefitReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.RemoveBenefitReq} RemoveBenefitReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RemoveBenefitReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.RemoveBenefitReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.userSrl = reader.fixed64();
                    break;
                case 2:
                    message.benefitId = reader.fixed32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("userSrl"))
                throw $util.ProtocolError("missing required 'userSrl'", { instance: message });
            if (!message.hasOwnProperty("benefitId"))
                throw $util.ProtocolError("missing required 'benefitId'", { instance: message });
            return message;
        };

        /**
         * Decodes a RemoveBenefitReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.RemoveBenefitReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.RemoveBenefitReq} RemoveBenefitReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RemoveBenefitReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RemoveBenefitReq message.
         * @function verify
         * @memberof proto_oparb.RemoveBenefitReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RemoveBenefitReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.userSrl) && !(message.userSrl && $util.isInteger(message.userSrl.low) && $util.isInteger(message.userSrl.high)))
                return "userSrl: integer|Long expected";
            if (!$util.isInteger(message.benefitId))
                return "benefitId: integer expected";
            return null;
        };

        /**
         * Creates a RemoveBenefitReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.RemoveBenefitReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.RemoveBenefitReq} RemoveBenefitReq
         */
        RemoveBenefitReq.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.RemoveBenefitReq)
                return object;
            var message = new $root.proto_oparb.RemoveBenefitReq();
            if (object.userSrl != null)
                if ($util.Long)
                    (message.userSrl = $util.Long.fromValue(object.userSrl)).unsigned = false;
                else if (typeof object.userSrl === "string")
                    message.userSrl = parseInt(object.userSrl, 10);
                else if (typeof object.userSrl === "number")
                    message.userSrl = object.userSrl;
                else if (typeof object.userSrl === "object")
                    message.userSrl = new $util.LongBits(object.userSrl.low >>> 0, object.userSrl.high >>> 0).toNumber();
            if (object.benefitId != null)
                message.benefitId = object.benefitId >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a RemoveBenefitReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.RemoveBenefitReq
         * @static
         * @param {proto_oparb.RemoveBenefitReq} message RemoveBenefitReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RemoveBenefitReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.userSrl = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.userSrl = options.longs === String ? "0" : 0;
                object.benefitId = 0;
            }
            if (message.userSrl != null && message.hasOwnProperty("userSrl"))
                if (typeof message.userSrl === "number")
                    object.userSrl = options.longs === String ? String(message.userSrl) : message.userSrl;
                else
                    object.userSrl = options.longs === String ? $util.Long.prototype.toString.call(message.userSrl) : options.longs === Number ? new $util.LongBits(message.userSrl.low >>> 0, message.userSrl.high >>> 0).toNumber() : message.userSrl;
            if (message.benefitId != null && message.hasOwnProperty("benefitId"))
                object.benefitId = message.benefitId;
            return object;
        };

        /**
         * Converts this RemoveBenefitReq to JSON.
         * @function toJSON
         * @memberof proto_oparb.RemoveBenefitReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RemoveBenefitReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RemoveBenefitReq;
    })();

    proto_oparb.RemoveBenefitAns = (function() {

        /**
         * Properties of a RemoveBenefitAns.
         * @memberof proto_oparb
         * @interface IRemoveBenefitAns
         * @property {proto_oparb.RemoveBenefitAns.result_type} result RemoveBenefitAns result
         */

        /**
         * Constructs a new RemoveBenefitAns.
         * @memberof proto_oparb
         * @classdesc Represents a RemoveBenefitAns.
         * @implements IRemoveBenefitAns
         * @constructor
         * @param {proto_oparb.IRemoveBenefitAns=} [properties] Properties to set
         */
        function RemoveBenefitAns(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RemoveBenefitAns result.
         * @member {proto_oparb.RemoveBenefitAns.result_type} result
         * @memberof proto_oparb.RemoveBenefitAns
         * @instance
         */
        RemoveBenefitAns.prototype.result = 0;

        /**
         * Creates a new RemoveBenefitAns instance using the specified properties.
         * @function create
         * @memberof proto_oparb.RemoveBenefitAns
         * @static
         * @param {proto_oparb.IRemoveBenefitAns=} [properties] Properties to set
         * @returns {proto_oparb.RemoveBenefitAns} RemoveBenefitAns instance
         */
        RemoveBenefitAns.create = function create(properties) {
            return new RemoveBenefitAns(properties);
        };

        /**
         * Encodes the specified RemoveBenefitAns message. Does not implicitly {@link proto_oparb.RemoveBenefitAns.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.RemoveBenefitAns
         * @static
         * @param {proto_oparb.IRemoveBenefitAns} message RemoveBenefitAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RemoveBenefitAns.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.result);
            return writer;
        };

        /**
         * Encodes the specified RemoveBenefitAns message, length delimited. Does not implicitly {@link proto_oparb.RemoveBenefitAns.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.RemoveBenefitAns
         * @static
         * @param {proto_oparb.IRemoveBenefitAns} message RemoveBenefitAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RemoveBenefitAns.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RemoveBenefitAns message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.RemoveBenefitAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.RemoveBenefitAns} RemoveBenefitAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RemoveBenefitAns.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.RemoveBenefitAns();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.result = reader.int32();
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
         * Decodes a RemoveBenefitAns message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.RemoveBenefitAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.RemoveBenefitAns} RemoveBenefitAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RemoveBenefitAns.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RemoveBenefitAns message.
         * @function verify
         * @memberof proto_oparb.RemoveBenefitAns
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RemoveBenefitAns.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            switch (message.result) {
            default:
                return "result: enum value expected";
            case 0:
            case 1:
            case 2:
                break;
            }
            return null;
        };

        /**
         * Creates a RemoveBenefitAns message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.RemoveBenefitAns
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.RemoveBenefitAns} RemoveBenefitAns
         */
        RemoveBenefitAns.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.RemoveBenefitAns)
                return object;
            var message = new $root.proto_oparb.RemoveBenefitAns();
            switch (object.result) {
            case "SUCCESS":
            case 0:
                message.result = 0;
                break;
            case "FAILED":
            case 1:
                message.result = 1;
                break;
            case "NOT_EXIST":
            case 2:
                message.result = 2;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a RemoveBenefitAns message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.RemoveBenefitAns
         * @static
         * @param {proto_oparb.RemoveBenefitAns} message RemoveBenefitAns
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RemoveBenefitAns.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.result = options.enums === String ? "SUCCESS" : 0;
            if (message.result != null && message.hasOwnProperty("result"))
                object.result = options.enums === String ? $root.proto_oparb.RemoveBenefitAns.result_type[message.result] : message.result;
            return object;
        };

        /**
         * Converts this RemoveBenefitAns to JSON.
         * @function toJSON
         * @memberof proto_oparb.RemoveBenefitAns
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RemoveBenefitAns.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * result_type enum.
         * @name proto_oparb.RemoveBenefitAns.result_type
         * @enum {number}
         * @property {number} SUCCESS=0 SUCCESS value
         * @property {number} FAILED=1 FAILED value
         * @property {number} NOT_EXIST=2 NOT_EXIST value
         */
        RemoveBenefitAns.result_type = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "SUCCESS"] = 0;
            values[valuesById[1] = "FAILED"] = 1;
            values[valuesById[2] = "NOT_EXIST"] = 2;
            return values;
        })();

        return RemoveBenefitAns;
    })();

    proto_oparb.PromotionInfoReq = (function() {

        /**
         * Properties of a PromotionInfoReq.
         * @memberof proto_oparb
         * @interface IPromotionInfoReq
         * @property {number|Long} userSrl PromotionInfoReq userSrl
         * @property {number} promotionId PromotionInfoReq promotionId
         */

        /**
         * Constructs a new PromotionInfoReq.
         * @memberof proto_oparb
         * @classdesc Represents a PromotionInfoReq.
         * @implements IPromotionInfoReq
         * @constructor
         * @param {proto_oparb.IPromotionInfoReq=} [properties] Properties to set
         */
        function PromotionInfoReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PromotionInfoReq userSrl.
         * @member {number|Long} userSrl
         * @memberof proto_oparb.PromotionInfoReq
         * @instance
         */
        PromotionInfoReq.prototype.userSrl = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * PromotionInfoReq promotionId.
         * @member {number} promotionId
         * @memberof proto_oparb.PromotionInfoReq
         * @instance
         */
        PromotionInfoReq.prototype.promotionId = 0;

        /**
         * Creates a new PromotionInfoReq instance using the specified properties.
         * @function create
         * @memberof proto_oparb.PromotionInfoReq
         * @static
         * @param {proto_oparb.IPromotionInfoReq=} [properties] Properties to set
         * @returns {proto_oparb.PromotionInfoReq} PromotionInfoReq instance
         */
        PromotionInfoReq.create = function create(properties) {
            return new PromotionInfoReq(properties);
        };

        /**
         * Encodes the specified PromotionInfoReq message. Does not implicitly {@link proto_oparb.PromotionInfoReq.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.PromotionInfoReq
         * @static
         * @param {proto_oparb.IPromotionInfoReq} message PromotionInfoReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PromotionInfoReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 1 =*/9).fixed64(message.userSrl);
            writer.uint32(/* id 2, wireType 5 =*/21).fixed32(message.promotionId);
            return writer;
        };

        /**
         * Encodes the specified PromotionInfoReq message, length delimited. Does not implicitly {@link proto_oparb.PromotionInfoReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.PromotionInfoReq
         * @static
         * @param {proto_oparb.IPromotionInfoReq} message PromotionInfoReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PromotionInfoReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PromotionInfoReq message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.PromotionInfoReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.PromotionInfoReq} PromotionInfoReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PromotionInfoReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.PromotionInfoReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.userSrl = reader.fixed64();
                    break;
                case 2:
                    message.promotionId = reader.fixed32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("userSrl"))
                throw $util.ProtocolError("missing required 'userSrl'", { instance: message });
            if (!message.hasOwnProperty("promotionId"))
                throw $util.ProtocolError("missing required 'promotionId'", { instance: message });
            return message;
        };

        /**
         * Decodes a PromotionInfoReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.PromotionInfoReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.PromotionInfoReq} PromotionInfoReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PromotionInfoReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PromotionInfoReq message.
         * @function verify
         * @memberof proto_oparb.PromotionInfoReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PromotionInfoReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.userSrl) && !(message.userSrl && $util.isInteger(message.userSrl.low) && $util.isInteger(message.userSrl.high)))
                return "userSrl: integer|Long expected";
            if (!$util.isInteger(message.promotionId))
                return "promotionId: integer expected";
            return null;
        };

        /**
         * Creates a PromotionInfoReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.PromotionInfoReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.PromotionInfoReq} PromotionInfoReq
         */
        PromotionInfoReq.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.PromotionInfoReq)
                return object;
            var message = new $root.proto_oparb.PromotionInfoReq();
            if (object.userSrl != null)
                if ($util.Long)
                    (message.userSrl = $util.Long.fromValue(object.userSrl)).unsigned = false;
                else if (typeof object.userSrl === "string")
                    message.userSrl = parseInt(object.userSrl, 10);
                else if (typeof object.userSrl === "number")
                    message.userSrl = object.userSrl;
                else if (typeof object.userSrl === "object")
                    message.userSrl = new $util.LongBits(object.userSrl.low >>> 0, object.userSrl.high >>> 0).toNumber();
            if (object.promotionId != null)
                message.promotionId = object.promotionId >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a PromotionInfoReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.PromotionInfoReq
         * @static
         * @param {proto_oparb.PromotionInfoReq} message PromotionInfoReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PromotionInfoReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.userSrl = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.userSrl = options.longs === String ? "0" : 0;
                object.promotionId = 0;
            }
            if (message.userSrl != null && message.hasOwnProperty("userSrl"))
                if (typeof message.userSrl === "number")
                    object.userSrl = options.longs === String ? String(message.userSrl) : message.userSrl;
                else
                    object.userSrl = options.longs === String ? $util.Long.prototype.toString.call(message.userSrl) : options.longs === Number ? new $util.LongBits(message.userSrl.low >>> 0, message.userSrl.high >>> 0).toNumber() : message.userSrl;
            if (message.promotionId != null && message.hasOwnProperty("promotionId"))
                object.promotionId = message.promotionId;
            return object;
        };

        /**
         * Converts this PromotionInfoReq to JSON.
         * @function toJSON
         * @memberof proto_oparb.PromotionInfoReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PromotionInfoReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PromotionInfoReq;
    })();

    proto_oparb.PromotionInfoAns = (function() {

        /**
         * Properties of a PromotionInfoAns.
         * @memberof proto_oparb
         * @interface IPromotionInfoAns
         * @property {proto_oparb.PromotionInfoAns.result_type} result PromotionInfoAns result
         * @property {Array.<number>|null} [values] PromotionInfoAns values
         */

        /**
         * Constructs a new PromotionInfoAns.
         * @memberof proto_oparb
         * @classdesc Represents a PromotionInfoAns.
         * @implements IPromotionInfoAns
         * @constructor
         * @param {proto_oparb.IPromotionInfoAns=} [properties] Properties to set
         */
        function PromotionInfoAns(properties) {
            this.values = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PromotionInfoAns result.
         * @member {proto_oparb.PromotionInfoAns.result_type} result
         * @memberof proto_oparb.PromotionInfoAns
         * @instance
         */
        PromotionInfoAns.prototype.result = 0;

        /**
         * PromotionInfoAns values.
         * @member {Array.<number>} values
         * @memberof proto_oparb.PromotionInfoAns
         * @instance
         */
        PromotionInfoAns.prototype.values = $util.emptyArray;

        /**
         * Creates a new PromotionInfoAns instance using the specified properties.
         * @function create
         * @memberof proto_oparb.PromotionInfoAns
         * @static
         * @param {proto_oparb.IPromotionInfoAns=} [properties] Properties to set
         * @returns {proto_oparb.PromotionInfoAns} PromotionInfoAns instance
         */
        PromotionInfoAns.create = function create(properties) {
            return new PromotionInfoAns(properties);
        };

        /**
         * Encodes the specified PromotionInfoAns message. Does not implicitly {@link proto_oparb.PromotionInfoAns.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.PromotionInfoAns
         * @static
         * @param {proto_oparb.IPromotionInfoAns} message PromotionInfoAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PromotionInfoAns.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.result);
            if (message.values != null && message.values.length)
                for (var i = 0; i < message.values.length; ++i)
                    writer.uint32(/* id 2, wireType 5 =*/21).fixed32(message.values[i]);
            return writer;
        };

        /**
         * Encodes the specified PromotionInfoAns message, length delimited. Does not implicitly {@link proto_oparb.PromotionInfoAns.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.PromotionInfoAns
         * @static
         * @param {proto_oparb.IPromotionInfoAns} message PromotionInfoAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PromotionInfoAns.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PromotionInfoAns message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.PromotionInfoAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.PromotionInfoAns} PromotionInfoAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PromotionInfoAns.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.PromotionInfoAns();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.result = reader.int32();
                    break;
                case 2:
                    if (!(message.values && message.values.length))
                        message.values = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.values.push(reader.fixed32());
                    } else
                        message.values.push(reader.fixed32());
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
         * Decodes a PromotionInfoAns message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.PromotionInfoAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.PromotionInfoAns} PromotionInfoAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PromotionInfoAns.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PromotionInfoAns message.
         * @function verify
         * @memberof proto_oparb.PromotionInfoAns
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PromotionInfoAns.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            switch (message.result) {
            default:
                return "result: enum value expected";
            case 0:
            case 1:
            case 2:
                break;
            }
            if (message.values != null && message.hasOwnProperty("values")) {
                if (!Array.isArray(message.values))
                    return "values: array expected";
                for (var i = 0; i < message.values.length; ++i)
                    if (!$util.isInteger(message.values[i]))
                        return "values: integer[] expected";
            }
            return null;
        };

        /**
         * Creates a PromotionInfoAns message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.PromotionInfoAns
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.PromotionInfoAns} PromotionInfoAns
         */
        PromotionInfoAns.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.PromotionInfoAns)
                return object;
            var message = new $root.proto_oparb.PromotionInfoAns();
            switch (object.result) {
            case "SUCCESS":
            case 0:
                message.result = 0;
                break;
            case "FAILED":
            case 1:
                message.result = 1;
                break;
            case "NOT_EXIST":
            case 2:
                message.result = 2;
                break;
            }
            if (object.values) {
                if (!Array.isArray(object.values))
                    throw TypeError(".proto_oparb.PromotionInfoAns.values: array expected");
                message.values = [];
                for (var i = 0; i < object.values.length; ++i)
                    message.values[i] = object.values[i] >>> 0;
            }
            return message;
        };

        /**
         * Creates a plain object from a PromotionInfoAns message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.PromotionInfoAns
         * @static
         * @param {proto_oparb.PromotionInfoAns} message PromotionInfoAns
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PromotionInfoAns.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.values = [];
            if (options.defaults)
                object.result = options.enums === String ? "SUCCESS" : 0;
            if (message.result != null && message.hasOwnProperty("result"))
                object.result = options.enums === String ? $root.proto_oparb.PromotionInfoAns.result_type[message.result] : message.result;
            if (message.values && message.values.length) {
                object.values = [];
                for (var j = 0; j < message.values.length; ++j)
                    object.values[j] = message.values[j];
            }
            return object;
        };

        /**
         * Converts this PromotionInfoAns to JSON.
         * @function toJSON
         * @memberof proto_oparb.PromotionInfoAns
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PromotionInfoAns.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * result_type enum.
         * @name proto_oparb.PromotionInfoAns.result_type
         * @enum {number}
         * @property {number} SUCCESS=0 SUCCESS value
         * @property {number} FAILED=1 FAILED value
         * @property {number} NOT_EXIST=2 NOT_EXIST value
         */
        PromotionInfoAns.result_type = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "SUCCESS"] = 0;
            values[valuesById[1] = "FAILED"] = 1;
            values[valuesById[2] = "NOT_EXIST"] = 2;
            return values;
        })();

        return PromotionInfoAns;
    })();

    proto_oparb.QueryCharReq = (function() {

        /**
         * Properties of a QueryCharReq.
         * @memberof proto_oparb
         * @interface IQueryCharReq
         * @property {number|Long} userSrl QueryCharReq userSrl
         */

        /**
         * Constructs a new QueryCharReq.
         * @memberof proto_oparb
         * @classdesc Represents a QueryCharReq.
         * @implements IQueryCharReq
         * @constructor
         * @param {proto_oparb.IQueryCharReq=} [properties] Properties to set
         */
        function QueryCharReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * QueryCharReq userSrl.
         * @member {number|Long} userSrl
         * @memberof proto_oparb.QueryCharReq
         * @instance
         */
        QueryCharReq.prototype.userSrl = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new QueryCharReq instance using the specified properties.
         * @function create
         * @memberof proto_oparb.QueryCharReq
         * @static
         * @param {proto_oparb.IQueryCharReq=} [properties] Properties to set
         * @returns {proto_oparb.QueryCharReq} QueryCharReq instance
         */
        QueryCharReq.create = function create(properties) {
            return new QueryCharReq(properties);
        };

        /**
         * Encodes the specified QueryCharReq message. Does not implicitly {@link proto_oparb.QueryCharReq.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.QueryCharReq
         * @static
         * @param {proto_oparb.IQueryCharReq} message QueryCharReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        QueryCharReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 1 =*/9).fixed64(message.userSrl);
            return writer;
        };

        /**
         * Encodes the specified QueryCharReq message, length delimited. Does not implicitly {@link proto_oparb.QueryCharReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.QueryCharReq
         * @static
         * @param {proto_oparb.IQueryCharReq} message QueryCharReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        QueryCharReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a QueryCharReq message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.QueryCharReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.QueryCharReq} QueryCharReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        QueryCharReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.QueryCharReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.userSrl = reader.fixed64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("userSrl"))
                throw $util.ProtocolError("missing required 'userSrl'", { instance: message });
            return message;
        };

        /**
         * Decodes a QueryCharReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.QueryCharReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.QueryCharReq} QueryCharReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        QueryCharReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a QueryCharReq message.
         * @function verify
         * @memberof proto_oparb.QueryCharReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        QueryCharReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.userSrl) && !(message.userSrl && $util.isInteger(message.userSrl.low) && $util.isInteger(message.userSrl.high)))
                return "userSrl: integer|Long expected";
            return null;
        };

        /**
         * Creates a QueryCharReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.QueryCharReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.QueryCharReq} QueryCharReq
         */
        QueryCharReq.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.QueryCharReq)
                return object;
            var message = new $root.proto_oparb.QueryCharReq();
            if (object.userSrl != null)
                if ($util.Long)
                    (message.userSrl = $util.Long.fromValue(object.userSrl)).unsigned = false;
                else if (typeof object.userSrl === "string")
                    message.userSrl = parseInt(object.userSrl, 10);
                else if (typeof object.userSrl === "number")
                    message.userSrl = object.userSrl;
                else if (typeof object.userSrl === "object")
                    message.userSrl = new $util.LongBits(object.userSrl.low >>> 0, object.userSrl.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a QueryCharReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.QueryCharReq
         * @static
         * @param {proto_oparb.QueryCharReq} message QueryCharReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        QueryCharReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.userSrl = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.userSrl = options.longs === String ? "0" : 0;
            if (message.userSrl != null && message.hasOwnProperty("userSrl"))
                if (typeof message.userSrl === "number")
                    object.userSrl = options.longs === String ? String(message.userSrl) : message.userSrl;
                else
                    object.userSrl = options.longs === String ? $util.Long.prototype.toString.call(message.userSrl) : options.longs === Number ? new $util.LongBits(message.userSrl.low >>> 0, message.userSrl.high >>> 0).toNumber() : message.userSrl;
            return object;
        };

        /**
         * Converts this QueryCharReq to JSON.
         * @function toJSON
         * @memberof proto_oparb.QueryCharReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        QueryCharReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return QueryCharReq;
    })();

    proto_oparb.QueryCharAns = (function() {

        /**
         * Properties of a QueryCharAns.
         * @memberof proto_oparb
         * @interface IQueryCharAns
         * @property {number} charSrl QueryCharAns charSrl
         */

        /**
         * Constructs a new QueryCharAns.
         * @memberof proto_oparb
         * @classdesc Represents a QueryCharAns.
         * @implements IQueryCharAns
         * @constructor
         * @param {proto_oparb.IQueryCharAns=} [properties] Properties to set
         */
        function QueryCharAns(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * QueryCharAns charSrl.
         * @member {number} charSrl
         * @memberof proto_oparb.QueryCharAns
         * @instance
         */
        QueryCharAns.prototype.charSrl = 0;

        /**
         * Creates a new QueryCharAns instance using the specified properties.
         * @function create
         * @memberof proto_oparb.QueryCharAns
         * @static
         * @param {proto_oparb.IQueryCharAns=} [properties] Properties to set
         * @returns {proto_oparb.QueryCharAns} QueryCharAns instance
         */
        QueryCharAns.create = function create(properties) {
            return new QueryCharAns(properties);
        };

        /**
         * Encodes the specified QueryCharAns message. Does not implicitly {@link proto_oparb.QueryCharAns.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.QueryCharAns
         * @static
         * @param {proto_oparb.IQueryCharAns} message QueryCharAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        QueryCharAns.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 5 =*/13).fixed32(message.charSrl);
            return writer;
        };

        /**
         * Encodes the specified QueryCharAns message, length delimited. Does not implicitly {@link proto_oparb.QueryCharAns.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.QueryCharAns
         * @static
         * @param {proto_oparb.IQueryCharAns} message QueryCharAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        QueryCharAns.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a QueryCharAns message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.QueryCharAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.QueryCharAns} QueryCharAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        QueryCharAns.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.QueryCharAns();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.charSrl = reader.fixed32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("charSrl"))
                throw $util.ProtocolError("missing required 'charSrl'", { instance: message });
            return message;
        };

        /**
         * Decodes a QueryCharAns message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.QueryCharAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.QueryCharAns} QueryCharAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        QueryCharAns.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a QueryCharAns message.
         * @function verify
         * @memberof proto_oparb.QueryCharAns
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        QueryCharAns.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.charSrl))
                return "charSrl: integer expected";
            return null;
        };

        /**
         * Creates a QueryCharAns message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.QueryCharAns
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.QueryCharAns} QueryCharAns
         */
        QueryCharAns.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.QueryCharAns)
                return object;
            var message = new $root.proto_oparb.QueryCharAns();
            if (object.charSrl != null)
                message.charSrl = object.charSrl >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a QueryCharAns message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.QueryCharAns
         * @static
         * @param {proto_oparb.QueryCharAns} message QueryCharAns
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        QueryCharAns.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.charSrl = 0;
            if (message.charSrl != null && message.hasOwnProperty("charSrl"))
                object.charSrl = message.charSrl;
            return object;
        };

        /**
         * Converts this QueryCharAns to JSON.
         * @function toJSON
         * @memberof proto_oparb.QueryCharAns
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        QueryCharAns.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return QueryCharAns;
    })();

    proto_oparb.QueryPlayInfoReq = (function() {

        /**
         * Properties of a QueryPlayInfoReq.
         * @memberof proto_oparb
         * @interface IQueryPlayInfoReq
         * @property {number|Long} userSrl QueryPlayInfoReq userSrl
         */

        /**
         * Constructs a new QueryPlayInfoReq.
         * @memberof proto_oparb
         * @classdesc Represents a QueryPlayInfoReq.
         * @implements IQueryPlayInfoReq
         * @constructor
         * @param {proto_oparb.IQueryPlayInfoReq=} [properties] Properties to set
         */
        function QueryPlayInfoReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * QueryPlayInfoReq userSrl.
         * @member {number|Long} userSrl
         * @memberof proto_oparb.QueryPlayInfoReq
         * @instance
         */
        QueryPlayInfoReq.prototype.userSrl = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new QueryPlayInfoReq instance using the specified properties.
         * @function create
         * @memberof proto_oparb.QueryPlayInfoReq
         * @static
         * @param {proto_oparb.IQueryPlayInfoReq=} [properties] Properties to set
         * @returns {proto_oparb.QueryPlayInfoReq} QueryPlayInfoReq instance
         */
        QueryPlayInfoReq.create = function create(properties) {
            return new QueryPlayInfoReq(properties);
        };

        /**
         * Encodes the specified QueryPlayInfoReq message. Does not implicitly {@link proto_oparb.QueryPlayInfoReq.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.QueryPlayInfoReq
         * @static
         * @param {proto_oparb.IQueryPlayInfoReq} message QueryPlayInfoReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        QueryPlayInfoReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 1 =*/9).fixed64(message.userSrl);
            return writer;
        };

        /**
         * Encodes the specified QueryPlayInfoReq message, length delimited. Does not implicitly {@link proto_oparb.QueryPlayInfoReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.QueryPlayInfoReq
         * @static
         * @param {proto_oparb.IQueryPlayInfoReq} message QueryPlayInfoReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        QueryPlayInfoReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a QueryPlayInfoReq message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.QueryPlayInfoReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.QueryPlayInfoReq} QueryPlayInfoReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        QueryPlayInfoReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.QueryPlayInfoReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.userSrl = reader.fixed64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("userSrl"))
                throw $util.ProtocolError("missing required 'userSrl'", { instance: message });
            return message;
        };

        /**
         * Decodes a QueryPlayInfoReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.QueryPlayInfoReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.QueryPlayInfoReq} QueryPlayInfoReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        QueryPlayInfoReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a QueryPlayInfoReq message.
         * @function verify
         * @memberof proto_oparb.QueryPlayInfoReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        QueryPlayInfoReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.userSrl) && !(message.userSrl && $util.isInteger(message.userSrl.low) && $util.isInteger(message.userSrl.high)))
                return "userSrl: integer|Long expected";
            return null;
        };

        /**
         * Creates a QueryPlayInfoReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.QueryPlayInfoReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.QueryPlayInfoReq} QueryPlayInfoReq
         */
        QueryPlayInfoReq.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.QueryPlayInfoReq)
                return object;
            var message = new $root.proto_oparb.QueryPlayInfoReq();
            if (object.userSrl != null)
                if ($util.Long)
                    (message.userSrl = $util.Long.fromValue(object.userSrl)).unsigned = false;
                else if (typeof object.userSrl === "string")
                    message.userSrl = parseInt(object.userSrl, 10);
                else if (typeof object.userSrl === "number")
                    message.userSrl = object.userSrl;
                else if (typeof object.userSrl === "object")
                    message.userSrl = new $util.LongBits(object.userSrl.low >>> 0, object.userSrl.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a QueryPlayInfoReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.QueryPlayInfoReq
         * @static
         * @param {proto_oparb.QueryPlayInfoReq} message QueryPlayInfoReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        QueryPlayInfoReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.userSrl = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.userSrl = options.longs === String ? "0" : 0;
            if (message.userSrl != null && message.hasOwnProperty("userSrl"))
                if (typeof message.userSrl === "number")
                    object.userSrl = options.longs === String ? String(message.userSrl) : message.userSrl;
                else
                    object.userSrl = options.longs === String ? $util.Long.prototype.toString.call(message.userSrl) : options.longs === Number ? new $util.LongBits(message.userSrl.low >>> 0, message.userSrl.high >>> 0).toNumber() : message.userSrl;
            return object;
        };

        /**
         * Converts this QueryPlayInfoReq to JSON.
         * @function toJSON
         * @memberof proto_oparb.QueryPlayInfoReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        QueryPlayInfoReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return QueryPlayInfoReq;
    })();

    proto_oparb.QueryPlayInfoAns = (function() {

        /**
         * Properties of a QueryPlayInfoAns.
         * @memberof proto_oparb
         * @interface IQueryPlayInfoAns
         * @property {proto_oparb.QueryPlayInfoAns.result_type} result QueryPlayInfoAns result
         * @property {boolean} pcbang QueryPlayInfoAns pcbang
         * @property {number} playTime QueryPlayInfoAns playTime
         */

        /**
         * Constructs a new QueryPlayInfoAns.
         * @memberof proto_oparb
         * @classdesc Represents a QueryPlayInfoAns.
         * @implements IQueryPlayInfoAns
         * @constructor
         * @param {proto_oparb.IQueryPlayInfoAns=} [properties] Properties to set
         */
        function QueryPlayInfoAns(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * QueryPlayInfoAns result.
         * @member {proto_oparb.QueryPlayInfoAns.result_type} result
         * @memberof proto_oparb.QueryPlayInfoAns
         * @instance
         */
        QueryPlayInfoAns.prototype.result = 0;

        /**
         * QueryPlayInfoAns pcbang.
         * @member {boolean} pcbang
         * @memberof proto_oparb.QueryPlayInfoAns
         * @instance
         */
        QueryPlayInfoAns.prototype.pcbang = false;

        /**
         * QueryPlayInfoAns playTime.
         * @member {number} playTime
         * @memberof proto_oparb.QueryPlayInfoAns
         * @instance
         */
        QueryPlayInfoAns.prototype.playTime = 0;

        /**
         * Creates a new QueryPlayInfoAns instance using the specified properties.
         * @function create
         * @memberof proto_oparb.QueryPlayInfoAns
         * @static
         * @param {proto_oparb.IQueryPlayInfoAns=} [properties] Properties to set
         * @returns {proto_oparb.QueryPlayInfoAns} QueryPlayInfoAns instance
         */
        QueryPlayInfoAns.create = function create(properties) {
            return new QueryPlayInfoAns(properties);
        };

        /**
         * Encodes the specified QueryPlayInfoAns message. Does not implicitly {@link proto_oparb.QueryPlayInfoAns.verify|verify} messages.
         * @function encode
         * @memberof proto_oparb.QueryPlayInfoAns
         * @static
         * @param {proto_oparb.IQueryPlayInfoAns} message QueryPlayInfoAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        QueryPlayInfoAns.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.result);
            writer.uint32(/* id 2, wireType 0 =*/16).bool(message.pcbang);
            writer.uint32(/* id 3, wireType 5 =*/29).fixed32(message.playTime);
            return writer;
        };

        /**
         * Encodes the specified QueryPlayInfoAns message, length delimited. Does not implicitly {@link proto_oparb.QueryPlayInfoAns.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_oparb.QueryPlayInfoAns
         * @static
         * @param {proto_oparb.IQueryPlayInfoAns} message QueryPlayInfoAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        QueryPlayInfoAns.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a QueryPlayInfoAns message from the specified reader or buffer.
         * @function decode
         * @memberof proto_oparb.QueryPlayInfoAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_oparb.QueryPlayInfoAns} QueryPlayInfoAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        QueryPlayInfoAns.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_oparb.QueryPlayInfoAns();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.result = reader.int32();
                    break;
                case 2:
                    message.pcbang = reader.bool();
                    break;
                case 3:
                    message.playTime = reader.fixed32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("result"))
                throw $util.ProtocolError("missing required 'result'", { instance: message });
            if (!message.hasOwnProperty("pcbang"))
                throw $util.ProtocolError("missing required 'pcbang'", { instance: message });
            if (!message.hasOwnProperty("playTime"))
                throw $util.ProtocolError("missing required 'playTime'", { instance: message });
            return message;
        };

        /**
         * Decodes a QueryPlayInfoAns message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_oparb.QueryPlayInfoAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_oparb.QueryPlayInfoAns} QueryPlayInfoAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        QueryPlayInfoAns.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a QueryPlayInfoAns message.
         * @function verify
         * @memberof proto_oparb.QueryPlayInfoAns
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        QueryPlayInfoAns.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            switch (message.result) {
            default:
                return "result: enum value expected";
            case 0:
            case 1:
            case 2:
                break;
            }
            if (typeof message.pcbang !== "boolean")
                return "pcbang: boolean expected";
            if (!$util.isInteger(message.playTime))
                return "playTime: integer expected";
            return null;
        };

        /**
         * Creates a QueryPlayInfoAns message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_oparb.QueryPlayInfoAns
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_oparb.QueryPlayInfoAns} QueryPlayInfoAns
         */
        QueryPlayInfoAns.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_oparb.QueryPlayInfoAns)
                return object;
            var message = new $root.proto_oparb.QueryPlayInfoAns();
            switch (object.result) {
            case "SUCCESS":
            case 0:
                message.result = 0;
                break;
            case "FAILED":
            case 1:
                message.result = 1;
                break;
            case "NOT_EXIST":
            case 2:
                message.result = 2;
                break;
            }
            if (object.pcbang != null)
                message.pcbang = Boolean(object.pcbang);
            if (object.playTime != null)
                message.playTime = object.playTime >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a QueryPlayInfoAns message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_oparb.QueryPlayInfoAns
         * @static
         * @param {proto_oparb.QueryPlayInfoAns} message QueryPlayInfoAns
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        QueryPlayInfoAns.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.result = options.enums === String ? "SUCCESS" : 0;
                object.pcbang = false;
                object.playTime = 0;
            }
            if (message.result != null && message.hasOwnProperty("result"))
                object.result = options.enums === String ? $root.proto_oparb.QueryPlayInfoAns.result_type[message.result] : message.result;
            if (message.pcbang != null && message.hasOwnProperty("pcbang"))
                object.pcbang = message.pcbang;
            if (message.playTime != null && message.hasOwnProperty("playTime"))
                object.playTime = message.playTime;
            return object;
        };

        /**
         * Converts this QueryPlayInfoAns to JSON.
         * @function toJSON
         * @memberof proto_oparb.QueryPlayInfoAns
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        QueryPlayInfoAns.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * result_type enum.
         * @name proto_oparb.QueryPlayInfoAns.result_type
         * @enum {number}
         * @property {number} SUCCESS=0 SUCCESS value
         * @property {number} FAILED=1 FAILED value
         * @property {number} NOT_EXIST=2 NOT_EXIST value
         */
        QueryPlayInfoAns.result_type = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "SUCCESS"] = 0;
            values[valuesById[1] = "FAILED"] = 1;
            values[valuesById[2] = "NOT_EXIST"] = 2;
            return values;
        })();

        return QueryPlayInfoAns;
    })();

    return proto_oparb;
})();

module.exports = $root;
