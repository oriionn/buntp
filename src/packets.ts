import { LeapIndicator, MessageMode, NTP_EPOCH, type Packet } from "./models";

export const buildRequest = () => {
    const buf = Buffer.alloc(48);
    buf[0] = 0;

    // Leap Indicator
    buf[0] += LeapIndicator.NO_WARNING << 6;
    // Version Number
    buf[0] += 4 << 3;
    // Mode
    buf[0] += MessageMode.REQUEST << 0;

    // Stratum
    buf.writeUInt8(0, 1);
    // Poll Interval
    buf.writeUInt8(0, 2);
    // Precision
    buf.writeInt8(0, 3);

    // Root Delay
    buf.writeUInt32BE(0, 4);
    // Root Dispersion
    buf.writeUInt32BE(0, 8);
    // Reference Identifier
    buf.writeUInt32BE(0, 12);

    // Reference Timestamp
    buf.writeBigUInt64BE(0n, 16);
    // Originate Timestamp
    buf.writeBigUInt64BE(0n, 24);
    // Receive Timestamp
    buf.writeBigUInt64BE(0n, 32);

    // Transmit Timestamp
    const now = BigInt(Math.floor(Date.now() / 1000)) + NTP_EPOCH;
    buf.writeBigUInt64BE(now << 32n, 40);

    return buf;
}

export const readPacket = (buf: Buffer): Packet => {
    if (buf.byteLength < 48) throw new Error("Invalid packet");

    // @ts-expect-error
    let leapIndicator = buf[0] >> 6;
    // @ts-expect-error
    let versionNumber = (buf[0] & 0x38) >> 3;
    // @ts-expect-error
    let messageMode = (buf[0] & 0x7) >> 0;
    let stratum = buf.readUInt8(1);
    let pollInterval = buf.readUint8(2);
    let precision = buf.readInt8(3);
    let rootDelay = buf.readUint32BE(4);
    let rootDispersion = buf.readUint32BE(8);
    let referenceIdentifier = buf.subarray(12, 16).toString("ascii");

    let referenceTimestampSeconds = buf.readUint32BE(16);
    let referenceTimestampFraction = buf.readUint32BE(20);
    let originateTimestampSeconds = buf.readUint32BE(24);
    let originateTimestampFraction = buf.readUint32BE(28);
    let receiveTimestampSeconds = buf.readUint32BE(32);
    let receiveTimestampFraction = buf.readUint32BE(36);
    let transmitTimestampSeconds = buf.readUint32BE(40);
    let transmitTimestampFraction = buf.readUint32BE(44);

    return {
        leapIndicator,
        versionNumber,
        messageMode,
        stratum,
        pollInterval,
        precision,
        rootDelay,
        rootDispersion,
        referenceIdentifier,

        referenceTimestamp: {
            seconds: referenceTimestampSeconds,
            fraction: referenceTimestampFraction
        },
        originateTimestamp: {
            seconds: originateTimestampSeconds,
            fraction: originateTimestampFraction
        },
        receiveTimestamp: {
            seconds: receiveTimestampSeconds,
            fraction: receiveTimestampFraction
        },
        transmitTimestamp: {
            seconds: transmitTimestampSeconds,
            fraction: transmitTimestampFraction
        }
    }
}
