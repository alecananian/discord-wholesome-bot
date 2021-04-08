const nacl = require('tweetnacl');

const verifyDiscordWebhookRequest = (body, headers) =>
  nacl.sign.detached.verify(
    Buffer.from(headers.get('X-Signature-Timestamp') + JSON.stringify(body)),
    Buffer.from(headers.get('X-Signature-Ed25519'), 'hex'),
    Buffer.from(DISCORD_APP_PUBLIC_KEY, 'hex')
  );

module.exports = { verifyDiscordWebhookRequest };
