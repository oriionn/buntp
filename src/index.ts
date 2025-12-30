import { MessageMode, NTP_EPOCH, type Packet } from "./models";
import { buildRequest, readPacket } from "./packets";

export class NTPClient {
    address: string;
    timeout: number;

    /**
     *
     * @param {string} address    Address of the NTP server
     * @param {number} [ttl=5000] Timeout for sync requests (in milliseconds)
     */
    constructor(address: string, ttl: number = 5000) {
        this.address = address;
        this.timeout = ttl;
    }

    _makeReq(): Promise<Packet> {
        const req = buildRequest();

        return new Promise(async (resolve, reject) => {
            const client = await Bun.udpSocket({
                socket: {
                    data(socket, buf) {
                        let packet = readPacket(buf);
                        if (packet.messageMode === MessageMode.RESPONSE) {
                            socket.close();
                            return resolve(packet);
                        }
                    }
                },
            });

            try {
                const lookup = await Bun.dns.lookup(this.address);
                if (lookup === undefined || lookup.length === 0) return reject(new Error('Invalid address'));
                this.address = lookup[0]!.address;
            } catch (e) {
                return reject(new Error('Invalid address'));
            }


            client.send(req, 123, this.address);
            setTimeout(() => reject(new Error("Server timed out")), this.timeout)
        });
    }

    async rawSync(): Promise<Packet> {
        return await this._makeReq();
    }

    async sync(): Promise<Date> {
        let res = await this._makeReq();
        let second = res.transmitTimestamp.seconds - Number(NTP_EPOCH);
        let ms = Math.floor((res.transmitTimestamp.fraction * 1000) / Math.pow(2, 32));
        let timestamp = second * 1000 + ms;
        return new Date(timestamp);
    }
}
