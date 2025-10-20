# Setup Checklist

## ✅ Pre-Installation

- [ ] Node.js 16.11.0+ installed
- [ ] MongoDB installed or MongoDB Atlas account ready
- [ ] Discord bot created in Developer Portal
- [ ] Bot token obtained
- [ ] Client ID obtained
- [ ] Guild ID obtained (for testing)

## ✅ Bot Configuration (Discord Developer Portal)

- [ ] Privileged Gateway Intents enabled:
  - [ ] Presence Intent
  - [ ] Server Members Intent
  - [ ] Message Content Intent
- [ ] Bot permissions configured:
  - [ ] Administrator (or specific permissions)
- [ ] Bot invited to server

## ✅ Installation

- [ ] Repository cloned/downloaded
- [ ] `npm install` completed successfully
- [ ] `.env` file created from `.env.example`
- [ ] `.env` file filled with:
  - [ ] DISCORD_TOKEN
  - [ ] CLIENT_ID
  - [ ] GUILD_ID (optional)
  - [ ] MONGODB_URI
  - [ ] GENIUS_API_KEY (optional)

## ✅ Role Configuration

- [ ] Verify role IDs in `src/config.js`:
  - [ ] Admin role: `1296065345424986183`
  - [ ] Management role: `1308840318690394233`
  - [ ] Moderator role: `1379147275346907297`
  - [ ] Helper role: `1246460406055178260`
  - [ ] Support role: `1268911588992225280`
- [ ] Update role IDs if different in your server

## ✅ Deployment

- [ ] Commands deployed: `npm run deploy`
- [ ] No errors in deployment
- [ ] Bot started: `npm start`
- [ ] Bot shows as online in Discord
- [ ] Console shows "Logged in as [BotName]"

## ✅ Initial Configuration

- [ ] Logging channel set: `/logging #channel`
- [ ] Anti-raid configured (if needed): `/anti-raid on`
- [ ] Anti-ghostping enabled (if needed): `/anti-ghostping on`
- [ ] Word filters added (if needed): `/filter add word`

## ✅ Testing

### Basic Commands
- [ ] `/ping` - Bot responds with latency
- [ ] `/help` - Shows command list
- [ ] `/serverinfo` - Shows server information

### Permission Testing
- [ ] Admin role can use all commands
- [ ] Moderator role can use `/ban`, `/kick`
- [ ] Helper role can use `/warn`
- [ ] Support role can use `/timeout`
- [ ] Everyone can use music commands

### Moderation Commands
- [ ] `/warn @user reason` - Issues warning
- [ ] `/warnings @user` - Shows warnings
- [ ] `/timeout @user 10m reason` - Times out user
- [ ] `/purge 10` - Deletes messages

### Music Commands
- [ ] `/play song name` - Plays music
- [ ] `/queue` - Shows queue
- [ ] `/skip` - Skips song
- [ ] `/stop` - Stops music

### Security Features
- [ ] Word filter working (if configured)
- [ ] Anti-raid working (if enabled)
- [ ] Logging working (if configured)

## ✅ Verification

- [ ] All commands respond (no errors)
- [ ] Permissions work correctly
- [ ] Messages are simple text (no embeds except music)
- [ ] Music commands show embeds
- [ ] Database saves warnings/logs
- [ ] Auto-moderation working

## ✅ Production Ready

- [ ] All tests passed
- [ ] Logging configured
- [ ] Security features enabled
- [ ] Role permissions verified
- [ ] Documentation reviewed
- [ ] Team trained on commands

## 🔧 Troubleshooting

If something doesn't work:

1. **Bot doesn't respond**
   - [ ] Check if bot is online
   - [ ] Verify commands deployed
   - [ ] Check console for errors
   - [ ] Verify bot permissions

2. **Permission errors**
   - [ ] Check role IDs in `src/config.js`
   - [ ] Verify user has correct role
   - [ ] Check role hierarchy

3. **Database errors**
   - [ ] Verify MongoDB is running
   - [ ] Check MONGODB_URI in `.env`
   - [ ] Check console for connection errors

4. **Music not working**
   - [ ] User must be in voice channel
   - [ ] Bot needs voice permissions
   - [ ] Check console for errors

## 📝 Notes

- Server owner bypasses all permission checks
- Bot owner bypasses all permission checks
- Discord Administrator permission bypasses all checks
- Music commands use embeds (this is intentional)
- All other commands use simple text

## 🎯 Next Steps

After setup:
1. Train staff on available commands
2. Configure auto-moderation rules
3. Set up word filters
4. Test with different roles
5. Monitor logs for issues

---

**Setup Complete! 🎉**

For help, see:
- [QUICKSTART.md](QUICKSTART.md)
- [SETUP.md](SETUP.md)
- [COMMANDS.md](COMMANDS.md)
- [PERMISSIONS.md](PERMISSIONS.md)
