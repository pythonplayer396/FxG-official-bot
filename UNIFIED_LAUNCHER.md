# 🚀 Unified Launcher - One Command to Start Everything

## What is This?

The **Unified Launcher** (`index.js`) is a master script that starts both your Discord bot and web panel with a single command!

## ✨ Features

- 🎯 **One Command** - Start everything with `node index.js`
- ✅ **Automatic Checks** - Verifies .env files and dependencies
- 🔄 **Process Management** - Manages both bot and panel processes
- 🛑 **Graceful Shutdown** - Ctrl+C stops everything cleanly
- 📊 **Status Display** - Shows what's running
- 🎨 **Beautiful Output** - Clean, organized console messages

## 🎯 Usage

### Start Everything
```bash
node index.js
```

### Or use npm
```bash
npm start
```

### Development Mode (auto-reload)
```bash
npm run dev
```

### Start Only Bot
```bash
npm run bot
```

### Start Only Web Panel
```bash
npm run panel
```

## 📋 What It Does

When you run `node index.js`, it:

1. ✅ Checks if `.env` files exist
2. ✅ Checks if dependencies are installed
3. 🚀 Starts Discord Bot (`src/index.js`)
4. ⏱️ Waits 2 seconds
5. 🌐 Starts Web Panel (`web-panel/server.js`)
6. ✅ Shows success message
7. 👂 Listens for Ctrl+C to shutdown

## 📊 Output Example

```
╔═══════════════════════════════════════════════════════════════╗
║              FxG ModBot - Unified Launcher                    ║
╚═══════════════════════════════════════════════════════════════╝

🚀 Starting FxG ModBot System...

📱 Starting Discord Bot...
[COMMAND] Loaded: ban
[COMMAND] Loaded: kick
[COMMAND] Loaded: warn
...
[DATABASE] Connected to MongoDB
[READY] Logged in as FxG ModBot#1234

🌐 Starting Web Panel...
[DATABASE] PostgreSQL connection established successfully.
[DATABASE] All models synchronized.
[SERVER] Default admin user created
[SERVER] Username: admin
[SERVER] Password: changeme123
[SERVER] PLEASE CHANGE THE DEFAULT PASSWORD!
[SERVER] Web panel running on http://localhost:3000
[SERVER] Login at http://localhost:3000/login

╔═══════════════════════════════════════════════════════════════╗
║                    ✅ ALL SYSTEMS ONLINE                      ║
╚═══════════════════════════════════════════════════════════════╝

📱 Discord Bot: Running
🌐 Web Panel: http://localhost:3000

Press Ctrl+C to stop all services
```

## 🛑 Stopping

Press `Ctrl+C` once and it will:

1. Catch the signal
2. Stop Discord Bot gracefully
3. Stop Web Panel gracefully
4. Clean up processes
5. Exit cleanly

```
⚠️  Received shutdown signal...

🛑 Shutting down all services...
   Stopping Discord Bot...
   Stopping Web Panel...

✅ All services stopped
```

## 🔧 How It Works

The launcher uses Node.js `child_process.spawn()` to:

- Run bot in a separate process
- Run panel in a separate process
- Inherit stdio (see all output)
- Handle process exits
- Cleanup on shutdown

## 📝 File Structure

```
FxG-modbot/
├── index.js              ← Master launcher (THIS!)
├── src/
│   └── index.js          ← Discord bot
└── web-panel/
    └── server.js         ← Web panel
```

## ⚙️ Configuration

The launcher reads from:
- `.env` - Bot configuration
- `web-panel/.env` - Panel configuration

No additional configuration needed!

## 🐛 Error Handling

### Missing .env Files
```
⚠️  Bot .env file not found!
   Run: cp .env.example .env

⚠️  Web panel .env file not found!
   Run: cp web-panel/.env.example web-panel/.env

❌ Please create .env files before starting.
```

### Missing Dependencies
```
⚠️  Bot dependencies not installed!
   Run: npm install

⚠️  Web panel dependencies not installed!
   Run: cd web-panel && npm install

❌ Please install dependencies before starting.
```

### Process Crashes
If either process crashes, the launcher will:
1. Show error message
2. Stop other processes
3. Exit cleanly

## 🎯 Benefits

### Before (Manual)
```bash
# Terminal 1
node src/index.js

# Terminal 2
cd web-panel && node server.js
```

### After (Unified)
```bash
# One terminal
node index.js
```

## 🚀 Production Deployment

### Option 1: Direct
```bash
node index.js
```

### Option 2: PM2
```bash
pm2 start index.js --name "fxg-system"
pm2 save
pm2 startup
```

### Option 3: Systemd
Create `/etc/systemd/system/fxg-modbot.service`:
```ini
[Unit]
Description=FxG ModBot System
After=network.target mongodb.service postgresql.service

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/FxG-modbot
ExecStart=/usr/bin/node index.js
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable:
```bash
sudo systemctl enable fxg-modbot
sudo systemctl start fxg-modbot
```

## 📊 Process Management

The launcher tracks:
- Bot process PID
- Panel process PID
- Exit codes
- Error states

## 🎨 Customization

You can modify `index.js` to:
- Change startup delay
- Add more processes
- Customize output
- Add health checks
- Implement auto-restart

## ✅ Checklist

Before running `node index.js`:

- [ ] Node.js 16.11.0+ installed
- [ ] MongoDB running
- [ ] PostgreSQL running
- [ ] PostgreSQL database created
- [ ] Bot dependencies installed (`npm install`)
- [ ] Panel dependencies installed (`cd web-panel && npm install`)
- [ ] Bot `.env` configured
- [ ] Panel `web-panel/.env` configured
- [ ] Commands deployed (`npm run deploy`)

## 🎉 That's It!

Just run:
```bash
node index.js
```

And everything starts! 🚀

---

**Simple. Clean. Powerful.**

One command to rule them all! 👑
