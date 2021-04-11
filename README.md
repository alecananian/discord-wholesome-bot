# discord-wholesome-bot

Bot/interaction receiver for [Discord Slash Commands](https://discord.com/developers/docs/interactions/slash-commands) that posts a [wholesome image](https://imgur.com/t/wholesome) to your channel 🤗

## Develop

### Prerequisites

- [Cloudflare Workers](https://workers.cloudflare.com) account
- [Discord Developer](https://discord.com/developers/applications) Application and Bot
- [Imgur API](https://imgur.com/account/settings/apps) Application
- [ngrok](https://ngrok.com)

### Setup
Create a new JavaScript Cloudflare Worker with the name `discord-wholesome-bot` and deploy with the default setup. Add the following environment variables to the worker as secrets (encrypted values):

```
DISCORD_APP_PUBLIC_KEY
DISCORD_WEBHOOK_URL
IMGUR_API_CLIENT_ID
```

In your local code respository, create a `wrangler.toml` file from the provided example file:

```
cp wrangler.toml.example wrangler.toml
```

Fill in the `account_id` and KV Namespace IDs.

### Run
Start the worker:

```
npm start
```

Start an `ngrok` listener pointing to your worker's port:

```
ngrok http 8787
```

Take the resulting `Forwarding` HTTPS domain and enter it as your Discord application's "Interactions Endpoint URL" in the developer portal.

In the OAuth2 tab, select the `bot` and `applications.commands` scopes, and navigate to the provided URL to add the application to your Discord server (guild).

Add the `/wholesome` slash command to your application, replacing `<BOT_TOKEN>` and `<APPLICATION_ID>` with your application's values:

```
curl --location --request POST 'https://discord.com/api/v8/applications/<APPLICATION_ID>/commands' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bot <BOT_TOKEN>' \
--data-raw '{
    "name": "wholesome",
    "description": "Send a wholesome photo",
    "options": []
}'
```

Go to your Discord server and test it out!

## Deploy

Manually publish to Cloudflare Workers:

```
npm run publish
```
