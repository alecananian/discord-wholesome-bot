const { InteractionType, InteractionResponseType } = require('./types');
const {
  getRandomWholesomePost,
  getTopWholesomePost,
  convertPostToResponseData
} = require('./utils/imgur');
const { createErrorResponse, createJsonResponse } = require('./utils/response');
const {
  verifyDiscordWebhookRequest,
  executeDiscordWebhook
} = require('./utils/webhook');

const handleRequest = async request => {
  const { method, headers } = request;
  if (method !== 'POST') {
    return createErrorResponse('Method not allowed', 405);
  }

  const body = await request.json();
  const isVerified = await verifyDiscordWebhookRequest(body, headers);
  if (!isVerified) {
    return createErrorResponse('Invalid request signature', 401);
  }

  if (body.type === InteractionType.Ping) {
    return createJsonResponse({ type: InteractionResponseType.Pong });
  }

  const post = await getRandomWholesomePost();
  return createJsonResponse({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: convertPostToResponseData(post)
  });
};

const handleScheduled = async () => {
  const post = await getTopWholesomePost();
  return executeDiscordWebhook(convertPostToResponseData(post));
};

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

addEventListener('scheduled', event => {
  event.waitUntil(handleScheduled());
});
