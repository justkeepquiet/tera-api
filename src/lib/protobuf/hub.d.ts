import * as $protobuf from "protobufjs";
/** Namespace proto_hub. */
export namespace proto_hub {

    /** Properties of a RegisterReq. */
    interface IRegisterReq {

        /** RegisterReq serverId */
        serverId: number;

        /** RegisterReq eventSub */
        eventSub?: (number[]|null);
    }

    /** Represents a RegisterReq. */
    class RegisterReq implements IRegisterReq {

        /**
         * Constructs a new RegisterReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_hub.IRegisterReq);

        /** RegisterReq serverId. */
        public serverId: number;

        /** RegisterReq eventSub. */
        public eventSub: number[];

        /**
         * Creates a new RegisterReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RegisterReq instance
         */
        public static create(properties?: proto_hub.IRegisterReq): proto_hub.RegisterReq;

        /**
         * Encodes the specified RegisterReq message. Does not implicitly {@link proto_hub.RegisterReq.verify|verify} messages.
         * @param message RegisterReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_hub.IRegisterReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RegisterReq message, length delimited. Does not implicitly {@link proto_hub.RegisterReq.verify|verify} messages.
         * @param message RegisterReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_hub.IRegisterReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RegisterReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RegisterReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_hub.RegisterReq;

        /**
         * Decodes a RegisterReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RegisterReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_hub.RegisterReq;

        /**
         * Verifies a RegisterReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RegisterReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RegisterReq
         */
        public static fromObject(object: { [k: string]: any }): proto_hub.RegisterReq;

        /**
         * Creates a plain object from a RegisterReq message. Also converts values to other types if specified.
         * @param message RegisterReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_hub.RegisterReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RegisterReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a RegisterAns. */
    interface IRegisterAns {

        /** RegisterAns result */
        result: boolean;

        /** RegisterAns serverList */
        serverList?: (number[]|null);
    }

    /** Represents a RegisterAns. */
    class RegisterAns implements IRegisterAns {

        /**
         * Constructs a new RegisterAns.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_hub.IRegisterAns);

        /** RegisterAns result. */
        public result: boolean;

        /** RegisterAns serverList. */
        public serverList: number[];

        /**
         * Creates a new RegisterAns instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RegisterAns instance
         */
        public static create(properties?: proto_hub.IRegisterAns): proto_hub.RegisterAns;

        /**
         * Encodes the specified RegisterAns message. Does not implicitly {@link proto_hub.RegisterAns.verify|verify} messages.
         * @param message RegisterAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_hub.IRegisterAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RegisterAns message, length delimited. Does not implicitly {@link proto_hub.RegisterAns.verify|verify} messages.
         * @param message RegisterAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_hub.IRegisterAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RegisterAns message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RegisterAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_hub.RegisterAns;

        /**
         * Decodes a RegisterAns message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RegisterAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_hub.RegisterAns;

        /**
         * Verifies a RegisterAns message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RegisterAns message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RegisterAns
         */
        public static fromObject(object: { [k: string]: any }): proto_hub.RegisterAns;

        /**
         * Creates a plain object from a RegisterAns message. Also converts values to other types if specified.
         * @param message RegisterAns
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_hub.RegisterAns, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RegisterAns to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SendMessageReq. */
    interface ISendMessageReq {

        /** SendMessageReq jobId */
        jobId: (number|Long);

        /** SendMessageReq serverId */
        serverId: number;

        /** SendMessageReq msgBuf */
        msgBuf: Uint8Array;
    }

    /** Represents a SendMessageReq. */
    class SendMessageReq implements ISendMessageReq {

        /**
         * Constructs a new SendMessageReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_hub.ISendMessageReq);

        /** SendMessageReq jobId. */
        public jobId: (number|Long);

        /** SendMessageReq serverId. */
        public serverId: number;

        /** SendMessageReq msgBuf. */
        public msgBuf: Uint8Array;

        /**
         * Creates a new SendMessageReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SendMessageReq instance
         */
        public static create(properties?: proto_hub.ISendMessageReq): proto_hub.SendMessageReq;

        /**
         * Encodes the specified SendMessageReq message. Does not implicitly {@link proto_hub.SendMessageReq.verify|verify} messages.
         * @param message SendMessageReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_hub.ISendMessageReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SendMessageReq message, length delimited. Does not implicitly {@link proto_hub.SendMessageReq.verify|verify} messages.
         * @param message SendMessageReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_hub.ISendMessageReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SendMessageReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SendMessageReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_hub.SendMessageReq;

        /**
         * Decodes a SendMessageReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SendMessageReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_hub.SendMessageReq;

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
        public static fromObject(object: { [k: string]: any }): proto_hub.SendMessageReq;

        /**
         * Creates a plain object from a SendMessageReq message. Also converts values to other types if specified.
         * @param message SendMessageReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_hub.SendMessageReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SendMessageReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SendMessageAns. */
    interface ISendMessageAns {

        /** SendMessageAns jobId */
        jobId: (number|Long);

        /** SendMessageAns serverId */
        serverId: number;

        /** SendMessageAns destCount */
        destCount: number;

        /** SendMessageAns result */
        result: boolean;
    }

    /** Represents a SendMessageAns. */
    class SendMessageAns implements ISendMessageAns {

        /**
         * Constructs a new SendMessageAns.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_hub.ISendMessageAns);

        /** SendMessageAns jobId. */
        public jobId: (number|Long);

        /** SendMessageAns serverId. */
        public serverId: number;

        /** SendMessageAns destCount. */
        public destCount: number;

        /** SendMessageAns result. */
        public result: boolean;

        /**
         * Creates a new SendMessageAns instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SendMessageAns instance
         */
        public static create(properties?: proto_hub.ISendMessageAns): proto_hub.SendMessageAns;

        /**
         * Encodes the specified SendMessageAns message. Does not implicitly {@link proto_hub.SendMessageAns.verify|verify} messages.
         * @param message SendMessageAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_hub.ISendMessageAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SendMessageAns message, length delimited. Does not implicitly {@link proto_hub.SendMessageAns.verify|verify} messages.
         * @param message SendMessageAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_hub.ISendMessageAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SendMessageAns message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SendMessageAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_hub.SendMessageAns;

        /**
         * Decodes a SendMessageAns message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SendMessageAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_hub.SendMessageAns;

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
        public static fromObject(object: { [k: string]: any }): proto_hub.SendMessageAns;

        /**
         * Creates a plain object from a SendMessageAns message. Also converts values to other types if specified.
         * @param message SendMessageAns
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_hub.SendMessageAns, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SendMessageAns to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a RecvMessageReq. */
    interface IRecvMessageReq {

        /** RecvMessageReq serverId */
        serverId: number;

        /** RecvMessageReq jobId */
        jobId: (number|Long);

        /** RecvMessageReq msgBuf */
        msgBuf: Uint8Array;
    }

    /** Represents a RecvMessageReq. */
    class RecvMessageReq implements IRecvMessageReq {

        /**
         * Constructs a new RecvMessageReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_hub.IRecvMessageReq);

        /** RecvMessageReq serverId. */
        public serverId: number;

        /** RecvMessageReq jobId. */
        public jobId: (number|Long);

        /** RecvMessageReq msgBuf. */
        public msgBuf: Uint8Array;

        /**
         * Creates a new RecvMessageReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RecvMessageReq instance
         */
        public static create(properties?: proto_hub.IRecvMessageReq): proto_hub.RecvMessageReq;

        /**
         * Encodes the specified RecvMessageReq message. Does not implicitly {@link proto_hub.RecvMessageReq.verify|verify} messages.
         * @param message RecvMessageReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_hub.IRecvMessageReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RecvMessageReq message, length delimited. Does not implicitly {@link proto_hub.RecvMessageReq.verify|verify} messages.
         * @param message RecvMessageReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_hub.IRecvMessageReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RecvMessageReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RecvMessageReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_hub.RecvMessageReq;

        /**
         * Decodes a RecvMessageReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RecvMessageReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_hub.RecvMessageReq;

        /**
         * Verifies a RecvMessageReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RecvMessageReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RecvMessageReq
         */
        public static fromObject(object: { [k: string]: any }): proto_hub.RecvMessageReq;

        /**
         * Creates a plain object from a RecvMessageReq message. Also converts values to other types if specified.
         * @param message RecvMessageReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_hub.RecvMessageReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RecvMessageReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
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
        constructor(properties?: proto_hub.IPingReq);

        /**
         * Creates a new PingReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PingReq instance
         */
        public static create(properties?: proto_hub.IPingReq): proto_hub.PingReq;

        /**
         * Encodes the specified PingReq message. Does not implicitly {@link proto_hub.PingReq.verify|verify} messages.
         * @param message PingReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_hub.IPingReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PingReq message, length delimited. Does not implicitly {@link proto_hub.PingReq.verify|verify} messages.
         * @param message PingReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_hub.IPingReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PingReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PingReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_hub.PingReq;

        /**
         * Decodes a PingReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PingReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_hub.PingReq;

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
        public static fromObject(object: { [k: string]: any }): proto_hub.PingReq;

        /**
         * Creates a plain object from a PingReq message. Also converts values to other types if specified.
         * @param message PingReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_hub.PingReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PingReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PingAns. */
    interface IPingAns {
    }

    /** Represents a PingAns. */
    class PingAns implements IPingAns {

        /**
         * Constructs a new PingAns.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_hub.IPingAns);

        /**
         * Creates a new PingAns instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PingAns instance
         */
        public static create(properties?: proto_hub.IPingAns): proto_hub.PingAns;

        /**
         * Encodes the specified PingAns message. Does not implicitly {@link proto_hub.PingAns.verify|verify} messages.
         * @param message PingAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_hub.IPingAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PingAns message, length delimited. Does not implicitly {@link proto_hub.PingAns.verify|verify} messages.
         * @param message PingAns message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_hub.IPingAns, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PingAns message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PingAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_hub.PingAns;

        /**
         * Decodes a PingAns message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PingAns
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_hub.PingAns;

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
        public static fromObject(object: { [k: string]: any }): proto_hub.PingAns;

        /**
         * Creates a plain object from a PingAns message. Also converts values to other types if specified.
         * @param message PingAns
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_hub.PingAns, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PingAns to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ServerEvent. */
    interface IServerEvent {

        /** ServerEvent serverId */
        serverId: number;

        /** ServerEvent event */
        event: proto_hub.ServerEvent.event_type;
    }

    /** Represents a ServerEvent. */
    class ServerEvent implements IServerEvent {

        /**
         * Constructs a new ServerEvent.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto_hub.IServerEvent);

        /** ServerEvent serverId. */
        public serverId: number;

        /** ServerEvent event. */
        public event: proto_hub.ServerEvent.event_type;

        /**
         * Creates a new ServerEvent instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ServerEvent instance
         */
        public static create(properties?: proto_hub.IServerEvent): proto_hub.ServerEvent;

        /**
         * Encodes the specified ServerEvent message. Does not implicitly {@link proto_hub.ServerEvent.verify|verify} messages.
         * @param message ServerEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto_hub.IServerEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ServerEvent message, length delimited. Does not implicitly {@link proto_hub.ServerEvent.verify|verify} messages.
         * @param message ServerEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto_hub.IServerEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ServerEvent message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ServerEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): proto_hub.ServerEvent;

        /**
         * Decodes a ServerEvent message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ServerEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): proto_hub.ServerEvent;

        /**
         * Verifies a ServerEvent message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ServerEvent message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ServerEvent
         */
        public static fromObject(object: { [k: string]: any }): proto_hub.ServerEvent;

        /**
         * Creates a plain object from a ServerEvent message. Also converts values to other types if specified.
         * @param message ServerEvent
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto_hub.ServerEvent, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ServerEvent to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace ServerEvent {

        /** event_type enum. */
        enum event_type {
            CONNECTED = 0,
            DISCONNECTED = 1
        }
    }
}
