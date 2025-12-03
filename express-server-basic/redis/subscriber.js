// subscriber.js
const Redis = require('ioredis');
const subscriber = new Redis();

const handlers = {}; // store channel → handler

function subscribeTo(channel, handler) {
    handlers[channel] = handler;

    subscriber.subscribe(channel, (err) => {
        if (err) {
            console.error("Redis subscribe error:", err);
        } else {
            console.log(`Subscribed to channel: ${channel}`);
        }
    });
}

// single listener for all channels
subscriber.on("message", async (channel, message) => {
    const handler = handlers[channel];

    if (!handler) return; // no handler for this channel

    try {
       await handler(JSON.parse(message));
    } catch (e) {
        console.error("Message parse error:", e);
    }
});

module.exports = subscribeTo;
