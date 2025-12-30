# buntp
🧅 A simple NTP client implementation for Bun

This implementation was done following the [RFC 4330](https://datatracker.ietf.org/doc/html/rfc4330).

## Installation
```sh
bun add buntp
```

## Usage
```typescript
import { NTPClient } from "buntp";

const client = new NTPClient("your ntp server address");
let date = await client.sync(); // Returning a Date object
let rawRes = await client.rawSync(); // Returning a Packet object (see definition at src/models.ts)
```
