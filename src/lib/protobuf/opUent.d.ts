import * as $protobuf from "protobufjs";
/** Namespace proto_opuent. */
export namespace proto_opuent {

    /** Properties of a QueryUserReq. */
    interface IQueryUserReq {

        /** QueryUserReq userSrl */
        userSrl: (number|Long);

        /** QueryUserReq action */
        action: proto_opuent.QueryUserReq.action_type;

        /** QueryUserReq serverId */
        serverId: number;
    }

    /** Represents a QueryUserReq. */
    class QueryUserReq implements IQueryUserReq {

        /**
         * Constructs a new QueryUserReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_opuent.IQueryUserReq);

        /** QueryUserReq userSrl. */
        public userSrl: (number|Long);

        /** QueryUserReq action. */
        public action: proto_opuent.QueryUserReq.action_type;

        /** QueryUserReq serverId. */
        public serverId: number;

        /**
         * Creates a new QueryUserReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns QueryUserReq instance
         */
        public static create(properties?: proto_opuent.IQueryUserReq): proto_opuent.QueryUserReq;

        /**
         * Encodes the specified QueryUserReq message. Does not implicitly {@link proto_opuent.QueryUserReq.verify|verify} messages.
         * @param message QueryUserReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_opuent.IQueryUserReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified QueryUserReq message, length delimited. Does not implicitly {@link proto_opuent.QueryUserReq.verify|verify} messages.
         * @param message QueryUserReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_opuent.IQueryUserReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a QueryUserReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns QueryUserReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_opuent.QueryUserReq;

        /**
         * Decodes a QueryUserReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns QueryUserReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_opuent.QueryUserReq;

        /**
         * Verifies a QueryUserReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a QueryUserReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns QueryUserReq
         */
        public static fromObject(object: { [k: string]: any }): proto_opuent.QueryUserReq;

        /**
         * Creates a plain object from a QueryUserReq message. Also converts values to other types if specified.
         * @param message QueryUserReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_opuent.QueryUserReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this QueryUserReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace QueryUserReq {

        /** action_type enum. */
        enum action_type {
            QUERY = 0,
            INSERT = 1,
            DEL = 2
        }
    }

    /** Properties of a QueryUserAns. */
    interface IQueryUserAns {

        /** QueryUserAns userSrl */
        userSrl: (number|Long);

        /** QueryUserAns serverId */
        serverId: number;
    }

    /** Represents a QueryUserAns. */
    class QueryUserAns implements IQueryUserAns {

        /**
         * Constructs a new QueryUserAns.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_opuent.IQueryUserAns);

        /** QueryUserAns userSrl. */
        public userSrl: (number|Long);

        /** QueryUserAns serverId. */
        public serverId: number;

        /**
         * Creates a new QueryUserAns instance using the specified properties.
         * @param [properties] Properties to set
         * @returns QueryUserAns instance
         */
        public static create(properties?: proto_opuent.IQueryUserAns): proto_opuent.QueryUserAns;

        /**
         * Encodes the specified QueryUserAns message. Does not implicitly {@link proto_opuent.QueryUserAns.verify|verify} messages.
         * @param message QueryUserAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_opuent.IQueryUserAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified QueryUserAns message, length delimited. Does not implicitly {@link proto_opuent.QueryUserAns.verify|verify} messages.
         * @param message QueryUserAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_opuent.IQueryUserAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a QueryUserAns message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns QueryUserAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_opuent.QueryUserAns;

        /**
         * Decodes a QueryUserAns message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns QueryUserAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_opuent.QueryUserAns;

        /**
         * Verifies a QueryUserAns message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a QueryUserAns message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns QueryUserAns
         */
        public static fromObject(object: { [k: string]: any }): proto_opuent.QueryUserAns;

        /**
         * Creates a plain object from a QueryUserAns message. Also converts values to other types if specified.
         * @param message QueryUserAns
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_opuent.QueryUserAns, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this QueryUserAns to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a GetServerStatReq. */
    interface IGetServerStatReq {
    }

    /** Represents a GetServerStatReq. */
    class GetServerStatReq implements IGetServerStatReq {

        /**
         * Constructs a new GetServerStatReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_opuent.IGetServerStatReq);

        /**
         * Creates a new GetServerStatReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetServerStatReq instance
         */
        public static create(properties?: proto_opuent.IGetServerStatReq): proto_opuent.GetServerStatReq;

        /**
         * Encodes the specified GetServerStatReq message. Does not implicitly {@link proto_opuent.GetServerStatReq.verify|verify} messages.
         * @param message GetServerStatReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_opuent.IGetServerStatReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetServerStatReq message, length delimited. Does not implicitly {@link proto_opuent.GetServerStatReq.verify|verify} messages.
         * @param message GetServerStatReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_opuent.IGetServerStatReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetServerStatReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetServerStatReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_opuent.GetServerStatReq;

        /**
         * Decodes a GetServerStatReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetServerStatReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_opuent.GetServerStatReq;

        /**
         * Verifies a GetServerStatReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetServerStatReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetServerStatReq
         */
        public static fromObject(object: { [k: string]: any }): proto_opuent.GetServerStatReq;

        /**
         * Creates a plain object from a GetServerStatReq message. Also converts values to other types if specified.
         * @param message GetServerStatReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_opuent.GetServerStatReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetServerStatReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a GetServerStatAns. */
    interface IGetServerStatAns {

        /** GetServerStatAns serverList */
        serverList?: (proto_opuent.GetServerStatAns.IServerInfo[]|null);
    }

    /** Represents a GetServerStatAns. */
    class GetServerStatAns implements IGetServerStatAns {

        /**
         * Constructs a new GetServerStatAns.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_opuent.IGetServerStatAns);

        /** GetServerStatAns serverList. */
        public serverList: proto_opuent.GetServerStatAns.IServerInfo[];

        /**
         * Creates a new GetServerStatAns instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetServerStatAns instance
         */
        public static create(properties?: proto_opuent.IGetServerStatAns): proto_opuent.GetServerStatAns;

        /**
         * Encodes the specified GetServerStatAns message. Does not implicitly {@link proto_opuent.GetServerStatAns.verify|verify} messages.
         * @param message GetServerStatAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_opuent.IGetServerStatAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetServerStatAns message, length delimited. Does not implicitly {@link proto_opuent.GetServerStatAns.verify|verify} messages.
         * @param message GetServerStatAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_opuent.IGetServerStatAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetServerStatAns message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetServerStatAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_opuent.GetServerStatAns;

        /**
         * Decodes a GetServerStatAns message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetServerStatAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_opuent.GetServerStatAns;

        /**
         * Verifies a GetServerStatAns message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetServerStatAns message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetServerStatAns
         */
        public static fromObject(object: { [k: string]: any }): proto_opuent.GetServerStatAns;

        /**
         * Creates a plain object from a GetServerStatAns message. Also converts values to other types if specified.
         * @param message GetServerStatAns
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_opuent.GetServerStatAns, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetServerStatAns to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace GetServerStatAns {

        /** Properties of a ServerInfo. */
        interface IServerInfo {

            /** ServerInfo serverId */
            serverId: number;

            /** ServerInfo userCnt */
            userCnt: number;
        }

        /** Represents a ServerInfo. */
        class ServerInfo implements IServerInfo {

            /**
             * Constructs a new ServerInfo.
             * @param [properties] Properties to set
             */
            constructor(properties?: proto_opuent.GetServerStatAns.IServerInfo);

            /** ServerInfo serverId. */
            public serverId: number;

            /** ServerInfo userCnt. */
            public userCnt: number;

            /**
             * Creates a new ServerInfo instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ServerInfo instance
             */
            public static create(properties?: proto_opuent.GetServerStatAns.IServerInfo): proto_opuent.GetServerStatAns.ServerInfo;

            /**
             * Encodes the specified ServerInfo message. Does not implicitly {@link proto_opuent.GetServerStatAns.ServerInfo.verify|verify} messages.
             * @param message ServerInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: proto_opuent.GetServerStatAns.IServerInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ServerInfo message, length delimited. Does not implicitly {@link proto_opuent.GetServerStatAns.ServerInfo.verify|verify} messages.
             * @param message ServerInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: proto_opuent.GetServerStatAns.IServerInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ServerInfo message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ServerInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_opuent.GetServerStatAns.ServerInfo;

            /**
             * Decodes a ServerInfo message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ServerInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_opuent.GetServerStatAns.ServerInfo;

            /**
             * Verifies a ServerInfo message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ServerInfo message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ServerInfo
             */
            public static fromObject(object: { [k: string]: any }): proto_opuent.GetServerStatAns.ServerInfo;

            /**
             * Creates a plain object from a ServerInfo message. Also converts values to other types if specified.
             * @param message ServerInfo
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: proto_opuent.GetServerStatAns.ServerInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ServerInfo to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }

    /** Properties of a GetAllServerStatReq. */
    interface IGetAllServerStatReq {

        /** GetAllServerStatReq serverCat */
        serverCat: number;
    }

    /** Represents a GetAllServerStatReq. */
    class GetAllServerStatReq implements IGetAllServerStatReq {

        /**
         * Constructs a new GetAllServerStatReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_opuent.IGetAllServerStatReq);

        /** GetAllServerStatReq serverCat. */
        public serverCat: number;

        /**
         * Creates a new GetAllServerStatReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetAllServerStatReq instance
         */
        public static create(properties?: proto_opuent.IGetAllServerStatReq): proto_opuent.GetAllServerStatReq;

        /**
         * Encodes the specified GetAllServerStatReq message. Does not implicitly {@link proto_opuent.GetAllServerStatReq.verify|verify} messages.
         * @param message GetAllServerStatReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_opuent.IGetAllServerStatReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetAllServerStatReq message, length delimited. Does not implicitly {@link proto_opuent.GetAllServerStatReq.verify|verify} messages.
         * @param message GetAllServerStatReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_opuent.IGetAllServerStatReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetAllServerStatReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetAllServerStatReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_opuent.GetAllServerStatReq;

        /**
         * Decodes a GetAllServerStatReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetAllServerStatReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_opuent.GetAllServerStatReq;

        /**
         * Verifies a GetAllServerStatReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetAllServerStatReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetAllServerStatReq
         */
        public static fromObject(object: { [k: string]: any }): proto_opuent.GetAllServerStatReq;

        /**
         * Creates a plain object from a GetAllServerStatReq message. Also converts values to other types if specified.
         * @param message GetAllServerStatReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_opuent.GetAllServerStatReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetAllServerStatReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a GetAllServerStatAns. */
    interface IGetAllServerStatAns {

        /** GetAllServerStatAns serverList */
        serverList?: (proto_opuent.GetAllServerStatAns.IServerInfo[]|null);
    }

    /** Represents a GetAllServerStatAns. */
    class GetAllServerStatAns implements IGetAllServerStatAns {

        /**
         * Constructs a new GetAllServerStatAns.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_opuent.IGetAllServerStatAns);

        /** GetAllServerStatAns serverList. */
        public serverList: proto_opuent.GetAllServerStatAns.IServerInfo[];

        /**
         * Creates a new GetAllServerStatAns instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetAllServerStatAns instance
         */
        public static create(properties?: proto_opuent.IGetAllServerStatAns): proto_opuent.GetAllServerStatAns;

        /**
         * Encodes the specified GetAllServerStatAns message. Does not implicitly {@link proto_opuent.GetAllServerStatAns.verify|verify} messages.
         * @param message GetAllServerStatAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_opuent.IGetAllServerStatAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetAllServerStatAns message, length delimited. Does not implicitly {@link proto_opuent.GetAllServerStatAns.verify|verify} messages.
         * @param message GetAllServerStatAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_opuent.IGetAllServerStatAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetAllServerStatAns message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetAllServerStatAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_opuent.GetAllServerStatAns;

        /**
         * Decodes a GetAllServerStatAns message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetAllServerStatAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_opuent.GetAllServerStatAns;

        /**
         * Verifies a GetAllServerStatAns message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetAllServerStatAns message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetAllServerStatAns
         */
        public static fromObject(object: { [k: string]: any }): proto_opuent.GetAllServerStatAns;

        /**
         * Creates a plain object from a GetAllServerStatAns message. Also converts values to other types if specified.
         * @param message GetAllServerStatAns
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_opuent.GetAllServerStatAns, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetAllServerStatAns to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace GetAllServerStatAns {

        /** Properties of a ServerInfo. */
        interface IServerInfo {

            /** ServerInfo serverId */
            serverId: number;

            /** ServerInfo lastMsg */
            lastMsg: number;

            /** ServerInfo ip */
            ip: number;

            /** ServerInfo port */
            port: number;
        }

        /** Represents a ServerInfo. */
        class ServerInfo implements IServerInfo {

            /**
             * Constructs a new ServerInfo.
             * @param [properties] Properties to set
             */
            constructor(properties?: proto_opuent.GetAllServerStatAns.IServerInfo);

            /** ServerInfo serverId. */
            public serverId: number;

            /** ServerInfo lastMsg. */
            public lastMsg: number;

            /** ServerInfo ip. */
            public ip: number;

            /** ServerInfo port. */
            public port: number;

            /**
             * Creates a new ServerInfo instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ServerInfo instance
             */
            public static create(properties?: proto_opuent.GetAllServerStatAns.IServerInfo): proto_opuent.GetAllServerStatAns.ServerInfo;

            /**
             * Encodes the specified ServerInfo message. Does not implicitly {@link proto_opuent.GetAllServerStatAns.ServerInfo.verify|verify} messages.
             * @param message ServerInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: proto_opuent.GetAllServerStatAns.IServerInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ServerInfo message, length delimited. Does not implicitly {@link proto_opuent.GetAllServerStatAns.ServerInfo.verify|verify} messages.
             * @param message ServerInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: proto_opuent.GetAllServerStatAns.IServerInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ServerInfo message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ServerInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_opuent.GetAllServerStatAns.ServerInfo;

            /**
             * Decodes a ServerInfo message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ServerInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_opuent.GetAllServerStatAns.ServerInfo;

            /**
             * Verifies a ServerInfo message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ServerInfo message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ServerInfo
             */
            public static fromObject(object: { [k: string]: any }): proto_opuent.GetAllServerStatAns.ServerInfo;

            /**
             * Creates a plain object from a ServerInfo message. Also converts values to other types if specified.
             * @param message ServerInfo
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: proto_opuent.GetAllServerStatAns.ServerInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ServerInfo to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }
}
