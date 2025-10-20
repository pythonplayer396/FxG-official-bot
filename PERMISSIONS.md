# FxG ModBot - Role-Based Permissions

## Overview

The bot uses a hardcoded role-based permission system. No embeds are used (except for music commands).

## Role Hierarchy

### 1. Admin Role
**Role ID:** `1296065345424986183`
- **Access:** Full access to all commands
- **Commands:** Everything

### 2. Management Role  
**Role ID:** `1308840318690394233`
- **Access:** Absence management and utility commands
- **Commands:**
  - `/absence` (add, list, remove)
  - All user commands

### 3. Moderator Role
**Role ID:** `1379147275346907297`
- **Access:** Heavy punishment commands
- **Commands:**
  - `/ban`, `/unban`, `/kick`, `/softban`
  - `/message`
  - All commands below this level

### 4. Helper Role
**Role ID:** `1246460406055178260`
- **Access:** Warning system
- **Commands:**
  - `/warn`, `/warnings`
  - All commands below this level

### 5. Support Role
**Role ID:** `1268911588992225280`
- **Access:** Timeout and moderation utilities
- **Commands:**
  - `/timeout`
  - `/purge`, `/slowmode`
  - All commands below this level

### Everyone
- **Access:** Music commands and basic utilities
- **Commands:**
  - All music commands (`/play`, `/skip`, `/stop`, `/queue`, `/pause`, `/resume`, `/volume`, `/nowplaying`, `/lyrics`)
  - `/report`, `/poll`, `/ping`, `/help`, `/avatar`, `/servericon`, `/serverinfo`, `/userinfo`, `/inrole`, `/active-staff`, `/timer`, `/ping-ip`

## Command Permission Matrix

| Command | Admin | Management | Moderator | Helper | Support | Everyone |
|---------|-------|------------|-----------|--------|---------|----------|
| **Admin Commands** |
| `/anti-raid` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/anti-ghostping` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/filter` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/autowarn` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/logging` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/role-permission` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/lockdown` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `/unlock` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Heavy Punishment** |
| `/ban` | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| `/unban` | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| `/kick` | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| `/softban` | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Timeout/Mute** |
| `/timeout` | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ |
| **Warnings** |
| `/warn` | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ |
| `/warnings` | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ |
| `/clear-warnings` | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Moderation Utilities** |
| `/purge` | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ |
| `/slowmode` | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ |
| **Management** |
| `/absence` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `/message` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Music** |
| All music commands | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **User Commands** |
| All utility commands | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

## Special Permissions

- **Server Owner:** Has access to all commands
- **Bot Owner:** Has access to all commands  
- **Discord Administrator Permission:** Has access to all commands

## Message Format

All commands (except music) now use simple text responses:
- ✅ Success messages
- ❌ Error messages
- ⚠️ Warning messages
- ℹ️ Info messages

Music commands still use embeds for better presentation.

## Modifying Permissions

To change role IDs, edit `/src/config.js`:

```javascript
roles: {
    admin: '1296065345424986183',
    management: '1308840318690394233',
    moderator: '1379147275346907297',
    helper: '1246460406055178260',
    support: '1268911588992225280'
}
```

To modify command permissions, edit `/src/utils/permissions.js` in the `canUseCommand` method.

## Notes

- Role hierarchy is cumulative (higher roles inherit lower role permissions)
- Users with multiple roles get the highest level of access
- Permission checks happen before command execution
- Failed permission checks show a simple error message
