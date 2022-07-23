import * as $protobuf from "protobufjs";
/** Namespace proto_oparb. */
export namespace proto_oparb {

    /** Properties of an opmsg. */
    interface Iopmsg {

        /** opmsg senderGusid */
        senderGusid?: (number|null);

        /** opmsg receiverGusid */
        receiverGusid?: (number|null);

        /** opmsg jobType */
        jobType?: (proto_oparb.opmsg.JobType|null);

        /** opmsg jobId */
        jobId?: (number|Long|null);

        /** opmsg gufid */
        gufid?: (number|null);

        /** opmsg execType */
        execType?: (proto_oparb.opmsg.ExecType|null);

        /** opmsg castTargetUserGroupSn */
        castTargetUserGroupSn?: (number|null);

        /** opmsg sessionKey */
        sessionKey?: (Uint8Array|null);

        /** opmsg arguments */
        "arguments"?: (proto_oparb.opmsg.IArgument[]|null);

        /** opmsg resultCode */
        resultCode?: (number|null);

        /** opmsg resultScalar */
        resultScalar?: (Uint8Array|null);

        /** opmsg resultSets */
        resultSets?: (proto_oparb.opmsg.IResultSet[]|null);

        /** opmsg blob */
        blob?: (Uint8Array|null);
    }

    /** Represents an opmsg. */
    class opmsg implements Iopmsg {

        /**
         * Constructs a new opmsg.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.Iopmsg);

        /** opmsg senderGusid. */
        public senderGusid: number;

        /** opmsg receiverGusid. */
        public receiverGusid: number;

        /** opmsg jobType. */
        public jobType: proto_oparb.opmsg.JobType;

        /** opmsg jobId. */
        public jobId: (number|Long);

        /** opmsg gufid. */
        public gufid: number;

        /** opmsg execType. */
        public execType: proto_oparb.opmsg.ExecType;

        /** opmsg castTargetUserGroupSn. */
        public castTargetUserGroupSn: number;

        /** opmsg sessionKey. */
        public sessionKey: Uint8Array;

        /** opmsg arguments. */
        public arguments: proto_oparb.opmsg.IArgument[];

        /** opmsg resultCode. */
        public resultCode: number;

        /** opmsg resultScalar. */
        public resultScalar: Uint8Array;

        /** opmsg resultSets. */
        public resultSets: proto_oparb.opmsg.IResultSet[];

        /** opmsg blob. */
        public blob: Uint8Array;

        /**
         * Creates a new opmsg instance using the specified properties.
         * @param [properties] Properties to set
         * @returns opmsg instance
         */
        public static create(properties?: proto_oparb.Iopmsg): proto_oparb.opmsg;

        /**
         * Encodes the specified opmsg message. Does not implicitly {@link proto_oparb.opmsg.verify|verify} messages.
         * @param message opmsg message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.Iopmsg, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified opmsg message, length delimited. Does not implicitly {@link proto_oparb.opmsg.verify|verify} messages.
         * @param message opmsg message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.Iopmsg, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an opmsg message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns opmsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.opmsg;

        /**
         * Decodes an opmsg message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns opmsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.opmsg;

        /**
         * Verifies an opmsg message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an opmsg message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns opmsg
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.opmsg;

        /**
         * Creates a plain object from an opmsg message. Also converts values to other types if specified.
         * @param message opmsg
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.opmsg, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this opmsg to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace opmsg {

        /** JobType enum. */
        enum JobType {
            REQUEST = 1,
            RESPONSE = 2,
            NOTICE = 3
        }

        /** ExecType enum. */
        enum ExecType {
            EXECUTE = 1,
            CAST = 2
        }

        /** Properties of an Argument. */
        interface IArgument {

            /** Argument name */
            name?: (Uint8Array|null);

            /** Argument value */
            value: Uint8Array;
        }

        /** Represents an Argument. */
        class Argument implements IArgument {

            /**
             * Constructs a new Argument.
             * @param [properties] Properties to set
             */
            constructor(properties?: proto_oparb.opmsg.IArgument);

            /** Argument name. */
            public name: Uint8Array;

            /** Argument value. */
            public value: Uint8Array;

            /**
             * Creates a new Argument instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Argument instance
             */
            public static create(properties?: proto_oparb.opmsg.IArgument): proto_oparb.opmsg.Argument;

            /**
             * Encodes the specified Argument message. Does not implicitly {@link proto_oparb.opmsg.Argument.verify|verify} messages.
             * @param message Argument message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: proto_oparb.opmsg.IArgument, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Argument message, length delimited. Does not implicitly {@link proto_oparb.opmsg.Argument.verify|verify} messages.
             * @param message Argument message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: proto_oparb.opmsg.IArgument, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Argument message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Argument
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.opmsg.Argument;

            /**
             * Decodes an Argument message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Argument
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.opmsg.Argument;

            /**
             * Verifies an Argument message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Argument message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Argument
             */
            public static fromObject(object: { [k: string]: any }): proto_oparb.opmsg.Argument;

            /**
             * Creates a plain object from an Argument message. Also converts values to other types if specified.
             * @param message Argument
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: proto_oparb.opmsg.Argument, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Argument to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a ResultSet. */
        interface IResultSet {

            /** ResultSet columnNames */
            columnNames?: (Uint8Array[]|null);

            /** ResultSet rows */
            rows?: (proto_oparb.opmsg.ResultSet.IRow[]|null);

            /** ResultSet totalCount */
            totalCount?: (number|null);
        }

        /** Represents a ResultSet. */
        class ResultSet implements IResultSet {

            /**
             * Constructs a new ResultSet.
             * @param [properties] Properties to set
             */
            constructor(properties?: proto_oparb.opmsg.IResultSet);

            /** ResultSet columnNames. */
            public columnNames: Uint8Array[];

            /** ResultSet rows. */
            public rows: proto_oparb.opmsg.ResultSet.IRow[];

            /** ResultSet totalCount. */
            public totalCount: number;

            /**
             * Creates a new ResultSet instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ResultSet instance
             */
            public static create(properties?: proto_oparb.opmsg.IResultSet): proto_oparb.opmsg.ResultSet;

            /**
             * Encodes the specified ResultSet message. Does not implicitly {@link proto_oparb.opmsg.ResultSet.verify|verify} messages.
             * @param message ResultSet message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: proto_oparb.opmsg.IResultSet, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ResultSet message, length delimited. Does not implicitly {@link proto_oparb.opmsg.ResultSet.verify|verify} messages.
             * @param message ResultSet message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: proto_oparb.opmsg.IResultSet, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ResultSet message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ResultSet
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.opmsg.ResultSet;

            /**
             * Decodes a ResultSet message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ResultSet
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.opmsg.ResultSet;

            /**
             * Verifies a ResultSet message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ResultSet message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ResultSet
             */
            public static fromObject(object: { [k: string]: any }): proto_oparb.opmsg.ResultSet;

            /**
             * Creates a plain object from a ResultSet message. Also converts values to other types if specified.
             * @param message ResultSet
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: proto_oparb.opmsg.ResultSet, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ResultSet to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        namespace ResultSet {

            /** Properties of a Row. */
            interface IRow {

                /** Row values */
                values?: (Uint8Array[]|null);
            }

            /** Represents a Row. */
            class Row implements IRow {

                /**
                 * Constructs a new Row.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: proto_oparb.opmsg.ResultSet.IRow);

                /** Row values. */
                public values: Uint8Array[];

                /**
                 * Creates a new Row instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Row instance
                 */
                public static create(properties?: proto_oparb.opmsg.ResultSet.IRow): proto_oparb.opmsg.ResultSet.Row;

                /**
                 * Encodes the specified Row message. Does not implicitly {@link proto_oparb.opmsg.ResultSet.Row.verify|verify} messages.
                 * @param message Row message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: proto_oparb.opmsg.ResultSet.IRow, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Row message, length delimited. Does not implicitly {@link proto_oparb.opmsg.ResultSet.Row.verify|verify} messages.
                 * @param message Row message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: proto_oparb.opmsg.ResultSet.IRow, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Row message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Row
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.opmsg.ResultSet.Row;

                /**
                 * Decodes a Row message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Row
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.opmsg.ResultSet.Row;

                /**
                 * Verifies a Row message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Row message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Row
                 */
                public static fromObject(object: { [k: string]: any }): proto_oparb.opmsg.ResultSet.Row;

                /**
                 * Creates a plain object from a Row message. Also converts values to other types if specified.
                 * @param message Row
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: proto_oparb.opmsg.ResultSet.Row, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Row to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }
        }
    }

    /** Properties of a KickUserReq. */
    interface IKickUserReq {

        /** KickUserReq userSrl */
        userSrl: (number|Long);

        /** KickUserReq kickCode */
        kickCode: number;
    }

    /** Represents a KickUserReq. */
    class KickUserReq implements IKickUserReq {

        /**
         * Constructs a new KickUserReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.IKickUserReq);

        /** KickUserReq userSrl. */
        public userSrl: (number|Long);

        /** KickUserReq kickCode. */
        public kickCode: number;

        /**
         * Creates a new KickUserReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns KickUserReq instance
         */
        public static create(properties?: proto_oparb.IKickUserReq): proto_oparb.KickUserReq;

        /**
         * Encodes the specified KickUserReq message. Does not implicitly {@link proto_oparb.KickUserReq.verify|verify} messages.
         * @param message KickUserReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.IKickUserReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified KickUserReq message, length delimited. Does not implicitly {@link proto_oparb.KickUserReq.verify|verify} messages.
         * @param message KickUserReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.IKickUserReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a KickUserReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns KickUserReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.KickUserReq;

        /**
         * Decodes a KickUserReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns KickUserReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.KickUserReq;

        /**
         * Verifies a KickUserReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a KickUserReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns KickUserReq
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.KickUserReq;

        /**
         * Creates a plain object from a KickUserReq message. Also converts values to other types if specified.
         * @param message KickUserReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.KickUserReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this KickUserReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a KickUserAns. */
    interface IKickUserAns {

        /** KickUserAns result */
        result: proto_oparb.KickUserAns.result_type;
    }

    /** Represents a KickUserAns. */
    class KickUserAns implements IKickUserAns {

        /**
         * Constructs a new KickUserAns.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.IKickUserAns);

        /** KickUserAns result. */
        public result: proto_oparb.KickUserAns.result_type;

        /**
         * Creates a new KickUserAns instance using the specified properties.
         * @param [properties] Properties to set
         * @returns KickUserAns instance
         */
        public static create(properties?: proto_oparb.IKickUserAns): proto_oparb.KickUserAns;

        /**
         * Encodes the specified KickUserAns message. Does not implicitly {@link proto_oparb.KickUserAns.verify|verify} messages.
         * @param message KickUserAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.IKickUserAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified KickUserAns message, length delimited. Does not implicitly {@link proto_oparb.KickUserAns.verify|verify} messages.
         * @param message KickUserAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.IKickUserAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a KickUserAns message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns KickUserAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.KickUserAns;

        /**
         * Decodes a KickUserAns message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns KickUserAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.KickUserAns;

        /**
         * Verifies a KickUserAns message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a KickUserAns message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns KickUserAns
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.KickUserAns;

        /**
         * Creates a plain object from a KickUserAns message. Also converts values to other types if specified.
         * @param message KickUserAns
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.KickUserAns, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this KickUserAns to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace KickUserAns {

        /** result_type enum. */
        enum result_type {
            SUCCESS = 0,
            FAILED = 1,
            NOT_EXIST = 2
        }
    }

    /** Properties of a SendMessageReq. */
    interface ISendMessageReq {

        /** SendMessageReq userSrl */
        userSrl: (number|Long);

        /** SendMessageReq message */
        message: Uint8Array;
    }

    /** Represents a SendMessageReq. */
    class SendMessageReq implements ISendMessageReq {

        /**
         * Constructs a new SendMessageReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.ISendMessageReq);

        /** SendMessageReq userSrl. */
        public userSrl: (number|Long);

        /** SendMessageReq message. */
        public message: Uint8Array;

        /**
         * Creates a new SendMessageReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SendMessageReq instance
         */
        public static create(properties?: proto_oparb.ISendMessageReq): proto_oparb.SendMessageReq;

        /**
         * Encodes the specified SendMessageReq message. Does not implicitly {@link proto_oparb.SendMessageReq.verify|verify} messages.
         * @param message SendMessageReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.ISendMessageReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SendMessageReq message, length delimited. Does not implicitly {@link proto_oparb.SendMessageReq.verify|verify} messages.
         * @param message SendMessageReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.ISendMessageReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SendMessageReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SendMessageReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.SendMessageReq;

        /**
         * Decodes a SendMessageReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SendMessageReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.SendMessageReq;

        /**
         * Verifies a SendMessageReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SendMessageReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SendMessageReq
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.SendMessageReq;

        /**
         * Creates a plain object from a SendMessageReq message. Also converts values to other types if specified.
         * @param message SendMessageReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.SendMessageReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SendMessageReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SendMessageAns. */
    interface ISendMessageAns {

        /** SendMessageAns result */
        result: proto_oparb.SendMessageAns.result_type;
    }

    /** Represents a SendMessageAns. */
    class SendMessageAns implements ISendMessageAns {

        /**
         * Constructs a new SendMessageAns.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.ISendMessageAns);

        /** SendMessageAns result. */
        public result: proto_oparb.SendMessageAns.result_type;

        /**
         * Creates a new SendMessageAns instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SendMessageAns instance
         */
        public static create(properties?: proto_oparb.ISendMessageAns): proto_oparb.SendMessageAns;

        /**
         * Encodes the specified SendMessageAns message. Does not implicitly {@link proto_oparb.SendMessageAns.verify|verify} messages.
         * @param message SendMessageAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.ISendMessageAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SendMessageAns message, length delimited. Does not implicitly {@link proto_oparb.SendMessageAns.verify|verify} messages.
         * @param message SendMessageAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.ISendMessageAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SendMessageAns message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SendMessageAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.SendMessageAns;

        /**
         * Decodes a SendMessageAns message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SendMessageAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.SendMessageAns;

        /**
         * Verifies a SendMessageAns message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SendMessageAns message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SendMessageAns
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.SendMessageAns;

        /**
         * Creates a plain object from a SendMessageAns message. Also converts values to other types if specified.
         * @param message SendMessageAns
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.SendMessageAns, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SendMessageAns to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace SendMessageAns {

        /** result_type enum. */
        enum result_type {
            SUCCESS = 0,
            FAILED = 1,
            NOT_EXIST = 2
        }
    }

    /** Properties of a BulkKickReq. */
    interface IBulkKickReq {

        /** BulkKickReq kickCode */
        kickCode: number;

        /** BulkKickReq filter */
        filter: number;

        /** BulkKickReq filterMask */
        filterMask: number;
    }

    /** Represents a BulkKickReq. */
    class BulkKickReq implements IBulkKickReq {

        /**
         * Constructs a new BulkKickReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.IBulkKickReq);

        /** BulkKickReq kickCode. */
        public kickCode: number;

        /** BulkKickReq filter. */
        public filter: number;

        /** BulkKickReq filterMask. */
        public filterMask: number;

        /**
         * Creates a new BulkKickReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BulkKickReq instance
         */
        public static create(properties?: proto_oparb.IBulkKickReq): proto_oparb.BulkKickReq;

        /**
         * Encodes the specified BulkKickReq message. Does not implicitly {@link proto_oparb.BulkKickReq.verify|verify} messages.
         * @param message BulkKickReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.IBulkKickReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BulkKickReq message, length delimited. Does not implicitly {@link proto_oparb.BulkKickReq.verify|verify} messages.
         * @param message BulkKickReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.IBulkKickReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BulkKickReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BulkKickReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.BulkKickReq;

        /**
         * Decodes a BulkKickReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BulkKickReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.BulkKickReq;

        /**
         * Verifies a BulkKickReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a BulkKickReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns BulkKickReq
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.BulkKickReq;

        /**
         * Creates a plain object from a BulkKickReq message. Also converts values to other types if specified.
         * @param message BulkKickReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.BulkKickReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this BulkKickReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a BulkKickAns. */
    interface IBulkKickAns {

        /** BulkKickAns userCnt */
        userCnt: number;
    }

    /** Represents a BulkKickAns. */
    class BulkKickAns implements IBulkKickAns {

        /**
         * Constructs a new BulkKickAns.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.IBulkKickAns);

        /** BulkKickAns userCnt. */
        public userCnt: number;

        /**
         * Creates a new BulkKickAns instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BulkKickAns instance
         */
        public static create(properties?: proto_oparb.IBulkKickAns): proto_oparb.BulkKickAns;

        /**
         * Encodes the specified BulkKickAns message. Does not implicitly {@link proto_oparb.BulkKickAns.verify|verify} messages.
         * @param message BulkKickAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.IBulkKickAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BulkKickAns message, length delimited. Does not implicitly {@link proto_oparb.BulkKickAns.verify|verify} messages.
         * @param message BulkKickAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.IBulkKickAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BulkKickAns message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BulkKickAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.BulkKickAns;

        /**
         * Decodes a BulkKickAns message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BulkKickAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.BulkKickAns;

        /**
         * Verifies a BulkKickAns message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a BulkKickAns message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns BulkKickAns
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.BulkKickAns;

        /**
         * Creates a plain object from a BulkKickAns message. Also converts values to other types if specified.
         * @param message BulkKickAns
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.BulkKickAns, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this BulkKickAns to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a DeniedChatUserReq. */
    interface IDeniedChatUserReq {

        /** DeniedChatUserReq userSrl */
        userSrl: (number|Long);

        /** DeniedChatUserReq endDatetime */
        endDatetime: number;
    }

    /** Represents a DeniedChatUserReq. */
    class DeniedChatUserReq implements IDeniedChatUserReq {

        /**
         * Constructs a new DeniedChatUserReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.IDeniedChatUserReq);

        /** DeniedChatUserReq userSrl. */
        public userSrl: (number|Long);

        /** DeniedChatUserReq endDatetime. */
        public endDatetime: number;

        /**
         * Creates a new DeniedChatUserReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DeniedChatUserReq instance
         */
        public static create(properties?: proto_oparb.IDeniedChatUserReq): proto_oparb.DeniedChatUserReq;

        /**
         * Encodes the specified DeniedChatUserReq message. Does not implicitly {@link proto_oparb.DeniedChatUserReq.verify|verify} messages.
         * @param message DeniedChatUserReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.IDeniedChatUserReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DeniedChatUserReq message, length delimited. Does not implicitly {@link proto_oparb.DeniedChatUserReq.verify|verify} messages.
         * @param message DeniedChatUserReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.IDeniedChatUserReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DeniedChatUserReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DeniedChatUserReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.DeniedChatUserReq;

        /**
         * Decodes a DeniedChatUserReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DeniedChatUserReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.DeniedChatUserReq;

        /**
         * Verifies a DeniedChatUserReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DeniedChatUserReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DeniedChatUserReq
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.DeniedChatUserReq;

        /**
         * Creates a plain object from a DeniedChatUserReq message. Also converts values to other types if specified.
         * @param message DeniedChatUserReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.DeniedChatUserReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DeniedChatUserReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a DeniedChatUserAns. */
    interface IDeniedChatUserAns {

        /** DeniedChatUserAns result */
        result: proto_oparb.DeniedChatUserAns.result_type;
    }

    /** Represents a DeniedChatUserAns. */
    class DeniedChatUserAns implements IDeniedChatUserAns {

        /**
         * Constructs a new DeniedChatUserAns.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.IDeniedChatUserAns);

        /** DeniedChatUserAns result. */
        public result: proto_oparb.DeniedChatUserAns.result_type;

        /**
         * Creates a new DeniedChatUserAns instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DeniedChatUserAns instance
         */
        public static create(properties?: proto_oparb.IDeniedChatUserAns): proto_oparb.DeniedChatUserAns;

        /**
         * Encodes the specified DeniedChatUserAns message. Does not implicitly {@link proto_oparb.DeniedChatUserAns.verify|verify} messages.
         * @param message DeniedChatUserAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.IDeniedChatUserAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DeniedChatUserAns message, length delimited. Does not implicitly {@link proto_oparb.DeniedChatUserAns.verify|verify} messages.
         * @param message DeniedChatUserAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.IDeniedChatUserAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DeniedChatUserAns message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DeniedChatUserAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.DeniedChatUserAns;

        /**
         * Decodes a DeniedChatUserAns message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DeniedChatUserAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.DeniedChatUserAns;

        /**
         * Verifies a DeniedChatUserAns message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DeniedChatUserAns message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DeniedChatUserAns
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.DeniedChatUserAns;

        /**
         * Creates a plain object from a DeniedChatUserAns message. Also converts values to other types if specified.
         * @param message DeniedChatUserAns
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.DeniedChatUserAns, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DeniedChatUserAns to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace DeniedChatUserAns {

        /** result_type enum. */
        enum result_type {
            SUCCESS = 0,
            FAILED = 1,
            NOT_EXIST = 2
        }
    }

    /** Properties of an AddRemainingMinReq. */
    interface IAddRemainingMinReq {

        /** AddRemainingMinReq userSrl */
        userSrl: (number|Long);

        /** AddRemainingMinReq remainingMin */
        remainingMin: number;
    }

    /** Represents an AddRemainingMinReq. */
    class AddRemainingMinReq implements IAddRemainingMinReq {

        /**
         * Constructs a new AddRemainingMinReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.IAddRemainingMinReq);

        /** AddRemainingMinReq userSrl. */
        public userSrl: (number|Long);

        /** AddRemainingMinReq remainingMin. */
        public remainingMin: number;

        /**
         * Creates a new AddRemainingMinReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AddRemainingMinReq instance
         */
        public static create(properties?: proto_oparb.IAddRemainingMinReq): proto_oparb.AddRemainingMinReq;

        /**
         * Encodes the specified AddRemainingMinReq message. Does not implicitly {@link proto_oparb.AddRemainingMinReq.verify|verify} messages.
         * @param message AddRemainingMinReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.IAddRemainingMinReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AddRemainingMinReq message, length delimited. Does not implicitly {@link proto_oparb.AddRemainingMinReq.verify|verify} messages.
         * @param message AddRemainingMinReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.IAddRemainingMinReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AddRemainingMinReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AddRemainingMinReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.AddRemainingMinReq;

        /**
         * Decodes an AddRemainingMinReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AddRemainingMinReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.AddRemainingMinReq;

        /**
         * Verifies an AddRemainingMinReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AddRemainingMinReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AddRemainingMinReq
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.AddRemainingMinReq;

        /**
         * Creates a plain object from an AddRemainingMinReq message. Also converts values to other types if specified.
         * @param message AddRemainingMinReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.AddRemainingMinReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AddRemainingMinReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an AddRemainingMinAns. */
    interface IAddRemainingMinAns {

        /** AddRemainingMinAns result */
        result: proto_oparb.AddRemainingMinAns.result_type;
    }

    /** Represents an AddRemainingMinAns. */
    class AddRemainingMinAns implements IAddRemainingMinAns {

        /**
         * Constructs a new AddRemainingMinAns.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.IAddRemainingMinAns);

        /** AddRemainingMinAns result. */
        public result: proto_oparb.AddRemainingMinAns.result_type;

        /**
         * Creates a new AddRemainingMinAns instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AddRemainingMinAns instance
         */
        public static create(properties?: proto_oparb.IAddRemainingMinAns): proto_oparb.AddRemainingMinAns;

        /**
         * Encodes the specified AddRemainingMinAns message. Does not implicitly {@link proto_oparb.AddRemainingMinAns.verify|verify} messages.
         * @param message AddRemainingMinAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.IAddRemainingMinAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AddRemainingMinAns message, length delimited. Does not implicitly {@link proto_oparb.AddRemainingMinAns.verify|verify} messages.
         * @param message AddRemainingMinAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.IAddRemainingMinAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AddRemainingMinAns message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AddRemainingMinAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.AddRemainingMinAns;

        /**
         * Decodes an AddRemainingMinAns message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AddRemainingMinAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.AddRemainingMinAns;

        /**
         * Verifies an AddRemainingMinAns message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AddRemainingMinAns message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AddRemainingMinAns
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.AddRemainingMinAns;

        /**
         * Creates a plain object from an AddRemainingMinAns message. Also converts values to other types if specified.
         * @param message AddRemainingMinAns
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.AddRemainingMinAns, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AddRemainingMinAns to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace AddRemainingMinAns {

        /** result_type enum. */
        enum result_type {
            SUCCESS = 0,
            FAILED = 1,
            NOT_EXIST = 2
        }
    }

    /** Properties of a PingReq. */
    interface IPingReq {
    }

    /** Represents a PingReq. */
    class PingReq implements IPingReq {

        /**
         * Constructs a new PingReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.IPingReq);

        /**
         * Creates a new PingReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PingReq instance
         */
        public static create(properties?: proto_oparb.IPingReq): proto_oparb.PingReq;

        /**
         * Encodes the specified PingReq message. Does not implicitly {@link proto_oparb.PingReq.verify|verify} messages.
         * @param message PingReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.IPingReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PingReq message, length delimited. Does not implicitly {@link proto_oparb.PingReq.verify|verify} messages.
         * @param message PingReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.IPingReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PingReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PingReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.PingReq;

        /**
         * Decodes a PingReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PingReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.PingReq;

        /**
         * Verifies a PingReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PingReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PingReq
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.PingReq;

        /**
         * Creates a plain object from a PingReq message. Also converts values to other types if specified.
         * @param message PingReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.PingReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PingReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PingAns. */
    interface IPingAns {

        /** PingAns time */
        time: number;

        /** PingAns value1 */
        value1: number;

        /** PingAns value2 */
        value2: number;

        /** PingAns optValues */
        optValues?: (number[]|null);
    }

    /** Represents a PingAns. */
    class PingAns implements IPingAns {

        /**
         * Constructs a new PingAns.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.IPingAns);

        /** PingAns time. */
        public time: number;

        /** PingAns value1. */
        public value1: number;

        /** PingAns value2. */
        public value2: number;

        /** PingAns optValues. */
        public optValues: number[];

        /**
         * Creates a new PingAns instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PingAns instance
         */
        public static create(properties?: proto_oparb.IPingAns): proto_oparb.PingAns;

        /**
         * Encodes the specified PingAns message. Does not implicitly {@link proto_oparb.PingAns.verify|verify} messages.
         * @param message PingAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.IPingAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PingAns message, length delimited. Does not implicitly {@link proto_oparb.PingAns.verify|verify} messages.
         * @param message PingAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.IPingAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PingAns message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PingAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.PingAns;

        /**
         * Decodes a PingAns message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PingAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.PingAns;

        /**
         * Verifies a PingAns message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PingAns message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PingAns
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.PingAns;

        /**
         * Creates a plain object from a PingAns message. Also converts values to other types if specified.
         * @param message PingAns
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.PingAns, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PingAns to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an UpdateServerStatNoti. */
    interface IUpdateServerStatNoti {
    }

    /** Represents an UpdateServerStatNoti. */
    class UpdateServerStatNoti implements IUpdateServerStatNoti {

        /**
         * Constructs a new UpdateServerStatNoti.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.IUpdateServerStatNoti);

        /**
         * Creates a new UpdateServerStatNoti instance using the specified properties.
         * @param [properties] Properties to set
         * @returns UpdateServerStatNoti instance
         */
        public static create(properties?: proto_oparb.IUpdateServerStatNoti): proto_oparb.UpdateServerStatNoti;

        /**
         * Encodes the specified UpdateServerStatNoti message. Does not implicitly {@link proto_oparb.UpdateServerStatNoti.verify|verify} messages.
         * @param message UpdateServerStatNoti message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.IUpdateServerStatNoti, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified UpdateServerStatNoti message, length delimited. Does not implicitly {@link proto_oparb.UpdateServerStatNoti.verify|verify} messages.
         * @param message UpdateServerStatNoti message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.IUpdateServerStatNoti, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an UpdateServerStatNoti message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns UpdateServerStatNoti
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.UpdateServerStatNoti;

        /**
         * Decodes an UpdateServerStatNoti message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns UpdateServerStatNoti
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.UpdateServerStatNoti;

        /**
         * Verifies an UpdateServerStatNoti message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an UpdateServerStatNoti message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns UpdateServerStatNoti
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.UpdateServerStatNoti;

        /**
         * Creates a plain object from an UpdateServerStatNoti message. Also converts values to other types if specified.
         * @param message UpdateServerStatNoti
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.UpdateServerStatNoti, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this UpdateServerStatNoti to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a BoxNotiUserReq. */
    interface IBoxNotiUserReq {

        /** BoxNotiUserReq userSrl */
        userSrl: (number|Long);

        /** BoxNotiUserReq charSrl */
        charSrl: number;
    }

    /** Represents a BoxNotiUserReq. */
    class BoxNotiUserReq implements IBoxNotiUserReq {

        /**
         * Constructs a new BoxNotiUserReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.IBoxNotiUserReq);

        /** BoxNotiUserReq userSrl. */
        public userSrl: (number|Long);

        /** BoxNotiUserReq charSrl. */
        public charSrl: number;

        /**
         * Creates a new BoxNotiUserReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BoxNotiUserReq instance
         */
        public static create(properties?: proto_oparb.IBoxNotiUserReq): proto_oparb.BoxNotiUserReq;

        /**
         * Encodes the specified BoxNotiUserReq message. Does not implicitly {@link proto_oparb.BoxNotiUserReq.verify|verify} messages.
         * @param message BoxNotiUserReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.IBoxNotiUserReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BoxNotiUserReq message, length delimited. Does not implicitly {@link proto_oparb.BoxNotiUserReq.verify|verify} messages.
         * @param message BoxNotiUserReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.IBoxNotiUserReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BoxNotiUserReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BoxNotiUserReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.BoxNotiUserReq;

        /**
         * Decodes a BoxNotiUserReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BoxNotiUserReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.BoxNotiUserReq;

        /**
         * Verifies a BoxNotiUserReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a BoxNotiUserReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns BoxNotiUserReq
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.BoxNotiUserReq;

        /**
         * Creates a plain object from a BoxNotiUserReq message. Also converts values to other types if specified.
         * @param message BoxNotiUserReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.BoxNotiUserReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this BoxNotiUserReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a BoxNotiUserAns. */
    interface IBoxNotiUserAns {

        /** BoxNotiUserAns result */
        result: proto_oparb.BoxNotiUserAns.result_type;
    }

    /** Represents a BoxNotiUserAns. */
    class BoxNotiUserAns implements IBoxNotiUserAns {

        /**
         * Constructs a new BoxNotiUserAns.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.IBoxNotiUserAns);

        /** BoxNotiUserAns result. */
        public result: proto_oparb.BoxNotiUserAns.result_type;

        /**
         * Creates a new BoxNotiUserAns instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BoxNotiUserAns instance
         */
        public static create(properties?: proto_oparb.IBoxNotiUserAns): proto_oparb.BoxNotiUserAns;

        /**
         * Encodes the specified BoxNotiUserAns message. Does not implicitly {@link proto_oparb.BoxNotiUserAns.verify|verify} messages.
         * @param message BoxNotiUserAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.IBoxNotiUserAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BoxNotiUserAns message, length delimited. Does not implicitly {@link proto_oparb.BoxNotiUserAns.verify|verify} messages.
         * @param message BoxNotiUserAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.IBoxNotiUserAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BoxNotiUserAns message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BoxNotiUserAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.BoxNotiUserAns;

        /**
         * Decodes a BoxNotiUserAns message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BoxNotiUserAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.BoxNotiUserAns;

        /**
         * Verifies a BoxNotiUserAns message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a BoxNotiUserAns message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns BoxNotiUserAns
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.BoxNotiUserAns;

        /**
         * Creates a plain object from a BoxNotiUserAns message. Also converts values to other types if specified.
         * @param message BoxNotiUserAns
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.BoxNotiUserAns, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this BoxNotiUserAns to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace BoxNotiUserAns {

        /** result_type enum. */
        enum result_type {
            SUCCESS = 0,
            FAILED = 1,
            NOT_EXIST = 2
        }
    }

    /** Properties of a SvrMsgReq. */
    interface ISvrMsgReq {

        /** SvrMsgReq contents */
        contents: Uint8Array;
    }

    /** Represents a SvrMsgReq. */
    class SvrMsgReq implements ISvrMsgReq {

        /**
         * Constructs a new SvrMsgReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.ISvrMsgReq);

        /** SvrMsgReq contents. */
        public contents: Uint8Array;

        /**
         * Creates a new SvrMsgReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SvrMsgReq instance
         */
        public static create(properties?: proto_oparb.ISvrMsgReq): proto_oparb.SvrMsgReq;

        /**
         * Encodes the specified SvrMsgReq message. Does not implicitly {@link proto_oparb.SvrMsgReq.verify|verify} messages.
         * @param message SvrMsgReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.ISvrMsgReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SvrMsgReq message, length delimited. Does not implicitly {@link proto_oparb.SvrMsgReq.verify|verify} messages.
         * @param message SvrMsgReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.ISvrMsgReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SvrMsgReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SvrMsgReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.SvrMsgReq;

        /**
         * Decodes a SvrMsgReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SvrMsgReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.SvrMsgReq;

        /**
         * Verifies a SvrMsgReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SvrMsgReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SvrMsgReq
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.SvrMsgReq;

        /**
         * Creates a plain object from a SvrMsgReq message. Also converts values to other types if specified.
         * @param message SvrMsgReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.SvrMsgReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SvrMsgReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SvrMsgAns. */
    interface ISvrMsgAns {

        /** SvrMsgAns result */
        result: boolean;
    }

    /** Represents a SvrMsgAns. */
    class SvrMsgAns implements ISvrMsgAns {

        /**
         * Constructs a new SvrMsgAns.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.ISvrMsgAns);

        /** SvrMsgAns result. */
        public result: boolean;

        /**
         * Creates a new SvrMsgAns instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SvrMsgAns instance
         */
        public static create(properties?: proto_oparb.ISvrMsgAns): proto_oparb.SvrMsgAns;

        /**
         * Encodes the specified SvrMsgAns message. Does not implicitly {@link proto_oparb.SvrMsgAns.verify|verify} messages.
         * @param message SvrMsgAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.ISvrMsgAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SvrMsgAns message, length delimited. Does not implicitly {@link proto_oparb.SvrMsgAns.verify|verify} messages.
         * @param message SvrMsgAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.ISvrMsgAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SvrMsgAns message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SvrMsgAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.SvrMsgAns;

        /**
         * Decodes a SvrMsgAns message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SvrMsgAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.SvrMsgAns;

        /**
         * Verifies a SvrMsgAns message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SvrMsgAns message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SvrMsgAns
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.SvrMsgAns;

        /**
         * Creates a plain object from a SvrMsgAns message. Also converts values to other types if specified.
         * @param message SvrMsgAns
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.SvrMsgAns, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SvrMsgAns to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a CharTransQueryReq. */
    interface ICharTransQueryReq {

        /** CharTransQueryReq charSrl */
        charSrl: number;
    }

    /** Represents a CharTransQueryReq. */
    class CharTransQueryReq implements ICharTransQueryReq {

        /**
         * Constructs a new CharTransQueryReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.ICharTransQueryReq);

        /** CharTransQueryReq charSrl. */
        public charSrl: number;

        /**
         * Creates a new CharTransQueryReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CharTransQueryReq instance
         */
        public static create(properties?: proto_oparb.ICharTransQueryReq): proto_oparb.CharTransQueryReq;

        /**
         * Encodes the specified CharTransQueryReq message. Does not implicitly {@link proto_oparb.CharTransQueryReq.verify|verify} messages.
         * @param message CharTransQueryReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.ICharTransQueryReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CharTransQueryReq message, length delimited. Does not implicitly {@link proto_oparb.CharTransQueryReq.verify|verify} messages.
         * @param message CharTransQueryReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.ICharTransQueryReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CharTransQueryReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CharTransQueryReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.CharTransQueryReq;

        /**
         * Decodes a CharTransQueryReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CharTransQueryReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.CharTransQueryReq;

        /**
         * Verifies a CharTransQueryReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CharTransQueryReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CharTransQueryReq
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.CharTransQueryReq;

        /**
         * Creates a plain object from a CharTransQueryReq message. Also converts values to other types if specified.
         * @param message CharTransQueryReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.CharTransQueryReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CharTransQueryReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a CharTransQueryAns. */
    interface ICharTransQueryAns {

        /** CharTransQueryAns money */
        money: (number|Long);

        /** CharTransQueryAns level */
        level: number;

        /** CharTransQueryAns code */
        code: number;
    }

    /** Represents a CharTransQueryAns. */
    class CharTransQueryAns implements ICharTransQueryAns {

        /**
         * Constructs a new CharTransQueryAns.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.ICharTransQueryAns);

        /** CharTransQueryAns money. */
        public money: (number|Long);

        /** CharTransQueryAns level. */
        public level: number;

        /** CharTransQueryAns code. */
        public code: number;

        /**
         * Creates a new CharTransQueryAns instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CharTransQueryAns instance
         */
        public static create(properties?: proto_oparb.ICharTransQueryAns): proto_oparb.CharTransQueryAns;

        /**
         * Encodes the specified CharTransQueryAns message. Does not implicitly {@link proto_oparb.CharTransQueryAns.verify|verify} messages.
         * @param message CharTransQueryAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.ICharTransQueryAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CharTransQueryAns message, length delimited. Does not implicitly {@link proto_oparb.CharTransQueryAns.verify|verify} messages.
         * @param message CharTransQueryAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.ICharTransQueryAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CharTransQueryAns message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CharTransQueryAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.CharTransQueryAns;

        /**
         * Decodes a CharTransQueryAns message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CharTransQueryAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.CharTransQueryAns;

        /**
         * Verifies a CharTransQueryAns message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CharTransQueryAns message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CharTransQueryAns
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.CharTransQueryAns;

        /**
         * Creates a plain object from a CharTransQueryAns message. Also converts values to other types if specified.
         * @param message CharTransQueryAns
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.CharTransQueryAns, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CharTransQueryAns to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a CharTransExecReq. */
    interface ICharTransExecReq {

        /** CharTransExecReq charSrl */
        charSrl: number;

        /** CharTransExecReq destArb */
        destArb: number;

        /** CharTransExecReq moneyMax */
        moneyMax: (number|Long);

        /** CharTransExecReq levelMin */
        levelMin: number;
    }

    /** Represents a CharTransExecReq. */
    class CharTransExecReq implements ICharTransExecReq {

        /**
         * Constructs a new CharTransExecReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.ICharTransExecReq);

        /** CharTransExecReq charSrl. */
        public charSrl: number;

        /** CharTransExecReq destArb. */
        public destArb: number;

        /** CharTransExecReq moneyMax. */
        public moneyMax: (number|Long);

        /** CharTransExecReq levelMin. */
        public levelMin: number;

        /**
         * Creates a new CharTransExecReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CharTransExecReq instance
         */
        public static create(properties?: proto_oparb.ICharTransExecReq): proto_oparb.CharTransExecReq;

        /**
         * Encodes the specified CharTransExecReq message. Does not implicitly {@link proto_oparb.CharTransExecReq.verify|verify} messages.
         * @param message CharTransExecReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.ICharTransExecReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CharTransExecReq message, length delimited. Does not implicitly {@link proto_oparb.CharTransExecReq.verify|verify} messages.
         * @param message CharTransExecReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.ICharTransExecReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CharTransExecReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CharTransExecReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.CharTransExecReq;

        /**
         * Decodes a CharTransExecReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CharTransExecReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.CharTransExecReq;

        /**
         * Verifies a CharTransExecReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CharTransExecReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CharTransExecReq
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.CharTransExecReq;

        /**
         * Creates a plain object from a CharTransExecReq message. Also converts values to other types if specified.
         * @param message CharTransExecReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.CharTransExecReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CharTransExecReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a CharTransExecAns. */
    interface ICharTransExecAns {

        /** CharTransExecAns newCharSrl */
        newCharSrl: number;

        /** CharTransExecAns code */
        code: number;
    }

    /** Represents a CharTransExecAns. */
    class CharTransExecAns implements ICharTransExecAns {

        /**
         * Constructs a new CharTransExecAns.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.ICharTransExecAns);

        /** CharTransExecAns newCharSrl. */
        public newCharSrl: number;

        /** CharTransExecAns code. */
        public code: number;

        /**
         * Creates a new CharTransExecAns instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CharTransExecAns instance
         */
        public static create(properties?: proto_oparb.ICharTransExecAns): proto_oparb.CharTransExecAns;

        /**
         * Encodes the specified CharTransExecAns message. Does not implicitly {@link proto_oparb.CharTransExecAns.verify|verify} messages.
         * @param message CharTransExecAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.ICharTransExecAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CharTransExecAns message, length delimited. Does not implicitly {@link proto_oparb.CharTransExecAns.verify|verify} messages.
         * @param message CharTransExecAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.ICharTransExecAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CharTransExecAns message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CharTransExecAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.CharTransExecAns;

        /**
         * Decodes a CharTransExecAns message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CharTransExecAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.CharTransExecAns;

        /**
         * Verifies a CharTransExecAns message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CharTransExecAns message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CharTransExecAns
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.CharTransExecAns;

        /**
         * Creates a plain object from a CharTransExecAns message. Also converts values to other types if specified.
         * @param message CharTransExecAns
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.CharTransExecAns, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CharTransExecAns to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SendRefreshBillNoti. */
    interface ISendRefreshBillNoti {

        /** SendRefreshBillNoti userSrl */
        userSrl: (number|Long);
    }

    /** Represents a SendRefreshBillNoti. */
    class SendRefreshBillNoti implements ISendRefreshBillNoti {

        /**
         * Constructs a new SendRefreshBillNoti.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.ISendRefreshBillNoti);

        /** SendRefreshBillNoti userSrl. */
        public userSrl: (number|Long);

        /**
         * Creates a new SendRefreshBillNoti instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SendRefreshBillNoti instance
         */
        public static create(properties?: proto_oparb.ISendRefreshBillNoti): proto_oparb.SendRefreshBillNoti;

        /**
         * Encodes the specified SendRefreshBillNoti message. Does not implicitly {@link proto_oparb.SendRefreshBillNoti.verify|verify} messages.
         * @param message SendRefreshBillNoti message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.ISendRefreshBillNoti, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SendRefreshBillNoti message, length delimited. Does not implicitly {@link proto_oparb.SendRefreshBillNoti.verify|verify} messages.
         * @param message SendRefreshBillNoti message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.ISendRefreshBillNoti, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SendRefreshBillNoti message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SendRefreshBillNoti
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.SendRefreshBillNoti;

        /**
         * Decodes a SendRefreshBillNoti message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SendRefreshBillNoti
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.SendRefreshBillNoti;

        /**
         * Verifies a SendRefreshBillNoti message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SendRefreshBillNoti message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SendRefreshBillNoti
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.SendRefreshBillNoti;

        /**
         * Creates a plain object from a SendRefreshBillNoti message. Also converts values to other types if specified.
         * @param message SendRefreshBillNoti
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.SendRefreshBillNoti, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SendRefreshBillNoti to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SendCommandNoti. */
    interface ISendCommandNoti {

        /** SendCommandNoti userSrl */
        userSrl: (number|Long);

        /** SendCommandNoti command */
        command: number;

        /** SendCommandNoti value */
        value: number;

        /** SendCommandNoti value2 */
        value2?: (number|null);
    }

    /** Represents a SendCommandNoti. */
    class SendCommandNoti implements ISendCommandNoti {

        /**
         * Constructs a new SendCommandNoti.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.ISendCommandNoti);

        /** SendCommandNoti userSrl. */
        public userSrl: (number|Long);

        /** SendCommandNoti command. */
        public command: number;

        /** SendCommandNoti value. */
        public value: number;

        /** SendCommandNoti value2. */
        public value2: number;

        /**
         * Creates a new SendCommandNoti instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SendCommandNoti instance
         */
        public static create(properties?: proto_oparb.ISendCommandNoti): proto_oparb.SendCommandNoti;

        /**
         * Encodes the specified SendCommandNoti message. Does not implicitly {@link proto_oparb.SendCommandNoti.verify|verify} messages.
         * @param message SendCommandNoti message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.ISendCommandNoti, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SendCommandNoti message, length delimited. Does not implicitly {@link proto_oparb.SendCommandNoti.verify|verify} messages.
         * @param message SendCommandNoti message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.ISendCommandNoti, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SendCommandNoti message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SendCommandNoti
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.SendCommandNoti;

        /**
         * Decodes a SendCommandNoti message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SendCommandNoti
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.SendCommandNoti;

        /**
         * Verifies a SendCommandNoti message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SendCommandNoti message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SendCommandNoti
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.SendCommandNoti;

        /**
         * Creates a plain object from a SendCommandNoti message. Also converts values to other types if specified.
         * @param message SendCommandNoti
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.SendCommandNoti, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SendCommandNoti to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a CharNameBanReq. */
    interface ICharNameBanReq {

        /** CharNameBanReq charSrl */
        charSrl: number;

        /** CharNameBanReq code */
        code: number;
    }

    /** Represents a CharNameBanReq. */
    class CharNameBanReq implements ICharNameBanReq {

        /**
         * Constructs a new CharNameBanReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.ICharNameBanReq);

        /** CharNameBanReq charSrl. */
        public charSrl: number;

        /** CharNameBanReq code. */
        public code: number;

        /**
         * Creates a new CharNameBanReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CharNameBanReq instance
         */
        public static create(properties?: proto_oparb.ICharNameBanReq): proto_oparb.CharNameBanReq;

        /**
         * Encodes the specified CharNameBanReq message. Does not implicitly {@link proto_oparb.CharNameBanReq.verify|verify} messages.
         * @param message CharNameBanReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.ICharNameBanReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CharNameBanReq message, length delimited. Does not implicitly {@link proto_oparb.CharNameBanReq.verify|verify} messages.
         * @param message CharNameBanReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.ICharNameBanReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CharNameBanReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CharNameBanReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.CharNameBanReq;

        /**
         * Decodes a CharNameBanReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CharNameBanReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.CharNameBanReq;

        /**
         * Verifies a CharNameBanReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CharNameBanReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CharNameBanReq
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.CharNameBanReq;

        /**
         * Creates a plain object from a CharNameBanReq message. Also converts values to other types if specified.
         * @param message CharNameBanReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.CharNameBanReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CharNameBanReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a CharNameBanAns. */
    interface ICharNameBanAns {

        /** CharNameBanAns result */
        result: proto_oparb.CharNameBanAns.result_type;
    }

    /** Represents a CharNameBanAns. */
    class CharNameBanAns implements ICharNameBanAns {

        /**
         * Constructs a new CharNameBanAns.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.ICharNameBanAns);

        /** CharNameBanAns result. */
        public result: proto_oparb.CharNameBanAns.result_type;

        /**
         * Creates a new CharNameBanAns instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CharNameBanAns instance
         */
        public static create(properties?: proto_oparb.ICharNameBanAns): proto_oparb.CharNameBanAns;

        /**
         * Encodes the specified CharNameBanAns message. Does not implicitly {@link proto_oparb.CharNameBanAns.verify|verify} messages.
         * @param message CharNameBanAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.ICharNameBanAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CharNameBanAns message, length delimited. Does not implicitly {@link proto_oparb.CharNameBanAns.verify|verify} messages.
         * @param message CharNameBanAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.ICharNameBanAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CharNameBanAns message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CharNameBanAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.CharNameBanAns;

        /**
         * Decodes a CharNameBanAns message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CharNameBanAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.CharNameBanAns;

        /**
         * Verifies a CharNameBanAns message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CharNameBanAns message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CharNameBanAns
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.CharNameBanAns;

        /**
         * Creates a plain object from a CharNameBanAns message. Also converts values to other types if specified.
         * @param message CharNameBanAns
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.CharNameBanAns, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CharNameBanAns to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace CharNameBanAns {

        /** result_type enum. */
        enum result_type {
            SUCCESS = 0,
            FAILED = 1,
            NOT_EXIST = 2
        }
    }

    /** Properties of a GuildNameBanReq. */
    interface IGuildNameBanReq {

        /** GuildNameBanReq guildSrl */
        guildSrl: number;
    }

    /** Represents a GuildNameBanReq. */
    class GuildNameBanReq implements IGuildNameBanReq {

        /**
         * Constructs a new GuildNameBanReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.IGuildNameBanReq);

        /** GuildNameBanReq guildSrl. */
        public guildSrl: number;

        /**
         * Creates a new GuildNameBanReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GuildNameBanReq instance
         */
        public static create(properties?: proto_oparb.IGuildNameBanReq): proto_oparb.GuildNameBanReq;

        /**
         * Encodes the specified GuildNameBanReq message. Does not implicitly {@link proto_oparb.GuildNameBanReq.verify|verify} messages.
         * @param message GuildNameBanReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.IGuildNameBanReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GuildNameBanReq message, length delimited. Does not implicitly {@link proto_oparb.GuildNameBanReq.verify|verify} messages.
         * @param message GuildNameBanReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.IGuildNameBanReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GuildNameBanReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GuildNameBanReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.GuildNameBanReq;

        /**
         * Decodes a GuildNameBanReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GuildNameBanReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.GuildNameBanReq;

        /**
         * Verifies a GuildNameBanReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GuildNameBanReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GuildNameBanReq
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.GuildNameBanReq;

        /**
         * Creates a plain object from a GuildNameBanReq message. Also converts values to other types if specified.
         * @param message GuildNameBanReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.GuildNameBanReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GuildNameBanReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a GuildNameBanAns. */
    interface IGuildNameBanAns {

        /** GuildNameBanAns result */
        result: proto_oparb.GuildNameBanAns.result_type;
    }

    /** Represents a GuildNameBanAns. */
    class GuildNameBanAns implements IGuildNameBanAns {

        /**
         * Constructs a new GuildNameBanAns.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.IGuildNameBanAns);

        /** GuildNameBanAns result. */
        public result: proto_oparb.GuildNameBanAns.result_type;

        /**
         * Creates a new GuildNameBanAns instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GuildNameBanAns instance
         */
        public static create(properties?: proto_oparb.IGuildNameBanAns): proto_oparb.GuildNameBanAns;

        /**
         * Encodes the specified GuildNameBanAns message. Does not implicitly {@link proto_oparb.GuildNameBanAns.verify|verify} messages.
         * @param message GuildNameBanAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.IGuildNameBanAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GuildNameBanAns message, length delimited. Does not implicitly {@link proto_oparb.GuildNameBanAns.verify|verify} messages.
         * @param message GuildNameBanAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.IGuildNameBanAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GuildNameBanAns message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GuildNameBanAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.GuildNameBanAns;

        /**
         * Decodes a GuildNameBanAns message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GuildNameBanAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.GuildNameBanAns;

        /**
         * Verifies a GuildNameBanAns message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GuildNameBanAns message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GuildNameBanAns
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.GuildNameBanAns;

        /**
         * Creates a plain object from a GuildNameBanAns message. Also converts values to other types if specified.
         * @param message GuildNameBanAns
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.GuildNameBanAns, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GuildNameBanAns to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace GuildNameBanAns {

        /** result_type enum. */
        enum result_type {
            SUCCESS = 0,
            FAILED = 1,
            NOT_EXIST = 2
        }
    }

    /** Properties of a CreateBoxReq. */
    interface ICreateBoxReq {

        /** CreateBoxReq userSrl */
        userSrl: (number|Long);

        /** CreateBoxReq svrId */
        svrId?: (number|null);

        /** CreateBoxReq charSrl */
        charSrl?: (number|null);

        /** CreateBoxReq validDuration */
        validDuration?: (number|null);

        /** CreateBoxReq title */
        title?: (string|null);

        /** CreateBoxReq content */
        content?: (string|null);

        /** CreateBoxReq icon */
        icon?: (string|null);

        /** CreateBoxReq transactionId */
        transactionId?: (number|Long|null);

        /** CreateBoxReq startValid */
        startValid?: (number|null);

        /** CreateBoxReq gameModeId */
        gameModeId?: (number|null);

        /** CreateBoxReq items */
        items?: (proto_oparb.CreateBoxReq.IItemList[]|null);
    }

    /** Represents a CreateBoxReq. */
    class CreateBoxReq implements ICreateBoxReq {

        /**
         * Constructs a new CreateBoxReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.ICreateBoxReq);

        /** CreateBoxReq userSrl. */
        public userSrl: (number|Long);

        /** CreateBoxReq svrId. */
        public svrId: number;

        /** CreateBoxReq charSrl. */
        public charSrl: number;

        /** CreateBoxReq validDuration. */
        public validDuration: number;

        /** CreateBoxReq title. */
        public title: string;

        /** CreateBoxReq content. */
        public content: string;

        /** CreateBoxReq icon. */
        public icon: string;

        /** CreateBoxReq transactionId. */
        public transactionId: (number|Long);

        /** CreateBoxReq startValid. */
        public startValid: number;

        /** CreateBoxReq gameModeId. */
        public gameModeId: number;

        /** CreateBoxReq items. */
        public items: proto_oparb.CreateBoxReq.IItemList[];

        /**
         * Creates a new CreateBoxReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CreateBoxReq instance
         */
        public static create(properties?: proto_oparb.ICreateBoxReq): proto_oparb.CreateBoxReq;

        /**
         * Encodes the specified CreateBoxReq message. Does not implicitly {@link proto_oparb.CreateBoxReq.verify|verify} messages.
         * @param message CreateBoxReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.ICreateBoxReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CreateBoxReq message, length delimited. Does not implicitly {@link proto_oparb.CreateBoxReq.verify|verify} messages.
         * @param message CreateBoxReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.ICreateBoxReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CreateBoxReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CreateBoxReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.CreateBoxReq;

        /**
         * Decodes a CreateBoxReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CreateBoxReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.CreateBoxReq;

        /**
         * Verifies a CreateBoxReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CreateBoxReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CreateBoxReq
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.CreateBoxReq;

        /**
         * Creates a plain object from a CreateBoxReq message. Also converts values to other types if specified.
         * @param message CreateBoxReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.CreateBoxReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CreateBoxReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace CreateBoxReq {

        /** Properties of an ItemList. */
        interface IItemList {

            /** ItemList itemId */
            itemId: number;

            /** ItemList count */
            count: number;
        }

        /** Represents an ItemList. */
        class ItemList implements IItemList {

            /**
             * Constructs a new ItemList.
             * @param [properties] Properties to set
             */
            constructor(properties?: proto_oparb.CreateBoxReq.IItemList);

            /** ItemList itemId. */
            public itemId: number;

            /** ItemList count. */
            public count: number;

            /**
             * Creates a new ItemList instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ItemList instance
             */
            public static create(properties?: proto_oparb.CreateBoxReq.IItemList): proto_oparb.CreateBoxReq.ItemList;

            /**
             * Encodes the specified ItemList message. Does not implicitly {@link proto_oparb.CreateBoxReq.ItemList.verify|verify} messages.
             * @param message ItemList message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: proto_oparb.CreateBoxReq.IItemList, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ItemList message, length delimited. Does not implicitly {@link proto_oparb.CreateBoxReq.ItemList.verify|verify} messages.
             * @param message ItemList message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: proto_oparb.CreateBoxReq.IItemList, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an ItemList message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ItemList
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.CreateBoxReq.ItemList;

            /**
             * Decodes an ItemList message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ItemList
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.CreateBoxReq.ItemList;

            /**
             * Verifies an ItemList message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an ItemList message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ItemList
             */
            public static fromObject(object: { [k: string]: any }): proto_oparb.CreateBoxReq.ItemList;

            /**
             * Creates a plain object from an ItemList message. Also converts values to other types if specified.
             * @param message ItemList
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: proto_oparb.CreateBoxReq.ItemList, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ItemList to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }

    /** Properties of a CreateBoxAns. */
    interface ICreateBoxAns {

        /** CreateBoxAns boxId */
        boxId: (number|Long);

        /** CreateBoxAns message */
        message?: (string|null);

        /** CreateBoxAns logId */
        logId?: (number|Long|null);
    }

    /** Represents a CreateBoxAns. */
    class CreateBoxAns implements ICreateBoxAns {

        /**
         * Constructs a new CreateBoxAns.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.ICreateBoxAns);

        /** CreateBoxAns boxId. */
        public boxId: (number|Long);

        /** CreateBoxAns message. */
        public message: string;

        /** CreateBoxAns logId. */
        public logId: (number|Long);

        /**
         * Creates a new CreateBoxAns instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CreateBoxAns instance
         */
        public static create(properties?: proto_oparb.ICreateBoxAns): proto_oparb.CreateBoxAns;

        /**
         * Encodes the specified CreateBoxAns message. Does not implicitly {@link proto_oparb.CreateBoxAns.verify|verify} messages.
         * @param message CreateBoxAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.ICreateBoxAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CreateBoxAns message, length delimited. Does not implicitly {@link proto_oparb.CreateBoxAns.verify|verify} messages.
         * @param message CreateBoxAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.ICreateBoxAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CreateBoxAns message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CreateBoxAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.CreateBoxAns;

        /**
         * Decodes a CreateBoxAns message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CreateBoxAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.CreateBoxAns;

        /**
         * Verifies a CreateBoxAns message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CreateBoxAns message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CreateBoxAns
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.CreateBoxAns;

        /**
         * Creates a plain object from a CreateBoxAns message. Also converts values to other types if specified.
         * @param message CreateBoxAns
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.CreateBoxAns, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CreateBoxAns to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a DisableBoxNoti. */
    interface IDisableBoxNoti {

        /** DisableBoxNoti boxId */
        boxId: (number|Long);
    }

    /** Represents a DisableBoxNoti. */
    class DisableBoxNoti implements IDisableBoxNoti {

        /**
         * Constructs a new DisableBoxNoti.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.IDisableBoxNoti);

        /** DisableBoxNoti boxId. */
        public boxId: (number|Long);

        /**
         * Creates a new DisableBoxNoti instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DisableBoxNoti instance
         */
        public static create(properties?: proto_oparb.IDisableBoxNoti): proto_oparb.DisableBoxNoti;

        /**
         * Encodes the specified DisableBoxNoti message. Does not implicitly {@link proto_oparb.DisableBoxNoti.verify|verify} messages.
         * @param message DisableBoxNoti message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.IDisableBoxNoti, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DisableBoxNoti message, length delimited. Does not implicitly {@link proto_oparb.DisableBoxNoti.verify|verify} messages.
         * @param message DisableBoxNoti message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.IDisableBoxNoti, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DisableBoxNoti message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DisableBoxNoti
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.DisableBoxNoti;

        /**
         * Decodes a DisableBoxNoti message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DisableBoxNoti
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.DisableBoxNoti;

        /**
         * Verifies a DisableBoxNoti message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DisableBoxNoti message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DisableBoxNoti
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.DisableBoxNoti;

        /**
         * Creates a plain object from a DisableBoxNoti message. Also converts values to other types if specified.
         * @param message DisableBoxNoti
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.DisableBoxNoti, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DisableBoxNoti to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a CheckBoxExternalKeyReq. */
    interface ICheckBoxExternalKeyReq {

        /** CheckBoxExternalKeyReq logId */
        logId?: ((number|Long)[]|null);
    }

    /** Represents a CheckBoxExternalKeyReq. */
    class CheckBoxExternalKeyReq implements ICheckBoxExternalKeyReq {

        /**
         * Constructs a new CheckBoxExternalKeyReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.ICheckBoxExternalKeyReq);

        /** CheckBoxExternalKeyReq logId. */
        public logId: (number|Long)[];

        /**
         * Creates a new CheckBoxExternalKeyReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CheckBoxExternalKeyReq instance
         */
        public static create(properties?: proto_oparb.ICheckBoxExternalKeyReq): proto_oparb.CheckBoxExternalKeyReq;

        /**
         * Encodes the specified CheckBoxExternalKeyReq message. Does not implicitly {@link proto_oparb.CheckBoxExternalKeyReq.verify|verify} messages.
         * @param message CheckBoxExternalKeyReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.ICheckBoxExternalKeyReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CheckBoxExternalKeyReq message, length delimited. Does not implicitly {@link proto_oparb.CheckBoxExternalKeyReq.verify|verify} messages.
         * @param message CheckBoxExternalKeyReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.ICheckBoxExternalKeyReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CheckBoxExternalKeyReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CheckBoxExternalKeyReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.CheckBoxExternalKeyReq;

        /**
         * Decodes a CheckBoxExternalKeyReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CheckBoxExternalKeyReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.CheckBoxExternalKeyReq;

        /**
         * Verifies a CheckBoxExternalKeyReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CheckBoxExternalKeyReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CheckBoxExternalKeyReq
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.CheckBoxExternalKeyReq;

        /**
         * Creates a plain object from a CheckBoxExternalKeyReq message. Also converts values to other types if specified.
         * @param message CheckBoxExternalKeyReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.CheckBoxExternalKeyReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CheckBoxExternalKeyReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a CheckBoxExternalKeyAns. */
    interface ICheckBoxExternalKeyAns {

        /** CheckBoxExternalKeyAns logId */
        logId?: ((number|Long)[]|null);

        /** CheckBoxExternalKeyAns boxId */
        boxId?: ((number|Long)[]|null);

        /** CheckBoxExternalKeyAns lastId */
        lastId: (number|Long);
    }

    /** Represents a CheckBoxExternalKeyAns. */
    class CheckBoxExternalKeyAns implements ICheckBoxExternalKeyAns {

        /**
         * Constructs a new CheckBoxExternalKeyAns.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.ICheckBoxExternalKeyAns);

        /** CheckBoxExternalKeyAns logId. */
        public logId: (number|Long)[];

        /** CheckBoxExternalKeyAns boxId. */
        public boxId: (number|Long)[];

        /** CheckBoxExternalKeyAns lastId. */
        public lastId: (number|Long);

        /**
         * Creates a new CheckBoxExternalKeyAns instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CheckBoxExternalKeyAns instance
         */
        public static create(properties?: proto_oparb.ICheckBoxExternalKeyAns): proto_oparb.CheckBoxExternalKeyAns;

        /**
         * Encodes the specified CheckBoxExternalKeyAns message. Does not implicitly {@link proto_oparb.CheckBoxExternalKeyAns.verify|verify} messages.
         * @param message CheckBoxExternalKeyAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.ICheckBoxExternalKeyAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CheckBoxExternalKeyAns message, length delimited. Does not implicitly {@link proto_oparb.CheckBoxExternalKeyAns.verify|verify} messages.
         * @param message CheckBoxExternalKeyAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.ICheckBoxExternalKeyAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CheckBoxExternalKeyAns message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CheckBoxExternalKeyAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.CheckBoxExternalKeyAns;

        /**
         * Decodes a CheckBoxExternalKeyAns message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CheckBoxExternalKeyAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.CheckBoxExternalKeyAns;

        /**
         * Verifies a CheckBoxExternalKeyAns message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CheckBoxExternalKeyAns message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CheckBoxExternalKeyAns
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.CheckBoxExternalKeyAns;

        /**
         * Creates a plain object from a CheckBoxExternalKeyAns message. Also converts values to other types if specified.
         * @param message CheckBoxExternalKeyAns
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.CheckBoxExternalKeyAns, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CheckBoxExternalKeyAns to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a CountBoxReq. */
    interface ICountBoxReq {

        /** CountBoxReq userSrl */
        userSrl: (number|Long);

        /** CountBoxReq svrId */
        svrId?: (number|null);

        /** CountBoxReq charSrl */
        charSrl?: (number|null);
    }

    /** Represents a CountBoxReq. */
    class CountBoxReq implements ICountBoxReq {

        /**
         * Constructs a new CountBoxReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.ICountBoxReq);

        /** CountBoxReq userSrl. */
        public userSrl: (number|Long);

        /** CountBoxReq svrId. */
        public svrId: number;

        /** CountBoxReq charSrl. */
        public charSrl: number;

        /**
         * Creates a new CountBoxReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CountBoxReq instance
         */
        public static create(properties?: proto_oparb.ICountBoxReq): proto_oparb.CountBoxReq;

        /**
         * Encodes the specified CountBoxReq message. Does not implicitly {@link proto_oparb.CountBoxReq.verify|verify} messages.
         * @param message CountBoxReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.ICountBoxReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CountBoxReq message, length delimited. Does not implicitly {@link proto_oparb.CountBoxReq.verify|verify} messages.
         * @param message CountBoxReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.ICountBoxReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CountBoxReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CountBoxReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.CountBoxReq;

        /**
         * Decodes a CountBoxReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CountBoxReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.CountBoxReq;

        /**
         * Verifies a CountBoxReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CountBoxReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CountBoxReq
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.CountBoxReq;

        /**
         * Creates a plain object from a CountBoxReq message. Also converts values to other types if specified.
         * @param message CountBoxReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.CountBoxReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CountBoxReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a CountBoxAns. */
    interface ICountBoxAns {

        /** CountBoxAns count */
        count: number;
    }

    /** Represents a CountBoxAns. */
    class CountBoxAns implements ICountBoxAns {

        /**
         * Constructs a new CountBoxAns.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.ICountBoxAns);

        /** CountBoxAns count. */
        public count: number;

        /**
         * Creates a new CountBoxAns instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CountBoxAns instance
         */
        public static create(properties?: proto_oparb.ICountBoxAns): proto_oparb.CountBoxAns;

        /**
         * Encodes the specified CountBoxAns message. Does not implicitly {@link proto_oparb.CountBoxAns.verify|verify} messages.
         * @param message CountBoxAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.ICountBoxAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CountBoxAns message, length delimited. Does not implicitly {@link proto_oparb.CountBoxAns.verify|verify} messages.
         * @param message CountBoxAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.ICountBoxAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CountBoxAns message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CountBoxAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.CountBoxAns;

        /**
         * Decodes a CountBoxAns message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CountBoxAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.CountBoxAns;

        /**
         * Verifies a CountBoxAns message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CountBoxAns message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CountBoxAns
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.CountBoxAns;

        /**
         * Creates a plain object from a CountBoxAns message. Also converts values to other types if specified.
         * @param message CountBoxAns
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.CountBoxAns, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CountBoxAns to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an UpdateVIPPubExpReq. */
    interface IUpdateVIPPubExpReq {

        /** UpdateVIPPubExpReq userSrl */
        userSrl: (number|Long);

        /** UpdateVIPPubExpReq pubExp */
        pubExp: number;
    }

    /** Represents an UpdateVIPPubExpReq. */
    class UpdateVIPPubExpReq implements IUpdateVIPPubExpReq {

        /**
         * Constructs a new UpdateVIPPubExpReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.IUpdateVIPPubExpReq);

        /** UpdateVIPPubExpReq userSrl. */
        public userSrl: (number|Long);

        /** UpdateVIPPubExpReq pubExp. */
        public pubExp: number;

        /**
         * Creates a new UpdateVIPPubExpReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns UpdateVIPPubExpReq instance
         */
        public static create(properties?: proto_oparb.IUpdateVIPPubExpReq): proto_oparb.UpdateVIPPubExpReq;

        /**
         * Encodes the specified UpdateVIPPubExpReq message. Does not implicitly {@link proto_oparb.UpdateVIPPubExpReq.verify|verify} messages.
         * @param message UpdateVIPPubExpReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.IUpdateVIPPubExpReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified UpdateVIPPubExpReq message, length delimited. Does not implicitly {@link proto_oparb.UpdateVIPPubExpReq.verify|verify} messages.
         * @param message UpdateVIPPubExpReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.IUpdateVIPPubExpReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an UpdateVIPPubExpReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns UpdateVIPPubExpReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.UpdateVIPPubExpReq;

        /**
         * Decodes an UpdateVIPPubExpReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns UpdateVIPPubExpReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.UpdateVIPPubExpReq;

        /**
         * Verifies an UpdateVIPPubExpReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an UpdateVIPPubExpReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns UpdateVIPPubExpReq
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.UpdateVIPPubExpReq;

        /**
         * Creates a plain object from an UpdateVIPPubExpReq message. Also converts values to other types if specified.
         * @param message UpdateVIPPubExpReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.UpdateVIPPubExpReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this UpdateVIPPubExpReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an UpdateVIPPubExpAns. */
    interface IUpdateVIPPubExpAns {

        /** UpdateVIPPubExpAns result */
        result: proto_oparb.UpdateVIPPubExpAns.result_type;
    }

    /** Represents an UpdateVIPPubExpAns. */
    class UpdateVIPPubExpAns implements IUpdateVIPPubExpAns {

        /**
         * Constructs a new UpdateVIPPubExpAns.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.IUpdateVIPPubExpAns);

        /** UpdateVIPPubExpAns result. */
        public result: proto_oparb.UpdateVIPPubExpAns.result_type;

        /**
         * Creates a new UpdateVIPPubExpAns instance using the specified properties.
         * @param [properties] Properties to set
         * @returns UpdateVIPPubExpAns instance
         */
        public static create(properties?: proto_oparb.IUpdateVIPPubExpAns): proto_oparb.UpdateVIPPubExpAns;

        /**
         * Encodes the specified UpdateVIPPubExpAns message. Does not implicitly {@link proto_oparb.UpdateVIPPubExpAns.verify|verify} messages.
         * @param message UpdateVIPPubExpAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.IUpdateVIPPubExpAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified UpdateVIPPubExpAns message, length delimited. Does not implicitly {@link proto_oparb.UpdateVIPPubExpAns.verify|verify} messages.
         * @param message UpdateVIPPubExpAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.IUpdateVIPPubExpAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an UpdateVIPPubExpAns message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns UpdateVIPPubExpAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.UpdateVIPPubExpAns;

        /**
         * Decodes an UpdateVIPPubExpAns message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns UpdateVIPPubExpAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.UpdateVIPPubExpAns;

        /**
         * Verifies an UpdateVIPPubExpAns message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an UpdateVIPPubExpAns message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns UpdateVIPPubExpAns
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.UpdateVIPPubExpAns;

        /**
         * Creates a plain object from an UpdateVIPPubExpAns message. Also converts values to other types if specified.
         * @param message UpdateVIPPubExpAns
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.UpdateVIPPubExpAns, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this UpdateVIPPubExpAns to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace UpdateVIPPubExpAns {

        /** result_type enum. */
        enum result_type {
            SUCCESS = 0,
            FAILED = 1,
            NOT_EXIST = 2
        }
    }

    /** Properties of an AddBenefitReq. */
    interface IAddBenefitReq {

        /** AddBenefitReq userSrl */
        userSrl: (number|Long);

        /** AddBenefitReq benefitId */
        benefitId: number;

        /** AddBenefitReq remainSec */
        remainSec: number;

        /** AddBenefitReq totalSec */
        totalSec?: (number|null);
    }

    /** Represents an AddBenefitReq. */
    class AddBenefitReq implements IAddBenefitReq {

        /**
         * Constructs a new AddBenefitReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.IAddBenefitReq);

        /** AddBenefitReq userSrl. */
        public userSrl: (number|Long);

        /** AddBenefitReq benefitId. */
        public benefitId: number;

        /** AddBenefitReq remainSec. */
        public remainSec: number;

        /** AddBenefitReq totalSec. */
        public totalSec: number;

        /**
         * Creates a new AddBenefitReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AddBenefitReq instance
         */
        public static create(properties?: proto_oparb.IAddBenefitReq): proto_oparb.AddBenefitReq;

        /**
         * Encodes the specified AddBenefitReq message. Does not implicitly {@link proto_oparb.AddBenefitReq.verify|verify} messages.
         * @param message AddBenefitReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.IAddBenefitReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AddBenefitReq message, length delimited. Does not implicitly {@link proto_oparb.AddBenefitReq.verify|verify} messages.
         * @param message AddBenefitReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.IAddBenefitReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AddBenefitReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AddBenefitReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.AddBenefitReq;

        /**
         * Decodes an AddBenefitReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AddBenefitReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.AddBenefitReq;

        /**
         * Verifies an AddBenefitReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AddBenefitReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AddBenefitReq
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.AddBenefitReq;

        /**
         * Creates a plain object from an AddBenefitReq message. Also converts values to other types if specified.
         * @param message AddBenefitReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.AddBenefitReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AddBenefitReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an AddBenefitAns. */
    interface IAddBenefitAns {

        /** AddBenefitAns result */
        result: proto_oparb.AddBenefitAns.result_type;
    }

    /** Represents an AddBenefitAns. */
    class AddBenefitAns implements IAddBenefitAns {

        /**
         * Constructs a new AddBenefitAns.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.IAddBenefitAns);

        /** AddBenefitAns result. */
        public result: proto_oparb.AddBenefitAns.result_type;

        /**
         * Creates a new AddBenefitAns instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AddBenefitAns instance
         */
        public static create(properties?: proto_oparb.IAddBenefitAns): proto_oparb.AddBenefitAns;

        /**
         * Encodes the specified AddBenefitAns message. Does not implicitly {@link proto_oparb.AddBenefitAns.verify|verify} messages.
         * @param message AddBenefitAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.IAddBenefitAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AddBenefitAns message, length delimited. Does not implicitly {@link proto_oparb.AddBenefitAns.verify|verify} messages.
         * @param message AddBenefitAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.IAddBenefitAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AddBenefitAns message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AddBenefitAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.AddBenefitAns;

        /**
         * Decodes an AddBenefitAns message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AddBenefitAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.AddBenefitAns;

        /**
         * Verifies an AddBenefitAns message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AddBenefitAns message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AddBenefitAns
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.AddBenefitAns;

        /**
         * Creates a plain object from an AddBenefitAns message. Also converts values to other types if specified.
         * @param message AddBenefitAns
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.AddBenefitAns, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AddBenefitAns to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace AddBenefitAns {

        /** result_type enum. */
        enum result_type {
            SUCCESS = 0,
            FAILED = 1,
            NOT_EXIST = 2
        }
    }

    /** Properties of a RemoveBenefitReq. */
    interface IRemoveBenefitReq {

        /** RemoveBenefitReq userSrl */
        userSrl: (number|Long);

        /** RemoveBenefitReq benefitId */
        benefitId: number;
    }

    /** Represents a RemoveBenefitReq. */
    class RemoveBenefitReq implements IRemoveBenefitReq {

        /**
         * Constructs a new RemoveBenefitReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.IRemoveBenefitReq);

        /** RemoveBenefitReq userSrl. */
        public userSrl: (number|Long);

        /** RemoveBenefitReq benefitId. */
        public benefitId: number;

        /**
         * Creates a new RemoveBenefitReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RemoveBenefitReq instance
         */
        public static create(properties?: proto_oparb.IRemoveBenefitReq): proto_oparb.RemoveBenefitReq;

        /**
         * Encodes the specified RemoveBenefitReq message. Does not implicitly {@link proto_oparb.RemoveBenefitReq.verify|verify} messages.
         * @param message RemoveBenefitReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.IRemoveBenefitReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RemoveBenefitReq message, length delimited. Does not implicitly {@link proto_oparb.RemoveBenefitReq.verify|verify} messages.
         * @param message RemoveBenefitReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.IRemoveBenefitReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RemoveBenefitReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RemoveBenefitReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.RemoveBenefitReq;

        /**
         * Decodes a RemoveBenefitReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RemoveBenefitReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.RemoveBenefitReq;

        /**
         * Verifies a RemoveBenefitReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RemoveBenefitReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RemoveBenefitReq
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.RemoveBenefitReq;

        /**
         * Creates a plain object from a RemoveBenefitReq message. Also converts values to other types if specified.
         * @param message RemoveBenefitReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.RemoveBenefitReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RemoveBenefitReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a RemoveBenefitAns. */
    interface IRemoveBenefitAns {

        /** RemoveBenefitAns result */
        result: proto_oparb.RemoveBenefitAns.result_type;
    }

    /** Represents a RemoveBenefitAns. */
    class RemoveBenefitAns implements IRemoveBenefitAns {

        /**
         * Constructs a new RemoveBenefitAns.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.IRemoveBenefitAns);

        /** RemoveBenefitAns result. */
        public result: proto_oparb.RemoveBenefitAns.result_type;

        /**
         * Creates a new RemoveBenefitAns instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RemoveBenefitAns instance
         */
        public static create(properties?: proto_oparb.IRemoveBenefitAns): proto_oparb.RemoveBenefitAns;

        /**
         * Encodes the specified RemoveBenefitAns message. Does not implicitly {@link proto_oparb.RemoveBenefitAns.verify|verify} messages.
         * @param message RemoveBenefitAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.IRemoveBenefitAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RemoveBenefitAns message, length delimited. Does not implicitly {@link proto_oparb.RemoveBenefitAns.verify|verify} messages.
         * @param message RemoveBenefitAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.IRemoveBenefitAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RemoveBenefitAns message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RemoveBenefitAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.RemoveBenefitAns;

        /**
         * Decodes a RemoveBenefitAns message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RemoveBenefitAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.RemoveBenefitAns;

        /**
         * Verifies a RemoveBenefitAns message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RemoveBenefitAns message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RemoveBenefitAns
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.RemoveBenefitAns;

        /**
         * Creates a plain object from a RemoveBenefitAns message. Also converts values to other types if specified.
         * @param message RemoveBenefitAns
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.RemoveBenefitAns, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RemoveBenefitAns to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace RemoveBenefitAns {

        /** result_type enum. */
        enum result_type {
            SUCCESS = 0,
            FAILED = 1,
            NOT_EXIST = 2
        }
    }

    /** Properties of a PromotionInfoReq. */
    interface IPromotionInfoReq {

        /** PromotionInfoReq userSrl */
        userSrl: (number|Long);

        /** PromotionInfoReq promotionId */
        promotionId: number;
    }

    /** Represents a PromotionInfoReq. */
    class PromotionInfoReq implements IPromotionInfoReq {

        /**
         * Constructs a new PromotionInfoReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.IPromotionInfoReq);

        /** PromotionInfoReq userSrl. */
        public userSrl: (number|Long);

        /** PromotionInfoReq promotionId. */
        public promotionId: number;

        /**
         * Creates a new PromotionInfoReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PromotionInfoReq instance
         */
        public static create(properties?: proto_oparb.IPromotionInfoReq): proto_oparb.PromotionInfoReq;

        /**
         * Encodes the specified PromotionInfoReq message. Does not implicitly {@link proto_oparb.PromotionInfoReq.verify|verify} messages.
         * @param message PromotionInfoReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.IPromotionInfoReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PromotionInfoReq message, length delimited. Does not implicitly {@link proto_oparb.PromotionInfoReq.verify|verify} messages.
         * @param message PromotionInfoReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.IPromotionInfoReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PromotionInfoReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PromotionInfoReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.PromotionInfoReq;

        /**
         * Decodes a PromotionInfoReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PromotionInfoReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.PromotionInfoReq;

        /**
         * Verifies a PromotionInfoReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PromotionInfoReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PromotionInfoReq
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.PromotionInfoReq;

        /**
         * Creates a plain object from a PromotionInfoReq message. Also converts values to other types if specified.
         * @param message PromotionInfoReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.PromotionInfoReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PromotionInfoReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PromotionInfoAns. */
    interface IPromotionInfoAns {

        /** PromotionInfoAns result */
        result: proto_oparb.PromotionInfoAns.result_type;

        /** PromotionInfoAns values */
        values?: (number[]|null);
    }

    /** Represents a PromotionInfoAns. */
    class PromotionInfoAns implements IPromotionInfoAns {

        /**
         * Constructs a new PromotionInfoAns.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.IPromotionInfoAns);

        /** PromotionInfoAns result. */
        public result: proto_oparb.PromotionInfoAns.result_type;

        /** PromotionInfoAns values. */
        public values: number[];

        /**
         * Creates a new PromotionInfoAns instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PromotionInfoAns instance
         */
        public static create(properties?: proto_oparb.IPromotionInfoAns): proto_oparb.PromotionInfoAns;

        /**
         * Encodes the specified PromotionInfoAns message. Does not implicitly {@link proto_oparb.PromotionInfoAns.verify|verify} messages.
         * @param message PromotionInfoAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.IPromotionInfoAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PromotionInfoAns message, length delimited. Does not implicitly {@link proto_oparb.PromotionInfoAns.verify|verify} messages.
         * @param message PromotionInfoAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.IPromotionInfoAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PromotionInfoAns message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PromotionInfoAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.PromotionInfoAns;

        /**
         * Decodes a PromotionInfoAns message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PromotionInfoAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.PromotionInfoAns;

        /**
         * Verifies a PromotionInfoAns message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PromotionInfoAns message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PromotionInfoAns
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.PromotionInfoAns;

        /**
         * Creates a plain object from a PromotionInfoAns message. Also converts values to other types if specified.
         * @param message PromotionInfoAns
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.PromotionInfoAns, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PromotionInfoAns to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace PromotionInfoAns {

        /** result_type enum. */
        enum result_type {
            SUCCESS = 0,
            FAILED = 1,
            NOT_EXIST = 2
        }
    }

    /** Properties of a QueryCharReq. */
    interface IQueryCharReq {

        /** QueryCharReq userSrl */
        userSrl: (number|Long);
    }

    /** Represents a QueryCharReq. */
    class QueryCharReq implements IQueryCharReq {

        /**
         * Constructs a new QueryCharReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.IQueryCharReq);

        /** QueryCharReq userSrl. */
        public userSrl: (number|Long);

        /**
         * Creates a new QueryCharReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns QueryCharReq instance
         */
        public static create(properties?: proto_oparb.IQueryCharReq): proto_oparb.QueryCharReq;

        /**
         * Encodes the specified QueryCharReq message. Does not implicitly {@link proto_oparb.QueryCharReq.verify|verify} messages.
         * @param message QueryCharReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.IQueryCharReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified QueryCharReq message, length delimited. Does not implicitly {@link proto_oparb.QueryCharReq.verify|verify} messages.
         * @param message QueryCharReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.IQueryCharReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a QueryCharReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns QueryCharReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.QueryCharReq;

        /**
         * Decodes a QueryCharReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns QueryCharReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.QueryCharReq;

        /**
         * Verifies a QueryCharReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a QueryCharReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns QueryCharReq
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.QueryCharReq;

        /**
         * Creates a plain object from a QueryCharReq message. Also converts values to other types if specified.
         * @param message QueryCharReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.QueryCharReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this QueryCharReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a QueryCharAns. */
    interface IQueryCharAns {

        /** QueryCharAns charSrl */
        charSrl: number;
    }

    /** Represents a QueryCharAns. */
    class QueryCharAns implements IQueryCharAns {

        /**
         * Constructs a new QueryCharAns.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.IQueryCharAns);

        /** QueryCharAns charSrl. */
        public charSrl: number;

        /**
         * Creates a new QueryCharAns instance using the specified properties.
         * @param [properties] Properties to set
         * @returns QueryCharAns instance
         */
        public static create(properties?: proto_oparb.IQueryCharAns): proto_oparb.QueryCharAns;

        /**
         * Encodes the specified QueryCharAns message. Does not implicitly {@link proto_oparb.QueryCharAns.verify|verify} messages.
         * @param message QueryCharAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.IQueryCharAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified QueryCharAns message, length delimited. Does not implicitly {@link proto_oparb.QueryCharAns.verify|verify} messages.
         * @param message QueryCharAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.IQueryCharAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a QueryCharAns message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns QueryCharAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.QueryCharAns;

        /**
         * Decodes a QueryCharAns message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns QueryCharAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.QueryCharAns;

        /**
         * Verifies a QueryCharAns message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a QueryCharAns message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns QueryCharAns
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.QueryCharAns;

        /**
         * Creates a plain object from a QueryCharAns message. Also converts values to other types if specified.
         * @param message QueryCharAns
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.QueryCharAns, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this QueryCharAns to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a QueryPlayInfoReq. */
    interface IQueryPlayInfoReq {

        /** QueryPlayInfoReq userSrl */
        userSrl: (number|Long);
    }

    /** Represents a QueryPlayInfoReq. */
    class QueryPlayInfoReq implements IQueryPlayInfoReq {

        /**
         * Constructs a new QueryPlayInfoReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.IQueryPlayInfoReq);

        /** QueryPlayInfoReq userSrl. */
        public userSrl: (number|Long);

        /**
         * Creates a new QueryPlayInfoReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns QueryPlayInfoReq instance
         */
        public static create(properties?: proto_oparb.IQueryPlayInfoReq): proto_oparb.QueryPlayInfoReq;

        /**
         * Encodes the specified QueryPlayInfoReq message. Does not implicitly {@link proto_oparb.QueryPlayInfoReq.verify|verify} messages.
         * @param message QueryPlayInfoReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.IQueryPlayInfoReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified QueryPlayInfoReq message, length delimited. Does not implicitly {@link proto_oparb.QueryPlayInfoReq.verify|verify} messages.
         * @param message QueryPlayInfoReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.IQueryPlayInfoReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a QueryPlayInfoReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns QueryPlayInfoReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.QueryPlayInfoReq;

        /**
         * Decodes a QueryPlayInfoReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns QueryPlayInfoReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.QueryPlayInfoReq;

        /**
         * Verifies a QueryPlayInfoReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a QueryPlayInfoReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns QueryPlayInfoReq
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.QueryPlayInfoReq;

        /**
         * Creates a plain object from a QueryPlayInfoReq message. Also converts values to other types if specified.
         * @param message QueryPlayInfoReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.QueryPlayInfoReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this QueryPlayInfoReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a QueryPlayInfoAns. */
    interface IQueryPlayInfoAns {

        /** QueryPlayInfoAns result */
        result: proto_oparb.QueryPlayInfoAns.result_type;

        /** QueryPlayInfoAns pcbang */
        pcbang: boolean;

        /** QueryPlayInfoAns playTime */
        playTime: number;
    }

    /** Represents a QueryPlayInfoAns. */
    class QueryPlayInfoAns implements IQueryPlayInfoAns {

        /**
         * Constructs a new QueryPlayInfoAns.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.IQueryPlayInfoAns);

        /** QueryPlayInfoAns result. */
        public result: proto_oparb.QueryPlayInfoAns.result_type;

        /** QueryPlayInfoAns pcbang. */
        public pcbang: boolean;

        /** QueryPlayInfoAns playTime. */
        public playTime: number;

        /**
         * Creates a new QueryPlayInfoAns instance using the specified properties.
         * @param [properties] Properties to set
         * @returns QueryPlayInfoAns instance
         */
        public static create(properties?: proto_oparb.IQueryPlayInfoAns): proto_oparb.QueryPlayInfoAns;

        /**
         * Encodes the specified QueryPlayInfoAns message. Does not implicitly {@link proto_oparb.QueryPlayInfoAns.verify|verify} messages.
         * @param message QueryPlayInfoAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.IQueryPlayInfoAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified QueryPlayInfoAns message, length delimited. Does not implicitly {@link proto_oparb.QueryPlayInfoAns.verify|verify} messages.
         * @param message QueryPlayInfoAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.IQueryPlayInfoAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a QueryPlayInfoAns message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns QueryPlayInfoAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.QueryPlayInfoAns;

        /**
         * Decodes a QueryPlayInfoAns message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns QueryPlayInfoAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.QueryPlayInfoAns;

        /**
         * Verifies a QueryPlayInfoAns message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a QueryPlayInfoAns message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns QueryPlayInfoAns
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.QueryPlayInfoAns;

        /**
         * Creates a plain object from a QueryPlayInfoAns message. Also converts values to other types if specified.
         * @param message QueryPlayInfoAns
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.QueryPlayInfoAns, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this QueryPlayInfoAns to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace QueryPlayInfoAns {

        /** result_type enum. */
        enum result_type {
            SUCCESS = 0,
            FAILED = 1,
            NOT_EXIST = 2
        }
    }

    /** Properties of an AddBenefitByTimestampReq. */
    interface IAddBenefitByTimestampReq {

        /** AddBenefitByTimestampReq userSrl */
        userSrl: (number|Long);

        /** AddBenefitByTimestampReq benefitId */
        benefitId: number;

        /** AddBenefitByTimestampReq expireTimestamp */
        expireTimestamp: number;

        /** AddBenefitByTimestampReq totalSec */
        totalSec?: (number|null);
    }

    /** Represents an AddBenefitByTimestampReq. */
    class AddBenefitByTimestampReq implements IAddBenefitByTimestampReq {

        /**
         * Constructs a new AddBenefitByTimestampReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.IAddBenefitByTimestampReq);

        /** AddBenefitByTimestampReq userSrl. */
        public userSrl: (number|Long);

        /** AddBenefitByTimestampReq benefitId. */
        public benefitId: number;

        /** AddBenefitByTimestampReq expireTimestamp. */
        public expireTimestamp: number;

        /** AddBenefitByTimestampReq totalSec. */
        public totalSec: number;

        /**
         * Creates a new AddBenefitByTimestampReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AddBenefitByTimestampReq instance
         */
        public static create(properties?: proto_oparb.IAddBenefitByTimestampReq): proto_oparb.AddBenefitByTimestampReq;

        /**
         * Encodes the specified AddBenefitByTimestampReq message. Does not implicitly {@link proto_oparb.AddBenefitByTimestampReq.verify|verify} messages.
         * @param message AddBenefitByTimestampReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.IAddBenefitByTimestampReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AddBenefitByTimestampReq message, length delimited. Does not implicitly {@link proto_oparb.AddBenefitByTimestampReq.verify|verify} messages.
         * @param message AddBenefitByTimestampReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.IAddBenefitByTimestampReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AddBenefitByTimestampReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AddBenefitByTimestampReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.AddBenefitByTimestampReq;

        /**
         * Decodes an AddBenefitByTimestampReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AddBenefitByTimestampReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.AddBenefitByTimestampReq;

        /**
         * Verifies an AddBenefitByTimestampReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AddBenefitByTimestampReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AddBenefitByTimestampReq
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.AddBenefitByTimestampReq;

        /**
         * Creates a plain object from an AddBenefitByTimestampReq message. Also converts values to other types if specified.
         * @param message AddBenefitByTimestampReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.AddBenefitByTimestampReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AddBenefitByTimestampReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an AddBenefitByTimestampAns. */
    interface IAddBenefitByTimestampAns {

        /** AddBenefitByTimestampAns result */
        result: proto_oparb.AddBenefitByTimestampAns.result_type;
    }

    /** Represents an AddBenefitByTimestampAns. */
    class AddBenefitByTimestampAns implements IAddBenefitByTimestampAns {

        /**
         * Constructs a new AddBenefitByTimestampAns.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.IAddBenefitByTimestampAns);

        /** AddBenefitByTimestampAns result. */
        public result: proto_oparb.AddBenefitByTimestampAns.result_type;

        /**
         * Creates a new AddBenefitByTimestampAns instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AddBenefitByTimestampAns instance
         */
        public static create(properties?: proto_oparb.IAddBenefitByTimestampAns): proto_oparb.AddBenefitByTimestampAns;

        /**
         * Encodes the specified AddBenefitByTimestampAns message. Does not implicitly {@link proto_oparb.AddBenefitByTimestampAns.verify|verify} messages.
         * @param message AddBenefitByTimestampAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.IAddBenefitByTimestampAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AddBenefitByTimestampAns message, length delimited. Does not implicitly {@link proto_oparb.AddBenefitByTimestampAns.verify|verify} messages.
         * @param message AddBenefitByTimestampAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.IAddBenefitByTimestampAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AddBenefitByTimestampAns message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AddBenefitByTimestampAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.AddBenefitByTimestampAns;

        /**
         * Decodes an AddBenefitByTimestampAns message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AddBenefitByTimestampAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.AddBenefitByTimestampAns;

        /**
         * Verifies an AddBenefitByTimestampAns message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AddBenefitByTimestampAns message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AddBenefitByTimestampAns
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.AddBenefitByTimestampAns;

        /**
         * Creates a plain object from an AddBenefitByTimestampAns message. Also converts values to other types if specified.
         * @param message AddBenefitByTimestampAns
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.AddBenefitByTimestampAns, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AddBenefitByTimestampAns to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace AddBenefitByTimestampAns {

        /** result_type enum. */
        enum result_type {
            SUCCESS = 0,
            FAILED = 1,
            NOT_EXIST = 2
        }
    }

    /** Properties of an ArbiterPacketCounterReq. */
    interface IArbiterPacketCounterReq {
    }

    /** Represents an ArbiterPacketCounterReq. */
    class ArbiterPacketCounterReq implements IArbiterPacketCounterReq {

        /**
         * Constructs a new ArbiterPacketCounterReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.IArbiterPacketCounterReq);

        /**
         * Creates a new ArbiterPacketCounterReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ArbiterPacketCounterReq instance
         */
        public static create(properties?: proto_oparb.IArbiterPacketCounterReq): proto_oparb.ArbiterPacketCounterReq;

        /**
         * Encodes the specified ArbiterPacketCounterReq message. Does not implicitly {@link proto_oparb.ArbiterPacketCounterReq.verify|verify} messages.
         * @param message ArbiterPacketCounterReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.IArbiterPacketCounterReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ArbiterPacketCounterReq message, length delimited. Does not implicitly {@link proto_oparb.ArbiterPacketCounterReq.verify|verify} messages.
         * @param message ArbiterPacketCounterReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.IArbiterPacketCounterReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ArbiterPacketCounterReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ArbiterPacketCounterReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.ArbiterPacketCounterReq;

        /**
         * Decodes an ArbiterPacketCounterReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ArbiterPacketCounterReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.ArbiterPacketCounterReq;

        /**
         * Verifies an ArbiterPacketCounterReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an ArbiterPacketCounterReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ArbiterPacketCounterReq
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.ArbiterPacketCounterReq;

        /**
         * Creates a plain object from an ArbiterPacketCounterReq message. Also converts values to other types if specified.
         * @param message ArbiterPacketCounterReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.ArbiterPacketCounterReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ArbiterPacketCounterReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an ArbiterPacketCounterAns. */
    interface IArbiterPacketCounterAns {

        /** ArbiterPacketCounterAns packetCounterList */
        packetCounterList?: (proto_oparb.ArbiterPacketCounterAns.IPacketCounter[]|null);
    }

    /** Represents an ArbiterPacketCounterAns. */
    class ArbiterPacketCounterAns implements IArbiterPacketCounterAns {

        /**
         * Constructs a new ArbiterPacketCounterAns.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.IArbiterPacketCounterAns);

        /** ArbiterPacketCounterAns packetCounterList. */
        public packetCounterList: proto_oparb.ArbiterPacketCounterAns.IPacketCounter[];

        /**
         * Creates a new ArbiterPacketCounterAns instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ArbiterPacketCounterAns instance
         */
        public static create(properties?: proto_oparb.IArbiterPacketCounterAns): proto_oparb.ArbiterPacketCounterAns;

        /**
         * Encodes the specified ArbiterPacketCounterAns message. Does not implicitly {@link proto_oparb.ArbiterPacketCounterAns.verify|verify} messages.
         * @param message ArbiterPacketCounterAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.IArbiterPacketCounterAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ArbiterPacketCounterAns message, length delimited. Does not implicitly {@link proto_oparb.ArbiterPacketCounterAns.verify|verify} messages.
         * @param message ArbiterPacketCounterAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.IArbiterPacketCounterAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ArbiterPacketCounterAns message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ArbiterPacketCounterAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.ArbiterPacketCounterAns;

        /**
         * Decodes an ArbiterPacketCounterAns message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ArbiterPacketCounterAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.ArbiterPacketCounterAns;

        /**
         * Verifies an ArbiterPacketCounterAns message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an ArbiterPacketCounterAns message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ArbiterPacketCounterAns
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.ArbiterPacketCounterAns;

        /**
         * Creates a plain object from an ArbiterPacketCounterAns message. Also converts values to other types if specified.
         * @param message ArbiterPacketCounterAns
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.ArbiterPacketCounterAns, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ArbiterPacketCounterAns to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace ArbiterPacketCounterAns {

        /** Properties of a PacketCounter. */
        interface IPacketCounter {

            /** PacketCounter msgId */
            msgId: number;

            /** PacketCounter counter */
            counter: (number|Long);
        }

        /** Represents a PacketCounter. */
        class PacketCounter implements IPacketCounter {

            /**
             * Constructs a new PacketCounter.
             * @param [properties] Properties to set
             */
            constructor(properties?: proto_oparb.ArbiterPacketCounterAns.IPacketCounter);

            /** PacketCounter msgId. */
            public msgId: number;

            /** PacketCounter counter. */
            public counter: (number|Long);

            /**
             * Creates a new PacketCounter instance using the specified properties.
             * @param [properties] Properties to set
             * @returns PacketCounter instance
             */
            public static create(properties?: proto_oparb.ArbiterPacketCounterAns.IPacketCounter): proto_oparb.ArbiterPacketCounterAns.PacketCounter;

            /**
             * Encodes the specified PacketCounter message. Does not implicitly {@link proto_oparb.ArbiterPacketCounterAns.PacketCounter.verify|verify} messages.
             * @param message PacketCounter message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: proto_oparb.ArbiterPacketCounterAns.IPacketCounter, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified PacketCounter message, length delimited. Does not implicitly {@link proto_oparb.ArbiterPacketCounterAns.PacketCounter.verify|verify} messages.
             * @param message PacketCounter message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: proto_oparb.ArbiterPacketCounterAns.IPacketCounter, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a PacketCounter message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns PacketCounter
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.ArbiterPacketCounterAns.PacketCounter;

            /**
             * Decodes a PacketCounter message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns PacketCounter
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.ArbiterPacketCounterAns.PacketCounter;

            /**
             * Verifies a PacketCounter message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a PacketCounter message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns PacketCounter
             */
            public static fromObject(object: { [k: string]: any }): proto_oparb.ArbiterPacketCounterAns.PacketCounter;

            /**
             * Creates a plain object from a PacketCounter message. Also converts values to other types if specified.
             * @param message PacketCounter
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: proto_oparb.ArbiterPacketCounterAns.PacketCounter, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this PacketCounter to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }

    /** Properties of a RestoreCharReq. */
    interface IRestoreCharReq {

        /** RestoreCharReq userSrl */
        userSrl: (number|Long);

        /** RestoreCharReq charSrl */
        charSrl: number;
    }

    /** Represents a RestoreCharReq. */
    class RestoreCharReq implements IRestoreCharReq {

        /**
         * Constructs a new RestoreCharReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.IRestoreCharReq);

        /** RestoreCharReq userSrl. */
        public userSrl: (number|Long);

        /** RestoreCharReq charSrl. */
        public charSrl: number;

        /**
         * Creates a new RestoreCharReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RestoreCharReq instance
         */
        public static create(properties?: proto_oparb.IRestoreCharReq): proto_oparb.RestoreCharReq;

        /**
         * Encodes the specified RestoreCharReq message. Does not implicitly {@link proto_oparb.RestoreCharReq.verify|verify} messages.
         * @param message RestoreCharReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.IRestoreCharReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RestoreCharReq message, length delimited. Does not implicitly {@link proto_oparb.RestoreCharReq.verify|verify} messages.
         * @param message RestoreCharReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.IRestoreCharReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RestoreCharReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RestoreCharReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.RestoreCharReq;

        /**
         * Decodes a RestoreCharReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RestoreCharReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.RestoreCharReq;

        /**
         * Verifies a RestoreCharReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RestoreCharReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RestoreCharReq
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.RestoreCharReq;

        /**
         * Creates a plain object from a RestoreCharReq message. Also converts values to other types if specified.
         * @param message RestoreCharReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.RestoreCharReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RestoreCharReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a RestoreCharAns. */
    interface IRestoreCharAns {

        /** RestoreCharAns result */
        result: proto_oparb.RestoreCharAns.result_type;

        /** RestoreCharAns errorCode */
        errorCode: number;
    }

    /** Represents a RestoreCharAns. */
    class RestoreCharAns implements IRestoreCharAns {

        /**
         * Constructs a new RestoreCharAns.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_oparb.IRestoreCharAns);

        /** RestoreCharAns result. */
        public result: proto_oparb.RestoreCharAns.result_type;

        /** RestoreCharAns errorCode. */
        public errorCode: number;

        /**
         * Creates a new RestoreCharAns instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RestoreCharAns instance
         */
        public static create(properties?: proto_oparb.IRestoreCharAns): proto_oparb.RestoreCharAns;

        /**
         * Encodes the specified RestoreCharAns message. Does not implicitly {@link proto_oparb.RestoreCharAns.verify|verify} messages.
         * @param message RestoreCharAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_oparb.IRestoreCharAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RestoreCharAns message, length delimited. Does not implicitly {@link proto_oparb.RestoreCharAns.verify|verify} messages.
         * @param message RestoreCharAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_oparb.IRestoreCharAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RestoreCharAns message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RestoreCharAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_oparb.RestoreCharAns;

        /**
         * Decodes a RestoreCharAns message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RestoreCharAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_oparb.RestoreCharAns;

        /**
         * Verifies a RestoreCharAns message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RestoreCharAns message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RestoreCharAns
         */
        public static fromObject(object: { [k: string]: any }): proto_oparb.RestoreCharAns;

        /**
         * Creates a plain object from a RestoreCharAns message. Also converts values to other types if specified.
         * @param message RestoreCharAns
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_oparb.RestoreCharAns, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RestoreCharAns to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace RestoreCharAns {

        /** result_type enum. */
        enum result_type {
            SUCCESS = 0,
            FAILED = 1,
            NOT_EXIST = 2
        }
    }
}
