import * as $protobuf from "protobufjs";
/** Namespace op. */
export namespace op {

    /** Properties of an OpMsg. */
    interface IOpMsg {

        /** OpMsg senderGusid */
        senderGusid?: (number|null);

        /** OpMsg receiverGusid */
        receiverGusid?: (number|null);

        /** OpMsg jobType */
        jobType?: (op.OpMsg.JobType|null);

        /** OpMsg jobId */
        jobId?: (number|Long|null);

        /** OpMsg gufid */
        gufid?: (number|null);

        /** OpMsg execType */
        execType?: (op.OpMsg.ExecType|null);

        /** OpMsg castTargetUserGroupSn */
        castTargetUserGroupSn?: (number|null);

        /** OpMsg sessionKey */
        sessionKey?: (Uint8Array|null);

        /** OpMsg arguments */
        "arguments"?: (op.OpMsg.IArgument[]|null);

        /** OpMsg resultCode */
        resultCode?: (number|null);

        /** OpMsg resultScalar */
        resultScalar?: (Uint8Array|null);

        /** OpMsg resultSets */
        resultSets?: (op.OpMsg.IResultSet[]|null);

        /** OpMsg blob */
        blob?: (Uint8Array|null);
    }

    /** Represents an OpMsg. */
    class OpMsg implements IOpMsg {

        /**
         * Constructs a new OpMsg.
         * @param [properties] Properties to set
         */
        constructor(properties?: op.IOpMsg);

        /** OpMsg senderGusid. */
        public senderGusid: number;

        /** OpMsg receiverGusid. */
        public receiverGusid: number;

        /** OpMsg jobType. */
        public jobType: op.OpMsg.JobType;

        /** OpMsg jobId. */
        public jobId: (number|Long);

        /** OpMsg gufid. */
        public gufid: number;

        /** OpMsg execType. */
        public execType: op.OpMsg.ExecType;

        /** OpMsg castTargetUserGroupSn. */
        public castTargetUserGroupSn: number;

        /** OpMsg sessionKey. */
        public sessionKey: Uint8Array;

        /** OpMsg arguments. */
        public arguments: op.OpMsg.IArgument[];

        /** OpMsg resultCode. */
        public resultCode: number;

        /** OpMsg resultScalar. */
        public resultScalar: Uint8Array;

        /** OpMsg resultSets. */
        public resultSets: op.OpMsg.IResultSet[];

        /** OpMsg blob. */
        public blob: Uint8Array;

        /**
         * Creates a new OpMsg instance using the specified properties.
         * @param [properties] Properties to set
         * @returns OpMsg instance
         */
        public static create(properties?: op.IOpMsg): op.OpMsg;

        /**
         * Encodes the specified OpMsg message. Does not implicitly {@link op.OpMsg.verify|verify} messages.
         * @param message OpMsg message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: op.IOpMsg, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified OpMsg message, length delimited. Does not implicitly {@link op.OpMsg.verify|verify} messages.
         * @param message OpMsg message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: op.IOpMsg, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an OpMsg message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns OpMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): op.OpMsg;

        /**
         * Decodes an OpMsg message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns OpMsg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): op.OpMsg;

        /**
         * Verifies an OpMsg message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an OpMsg message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns OpMsg
         */
        public static fromObject(object: { [k: string]: any }): op.OpMsg;

        /**
         * Creates a plain object from an OpMsg message. Also converts values to other types if specified.
         * @param message OpMsg
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: op.OpMsg, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this OpMsg to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace OpMsg {

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
            constructor(properties?: op.OpMsg.IArgument);

            /** Argument name. */
            public name: Uint8Array;

            /** Argument value. */
            public value: Uint8Array;

            /**
             * Creates a new Argument instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Argument instance
             */
            public static create(properties?: op.OpMsg.IArgument): op.OpMsg.Argument;

            /**
             * Encodes the specified Argument message. Does not implicitly {@link op.OpMsg.Argument.verify|verify} messages.
             * @param message Argument message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: op.OpMsg.IArgument, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Argument message, length delimited. Does not implicitly {@link op.OpMsg.Argument.verify|verify} messages.
             * @param message Argument message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: op.OpMsg.IArgument, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Argument message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Argument
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): op.OpMsg.Argument;

            /**
             * Decodes an Argument message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Argument
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): op.OpMsg.Argument;

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
            public static fromObject(object: { [k: string]: any }): op.OpMsg.Argument;

            /**
             * Creates a plain object from an Argument message. Also converts values to other types if specified.
             * @param message Argument
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: op.OpMsg.Argument, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
            rows?: (op.OpMsg.ResultSet.IRow[]|null);

            /** ResultSet totalCount */
            totalCount?: (number|null);
        }

        /** Represents a ResultSet. */
        class ResultSet implements IResultSet {

            /**
             * Constructs a new ResultSet.
             * @param [properties] Properties to set
             */
            constructor(properties?: op.OpMsg.IResultSet);

            /** ResultSet columnNames. */
            public columnNames: Uint8Array[];

            /** ResultSet rows. */
            public rows: op.OpMsg.ResultSet.IRow[];

            /** ResultSet totalCount. */
            public totalCount: number;

            /**
             * Creates a new ResultSet instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ResultSet instance
             */
            public static create(properties?: op.OpMsg.IResultSet): op.OpMsg.ResultSet;

            /**
             * Encodes the specified ResultSet message. Does not implicitly {@link op.OpMsg.ResultSet.verify|verify} messages.
             * @param message ResultSet message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: op.OpMsg.IResultSet, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ResultSet message, length delimited. Does not implicitly {@link op.OpMsg.ResultSet.verify|verify} messages.
             * @param message ResultSet message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: op.OpMsg.IResultSet, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ResultSet message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ResultSet
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): op.OpMsg.ResultSet;

            /**
             * Decodes a ResultSet message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ResultSet
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): op.OpMsg.ResultSet;

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
            public static fromObject(object: { [k: string]: any }): op.OpMsg.ResultSet;

            /**
             * Creates a plain object from a ResultSet message. Also converts values to other types if specified.
             * @param message ResultSet
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: op.OpMsg.ResultSet, options?: $protobuf.IConversionOptions): { [k: string]: any };

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
                constructor(properties?: op.OpMsg.ResultSet.IRow);

                /** Row values. */
                public values: Uint8Array[];

                /**
                 * Creates a new Row instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Row instance
                 */
                public static create(properties?: op.OpMsg.ResultSet.IRow): op.OpMsg.ResultSet.Row;

                /**
                 * Encodes the specified Row message. Does not implicitly {@link op.OpMsg.ResultSet.Row.verify|verify} messages.
                 * @param message Row message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: op.OpMsg.ResultSet.IRow, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Row message, length delimited. Does not implicitly {@link op.OpMsg.ResultSet.Row.verify|verify} messages.
                 * @param message Row message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: op.OpMsg.ResultSet.IRow, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Row message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Row
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): op.OpMsg.ResultSet.Row;

                /**
                 * Decodes a Row message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Row
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): op.OpMsg.ResultSet.Row;

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
                public static fromObject(object: { [k: string]: any }): op.OpMsg.ResultSet.Row;

                /**
                 * Creates a plain object from a Row message. Also converts values to other types if specified.
                 * @param message Row
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: op.OpMsg.ResultSet.Row, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Row to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }
        }
    }
}
