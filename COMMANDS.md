# FxG ModBot - Command Reference

## 🔨 Moderation Commands

### `/ban [user] [reason] [delete_days]`
Permanently ban a user from the server.
- **user**: The user to ban
- **reason**: Reason for the ban (optional)
- **delete_days**: Number of days of messages to delete (0-7, optional)
- **Permissions**: Ban Members

### `/unban [user_id]`
Unban a user using their User ID.
- **user_id**: The Discord ID of the banned user
- **Permissions**: Ban Members

### `/kick [user] [reason]`
Remove a user from the server.
- **user**: The user to kick
- **reason**: Reason for the kick (optional)
- **Permissions**: Kick Members

### `/softban [user] [days] [reason]`
Ban and immediately unban a user to delete their messages.
- **user**: The user to softban
- **days**: Number of days of messages to delete (1-7)
- **reason**: Reason for the softban (optional)
- **Permissions**: Ban Members

### `/timeout [user] [duration] [reason]`
Temporarily mute a user in text & voice.
- **user**: The user to timeout
- **duration**: Duration (e.g., 10m, 2h, 1d)
- **reason**: Reason for the timeout (optional)
- **Permissions**: Moderate Members

### `/warn [user] [reason]`
Issue a formal warning to a user.
- **user**: The user to warn
- **reason**: Reason for the warning
- **Permissions**: Moderate Members
- **Note**: Auto-timeout after 3 warnings

### `/warnings [user]`
View all active warnings for a user.
- **user**: The user to check
- **Permissions**: Moderate Members

### `/clear-warnings [user]`
Remove all warnings from a user.
- **user**: The user to clear warnings for
- **Permissions**: Administrator

### `/purge [amount] [user]`
Bulk delete a specified number of messages.
- **amount**: Number of messages to delete (1-100)
- **user**: Only delete messages from this user (optional)
- **Permissions**: Manage Messages
- **Note**: Can only delete messages less than 14 days old

### `/lockdown [duration]`
Lock all channels to prevent messaging.
- **duration**: Duration of lockdown (e.g., 10m, 1h) - leave empty for indefinite
- **Permissions**: Administrator

### `/unlock`
Unlock all channels after a lockdown.
- **Permissions**: Administrator

### `/slowmode [duration]`
Set slowmode for the current channel.
- **duration**: Slowmode duration (e.g., 5s, 10s, 1m) or "off" to disable
- **Permissions**: Manage Channels

---

## 🛡️ Security & Auto-Moderation

### `/anti-raid [status] [threshold] [timewindow]`
Toggle anti-raid protection.
- **status**: on/off
- **threshold**: Number of joins to trigger (3-20, optional)
- **timewindow**: Time window in seconds (5-60, optional)
- **Permissions**: Administrator
- **Default**: 5 joins in 10 seconds

### `/anti-ghostping [status]`
Toggle anti-ghost ping detection.
- **status**: on/off
- **Permissions**: Administrator
- **Note**: Logs deleted messages with mentions

### `/filter add [word]`
Add a word to the blacklist.
- **word**: The word or phrase to blacklist
- **Permissions**: Manage Guild

### `/filter remove [word]`
Remove a word from the blacklist.
- **word**: The word or phrase to remove
- **Permissions**: Manage Guild

### `/filter list`
Show all blacklisted words.
- **Permissions**: Manage Guild

### `/filter toggle [status]`
Enable or disable the word filter.
- **status**: on/off
- **Permissions**: Manage Guild

### `/autowarn add [trigger] [level]`
Add an auto-warn trigger.
- **trigger**: The word/phrase that triggers the warning
- **level**: Warning level (1-5)
- **Permissions**: Administrator

### `/autowarn remove [trigger]`
Remove an auto-warn trigger.
- **trigger**: The trigger to remove
- **Permissions**: Administrator

### `/autowarn list`
List all auto-warn triggers.
- **Permissions**: Administrator

---

## 📊 Utility & Information

### `/poll [question] [option1] [option2] [option3] [option4] [option5]`
Create a quick poll with reactions.
- **question**: The poll question
- **option1-5**: Poll options (minimum 2 required)

### `/inrole [role]`
List all members who have a specific role.
- **role**: The role to check

### `/active-staff`
Shows which staff members are currently online.
- **Note**: Shows members with moderation permissions

### `/timer [duration] [task]`
Set a timer.
- **duration**: Timer duration (e.g., 10m, 1h)
- **task**: What the timer is for
- **Note**: Max 24 hours

### `/ping`
Check the bot's latency and API response time.

### `/serverinfo`
Display detailed information about the server.

### `/userinfo [user]`
Display information about a user.
- **user**: The user to get info about (optional, defaults to you)

### `/avatar [user]`
Display a user's avatar.
- **user**: The user to get avatar from (optional)

### `/servericon`
Display the server's icon.

### `/ping-ip [host]`
Ping a host to check its status.
- **host**: The host or IP address to ping
- **Note**: Use cautiously, has 30s cooldown

### `/help`
Display all available commands and features.

---

## 🎵 Music Commands

### `/play [query]`
Play a song from YouTube or Spotify.
- **query**: Song name or URL
- **Note**: Must be in a voice channel

### `/skip`
Skip the currently playing song.

### `/stop`
Stop the music and clear the queue.

### `/queue`
Display the current music queue.

### `/pause`
Pause the current song.

### `/resume`
Resume the paused song.

### `/volume [level]`
Adjust the playback volume.
- **level**: Volume level (1-150)

### `/nowplaying`
Display information about the current song.

### `/lyrics [song]`
Fetch lyrics for the current or a specified song.
- **song**: Song name to search for (optional)
- **Note**: Requires Genius API key

---

## ⚙️ Admin Commands

### `/status [type] [text] [url]`
Change the bot's status and activity.
- **type**: The type of activity (Playing, Watching, Listening, Competing, Streaming)
- **text**: The status text to display
- **url**: The streaming URL (only required for Streaming type)
- **Permissions**: Administrator

### `/message [user] [message]`
Send a direct message to a user anonymously from the server.
- **user**: The user to message
- **message**: The message to send
- **Permissions**: Moderate Members

---

## ✉️ Logging

### `/logging [channel]`
Set the channel for moderation logs.
- **channel**: The channel to send logs to
- **Permissions**: Administrator

### `/report [user] [reason]`
Submit a private report to the server staff.
- **user**: The user to report
- **reason**: Reason for the report
- **Note**: 60s cooldown to prevent spam

---

## 👥 Staff Management

### `/absence add [user] [reason] [days]`
Log a staff member's absence.
- **user**: The staff member
- **reason**: Reason for absence
- **days**: Number of days (1-365)
- **Permissions**: Moderate Members

### `/absence list`
View all current staff absences.
- **Permissions**: Moderate Members

### `/absence remove [user]`
Remove a user from the absence list.
- **user**: The staff member
- **Permissions**: Moderate Members

### `/role-permission set [role] [command]`
Set command permissions for a role.
- **role**: The role to configure
- **command**: Command name or * for all commands
- **Permissions**: Administrator

### `/role-permission remove [role]`
Remove command permissions from a role.
- **role**: The role to configure
- **Permissions**: Administrator

### `/role-permission list`
List all role permissions.
- **Permissions**: Administrator

---

## Auto-Logging Features

The bot automatically logs the following events (when logging channel is set):

- **Member Joins**: User info, account age, member count
- **Member Leaves**: User info, roles, member count
- **Message Deletions**: Author, content, attachments
- **Ghost Pings**: Deleted messages with mentions
- **Moderation Actions**: Bans, kicks, timeouts, warnings, etc.
- **Anti-Raid Triggers**: Mass join detections and actions taken

---

## Permission Hierarchy

Commands require different permission levels:

1. **User Commands**: Available to everyone
   - `/report`, `/avatar`, `/servericon`, `/poll`, `/help`, etc.

2. **Moderator Commands**: Require moderation permissions
   - `/warn`, `/timeout`, `/kick`, `/purge`, `/message`, etc.

3. **Administrator Commands**: Require administrator permissions
   - `/ban`, `/lockdown`, `/anti-raid`, `/filter`, `/role-permission`, etc.

**Note**: Server owner and bot owner bypass all permission checks.
