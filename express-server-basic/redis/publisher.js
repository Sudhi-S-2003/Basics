

const Redis = require('ioredis');

const publisher = new Redis();

/**
 * Publish an event to a Redis channel.
 * @param {string} channel - The Redis channel to publish to.
 * @param {Object} payload - The data to send in the message.
 */
async function publishEvent(channel, payload) {
  if (typeof channel !== "string") {
    throw new Error("Channel must be a string");
  }

  if (typeof payload !== "object" || payload === null) {
    throw new Error("Payload must be a non-null object");
  }

  const message = JSON.stringify(payload);

  // Publish the message to the specified channel
  await publisher.publish(channel, message);
}

module.exports = publishEvent;
