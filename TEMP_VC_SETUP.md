# Temporary Voice Channel Setup Guide

## Overview
The FxG-modbot now includes a fully integrated temporary voice channel system that allows users to create and manage their own private voice channels.

## Features
- **Auto-create voice channels**: Users join a HUB channel and automatically get their own temporary VC
- **Full control panel**: Lock, hide, mute, limit users, ban/whitelist, change name, transfer ownership
- **Activity logging**: Track all voice channel activities (joins, leaves, creates, deletes, etc.)
- **Auto-cleanup**: Channels are automatically deleted when the owner leaves
- **Region selection**: Choose voice server region for optimal quality
- **Permission management**: Whitelist/ban users and roles from accessing your channel

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

This will install the required `level` database package and other dependencies.

### 2. Configure Environment Variables

Edit your `.env` file and add the following settings:

```env
# Temporary Voice Channel Settings
TEMP_VC_ENABLED=true
TEMP_VC_HUB_CHANNEL_ID=your_hub_voice_channel_id_here
TEMP_VC_CATEGORY_ID=your_category_id_here
TEMP_VC_DEFAULT_ROLE_ID=your_default_role_id_here
TEMP_VC_LOG_CHANNEL_ID=your_log_channel_id_here
TEMP_VC_ACTIVITY_LOG_CHANNEL_ID=your_activity_log_channel_id_here
```

### 3. Create Required Channels

You need to create the following channels in your Discord server:

#### A. Voice Channels
1. **HUB Voice Channel**: Create a voice channel where users will join to create their temp VC
   - Name it something like "➕ Create Temp VC"
   - Copy the channel ID and set it as `TEMP_VC_HUB_CHANNEL_ID`

2. **Category for Temp VCs**: Create a category where temporary voice channels will be created
   - Name it something like "Temporary Voice Channels"
   - Copy the category ID and set it as `TEMP_VC_CATEGORY_ID`

#### B. Text Channels (for logging)
1. **Log Channel**: Create a text channel for system logs
   - Name it something like "temp-vc-logs"
   - Copy the channel ID and set it as `TEMP_VC_LOG_CHANNEL_ID`

2. **Activity Log Channel**: Create a text channel for activity logs
   - Name it something like "temp-vc-activity"
   - Copy the channel ID and set it as `TEMP_VC_ACTIVITY_LOG_CHANNEL_ID`

### 4. Set Default Role ID

The `TEMP_VC_DEFAULT_ROLE_ID` should be set to your server's @everyone role ID:
- Right-click your server name → Server Settings → Roles
- Find @everyone role and copy its ID
- Set it as `TEMP_VC_DEFAULT_ROLE_ID`

### 5. Deploy Commands

Run the command deployment script to register the new slash commands:

```bash
npm run deploy
```

This will register the following commands:
- `/vc-fix` - Fix voice chat rooms (Admin only)
- `/vc-hubmsg` - Create HUB message (Admin only)
- `/vc-control` - Call control panel for your temp VC

### 6. Start the Bot

```bash
npm start
```

## Usage

### For Users

1. **Create a Temp VC**: Join the HUB voice channel
   - You'll be automatically moved to your new temporary voice channel
   - A control panel will appear in the channel

2. **Control Panel Buttons**:
   - **Lock/Unlock**: Lock channel so only whitelisted users can connect
   - **Hide/Unhide**: Make channel private (only whitelisted can see it)
   - **Mute/Unmute**: Only allow whitelisted users to speak
   - **Ban/Unban**: Ban specific users from joining
   - **Whitelist/Remove**: Manage whitelist for users and roles
   - **Limit**: Set user limit (0-99)
   - **Change Owner**: Transfer ownership to another user
   - **Change Name**: Rename your voice channel
   - **Kick**: Kick users from your channel
   - **Delete VC**: Delete your voice channel
   - **Change Region**: Select voice server region

3. **Auto-deletion**: When you leave your temp VC, it will be deleted after 10 seconds
   - Rejoin within 10 seconds to cancel deletion
   - If other users are present, ownership transfers to them

### For Admins

1. **Create HUB Message**: Use `/vc-hubmsg` to create an informational embed about the temp VC system

2. **Fix Issues**: Use `/vc-fix` to clean up the database and reset all temp VCs
   - This will delete all existing temp VCs
   - Useful if the system gets stuck

## Control Panel Commands

Users can also use `/vc-control` inside their temp VC to bring up the control panel again if they lose it.

## Logging

The system logs two types of activities:

### System Logs (TEMP_VC_LOG_CHANNEL_ID)
- Bot startup/shutdown
- Errors and warnings
- System events

### Activity Logs (TEMP_VC_ACTIVITY_LOG_CHANNEL_ID)
- User joins/leaves voice channels
- Temp VC creation/deletion
- Channel renames
- Ownership transfers
- User kicks/bans
- Whitelist changes
- Settings modifications

## Database

The temp VC system uses a LevelDB database stored in `tempvc-db/` directory. This database stores:
- Temp VC ownership information
- Control message IDs
- HUB channel bans (cooldown system)

The database is automatically managed and cleaned up.

## Troubleshooting

### Bot doesn't respond to HUB channel joins
- Check that `TEMP_VC_ENABLED=true` in your .env
- Verify the HUB channel ID is correct
- Ensure the bot has proper permissions (Manage Channels, Move Members)

### Control panel buttons don't work
- Make sure the bot has "Manage Channels" permission
- Check that the category ID is correct
- Verify the bot can send messages in voice channels

### Channels not being deleted
- Check the bot's permissions in the category
- Look for errors in the console or log channel

### Database issues
- Delete the `tempvc-db/` folder and restart the bot
- Use `/vc-fix` command to reset the system

## Required Bot Permissions

The bot needs the following permissions:
- Manage Channels
- Move Members
- Connect
- Speak
- View Channel
- Send Messages
- Embed Links
- Manage Permissions (for the category)

## Notes

- The system uses a 60-second cooldown after failed temp VC creation
- Channels are deleted 10 seconds after the owner leaves
- Maximum 25 users can be shown in kick/change owner menus (Discord limitation)
- The bot must be able to access the category where temp VCs are created

## Support

If you encounter any issues, check:
1. Console logs for errors
2. The log channel for system messages
3. Bot permissions in the category and channels
4. Environment variables are set correctly

---

**Enjoy your new temporary voice channel system!** 🎉
