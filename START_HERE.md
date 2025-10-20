# 🚀 Start Here - Quick Setup Guide

## One Command to Rule Them All! 

Just run `node index.js` and **everything starts automatically**:
- ✅ Discord Bot
- ✅ Web Panel
- ✅ Database connections
- ✅ All commands loaded

## 📋 Prerequisites Checklist

Before running, make sure you have:

### 1. Node.js Installed
```bash
node --version  # Should be 16.11.0 or higher
```

### 2. MongoDB Running (for Discord bot)
```bash
# Ubuntu/Debian
sudo systemctl status mongodb

# macOS
brew services list | grep mongodb
```

### 3. PostgreSQL Running (for web panel)
```bash
# Ubuntu/Debian
sudo systemctl status postgresql

# macOS
brew services list | grep postgresql
```

### 4. PostgreSQL Database Created
```bash
sudo -u postgres psql
CREATE DATABASE fxg_modbot;
CREATE USER fxg_admin WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE fxg_modbot TO fxg_admin;
\q
```

### 5. Dependencies Installed
```bash
# Bot dependencies
npm install

# Web panel dependencies
cd web-panel
npm install
cd ..
```

### 6. Configuration Files
```bash
# Bot config
cp .env.example .env
nano .env  # Add your Discord bot token

# Web panel config
cp web-panel/.env.example web-panel/.env
nano web-panel/.env  # Add database credentials
```

## 🎯 Quick Start (3 Steps)

### Step 1: Configure Bot
Edit `.env`:
```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
MONGODB_URI=mongodb://localhost:27017/fxg-modbot
```

### Step 2: Configure Web Panel
Edit `web-panel/.env`:
```env
DB_PASSWORD=your_postgres_password
SESSION_SECRET=random_string_here
ADMIN_PASSWORD=your_admin_password
```

### Step 3: Start Everything!
```bash
node index.js
```

That's it! 🎉

## 📱 Access Points

Once started, you can access:

- **Discord Bot:** Use slash commands in your Discord server
- **Web Panel:** http://localhost:3000
  - Username: `admin`
  - Password: (what you set in web-panel/.env)

## 🛑 Stopping

Press `Ctrl+C` to stop everything gracefully.

## 📝 Available Commands

```bash
# Start everything (bot + panel)
node index.js
# or
npm start

# Start only the bot
npm run bot

# Start only the web panel
npm run panel

# Deploy slash commands
npm run deploy

# Development mode (auto-reload)
npm run dev
```

## ✅ Verification

After starting, you should see:

```
╔═══════════════════════════════════════════════════════════════╗
║              FxG ModBot - Unified Launcher                    ║
╚═══════════════════════════════════════════════════════════════╝

🚀 Starting FxG ModBot System...

📱 Starting Discord Bot...
[COMMAND] Loaded: ban
[COMMAND] Loaded: kick
...
[DATABASE] Connected to MongoDB
[READY] Logged in as YourBot#1234

🌐 Starting Web Panel...
[DATABASE] PostgreSQL connection established successfully.
[SERVER] Web panel running on http://localhost:3000

╔═══════════════════════════════════════════════════════════════╗
║                    ✅ ALL SYSTEMS ONLINE                      ║
╚═══════════════════════════════════════════════════════════════╝

📱 Discord Bot: Running
🌐 Web Panel: http://localhost:3000

Press Ctrl+C to stop all services
```

## 🐛 Troubleshooting

### "Cannot find module"
```bash
npm install
cd web-panel && npm install
```

### "MongoDB connection error"
```bash
sudo systemctl start mongodb
```

### "PostgreSQL connection error"
```bash
sudo systemctl start postgresql
```

### "Port already in use"
Change `WEB_PORT` in `web-panel/.env` to a different port.

### "Bot token invalid"
Check your `DISCORD_TOKEN` in `.env` file.

## 🎓 First Time Setup

If this is your first time:

1. **Read:** `SETUP.md` for detailed bot setup
2. **Read:** `WEB_PANEL_GUIDE.md` for web panel setup
3. **Deploy commands:** `npm run deploy`
4. **Start:** `node index.js`

## 📚 Documentation

- **SETUP.md** - Detailed bot setup
- **WEB_PANEL_GUIDE.md** - Web panel setup
- **COMMANDS.md** - All available commands
- **PERMISSIONS.md** - Role permissions
- **COMPLETE_PROJECT_SUMMARY.md** - Everything overview

## 🎉 You're Ready!

Just run:
```bash
node index.js
```

And everything starts automatically! 🚀

---

**Need Help?** Check the documentation files or the troubleshooting section above.
