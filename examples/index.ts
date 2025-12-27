import { NTPClient } from "../src";

// Example with the University of Lyon's NTP server
const client = new NTPClient("134.214.100.6");

// Raw sync
console.log(await client.syncRaw());

// Sync
console.log(await client.sync());
