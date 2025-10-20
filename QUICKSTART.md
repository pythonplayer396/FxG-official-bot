# Quick Start Guide

## 1. Install Dependencies

```bash
npm install
```

## 2. Configure Environment

Create a `.env` file:

```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_guild_id_here

MONGODB_URI=mongodb://localhost:27017/fxg-modbot

GENIUS_API_KEY=your_genius_api_key_here
```

## 3. Deploy Commands

```bash
npm run deploy
```

## 4. Start the Bot

```bash
npm start
```

## 5. Configure in Discord

Once the bot is online:

1. Set up logging:
   ```
   /logging #your-log-channel
   ```

2. Enable security features:
   ```
   /anti-raid on
   /anti-ghostping on
   ```

3. Add word filters (optional):
   ```
   /filter add badword
   ```

## Role Configuration

The bot is pre-configured with these role IDs:

- **Admin**: `1296065345424986183`
- **Management**: `1308840318690394233`
- **Moderator**: `1379147275346907297`
- **Helper**: `1246460406055178260`
- **Support**: `1268911588992225280`

To change these, edit `src/config.js`.

## Testing

Test basic commands:
- `/ping` - Check bot latency
- `/help` - View all commands
- `/serverinfo` - View server information

Test moderation (with appropriate role):
- `/warn @user reason` - Issue a warning
- `/timeout @user 10m reason` - Timeout a user

Test music (everyone can use):
- `/play song name` - Play music

## Troubleshooting

### Bot doesn't respond
- Check if commands are deployed: `npm run deploy`
- Verify bot has proper permissions in Discord
- Check console for errors

### Permission errors
- Verify your role IDs in `src/config.js`
- Check if you have the required role
- Server owner bypasses all checks

### Database errors
- Make sure MongoDB is running
- Check `MONGODB_URI` in `.env`

## Next Steps

- Read [PERMISSIONS.md](PERMISSIONS.md) for detailed permission info
- Read [COMMANDS.md](COMMANDS.md) for all available commands
- Configure word filters and auto-moderation
- Set up absence tracking for staff
