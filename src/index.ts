import { MessageMode, NTP_EPOCH, type Packet } from "./models";
import { buildRequest, readPacket } from "./packets";

async function makeRequest(address: string): Promise<Packet> {
    const req = buildRequest()

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
            const lookup = await Bun.dns.lookup(address);
            if (lookup === undefined || lookup.length === 0) return reject(new Error('Invalid address'));
            address = lookup[0]!.address;
        } catch (e) {
            return reject(new Error('Invalid address'));
        }

        client.send(req, 123, address);
        setTimeout(() => reject(new Error("Server timed out")), 5 * 1000)
    });
}

export class NTPClient {
    address: string;

    constructor(address: string) {
        this.address = address;
    }

    async syncRaw() {
        return await makeRequest(this.address);
    }

    async sync() {
        let res = await makeRequest(this.address);
        let second = res.transmitTimestamp.seconds - Number(NTP_EPOCH);
        let ms = Math.floor((res.transmitTimestamp.fraction * 1000) / Math.pow(2, 32));
        let timestamp = second * 1000 + ms;
        return new Date(timestamp);
    }
}
