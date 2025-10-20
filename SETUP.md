# FxG ModBot - Setup Guide

## Prerequisites

- Node.js 16.11.0 or higher
- MongoDB (local or MongoDB Atlas)
- Discord Bot Token
- Discord Application with proper intents enabled

## Step 1: Create Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to "Bot" section and click "Add Bot"
4. Enable these **Privileged Gateway Intents**:
   - Presence Intent
   - Server Members Intent
   - Message Content Intent
5. Copy your bot token (you'll need this later)
6. Copy your Application ID (Client ID)

## Step 2: Install Dependencies

```bash
cd FxG-modbot
npm install
```

## Step 3: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and fill in your credentials:
```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_test_guild_id_here  # Optional: for faster command deployment during testing

MONGODB_URI=mongodb://localhost:27017/fxg-modbot

GENIUS_API_KEY=your_genius_api_key_here  # Optional: for lyrics command
```

### Getting Genius API Key (Optional)

1. Go to [Genius API](https://genius.com/api-clients)
2. Create a new API client
3. Copy the "Client Access Token"

## Step 4: Setup MongoDB

### Option A: Local MongoDB
```bash
# Install MongoDB on your system
# Ubuntu/Debian:
sudo apt-get install mongodb

# Start MongoDB
sudo systemctl start mongodb
```

### Option B: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env`

## Step 5: Deploy Slash Commands

```bash
npm run deploy
```

This will register all slash commands with Discord. You should see output like:
```
[DEPLOY] Loaded: ban
[DEPLOY] Loaded: kick
...
[DEPLOY] Successfully reloaded X commands.
```

## Step 6: Invite Bot to Your Server

1. Go to Discord Developer Portal → Your Application → OAuth2 → URL Generator
2. Select scopes:
   - `bot`
   - `applications.commands`
3. Select bot permissions:
   - Administrator (or select specific permissions)
4. Copy the generated URL and open it in your browser
5. Select your server and authorize

## Step 7: Start the Bot

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

You should see:
```
[COMMAND] Loaded: ban
[COMMAND] Loaded: kick
...
[EVENT] Loaded: ready
[EVENT] Loaded: interactionCreate
...
[DATABASE] Connected to MongoDB
[READY] Logged in as YourBot#1234
```

## Step 8: Configure the Bot

1. Set up logging channel:
```
/logging #your-log-channel
```

2. Enable security features:
```
/anti-raid on
/anti-ghostping on
```

3. Add word filters:
```
/filter add badword
```

4. Configure role permissions (optional):
```
/role-permission set @ModRole ban
```

## Troubleshooting

### Bot doesn't respond to commands
- Make sure you deployed commands (`npm run deploy`)
- Check if bot has proper permissions in your server
- Verify intents are enabled in Discord Developer Portal

### Database connection errors
- Make sure MongoDB is running
- Check your `MONGODB_URI` in `.env`
- For MongoDB Atlas, whitelist your IP address

### Music commands not working
- Make sure you're in a voice channel
- Bot needs "Connect" and "Speak" permissions
- Some videos may be age-restricted or region-locked

### Permission errors
- Bot needs proper role hierarchy (bot's role should be higher than users it moderates)
- Check bot permissions in server settings
- Use `/role-permission` to configure custom permissions

## Updating Commands

If you modify any command files, redeploy them:
```bash
npm run deploy
```

Then restart the bot:
```bash
npm start
```

## Production Deployment

For production, consider:
1. Using a process manager (PM2):
```bash
npm install -g pm2
pm2 start src/index.js --name fxg-modbot
pm2 save
pm2 startup
```

2. Setting up proper logging
3. Using environment-specific configs
4. Regular database backups
5. Monitoring and error tracking

## Support

For issues or questions:
- Check the [README.md](README.md)
- Review command documentation
- Check bot logs for errors

## Security Notes

- Never commit your `.env` file
- Keep your bot token secret
- Regularly update dependencies
- Use role hierarchy properly
- Review permissions before granting admin access
