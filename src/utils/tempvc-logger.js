const { EmbedBuilder } = require('discord.js');

class TempVCLogger {
    constructor(client, logChannelId) {
        this.client = client;
        this.logChannelId = logChannelId;
    }

    async log(level, message, details = null) {
        try {
            if (!this.logChannelId) return;
            
            const logChannel = await this.client.channels.fetch(this.logChannelId);
            if (!logChannel) {
                console.error('Temp VC log channel not found');
                return;
            }

            const embed = new EmbedBuilder()
                .setTitle(`${level.toUpperCase()} Log`)
                .setDescription(message)
                .setTimestamp()
                .setColor(this.getColorByLevel(level));

            if (details) {
                embed.addFields({ name: 'Details', value: details, inline: false });
            }

            await logChannel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error sending temp VC log to Discord:', error);
        }
    }

    getColorByLevel(level) {
        switch (level.toLowerCase()) {
            case 'error':
                return 0xFF0000; // Red
            case 'warn':
                return 0xFFA500; // Orange
            case 'info':
                return 0x00B9FF; // Blue
            case 'success':
                return 0x00FF00; // Green
            default:
                return 0x808080; // Gray
        }
    }

    async info(message, details = null) {
        await this.log('info', message, details);
    }

    async warn(message, details = null) {
        await this.log('warn', message, details);
    }

    async error(message, details = null) {
        await this.log('error', message, details);
    }

    async success(message, details = null) {
        await this.log('success', message, details);
    }

    async logUserAction(action, userId, channelId = null, additionalInfo = null) {
        const user = await this.client.users.fetch(userId).catch(() => null);
        const username = user ? user.username : 'Unknown User';
        
        let message = `**${action}** by ${username} (${userId})`;
        if (channelId) {
            message += ` in <#${channelId}>`;
        }
        
        await this.info(message, additionalInfo);
    }

    async logSystemEvent(event, details = null) {
        await this.info(`System Event: ${event}`, details);
    }

    async logError(error, context = null) {
        const errorMessage = error.message || 'Unknown error';
        const stackTrace = error.stack || 'No stack trace available';
        
        let details = `\`\`\`\n${stackTrace}\n\`\`\``;
        if (context) {
            details = `Context: ${context}\n\n${details}`;
        }
        
        await this.error(errorMessage, details);
    }
}

module.exports = TempVCLogger;
