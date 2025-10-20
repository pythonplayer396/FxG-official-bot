const { EmbedBuilder } = require('discord.js');
const config = require('../config');

class Logger {
    static async log(guild, action, data) {
        try {
            // Log to console only
            console.log(`[MODLOG] ${action.toUpperCase()} - Guild: ${guild.id}, Target: ${data.targetId}, Moderator: ${data.moderatorId}, Reason: ${data.reason || 'No reason'}`);
        } catch (error) {
            console.error('[LOGGER] Error logging action:', error);
        }
    }

    static createLogEmbed(action, data) {
        const embed = new EmbedBuilder()
            .setColor(this.getActionColor(action))
            .setTimestamp()
            .setFooter({ text: `Action: ${action.toUpperCase()}` });

        switch (action) {
            case 'ban':
                embed.setTitle(`${config.emojis.hammer} User Banned`)
                    .addFields(
                        { name: 'User', value: `<@${data.targetId}>`, inline: true },
                        { name: 'Moderator', value: `<@${data.moderatorId}>`, inline: true },
                        { name: 'Reason', value: data.reason || 'No reason provided' }
                    );
                break;

            case 'unban':
                embed.setTitle(`${config.emojis.success} User Unbanned`)
                    .addFields(
                        { name: 'User ID', value: data.targetId, inline: true },
                        { name: 'Moderator', value: `<@${data.moderatorId}>`, inline: true }
                    );
                break;

            case 'kick':
                embed.setTitle(`${config.emojis.warning} User Kicked`)
                    .addFields(
                        { name: 'User', value: `<@${data.targetId}>`, inline: true },
                        { name: 'Moderator', value: `<@${data.moderatorId}>`, inline: true },
                        { name: 'Reason', value: data.reason || 'No reason provided' }
                    );
                break;

            case 'timeout':
                embed.setTitle(`${config.emojis.warning} User Timed Out`)
                    .addFields(
                        { name: 'User', value: `<@${data.targetId}>`, inline: true },
                        { name: 'Moderator', value: `<@${data.moderatorId}>`, inline: true },
                        { name: 'Duration', value: data.additionalInfo.duration || 'Unknown', inline: true },
                        { name: 'Reason', value: data.reason || 'No reason provided' }
                    );
                break;

            case 'warn':
                embed.setTitle(`${config.emojis.warning} User Warned`)
                    .addFields(
                        { name: 'User', value: `<@${data.targetId}>`, inline: true },
                        { name: 'Moderator', value: `<@${data.moderatorId}>`, inline: true },
                        { name: 'Total Warnings', value: String(data.additionalInfo.totalWarnings || 1), inline: true },
                        { name: 'Reason', value: data.reason || 'No reason provided' }
                    );
                break;

            case 'purge':
                embed.setTitle(`${config.emojis.info} Messages Purged`)
                    .addFields(
                        { name: 'Channel', value: `<#${data.targetId}>`, inline: true },
                        { name: 'Moderator', value: `<@${data.moderatorId}>`, inline: true },
                        { name: 'Amount', value: String(data.additionalInfo.amount || 0), inline: true }
                    );
                break;

            case 'lockdown':
                embed.setTitle(`${config.emojis.lock} Server Locked Down`)
                    .addFields(
                        { name: 'Moderator', value: `<@${data.moderatorId}>`, inline: true },
                        { name: 'Duration', value: data.additionalInfo.duration || 'Indefinite', inline: true }
                    );
                break;

            case 'unlock':
                embed.setTitle(`${config.emojis.unlock} Server Unlocked`)
                    .addFields(
                        { name: 'Moderator', value: `<@${data.moderatorId}>`, inline: true }
                    );
                break;

            default:
                embed.setTitle('Moderation Action')
                    .setDescription(`Action: ${action}`);
        }

        return embed;
    }

    static getActionColor(action) {
        const colors = {
            ban: '#FF0000',
            unban: '#00FF00',
            kick: '#FFA500',
            softban: '#FF6347',
            timeout: '#FFD700',
            warn: '#FFFF00',
            purge: '#808080',
            lockdown: '#8B0000',
            unlock: '#32CD32'
        };
        return colors[action] || config.botColor;
    }
}

module.exports = Logger;
