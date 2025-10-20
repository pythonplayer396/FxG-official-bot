# FxG ModBot - Project Summary

## 📊 Statistics

- **Total Files**: 70+
- **Commands**: 41
- **Events**: 6
- **Models**: 4
- **Utilities**: 5
- **Lines of Code**: ~5,000+

## 🗂️ Project Structure

```
FxG-modbot/
├── src/
│   ├── commands/
│   │   ├── admin/          (5 commands)
│   │   │   ├── absence.js
│   │   │   ├── logging.js
│   │   │   ├── message.js
│   │   │   ├── report.js
│   │   │   └── role-permission.js
│   │   ├── moderation/     (12 commands)
│   │   │   ├── ban.js
│   │   │   ├── clear-warnings.js
│   │   │   ├── kick.js
│   │   │   ├── lockdown.js
│   │   │   ├── purge.js
│   │   │   ├── slowmode.js
│   │   │   ├── softban.js
│   │   │   ├── timeout.js
│   │   │   ├── unban.js
│   │   │   ├── unlock.js
│   │   │   ├── warn.js
│   │   │   └── warnings.js
│   │   ├── music/          (9 commands - with embeds)
│   │   │   ├── lyrics.js
│   │   │   ├── nowplaying.js
│   │   │   ├── pause.js
│   │   │   ├── play.js
│   │   │   ├── queue.js
│   │   │   ├── resume.js
│   │   │   ├── skip.js
│   │   │   ├── stop.js
│   │   │   └── volume.js
│   │   ├── security/       (4 commands)
│   │   │   ├── anti-ghostping.js
│   │   │   ├── anti-raid.js
│   │   │   ├── autowarn.js
│   │   │   └── filter.js
│   │   └── utility/        (11 commands)
│   │       ├── active-staff.js
│   │       ├── avatar.js
│   │       ├── help.js
│   │       ├── inrole.js
│   │       ├── ping.js
│   │       ├── ping-ip.js
│   │       ├── poll.js
│   │       ├── servericon.js
│   │       ├── serverinfo.js
│   │       ├── timer.js
│   │       └── userinfo.js
│   ├── events/
│   │   ├── ready.js
│   │   ├── interactionCreate.js
│   │   ├── guildMemberAdd.js
│   │   ├── guildMemberRemove.js
│   │   ├── messageCreate.js
│   │   └── messageDelete.js
│   ├── models/
│   │   ├── Absence.js
│   │   ├── GuildConfig.js
│   │   ├── ModLog.js
│   │   └── Warning.js
│   ├── utils/
│   │   ├── embedBuilder.js  (for music only)
│   │   ├── logger.js
│   │   ├── messages.js      (NEW - simple text)
│   │   ├── permissions.js   (UPDATED - role-based)
│   │   └── timeParser.js
│   ├── config.js            (UPDATED - role IDs)
│   ├── index.js
│   └── deploy-commands.js
├── Documentation/
│   ├── README.md
│   ├── SETUP.md
│   ├── COMMANDS.md
│   ├── PERMISSIONS.md
│   ├── QUICKSTART.md
│   └── CHANGES.md
├── Configuration/
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
└── Scripts/
    ├── convert-to-simple-messages.js
    └── update-commands.sh
```

## ✨ Key Features

### 1. Role-Based Permissions
- **5 role levels** with specific permissions
- **Hardcoded** in `src/config.js`
- **No database** configuration needed
- **Hierarchical** - higher roles inherit lower permissions

### 2. Clean Interface
- **No embeds** (except music)
- **Simple text** responses with emojis
- **Fast** and lightweight
- **Easy to read**

### 3. Comprehensive Moderation
- Ban, kick, timeout, warn
- Message purge
- Server lockdown
- Slowmode control
- Auto-moderation

### 4. Security Features
- Anti-raid protection
- Anti-ghost ping
- Word filter
- Auto-warn system

### 5. Music System
- YouTube/Spotify support
- Queue management
- Volume control
- Lyrics fetching
- **Uses embeds** for better presentation

### 6. Logging & Tracking
- Auto-logging all events
- Staff absence tracking
- Warning system
- Moderation logs

## 🎯 Role Permissions

| Role | ID | Access Level |
|------|-----|--------------|
| Admin | `1296065345424986183` | Full access |
| Management | `1308840318690394233` | Absence & utilities |
| Moderator | `1379147275346907297` | Heavy punishments |
| Helper | `1246460406055178260` | Warnings |
| Support | `1268911588992225280` | Timeout & mute |
| Everyone | - | Music & basic utilities |

## 📝 Command Categories

### Moderation (12 commands)
Ban, unban, kick, softban, timeout, warn, warnings, clear-warnings, purge, lockdown, unlock, slowmode

### Security (4 commands)
Anti-raid, anti-ghostping, filter, autowarn

### Admin (5 commands)
Absence, logging, message, report, role-permission

### Music (9 commands)
Play, skip, stop, queue, pause, resume, volume, nowplaying, lyrics

### Utility (11 commands)
Poll, inrole, active-staff, timer, ping, ping-ip, help, avatar, servericon, serverinfo, userinfo

## 🔧 Technologies

- **Discord.js v14** - Discord API wrapper
- **discord-player** - Music system
- **MongoDB/Mongoose** - Database
- **Node.js 16+** - Runtime
- **ytdl-core** - YouTube downloads
- **genius-lyrics-api** - Lyrics fetching

## 📚 Documentation

1. **README.md** - Overview and quick start
2. **SETUP.md** - Detailed installation guide
3. **COMMANDS.md** - Complete command reference
4. **PERMISSIONS.md** - Role permission matrix
5. **QUICKSTART.md** - Fast setup guide
6. **CHANGES.md** - Recent modifications

## 🚀 Quick Start

```bash
# Install
npm install

# Configure
cp .env.example .env
# Edit .env with your tokens

# Deploy commands
npm run deploy

# Start bot
npm start
```

## ✅ What's Working

- ✅ All 41 commands functional
- ✅ Role-based permissions
- ✅ No embeds (except music)
- ✅ Auto-moderation
- ✅ Logging system
- ✅ Music player
- ✅ Warning system
- ✅ Anti-raid
- ✅ Word filter

## 🎨 Design Philosophy

1. **Simplicity** - Clean text responses
2. **Performance** - Fast and lightweight
3. **Security** - Hardcoded permissions
4. **Flexibility** - Easy to modify
5. **Reliability** - Comprehensive error handling

## 📊 Message Format Examples

### Non-Music Commands (Simple Text)
```
✅ Banned User#1234 (123456789)
Reason: Spamming
Messages Deleted: 7 days
```

### Music Commands (Embeds)
```
🎵 Now Playing
Song Title - Artist
Duration: 3:45
[Progress Bar]
```

## 🔐 Security

- Role hierarchy enforced
- Permission checks before execution
- Audit logging
- Anti-raid protection
- Word filtering
- Ghost ping detection

## 🎯 Target Use Case

Perfect for:
- Medium to large Discord servers
- Servers with defined staff hierarchy
- Communities needing clean, simple moderation
- Servers wanting music + moderation in one bot

## 📞 Support

- Check documentation files
- Review command reference
- Test with `/help` command
- Check console logs for errors

---

**Built with ❤️ for FxG Community**
