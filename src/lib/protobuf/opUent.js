/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.proto_opuent = (function() {

    /**
     * Namespace proto_opuent.
     * @exports proto_opuent
     * @namespace
     */
    var proto_opuent = {};

    proto_opuent.QueryUserReq = (function() {

        /**
         * Properties of a QueryUserReq.
         * @memberof proto_opuent
         * @interface IQueryUserReq
         * @property {number|Long} userSrl QueryUserReq userSrl
         * @property {proto_opuent.QueryUserReq.action_type} action QueryUserReq action
         * @property {number} serverId QueryUserReq serverId
         */

        /**
         * Constructs a new QueryUserReq.
         * @memberof proto_opuent
         * @classdesc Represents a QueryUserReq.
         * @implements IQueryUserReq
         * @constructor
         * @param {proto_opuent.IQueryUserReq=} [properties] Properties to set
         */
        function QueryUserReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * QueryUserReq userSrl.
         * @member {number|Long} userSrl
         * @memberof proto_opuent.QueryUserReq
         * @instance
         */
        QueryUserReq.prototype.userSrl = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * QueryUserReq action.
         * @member {proto_opuent.QueryUserReq.action_type} action
         * @memberof proto_opuent.QueryUserReq
         * @instance
         */
        QueryUserReq.prototype.action = 0;

        /**
         * QueryUserReq serverId.
         * @member {number} serverId
         * @memberof proto_opuent.QueryUserReq
         * @instance
         */
        QueryUserReq.prototype.serverId = 0;

        /**
         * Creates a new QueryUserReq instance using the specified properties.
         * @function create
         * @memberof proto_opuent.QueryUserReq
         * @static
         * @param {proto_opuent.IQueryUserReq=} [properties] Properties to set
         * @returns {proto_opuent.QueryUserReq} QueryUserReq instance
         */
        QueryUserReq.create = function create(properties) {
            return new QueryUserReq(properties);
        };

        /**
         * Encodes the specified QueryUserReq message. Does not implicitly {@link proto_opuent.QueryUserReq.verify|verify} messages.
         * @function encode
         * @memberof proto_opuent.QueryUserReq
         * @static
         * @param {proto_opuent.IQueryUserReq} message QueryUserReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        QueryUserReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 1 =*/9).fixed64(message.userSrl);
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.action);
            writer.uint32(/* id 3, wireType 5 =*/29).fixed32(message.serverId);
            return writer;
        };

        /**
         * Encodes the specified QueryUserReq message, length delimited. Does not implicitly {@link proto_opuent.QueryUserReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_opuent.QueryUserReq
         * @static
         * @param {proto_opuent.IQueryUserReq} message QueryUserReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        QueryUserReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a QueryUserReq message from the specified reader or buffer.
         * @function decode
         * @memberof proto_opuent.QueryUserReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_opuent.QueryUserReq} QueryUserReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        QueryUserReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_opuent.QueryUserReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.userSrl = reader.fixed64();
                    break;
                case 2:
                    message.action = reader.int32();
                    break;
                case 3:
                    message.serverId = reader.fixed32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("userSrl"))
                throw $util.ProtocolError("missing required 'userSrl'", { instance: message });
            if (!message.hasOwnProperty("action"))
                throw $util.ProtocolError("missing required 'action'", { instance: message });
            if (!message.hasOwnProperty("serverId"))
                throw $util.ProtocolError("missing required 'serverId'", { instance: message });
            return message;
        };

        /**
         * Decodes a QueryUserReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_opuent.QueryUserReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_opuent.QueryUserReq} QueryUserReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        QueryUserReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a QueryUserReq message.
         * @function verify
         * @memberof proto_opuent.QueryUserReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        QueryUserReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.userSrl) && !(message.userSrl && $util.isInteger(message.userSrl.low) && $util.isInteger(message.userSrl.high)))
                return "userSrl: integer|Long expected";
            switch (message.action) {
            default:
                return "action: enum value expected";
            case 0:
            case 1:
            case 2:
                break;
            }
            if (!$util.isInteger(message.serverId))
                return "serverId: integer expected";
            return null;
        };

        /**
         * Creates a QueryUserReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_opuent.QueryUserReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_opuent.QueryUserReq} QueryUserReq
         */
        QueryUserReq.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_opuent.QueryUserReq)
                return object;
            var message = new $root.proto_opuent.QueryUserReq();
            if (object.userSrl != null)
                if ($util.Long)
                    (message.userSrl = $util.Long.fromValue(object.userSrl)).unsigned = false;
                else if (typeof object.userSrl === "string")
                    message.userSrl = parseInt(object.userSrl, 10);
                else if (typeof object.userSrl === "number")
                    message.userSrl = object.userSrl;
                else if (typeof object.userSrl === "object")
                    message.userSrl = new $util.LongBits(object.userSrl.low >>> 0, object.userSrl.high >>> 0).toNumber();
            switch (object.action) {
            case "QUERY":
            case 0:
                message.action = 0;
                break;
            case "INSERT":
            case 1:
                message.action = 1;
                break;
            case "DEL":
            case 2:
                message.action = 2;
                break;
            }
            if (object.serverId != null)
                message.serverId = object.serverId >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a QueryUserReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_opuent.QueryUserReq
         * @static
         * @param {proto_opuent.QueryUserReq} message QueryUserReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        QueryUserReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.userSrl = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.userSrl = options.longs === String ? "0" : 0;
                object.action = options.enums === String ? "QUERY" : 0;
                object.serverId = 0;
            }
            if (message.userSrl != null && message.hasOwnProperty("userSrl"))
                if (typeof message.userSrl === "number")
                    object.userSrl = options.longs === String ? String(message.userSrl) : message.userSrl;
                else
                    object.userSrl = options.longs === String ? $util.Long.prototype.toString.call(message.userSrl) : options.longs === Number ? new $util.LongBits(message.userSrl.low >>> 0, message.userSrl.high >>> 0).toNumber() : message.userSrl;
            if (message.action != null && message.hasOwnProperty("action"))
                object.action = options.enums === String ? $root.proto_opuent.QueryUserReq.action_type[message.action] : message.action;
            if (message.serverId != null && message.hasOwnProperty("serverId"))
                object.serverId = message.serverId;
            return object;
        };

        /**
         * Converts this QueryUserReq to JSON.
         * @function toJSON
         * @memberof proto_opuent.QueryUserReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        QueryUserReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * action_type enum.
         * @name proto_opuent.QueryUserReq.action_type
         * @enum {number}
         * @property {number} QUERY=0 QUERY value
         * @property {number} INSERT=1 INSERT value
         * @property {number} DEL=2 DEL value
         */
        QueryUserReq.action_type = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "QUERY"] = 0;
            values[valuesById[1] = "INSERT"] = 1;
            values[valuesById[2] = "DEL"] = 2;
            return values;
        })();

        return QueryUserReq;
    })();

    proto_opuent.QueryUserAns = (function() {

        /**
         * Properties of a QueryUserAns.
         * @memberof proto_opuent
         * @interface IQueryUserAns
         * @property {number|Long} userSrl QueryUserAns userSrl
         * @property {number} serverId QueryUserAns serverId
         */

        /**
         * Constructs a new QueryUserAns.
         * @memberof proto_opuent
         * @classdesc Represents a QueryUserAns.
         * @implements IQueryUserAns
         * @constructor
         * @param {proto_opuent.IQueryUserAns=} [properties] Properties to set
         */
        function QueryUserAns(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * QueryUserAns userSrl.
         * @member {number|Long} userSrl
         * @memberof proto_opuent.QueryUserAns
         * @instance
         */
        QueryUserAns.prototype.userSrl = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * QueryUserAns serverId.
         * @member {number} serverId
         * @memberof proto_opuent.QueryUserAns
         * @instance
         */
        QueryUserAns.prototype.serverId = 0;

        /**
         * Creates a new QueryUserAns instance using the specified properties.
         * @function create
         * @memberof proto_opuent.QueryUserAns
         * @static
         * @param {proto_opuent.IQueryUserAns=} [properties] Properties to set
         * @returns {proto_opuent.QueryUserAns} QueryUserAns instance
         */
        QueryUserAns.create = function create(properties) {
            return new QueryUserAns(properties);
        };

        /**
         * Encodes the specified QueryUserAns message. Does not implicitly {@link proto_opuent.QueryUserAns.verify|verify} messages.
         * @function encode
         * @memberof proto_opuent.QueryUserAns
         * @static
         * @param {proto_opuent.IQueryUserAns} message QueryUserAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        QueryUserAns.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 1 =*/9).fixed64(message.userSrl);
            writer.uint32(/* id 2, wireType 5 =*/21).fixed32(message.serverId);
            return writer;
        };

        /**
         * Encodes the specified QueryUserAns message, length delimited. Does not implicitly {@link proto_opuent.QueryUserAns.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_opuent.QueryUserAns
         * @static
         * @param {proto_opuent.IQueryUserAns} message QueryUserAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        QueryUserAns.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a QueryUserAns message from the specified reader or buffer.
         * @function decode
         * @memberof proto_opuent.QueryUserAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_opuent.QueryUserAns} QueryUserAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        QueryUserAns.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_opuent.QueryUserAns();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.userSrl = reader.fixed64();
                    break;
                case 2:
                    message.serverId = reader.fixed32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("userSrl"))
                throw $util.ProtocolError("missing required 'userSrl'", { instance: message });
            if (!message.hasOwnProperty("serverId"))
                throw $util.ProtocolError("missing required 'serverId'", { instance: message });
            return message;
        };

        /**
         * Decodes a QueryUserAns message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_opuent.QueryUserAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_opuent.QueryUserAns} QueryUserAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        QueryUserAns.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a QueryUserAns message.
         * @function verify
         * @memberof proto_opuent.QueryUserAns
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        QueryUserAns.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.userSrl) && !(message.userSrl && $util.isInteger(message.userSrl.low) && $util.isInteger(message.userSrl.high)))
                return "userSrl: integer|Long expected";
            if (!$util.isInteger(message.serverId))
                return "serverId: integer expected";
            return null;
        };

        /**
         * Creates a QueryUserAns message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_opuent.QueryUserAns
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_opuent.QueryUserAns} QueryUserAns
         */
        QueryUserAns.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_opuent.QueryUserAns)
                return object;
            var message = new $root.proto_opuent.QueryUserAns();
            if (object.userSrl != null)
                if ($util.Long)
                    (message.userSrl = $util.Long.fromValue(object.userSrl)).unsigned = false;
                else if (typeof object.userSrl === "string")
                    message.userSrl = parseInt(object.userSrl, 10);
                else if (typeof object.userSrl === "number")
                    message.userSrl = object.userSrl;
                else if (typeof object.userSrl === "object")
                    message.userSrl = new $util.LongBits(object.userSrl.low >>> 0, object.userSrl.high >>> 0).toNumber();
            if (object.serverId != null)
                message.serverId = object.serverId >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a QueryUserAns message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_opuent.QueryUserAns
         * @static
         * @param {proto_opuent.QueryUserAns} message QueryUserAns
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        QueryUserAns.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.userSrl = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.userSrl = options.longs === String ? "0" : 0;
                object.serverId = 0;
            }
            if (message.userSrl != null && message.hasOwnProperty("userSrl"))
                if (typeof message.userSrl === "number")
                    object.userSrl = options.longs === String ? String(message.userSrl) : message.userSrl;
                else
                    object.userSrl = options.longs === String ? $util.Long.prototype.toString.call(message.userSrl) : options.longs === Number ? new $util.LongBits(message.userSrl.low >>> 0, message.userSrl.high >>> 0).toNumber() : message.userSrl;
            if (message.serverId != null && message.hasOwnProperty("serverId"))
                object.serverId = message.serverId;
            return object;
        };

        /**
         * Converts this QueryUserAns to JSON.
         * @function toJSON
         * @memberof proto_opuent.QueryUserAns
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        QueryUserAns.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return QueryUserAns;
    })();

    proto_opuent.GetServerStatReq = (function() {

        /**
         * Properties of a GetServerStatReq.
         * @memberof proto_opuent
         * @interface IGetServerStatReq
         */

        /**
         * Constructs a new GetServerStatReq.
         * @memberof proto_opuent
         * @classdesc Represents a GetServerStatReq.
         * @implements IGetServerStatReq
         * @constructor
         * @param {proto_opuent.IGetServerStatReq=} [properties] Properties to set
         */
        function GetServerStatReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new GetServerStatReq instance using the specified properties.
         * @function create
         * @memberof proto_opuent.GetServerStatReq
         * @static
         * @param {proto_opuent.IGetServerStatReq=} [properties] Properties to set
         * @returns {proto_opuent.GetServerStatReq} GetServerStatReq instance
         */
        GetServerStatReq.create = function create(properties) {
            return new GetServerStatReq(properties);
        };

        /**
         * Encodes the specified GetServerStatReq message. Does not implicitly {@link proto_opuent.GetServerStatReq.verify|verify} messages.
         * @function encode
         * @memberof proto_opuent.GetServerStatReq
         * @static
         * @param {proto_opuent.IGetServerStatReq} message GetServerStatReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetServerStatReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified GetServerStatReq message, length delimited. Does not implicitly {@link proto_opuent.GetServerStatReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_opuent.GetServerStatReq
         * @static
         * @param {proto_opuent.IGetServerStatReq} message GetServerStatReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetServerStatReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GetServerStatReq message from the specified reader or buffer.
         * @function decode
         * @memberof proto_opuent.GetServerStatReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_opuent.GetServerStatReq} GetServerStatReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetServerStatReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_opuent.GetServerStatReq();
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
         * Decodes a GetServerStatReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_opuent.GetServerStatReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_opuent.GetServerStatReq} GetServerStatReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetServerStatReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GetServerStatReq message.
         * @function verify
         * @memberof proto_opuent.GetServerStatReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetServerStatReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates a GetServerStatReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_opuent.GetServerStatReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_opuent.GetServerStatReq} GetServerStatReq
         */
        GetServerStatReq.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_opuent.GetServerStatReq)
                return object;
            return new $root.proto_opuent.GetServerStatReq();
        };

        /**
         * Creates a plain object from a GetServerStatReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_opuent.GetServerStatReq
         * @static
         * @param {proto_opuent.GetServerStatReq} message GetServerStatReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetServerStatReq.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this GetServerStatReq to JSON.
         * @function toJSON
         * @memberof proto_opuent.GetServerStatReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetServerStatReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return GetServerStatReq;
    })();

    proto_opuent.GetServerStatAns = (function() {

        /**
         * Properties of a GetServerStatAns.
         * @memberof proto_opuent
         * @interface IGetServerStatAns
         * @property {Array.<proto_opuent.GetServerStatAns.IServerInfo>|null} [serverList] GetServerStatAns serverList
         */

        /**
         * Constructs a new GetServerStatAns.
         * @memberof proto_opuent
         * @classdesc Represents a GetServerStatAns.
         * @implements IGetServerStatAns
         * @constructor
         * @param {proto_opuent.IGetServerStatAns=} [properties] Properties to set
         */
        function GetServerStatAns(properties) {
            this.serverList = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GetServerStatAns serverList.
         * @member {Array.<proto_opuent.GetServerStatAns.IServerInfo>} serverList
         * @memberof proto_opuent.GetServerStatAns
         * @instance
         */
        GetServerStatAns.prototype.serverList = $util.emptyArray;

        /**
         * Creates a new GetServerStatAns instance using the specified properties.
         * @function create
         * @memberof proto_opuent.GetServerStatAns
         * @static
         * @param {proto_opuent.IGetServerStatAns=} [properties] Properties to set
         * @returns {proto_opuent.GetServerStatAns} GetServerStatAns instance
         */
        GetServerStatAns.create = function create(properties) {
            return new GetServerStatAns(properties);
        };

        /**
         * Encodes the specified GetServerStatAns message. Does not implicitly {@link proto_opuent.GetServerStatAns.verify|verify} messages.
         * @function encode
         * @memberof proto_opuent.GetServerStatAns
         * @static
         * @param {proto_opuent.IGetServerStatAns} message GetServerStatAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetServerStatAns.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.serverList != null && message.serverList.length)
                for (var i = 0; i < message.serverList.length; ++i)
                    $root.proto_opuent.GetServerStatAns.ServerInfo.encode(message.serverList[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified GetServerStatAns message, length delimited. Does not implicitly {@link proto_opuent.GetServerStatAns.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_opuent.GetServerStatAns
         * @static
         * @param {proto_opuent.IGetServerStatAns} message GetServerStatAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetServerStatAns.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GetServerStatAns message from the specified reader or buffer.
         * @function decode
         * @memberof proto_opuent.GetServerStatAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_opuent.GetServerStatAns} GetServerStatAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetServerStatAns.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_opuent.GetServerStatAns();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.serverList && message.serverList.length))
                        message.serverList = [];
                    message.serverList.push($root.proto_opuent.GetServerStatAns.ServerInfo.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GetServerStatAns message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_opuent.GetServerStatAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_opuent.GetServerStatAns} GetServerStatAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetServerStatAns.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GetServerStatAns message.
         * @function verify
         * @memberof proto_opuent.GetServerStatAns
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetServerStatAns.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.serverList != null && message.hasOwnProperty("serverList")) {
                if (!Array.isArray(message.serverList))
                    return "serverList: array expected";
                for (var i = 0; i < message.serverList.length; ++i) {
                    var error = $root.proto_opuent.GetServerStatAns.ServerInfo.verify(message.serverList[i]);
                    if (error)
                        return "serverList." + error;
                }
            }
            return null;
        };

        /**
         * Creates a GetServerStatAns message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_opuent.GetServerStatAns
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_opuent.GetServerStatAns} GetServerStatAns
         */
        GetServerStatAns.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_opuent.GetServerStatAns)
                return object;
            var message = new $root.proto_opuent.GetServerStatAns();
            if (object.serverList) {
                if (!Array.isArray(object.serverList))
                    throw TypeError(".proto_opuent.GetServerStatAns.serverList: array expected");
                message.serverList = [];
                for (var i = 0; i < object.serverList.length; ++i) {
                    if (typeof object.serverList[i] !== "object")
                        throw TypeError(".proto_opuent.GetServerStatAns.serverList: object expected");
                    message.serverList[i] = $root.proto_opuent.GetServerStatAns.ServerInfo.fromObject(object.serverList[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a GetServerStatAns message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_opuent.GetServerStatAns
         * @static
         * @param {proto_opuent.GetServerStatAns} message GetServerStatAns
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetServerStatAns.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.serverList = [];
            if (message.serverList && message.serverList.length) {
                object.serverList = [];
                for (var j = 0; j < message.serverList.length; ++j)
                    object.serverList[j] = $root.proto_opuent.GetServerStatAns.ServerInfo.toObject(message.serverList[j], options);
            }
            return object;
        };

        /**
         * Converts this GetServerStatAns to JSON.
         * @function toJSON
         * @memberof proto_opuent.GetServerStatAns
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetServerStatAns.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        GetServerStatAns.ServerInfo = (function() {

            /**
             * Properties of a ServerInfo.
             * @memberof proto_opuent.GetServerStatAns
             * @interface IServerInfo
             * @property {number} serverId ServerInfo serverId
             * @property {number} userCnt ServerInfo userCnt
             */

            /**
             * Constructs a new ServerInfo.
             * @memberof proto_opuent.GetServerStatAns
             * @classdesc Represents a ServerInfo.
             * @implements IServerInfo
             * @constructor
             * @param {proto_opuent.GetServerStatAns.IServerInfo=} [properties] Properties to set
             */
            function ServerInfo(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ServerInfo serverId.
             * @member {number} serverId
             * @memberof proto_opuent.GetServerStatAns.ServerInfo
             * @instance
             */
            ServerInfo.prototype.serverId = 0;

            /**
             * ServerInfo userCnt.
             * @member {number} userCnt
             * @memberof proto_opuent.GetServerStatAns.ServerInfo
             * @instance
             */
            ServerInfo.prototype.userCnt = 0;

            /**
             * Creates a new ServerInfo instance using the specified properties.
             * @function create
             * @memberof proto_opuent.GetServerStatAns.ServerInfo
             * @static
             * @param {proto_opuent.GetServerStatAns.IServerInfo=} [properties] Properties to set
             * @returns {proto_opuent.GetServerStatAns.ServerInfo} ServerInfo instance
             */
            ServerInfo.create = function create(properties) {
                return new ServerInfo(properties);
            };

            /**
             * Encodes the specified ServerInfo message. Does not implicitly {@link proto_opuent.GetServerStatAns.ServerInfo.verify|verify} messages.
             * @function encode
             * @memberof proto_opuent.GetServerStatAns.ServerInfo
             * @static
             * @param {proto_opuent.GetServerStatAns.IServerInfo} message ServerInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ServerInfo.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                writer.uint32(/* id 1, wireType 5 =*/13).fixed32(message.serverId);
                writer.uint32(/* id 2, wireType 5 =*/21).fixed32(message.userCnt);
                return writer;
            };

            /**
             * Encodes the specified ServerInfo message, length delimited. Does not implicitly {@link proto_opuent.GetServerStatAns.ServerInfo.verify|verify} messages.
             * @function encodeDelimited
             * @memberof proto_opuent.GetServerStatAns.ServerInfo
             * @static
             * @param {proto_opuent.GetServerStatAns.IServerInfo} message ServerInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ServerInfo.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ServerInfo message from the specified reader or buffer.
             * @function decode
             * @memberof proto_opuent.GetServerStatAns.ServerInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {proto_opuent.GetServerStatAns.ServerInfo} ServerInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ServerInfo.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_opuent.GetServerStatAns.ServerInfo();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.serverId = reader.fixed32();
                        break;
                    case 2:
                        message.userCnt = reader.fixed32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                if (!message.hasOwnProperty("serverId"))
                    throw $util.ProtocolError("missing required 'serverId'", { instance: message });
                if (!message.hasOwnProperty("userCnt"))
                    throw $util.ProtocolError("missing required 'userCnt'", { instance: message });
                return message;
            };

            /**
             * Decodes a ServerInfo message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof proto_opuent.GetServerStatAns.ServerInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {proto_opuent.GetServerStatAns.ServerInfo} ServerInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ServerInfo.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ServerInfo message.
             * @function verify
             * @memberof proto_opuent.GetServerStatAns.ServerInfo
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ServerInfo.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (!$util.isInteger(message.serverId))
                    return "serverId: integer expected";
                if (!$util.isInteger(message.userCnt))
                    return "userCnt: integer expected";
                return null;
            };

            /**
             * Creates a ServerInfo message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof proto_opuent.GetServerStatAns.ServerInfo
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {proto_opuent.GetServerStatAns.ServerInfo} ServerInfo
             */
            ServerInfo.fromObject = function fromObject(object) {
                if (object instanceof $root.proto_opuent.GetServerStatAns.ServerInfo)
                    return object;
                var message = new $root.proto_opuent.GetServerStatAns.ServerInfo();
                if (object.serverId != null)
                    message.serverId = object.serverId >>> 0;
                if (object.userCnt != null)
                    message.userCnt = object.userCnt >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a ServerInfo message. Also converts values to other types if specified.
             * @function toObject
             * @memberof proto_opuent.GetServerStatAns.ServerInfo
             * @static
             * @param {proto_opuent.GetServerStatAns.ServerInfo} message ServerInfo
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ServerInfo.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.serverId = 0;
                    object.userCnt = 0;
                }
                if (message.serverId != null && message.hasOwnProperty("serverId"))
                    object.serverId = message.serverId;
                if (message.userCnt != null && message.hasOwnProperty("userCnt"))
                    object.userCnt = message.userCnt;
                return object;
            };

            /**
             * Converts this ServerInfo to JSON.
             * @function toJSON
             * @memberof proto_opuent.GetServerStatAns.ServerInfo
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ServerInfo.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return ServerInfo;
        })();

        return GetServerStatAns;
    })();

    proto_opuent.GetAllServerStatReq = (function() {

        /**
         * Properties of a GetAllServerStatReq.
         * @memberof proto_opuent
         * @interface IGetAllServerStatReq
         * @property {number} serverCat GetAllServerStatReq serverCat
         */

        /**
         * Constructs a new GetAllServerStatReq.
         * @memberof proto_opuent
         * @classdesc Represents a GetAllServerStatReq.
         * @implements IGetAllServerStatReq
         * @constructor
         * @param {proto_opuent.IGetAllServerStatReq=} [properties] Properties to set
         */
        function GetAllServerStatReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GetAllServerStatReq serverCat.
         * @member {number} serverCat
         * @memberof proto_opuent.GetAllServerStatReq
         * @instance
         */
        GetAllServerStatReq.prototype.serverCat = 0;

        /**
         * Creates a new GetAllServerStatReq instance using the specified properties.
         * @function create
         * @memberof proto_opuent.GetAllServerStatReq
         * @static
         * @param {proto_opuent.IGetAllServerStatReq=} [properties] Properties to set
         * @returns {proto_opuent.GetAllServerStatReq} GetAllServerStatReq instance
         */
        GetAllServerStatReq.create = function create(properties) {
            return new GetAllServerStatReq(properties);
        };

        /**
         * Encodes the specified GetAllServerStatReq message. Does not implicitly {@link proto_opuent.GetAllServerStatReq.verify|verify} messages.
         * @function encode
         * @memberof proto_opuent.GetAllServerStatReq
         * @static
         * @param {proto_opuent.IGetAllServerStatReq} message GetAllServerStatReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetAllServerStatReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 5 =*/13).fixed32(message.serverCat);
            return writer;
        };

        /**
         * Encodes the specified GetAllServerStatReq message, length delimited. Does not implicitly {@link proto_opuent.GetAllServerStatReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_opuent.GetAllServerStatReq
         * @static
         * @param {proto_opuent.IGetAllServerStatReq} message GetAllServerStatReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetAllServerStatReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GetAllServerStatReq message from the specified reader or buffer.
         * @function decode
         * @memberof proto_opuent.GetAllServerStatReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_opuent.GetAllServerStatReq} GetAllServerStatReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetAllServerStatReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_opuent.GetAllServerStatReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.serverCat = reader.fixed32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("serverCat"))
                throw $util.ProtocolError("missing required 'serverCat'", { instance: message });
            return message;
        };

        /**
         * Decodes a GetAllServerStatReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_opuent.GetAllServerStatReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_opuent.GetAllServerStatReq} GetAllServerStatReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetAllServerStatReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GetAllServerStatReq message.
         * @function verify
         * @memberof proto_opuent.GetAllServerStatReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetAllServerStatReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.serverCat))
                return "serverCat: integer expected";
            return null;
        };

        /**
         * Creates a GetAllServerStatReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_opuent.GetAllServerStatReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_opuent.GetAllServerStatReq} GetAllServerStatReq
         */
        GetAllServerStatReq.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_opuent.GetAllServerStatReq)
                return object;
            var message = new $root.proto_opuent.GetAllServerStatReq();
            if (object.serverCat != null)
                message.serverCat = object.serverCat >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a GetAllServerStatReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_opuent.GetAllServerStatReq
         * @static
         * @param {proto_opuent.GetAllServerStatReq} message GetAllServerStatReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetAllServerStatReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.serverCat = 0;
            if (message.serverCat != null && message.hasOwnProperty("serverCat"))
                object.serverCat = message.serverCat;
            return object;
        };

        /**
         * Converts this GetAllServerStatReq to JSON.
         * @function toJSON
         * @memberof proto_opuent.GetAllServerStatReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetAllServerStatReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return GetAllServerStatReq;
    })();

    proto_opuent.GetAllServerStatAns = (function() {

        /**
         * Properties of a GetAllServerStatAns.
         * @memberof proto_opuent
         * @interface IGetAllServerStatAns
         * @property {Array.<proto_opuent.GetAllServerStatAns.IServerInfo>|null} [serverList] GetAllServerStatAns serverList
         */

        /**
         * Constructs a new GetAllServerStatAns.
         * @memberof proto_opuent
         * @classdesc Represents a GetAllServerStatAns.
         * @implements IGetAllServerStatAns
         * @constructor
         * @param {proto_opuent.IGetAllServerStatAns=} [properties] Properties to set
         */
        function GetAllServerStatAns(properties) {
            this.serverList = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GetAllServerStatAns serverList.
         * @member {Array.<proto_opuent.GetAllServerStatAns.IServerInfo>} serverList
         * @memberof proto_opuent.GetAllServerStatAns
         * @instance
         */
        GetAllServerStatAns.prototype.serverList = $util.emptyArray;

        /**
         * Creates a new GetAllServerStatAns instance using the specified properties.
         * @function create
         * @memberof proto_opuent.GetAllServerStatAns
         * @static
         * @param {proto_opuent.IGetAllServerStatAns=} [properties] Properties to set
         * @returns {proto_opuent.GetAllServerStatAns} GetAllServerStatAns instance
         */
        GetAllServerStatAns.create = function create(properties) {
            return new GetAllServerStatAns(properties);
        };

        /**
         * Encodes the specified GetAllServerStatAns message. Does not implicitly {@link proto_opuent.GetAllServerStatAns.verify|verify} messages.
         * @function encode
         * @memberof proto_opuent.GetAllServerStatAns
         * @static
         * @param {proto_opuent.IGetAllServerStatAns} message GetAllServerStatAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetAllServerStatAns.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.serverList != null && message.serverList.length)
                for (var i = 0; i < message.serverList.length; ++i)
                    $root.proto_opuent.GetAllServerStatAns.ServerInfo.encode(message.serverList[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified GetAllServerStatAns message, length delimited. Does not implicitly {@link proto_opuent.GetAllServerStatAns.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto_opuent.GetAllServerStatAns
         * @static
         * @param {proto_opuent.IGetAllServerStatAns} message GetAllServerStatAns message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetAllServerStatAns.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GetAllServerStatAns message from the specified reader or buffer.
         * @function decode
         * @memberof proto_opuent.GetAllServerStatAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto_opuent.GetAllServerStatAns} GetAllServerStatAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetAllServerStatAns.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_opuent.GetAllServerStatAns();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.serverList && message.serverList.length))
                        message.serverList = [];
                    message.serverList.push($root.proto_opuent.GetAllServerStatAns.ServerInfo.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GetAllServerStatAns message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto_opuent.GetAllServerStatAns
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto_opuent.GetAllServerStatAns} GetAllServerStatAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetAllServerStatAns.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GetAllServerStatAns message.
         * @function verify
         * @memberof proto_opuent.GetAllServerStatAns
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetAllServerStatAns.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.serverList != null && message.hasOwnProperty("serverList")) {
                if (!Array.isArray(message.serverList))
                    return "serverList: array expected";
                for (var i = 0; i < message.serverList.length; ++i) {
                    var error = $root.proto_opuent.GetAllServerStatAns.ServerInfo.verify(message.serverList[i]);
                    if (error)
                        return "serverList." + error;
                }
            }
            return null;
        };

        /**
         * Creates a GetAllServerStatAns message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto_opuent.GetAllServerStatAns
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto_opuent.GetAllServerStatAns} GetAllServerStatAns
         */
        GetAllServerStatAns.fromObject = function fromObject(object) {
            if (object instanceof $root.proto_opuent.GetAllServerStatAns)
                return object;
            var message = new $root.proto_opuent.GetAllServerStatAns();
            if (object.serverList) {
                if (!Array.isArray(object.serverList))
                    throw TypeError(".proto_opuent.GetAllServerStatAns.serverList: array expected");
                message.serverList = [];
                for (var i = 0; i < object.serverList.length; ++i) {
                    if (typeof object.serverList[i] !== "object")
                        throw TypeError(".proto_opuent.GetAllServerStatAns.serverList: object expected");
                    message.serverList[i] = $root.proto_opuent.GetAllServerStatAns.ServerInfo.fromObject(object.serverList[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a GetAllServerStatAns message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto_opuent.GetAllServerStatAns
         * @static
         * @param {proto_opuent.GetAllServerStatAns} message GetAllServerStatAns
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetAllServerStatAns.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.serverList = [];
            if (message.serverList && message.serverList.length) {
                object.serverList = [];
                for (var j = 0; j < message.serverList.length; ++j)
                    object.serverList[j] = $root.proto_opuent.GetAllServerStatAns.ServerInfo.toObject(message.serverList[j], options);
            }
            return object;
        };

        /**
         * Converts this GetAllServerStatAns to JSON.
         * @function toJSON
         * @memberof proto_opuent.GetAllServerStatAns
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetAllServerStatAns.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        GetAllServerStatAns.ServerInfo = (function() {

            /**
             * Properties of a ServerInfo.
             * @memberof proto_opuent.GetAllServerStatAns
             * @interface IServerInfo
             * @property {number} serverId ServerInfo serverId
             * @property {number} lastMsg ServerInfo lastMsg
             * @property {number} ip ServerInfo ip
             * @property {number} port ServerInfo port
             */

            /**
             * Constructs a new ServerInfo.
             * @memberof proto_opuent.GetAllServerStatAns
             * @classdesc Represents a ServerInfo.
             * @implements IServerInfo
             * @constructor
             * @param {proto_opuent.GetAllServerStatAns.IServerInfo=} [properties] Properties to set
             */
            function ServerInfo(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ServerInfo serverId.
             * @member {number} serverId
             * @memberof proto_opuent.GetAllServerStatAns.ServerInfo
             * @instance
             */
            ServerInfo.prototype.serverId = 0;

            /**
             * ServerInfo lastMsg.
             * @member {number} lastMsg
             * @memberof proto_opuent.GetAllServerStatAns.ServerInfo
             * @instance
             */
            ServerInfo.prototype.lastMsg = 0;

            /**
             * ServerInfo ip.
             * @member {number} ip
             * @memberof proto_opuent.GetAllServerStatAns.ServerInfo
             * @instance
             */
            ServerInfo.prototype.ip = 0;

            /**
             * ServerInfo port.
             * @member {number} port
             * @memberof proto_opuent.GetAllServerStatAns.ServerInfo
             * @instance
             */
            ServerInfo.prototype.port = 0;

            /**
             * Creates a new ServerInfo instance using the specified properties.
             * @function create
             * @memberof proto_opuent.GetAllServerStatAns.ServerInfo
             * @static
             * @param {proto_opuent.GetAllServerStatAns.IServerInfo=} [properties] Properties to set
             * @returns {proto_opuent.GetAllServerStatAns.ServerInfo} ServerInfo instance
             */
            ServerInfo.create = function create(properties) {
                return new ServerInfo(properties);
            };

            /**
             * Encodes the specified ServerInfo message. Does not implicitly {@link proto_opuent.GetAllServerStatAns.ServerInfo.verify|verify} messages.
             * @function encode
             * @memberof proto_opuent.GetAllServerStatAns.ServerInfo
             * @static
             * @param {proto_opuent.GetAllServerStatAns.IServerInfo} message ServerInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ServerInfo.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                writer.uint32(/* id 1, wireType 5 =*/13).fixed32(message.serverId);
                writer.uint32(/* id 2, wireType 5 =*/21).fixed32(message.lastMsg);
                writer.uint32(/* id 3, wireType 5 =*/29).fixed32(message.ip);
                writer.uint32(/* id 4, wireType 5 =*/37).fixed32(message.port);
                return writer;
            };

            /**
             * Encodes the specified ServerInfo message, length delimited. Does not implicitly {@link proto_opuent.GetAllServerStatAns.ServerInfo.verify|verify} messages.
             * @function encodeDelimited
             * @memberof proto_opuent.GetAllServerStatAns.ServerInfo
             * @static
             * @param {proto_opuent.GetAllServerStatAns.IServerInfo} message ServerInfo message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ServerInfo.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ServerInfo message from the specified reader or buffer.
             * @function decode
             * @memberof proto_opuent.GetAllServerStatAns.ServerInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {proto_opuent.GetAllServerStatAns.ServerInfo} ServerInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ServerInfo.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto_opuent.GetAllServerStatAns.ServerInfo();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.serverId = reader.fixed32();
                        break;
                    case 2:
                        message.lastMsg = reader.fixed32();
                        break;
                    case 3:
                        message.ip = reader.fixed32();
                        break;
                    case 4:
                        message.port = reader.fixed32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                if (!message.hasOwnProperty("serverId"))
                    throw $util.ProtocolError("missing required 'serverId'", { instance: message });
                if (!message.hasOwnProperty("lastMsg"))
                    throw $util.ProtocolError("missing required 'lastMsg'", { instance: message });
                if (!message.hasOwnProperty("ip"))
                    throw $util.ProtocolError("missing required 'ip'", { instance: message });
                if (!message.hasOwnProperty("port"))
                    throw $util.ProtocolError("missing required 'port'", { instance: message });
                return message;
            };

            /**
             * Decodes a ServerInfo message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof proto_opuent.GetAllServerStatAns.ServerInfo
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {proto_opuent.GetAllServerStatAns.ServerInfo} ServerInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ServerInfo.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ServerInfo message.
             * @function verify
             * @memberof proto_opuent.GetAllServerStatAns.ServerInfo
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ServerInfo.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (!$util.isInteger(message.serverId))
                    return "serverId: integer expected";
                if (!$util.isInteger(message.lastMsg))
                    return "lastMsg: integer expected";
                if (!$util.isInteger(message.ip))
                    return "ip: integer expected";
                if (!$util.isInteger(message.port))
                    return "port: integer expected";
                return null;
            };

            /**
             * Creates a ServerInfo message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof proto_opuent.GetAllServerStatAns.ServerInfo
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {proto_opuent.GetAllServerStatAns.ServerInfo} ServerInfo
             */
            ServerInfo.fromObject = function fromObject(object) {
                if (object instanceof $root.proto_opuent.GetAllServerStatAns.ServerInfo)
                    return object;
                var message = new $root.proto_opuent.GetAllServerStatAns.ServerInfo();
                if (object.serverId != null)
                    message.serverId = object.serverId >>> 0;
                if (object.lastMsg != null)
                    message.lastMsg = object.lastMsg >>> 0;
                if (object.ip != null)
                    message.ip = object.ip >>> 0;
                if (object.port != null)
                    message.port = object.port >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a ServerInfo message. Also converts values to other types if specified.
             * @function toObject
             * @memberof proto_opuent.GetAllServerStatAns.ServerInfo
             * @static
             * @param {proto_opuent.GetAllServerStatAns.ServerInfo} message ServerInfo
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ServerInfo.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.serverId = 0;
                    object.lastMsg = 0;
                    object.ip = 0;
                    object.port = 0;
                }
                if (message.serverId != null && message.hasOwnProperty("serverId"))
                    object.serverId = message.serverId;
                if (message.lastMsg != null && message.hasOwnProperty("lastMsg"))
                    object.lastMsg = message.lastMsg;
                if (message.ip != null && message.hasOwnProperty("ip"))
                    object.ip = message.ip;
                if (message.port != null && message.hasOwnProperty("port"))
                    object.port = message.port;
                return object;
            };

            /**
             * Converts this ServerInfo to JSON.
             * @function toJSON
             * @memberof proto_opuent.GetAllServerStatAns.ServerInfo
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ServerInfo.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return ServerInfo;
        })();

        return GetAllServerStatAns;
    })();

    return proto_opuent;
})();

module.exports = $root;
