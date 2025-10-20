# Database Setup Guide

## PostgreSQL Connection

Your bot is now configured to connect to your Railway PostgreSQL database.

### Environment Variables

The `.env.example` file has been updated with your database credentials. To use them:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your Discord bot token and other settings:
   ```env
   DISCORD_TOKEN=your_actual_bot_token
   CLIENT_ID=your_client_id
   GUILD_ID=your_guild_id
   ```

### Database Configuration

The following environment variables are set for your PostgreSQL database:

- `DATABASE_URL`: Full connection string for PostgreSQL
- `PGHOST`: postgres.railway.internal
- `PGPORT`: 5432
- `PGUSER`: postgres
- `PGPASSWORD`: WzZqQfQutzNxRTSwFQNATzYXoxKssMHq
- `PGDATABASE`: railway

### Database Tables

The bot will automatically create the following tables on first run:

1. **guild_configs** - Server configuration settings
2. **mod_logs** - Moderation action logs
3. **absences** - User absence records
4. **warnings** - User warning records

### Using the Database

#### In Your Commands

You can use the models in your commands like this:

```javascript
const GuildConfig = require('../../models/GuildConfig');
const ModLog = require('../../models/ModLog');
const Absence = require('../../models/Absence');
const Warning = require('../../models/Warning');

// Example: Get guild config
const config = await GuildConfig.get(interaction.guildId);

// Example: Create a mod log
const log = await ModLog.create({
    guildId: interaction.guildId,
    action: 'ban',
    userId: user.id,
    moderatorId: interaction.user.id,
    reason: 'Violation of rules',
    duration: null
});

// Example: Create an absence
const absence = await Absence.create({
    guildId: interaction.guildId,
    userId: user.id,
    reason: 'Vacation',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
});

// Example: Add a warning
const warning = await Warning.create({
    guildId: interaction.guildId,
    userId: user.id,
    moderatorId: interaction.user.id,
    reason: 'Spamming'
});
```

#### Direct Database Queries

For custom queries, you can use the query function:

```javascript
const { query } = require('../utils/database');

const result = await query('SELECT * FROM guild_configs WHERE guild_id = $1', [guildId]);
```

### Starting the Bot

Run the bot with:

```bash
npm start
```

The bot will:
1. Connect to the PostgreSQL database
2. Create tables if they don't exist
3. Log in to Discord

### Troubleshooting

If you encounter connection issues:

1. **Check your Railway database is running**
2. **Verify the connection string** in your `.env` file
3. **Check the logs** for specific error messages
4. **Ensure your IP is whitelisted** (if Railway requires it)

### Security Notes

⚠️ **Important**: Never commit your `.env` file to version control. It contains sensitive credentials.

The `.env.example` file is safe to commit as a template for others.
