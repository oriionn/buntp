export const NTP_EPOCH = 2208988800n;

export enum LeapIndicator {
    NO_WARNING = 0, // no warning
    LAST_MINUTE_61_SECONDS = 1, // last minute has 61 seconds
    LAST_MINUTE_59_SECONDS = 2, // last minute has 59 seconds
    ALARM_CONDITION = 3, // clock not synchronized
}

export enum MessageMode {
    REQUEST = 3,
    RESPONSE = 4
}

export enum Stratum {
    KOD, // kiss-o'-death
    PRIMARY, // primary reference
    SECONDARY, // secondary reference,
    RESERVED // reserved
}

export interface NTPTime {
    seconds: number;
    fraction: number;
}

export interface Packet {
    leapIndicator: LeapIndicator;
    versionNumber: number;
    messageMode: MessageMode;
    stratum: Stratum;
    pollInterval: number;
    precision: number;
    rootDelay: number;
    rootDispersion: number;
    referenceIdentifier: string;

    referenceTimestamp: NTPTime;
    originateTimestamp: NTPTime;
    receiveTimestamp: NTPTime;
    transmitTimestamp: NTPTime;
}
