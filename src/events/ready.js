const { Events, ActivityType } = require('discord.js');
const { updateEmbedAvatars } = require('../utils/tempvc-embeds');
const config = require('../config');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`[READY] Logged in as ${client.user.tag}`);
        console.log(`[READY] Serving ${client.guilds.cache.size} guilds`);
        console.log(`[READY] Loaded ${client.commands.size} commands`);
        
        // Initialize Temp VC embeds with bot avatar
        if (config.tempVC && config.tempVC.enabled) {
            const botAvatar = client.user.avatarURL();
            updateEmbedAvatars(botAvatar);
            
            if (client.tempVCLogger) {
                await client.tempVCLogger.success('Temp VC Bot started successfully', `Logged in as ${client.user.tag}`);
            }
            
            console.log('[TEMP-VC] Embeds initialized with bot avatar');
        }
        
        // Set bot status
        client.user.setPresence({
            activities: [{ 
                name: 'your server | /help', 
                type: ActivityType.Watching 
            }],
            status: 'online',
        });

        // Rotate status every 5 minutes
        const statuses = [
            { name: 'your server | /help', type: ActivityType.Watching },
            { name: `${client.guilds.cache.size} servers`, type: ActivityType.Watching },
            { name: 'for rule breakers', type: ActivityType.Watching },
            { name: '/help for commands', type: ActivityType.Listening }
        ];

        let currentStatus = 0;
        setInterval(() => {
            currentStatus = (currentStatus + 1) % statuses.length;
            client.user.setPresence({
                activities: [statuses[currentStatus]],
                status: 'online',
            });
        }, 300000); // 5 minutes
    },
};
