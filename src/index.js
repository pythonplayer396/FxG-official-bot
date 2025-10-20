require('dotenv').config();
const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const { Player } = require('discord-player');
const { Level } = require('level');
const fs = require('fs');
const path = require('path');
const { connectDatabase } = require('./utils/database');
const config = require('./config');
const TempVCLogger = require('./utils/tempvc-logger');
const TempVCActivityLogger = require('./utils/tempvc-activity-logger');
const { updateEmbedAvatars } = require('./utils/tempvc-embeds');
const { createControlMsg } = require('./events/voiceStateUpdate');

// Create Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildEmojisAndStickers,
    ],
    partials: [Partials.Channel, Partials.Message, Partials.Reaction],
});

// Initialize collections
client.commands = new Collection();
client.cooldowns = new Collection();

// Initialize Temp VC database and loggers if enabled
if (config.tempVC && config.tempVC.enabled) {
    const dbPath = path.join(__dirname, '..', 'tempvc-db');
    client.tempVCDB = new Level(dbPath, { valueEncoding: 'json' });
    client.tempVCLogger = new TempVCLogger(client, config.tempVC.logChannelId);
    client.tempVCActivityLogger = new TempVCActivityLogger(client, config.tempVC.activityLogChannelId);
    
    // Attach createControlMsg to client for use in commands
    client.createControlMsg = async (userId, userName, permissions) => {
        return await createControlMsg(userId, userName, client, config);
    };
    
    // Attach cleanup function
    client.cleanupTempVC = async (userId, vcId) => {
        const { cleanupDatabase } = require('./events/voiceStateUpdate');
        await cleanupDatabase(userId, client.tempVCDB);
    };
    
    console.log('[TEMP-VC] Temporary Voice Channel system initialized');
}

// Initialize music player
client.player = new Player(client, {
    ytdlOptions: {
        quality: 'highestaudio',
        highWaterMark: 1 << 25
    }
});

// Load command handler
const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
        const filePath = path.join(folderPath, file);
        const command = require(filePath);
        
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            console.log(`[COMMAND] Loaded: ${command.data.name}`);
        } else {
            console.log(`[WARNING] Command at ${filePath} is missing required "data" or "execute" property.`);
        }
    }
}

// Load event handlers
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
    console.log(`[EVENT] Loaded: ${event.name}`);
}

// Handle errors
process.on('unhandledRejection', error => {
    console.error('[ERROR] Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
    console.error('[ERROR] Uncaught exception:', error);
});

// Initialize database and login to Discord
async function startBot() {
    try {
        // Connect to database
        await connectDatabase();
        
        // Login to Discord
        await client.login(process.env.DISCORD_TOKEN);
        console.log('[BOT] Successfully logged in to Discord');
    } catch (error) {
        console.error('[ERROR] Failed to start bot:', error);
        process.exit(1);
    }
}

startBot();
