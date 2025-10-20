require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);

// Load all commands
for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
        const filePath = path.join(folderPath, file);
        const command = require(filePath);
        
        if ('data' in command) {
            commands.push(command.data.toJSON());
            console.log(`[DEPLOY] Loaded: ${command.data.name}`);
        }
    }
}

// Deploy commands
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log(`[DEPLOY] Started refreshing ${commands.length} application (/) commands.`);

        // Deploy globally or to a specific guild
        if (process.env.GUILD_ID) {
            // Guild-specific deployment (faster for testing)
            const data = await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                { body: commands },
            );
            console.log(`[DEPLOY] Successfully reloaded ${data.length} guild commands.`);
        } else {
            // Global deployment (takes up to 1 hour to propagate)
            const data = await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID),
                { body: commands },
            );
            console.log(`[DEPLOY] Successfully reloaded ${data.length} global commands.`);
        }
    } catch (error) {
        console.error('[DEPLOY] Error:', error);
    }
})();
