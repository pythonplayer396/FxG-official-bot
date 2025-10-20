# Temporary Voice Channel System Architecture

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER ACTIONS                             │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    1. User Joins HUB Channel                     │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│              voiceStateUpdate Event (Discord.js)                 │
│                                                                   │
│  • Detects user joined HUB channel                              │
│  • Checks if user already has a temp VC                         │
│  • Triggers temp VC creation                                    │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   2. Create Temp Voice Channel                   │
│                                                                   │
│  • Create new voice channel in category                         │
│  • Set permissions (owner can connect/speak)                    │
│  • Generate control panel message                               │
│  • Store in database:                                           │
│    - tempVcIdKey_<userId> → channel ID                         │
│    - tempmsgIdKey_<userId> → control message ID                │
│    - tempTimestampKey_<userId> → creation time                 │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   3. Move User to Temp VC                        │
│                                                                   │
│  • Move user from HUB to new temp VC                            │
│  • Send control panel in channel                                │
│  • Log activity                                                 │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                  4. User Interacts with Buttons                  │
│                                                                   │
│  Button Click → interactionCreate Event                         │
│                 → tempvc-interactions.js                        │
│                 → Handle specific action                        │
│                 → Update channel/permissions                    │
│                 → Log activity                                  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    5. User Leaves Channel                        │
│                                                                   │
│  • voiceStateUpdate detects owner left                          │
│  • Start 10-second deletion timer                               │
│  • Send warning message                                         │
│  • If owner rejoins → Cancel timer                              │
│  • If timer expires → Delete channel & cleanup DB               │
│  • If others present → Transfer ownership                       │
└─────────────────────────────────────────────────────────────────┘
```

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FxG-ModBot                               │
│                        (index.js)                                │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Client Initialization                        │  │
│  │  • Discord.js Client                                     │  │
│  │  • Music Player                                          │  │
│  │  • Commands Collection                                   │  │
│  │  • Temp VC Database (LevelDB)                           │  │
│  │  • Temp VC Loggers                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┼───────────────┐
                ▼               ▼               ▼
        ┌──────────┐    ┌──────────┐    ┌──────────┐
        │ Commands │    │  Events  │    │ Utilities│
        └──────────┘    └──────────┘    └──────────┘
                │               │               │
    ┌───────────┼───────┐      │      ┌────────┼────────┐
    ▼           ▼       ▼      ▼      ▼        ▼        ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│vc-fix  │ │vc-hub  │ │vc-ctrl │ │voice   │ │tempvc  │ │tempvc  │
│        │ │msg     │ │        │ │State   │ │logger  │ │embeds  │
└────────┘ └────────┘ └────────┘ │Update  │ └────────┘ └────────┘
                                  └────────┘
                                      │
                                      ▼
                              ┌──────────────┐
                              │ interaction  │
                              │   Create     │
                              └──────────────┘
                                      │
                                      ▼
                              ┌──────────────┐
                              │tempvc-inter  │
                              │actions.js    │
                              └──────────────┘
```

## Database Schema

```
LevelDB (tempvc-db/)
├── tempVcIdKey_<userId>          → String (channel ID)
├── tempmsgIdKey_<userId>         → String (message ID)
├── tempTimestampKey_<userId>     → Number (timestamp)
└── tempHUBBans                   → Object { userId: timestamp }
```

## File Structure

```
FxG-modbot/
├── src/
│   ├── commands/
│   │   └── voice/
│   │       ├── vc-fix.js          # Admin: Reset system
│   │       ├── vc-hubmsg.js       # Admin: Create HUB message
│   │       └── vc-control.js      # User: Access control panel
│   │
│   ├── events/
│   │   ├── ready.js               # Initialize embeds with bot avatar
│   │   ├── interactionCreate.js   # Route temp VC interactions
│   │   └── voiceStateUpdate.js    # Handle voice state changes
│   │
│   ├── utils/
│   │   ├── tempvc-logger.js           # System logging
│   │   ├── tempvc-activity-logger.js  # Activity logging
│   │   ├── tempvc-embeds.js           # Embed templates
│   │   └── tempvc-interactions.js     # Button/menu handlers
│   │
│   ├── config.js              # Configuration (includes tempVC section)
│   └── index.js               # Main entry point
│
├── tempvc-db/                 # LevelDB database (auto-created)
├── .env                       # Environment variables
├── package.json               # Dependencies
│
└── Documentation/
    ├── TEMP_VC_SETUP.md                  # Full setup guide
    ├── TEMP_VC_INTEGRATION_SUMMARY.md    # Integration summary
    ├── QUICK_START_TEMP_VC.md            # Quick start guide
    └── TEMP_VC_ARCHITECTURE.md           # This file
```

## Interaction Types

### 1. Button Interactions
```
User clicks button → interactionCreate
                   → tempvc-interactions.js
                   → handleTempVCInteraction()
                   → Specific handler (e.g., handleLockButton)
                   → Update channel/permissions
                   → Update control panel
                   → Log activity
```

### 2. Select Menu Interactions
```
User selects option → interactionCreate
                    → tempvc-interactions.js
                    → handleTempVCInteraction()
                    → Menu handler (e.g., handleWhitelistMenu)
                    → Update permissions
                    → Refresh menu
                    → Log activity
```

### 3. Modal Interactions
```
User submits modal → interactionCreate
                   → tempvc-interactions.js
                   → handleTempVCInteraction()
                   → Modal handler (e.g., handleChangeNameModal)
                   → Apply changes
                   → Confirm to user
                   → Log activity
```

## Permission Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Channel Permissions                           │
└─────────────────────────────────────────────────────────────────┘

Default State (on creation):
├── @everyone
│   ├── ViewChannel: ✅ Allow
│   ├── Connect: ✅ Allow
│   └── Speak: ✅ Allow
└── Owner
    ├── ViewChannel: ✅ Allow
    ├── Connect: ✅ Allow
    └── Speak: ✅ Allow

After Lock:
├── @everyone
│   ├── ViewChannel: ✅ Allow
│   ├── Connect: ❌ Deny
│   └── Speak: ✅ Allow
└── Owner
    ├── ViewChannel: ✅ Allow
    ├── Connect: ✅ Allow (override)
    └── Speak: ✅ Allow

After Hide:
├── @everyone
│   ├── ViewChannel: ❌ Deny
│   ├── Connect: ✅ Allow
│   └── Speak: ✅ Allow
└── Owner
    ├── ViewChannel: ✅ Allow (override)
    ├── Connect: ✅ Allow
    └── Speak: ✅ Allow

Whitelist User:
├── @everyone
│   └── (existing permissions)
├── Owner
│   └── (existing permissions)
└── Whitelisted User
    ├── ViewChannel: ✅ Allow (override)
    └── Connect: ✅ Allow (override)

Ban User:
├── @everyone
│   └── (existing permissions)
├── Owner
│   └── (existing permissions)
└── Banned User
    └── ViewChannel: ❌ Deny (override)
```

## Logging System

```
┌─────────────────────────────────────────────────────────────────┐
│                      Logging Architecture                        │
└─────────────────────────────────────────────────────────────────┘

System Logger (tempvc-logger.js)
├── Logs to: TEMP_VC_LOG_CHANNEL_ID
├── Types:
│   ├── INFO    (Blue)   - General information
│   ├── SUCCESS (Green)  - Successful operations
│   ├── WARN    (Orange) - Warnings
│   └── ERROR   (Red)    - Errors
└── Used for:
    ├── Bot startup/shutdown
    ├── System errors
    └── Administrative actions

Activity Logger (tempvc-activity-logger.js)
├── Logs to: TEMP_VC_ACTIVITY_LOG_CHANNEL_ID
├── Types:
│   ├── JOIN             (Green)  - User joined VC
│   ├── LEAVE            (Red)    - User left VC
│   ├── CREATE           (Blue)   - VC created
│   ├── DELETE           (Gray)   - VC deleted
│   ├── RENAME           (Gold)   - VC renamed
│   ├── TRANSFER         (Purple) - Ownership transferred
│   ├── KICK             (Orange) - User kicked
│   ├── BAN              (Dark Red) - User banned
│   ├── UNBAN            (Light Green) - User unbanned
│   ├── WHITELIST_ADD    (Light Green) - User whitelisted
│   ├── WHITELIST_REMOVE (Light Red) - User removed from whitelist
│   ├── SETTINGS         (Blue)   - Settings changed
│   └── AUTO_DELETE      (Gray)   - Auto-deleted
└── Used for:
    └── All user actions and channel events
```

## Error Handling

```
┌─────────────────────────────────────────────────────────────────┐
│                      Error Handling Flow                         │
└─────────────────────────────────────────────────────────────────┘

Error Occurs
    │
    ├─→ Log to console
    ├─→ Log to system logger (if available)
    ├─→ Send user-friendly message to user
    └─→ Cleanup resources if needed

Common Errors:
├── Channel not found
│   └─→ Clean up database entry
├── Permission denied
│   └─→ Notify user, log error
├── User not in voice channel
│   └─→ Send ephemeral message
└── Database error
    └─→ Log error, continue operation
```

## Performance Considerations

- **Database**: LevelDB is fast and lightweight
- **Memory**: Minimal overhead, only active VCs stored
- **Timeouts**: Managed efficiently with setTimeout/clearTimeout
- **Cleanup**: Automatic cleanup on channel deletion
- **Caching**: Uses Discord.js caching for channels/users

## Security Features

- **Permission checks**: Owner verification for all actions
- **Cooldown system**: 60-second cooldown after failed creation
- **Auto-cleanup**: Prevents orphaned channels
- **Permission overrides**: Owner always has access
- **Database isolation**: Separate database for temp VC system

---

**System designed for scalability, reliability, and ease of use!** 🚀
