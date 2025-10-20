# Quick Start - Temporary Voice Channels

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Channels in Discord

1. **Create a voice channel** named "➕ Create Temp VC"
   - Right-click the channel → Copy Channel ID
   
2. **Create a category** named "Temporary Voice Channels"
   - Right-click the category → Copy Channel ID
   
3. **Create two text channels**:
   - `temp-vc-logs` (for system logs)
   - `temp-vc-activity` (for activity logs)
   - Right-click each → Copy Channel ID

4. **Get your @everyone role ID**:
   - Server Settings → Roles → @everyone → Copy Role ID

### Step 2: Update .env File

Open `/home/darkwall/FxG-modbot/.env` and add:

```env
TEMP_VC_ENABLED=true
TEMP_VC_HUB_CHANNEL_ID=<paste_hub_voice_channel_id>
TEMP_VC_CATEGORY_ID=<paste_category_id>
TEMP_VC_DEFAULT_ROLE_ID=<paste_everyone_role_id>
TEMP_VC_LOG_CHANNEL_ID=<paste_log_channel_id>
TEMP_VC_ACTIVITY_LOG_CHANNEL_ID=<paste_activity_channel_id>
```

### Step 3: Deploy Commands & Start

```bash
cd /home/darkwall/FxG-modbot
npm run deploy
npm start
```

### Step 4: Test It!

1. Join the "➕ Create Temp VC" voice channel
2. You'll be moved to your own temp VC
3. Use the control panel buttons to manage your channel
4. Leave the channel to see it auto-delete after 10 seconds

## 🎮 Usage

### For Users
- **Join HUB channel** → Get your own temp VC
- **Use buttons** → Control your channel
- **Leave channel** → Auto-deletes after 10 seconds

### For Admins
- `/vc-hubmsg` → Create info message about temp VCs
- `/vc-fix` → Reset/fix the temp VC system
- `/vc-control` → Access control panel (when in your temp VC)

## 🎛️ Control Panel Features

| Button | Function |
|--------|----------|
| 🔒 Lock/Unlock | Control who can connect |
| 👤 Hide/Unhide | Control channel visibility |
| 🔇 Mute/Unmute | Control who can speak |
| 🚫 Ban/Unban | Ban users/roles |
| 🗒️ Whitelist | Whitelist users/roles |
| ⚠️ Limit | Set user limit (0-99) |
| 📲 Change Owner | Transfer ownership |
| 📝 Change Name | Rename channel |
| 💢 Kick | Kick users |
| 🗑️ Delete VC | Delete channel |
| 🌎 Change Region | Select voice region |

## 📊 What Gets Logged

### System Logs
- Bot startup/errors
- VC creation/deletion
- System events

### Activity Logs
- User joins/leaves
- Channel renames
- Ownership transfers
- Kicks/bans
- Whitelist changes
- Settings modifications

## ⚙️ Bot Permissions Needed

Make sure the bot has these permissions:
- ✅ Manage Channels
- ✅ Move Members
- ✅ Connect
- ✅ Speak
- ✅ View Channel
- ✅ Send Messages
- ✅ Embed Links
- ✅ Manage Permissions (in the temp VC category)

## 🐛 Troubleshooting

**Bot doesn't create temp VC?**
- Check `TEMP_VC_ENABLED=true` in .env
- Verify all channel IDs are correct
- Check bot permissions

**Control panel doesn't work?**
- Bot needs "Manage Channels" permission
- Check category ID is correct

**Channels not deleting?**
- Check bot permissions in category
- Look for errors in console

**Need to reset everything?**
- Use `/vc-fix` command
- Or delete `tempvc-db/` folder and restart

## 📝 Notes

- 60-second cooldown after failed creation
- 10-second auto-delete timer
- Max 25 users in menus (Discord limit)
- Database stored in `tempvc-db/` folder

---

**That's it! You're ready to go!** 🎉

For detailed documentation, see `TEMP_VC_SETUP.md`
