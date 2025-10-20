# FxG ModBot - Advanced Discord Moderation Bot

A comprehensive Discord moderation bot with music, security, and utility features. Features a clean, no-embed interface (except for music commands), hardcoded role-based permissions, and a **beautiful web admin panel** with PostgreSQL database.

## 🌐 Web Admin Panel

**NEW!** Manage your bot from a beautiful web interface:
- 📊 Real-time dashboard with statistics
- ⚠️ Warning management
- 📋 Complete moderation logs
- 📅 Staff absence tracking
- 🏠 Guild configuration
- 📈 30-day statistics & trends
- 👥 User management
- 🔐 Secure authentication

**Quick Start:** See [WEB_PANEL_GUIDE.md](WEB_PANEL_GUIDE.md)

## Features

### 🔨 Moderation
- Ban, Unban, Kick, Softban
- Timeout (Temporary Mute)
- Warning System (auto-timeout at 3 warnings)
- Message Purge
- Channel Lockdown
- Slowmode Control

### 🛡️ Security & Auto-Moderation
- Anti-Raid Protection
- Anti-Ghost Ping Detection
- Word Filter/Blacklist
- Auto-Warn System
- Hardcoded Role-Based Permissions

### 📊 Utility & Information
- Polls
- Role Member Lists
- Active Staff Tracker
- Timers
- Server/User Info
- Ping & Latency
- IP Ping

### 🎵 Music & Audio
- Play from YouTube/Spotify
- Queue Management
- Volume Control (1-150%)
- Lyrics Fetching
- Playback Controls
- **Music commands use embeds for better presentation**

### ✉️ Messaging & Logging
- Anonymous DM System
- Comprehensive Auto-Logging
- Staff Absence Management
- User Reports

## Role-Based Permissions

The bot uses hardcoded role IDs for permissions:

- **Admin** (`1296065345424986183`): Full access to all commands
- **Management** (`1308840318690394233`): Absence management and utilities
- **Moderator** (`1379147275346907297`): Ban, kick, and heavy punishments
- **Helper** (`1246460406055178260`): Warning system
- **Support** (`1268911588992225280`): Timeout and moderation utilities
- **Everyone**: Music commands and basic utilities

See [PERMISSIONS.md](PERMISSIONS.md) for detailed permission matrix.

## 🚀 Quick Start (One Command!)

```bash
node index.js
```

This starts **everything**:
- ✅ Discord Bot
- ✅ Web Panel
- ✅ All databases
- ✅ All commands

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   cd web-panel && npm install && cd ..
   ```

2. **Configure bot** (`.env`):
   ```bash
   cp .env.example .env
   nano .env  # Add your Discord bot token
   ```

3. **Configure web panel** (`web-panel/.env`):
   ```bash
   cp web-panel/.env.example web-panel/.env
   nano web-panel/.env  # Add database credentials
   ```

4. **Deploy commands:**
   ```bash
   npm run deploy
   ```

5. **Start everything:**
   ```bash
   node index.js
   ```

**Access:**
- Discord: Use slash commands in your server
- Web Panel: http://localhost:3000

For detailed setup, see [START_HERE.md](START_HERE.md) or [SETUP.md](SETUP.md).

## Development

Run in development mode with auto-reload:
```bash
npm run dev
```

## Configuration

- **Environment**: Edit `.env` file
- **Role IDs**: Edit `src/config.js`
- **Permissions**: Edit `src/utils/permissions.js`

## Requirements

- Node.js 16.11.0 or higher
- MongoDB (local or cloud)
- Discord Bot Token with proper intents enabled

## Documentation

- [Setup Guide](SETUP.md) - Detailed installation and configuration
- [Commands Reference](COMMANDS.md) - Complete command documentation
- [Permissions](PERMISSIONS.md) - Role-based permission system

## Key Features

- ✅ **No Embeds** (except music) - Clean, simple text responses
- ✅ **Hardcoded Permissions** - No database configuration needed
- ✅ **Auto-Logging** - Comprehensive event logging
- ✅ **Anti-Raid** - Automatic mass-join protection
- ✅ **Word Filter** - Automatic message filtering
- ✅ **Music Player** - Full-featured music system

## License

MIT
