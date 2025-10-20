const { EmbedBuilder } = require('discord.js');

class TempVCActivityLogger {
    constructor(client, activityChannelId) {
        this.client = client;
        this.activityChannelId = activityChannelId;
    }

    async logActivity(type, user, details = {}) {
        try {
            if (!this.activityChannelId) return;
            
            const activityChannel = await this.client.channels.fetch(this.activityChannelId);
            if (!activityChannel) {
                console.error('Temp VC activity log channel not found');
                return;
            }

            const embed = new EmbedBuilder()
                .setTimestamp()
                .setFooter({ text: 'Voice Channel Activity' });

            switch (type) {
                case 'JOIN':
                    embed.setTitle('🟢 User Joined Voice Channel')
                        .setColor(0x00FF00)
                        .setDescription(`${user.username} joined ${details.channelMention}`)
                        .addFields(
                            { name: 'User', value: `<@${user.id}>`, inline: true },
                            { name: 'Channel', value: details.channelMention, inline: true }
                        );
                    break;

                case 'LEAVE':
                    embed.setTitle('🔴 User Left Voice Channel')
                        .setColor(0xFF0000)
                        .setDescription(`${user.username} left ${details.channelMention}`)
                        .addFields(
                            { name: 'User', value: `<@${user.id}>`, inline: true },
                            { name: 'Channel', value: details.channelMention, inline: true }
                        );
                    break;

                case 'CREATE':
                    embed.setTitle('🆕 Temporary Voice Channel Created')
                        .setColor(0x00B9FF)
                        .setDescription(`${user.username} created a new temporary voice channel`)
                        .addFields(
                            { name: 'Owner', value: `<@${user.id}>`, inline: true },
                            { name: 'Channel', value: details.channelMention, inline: true },
                            { name: 'Channel Name', value: details.channelName, inline: true }
                        );
                    break;

                case 'DELETE':
                    embed.setTitle('🗑️ Temporary Voice Channel Deleted')
                        .setColor(0x808080)
                        .setDescription(`Voice channel "${details.channelName}" was deleted`)
                        .addFields(
                            { name: 'Owner', value: `<@${user.id}>`, inline: true },
                            { name: 'Reason', value: details.reason || 'Manual deletion', inline: true }
                        );
                    break;

                case 'RENAME':
                    embed.setTitle('✏️ Voice Channel Renamed')
                        .setColor(0xFFD700)
                        .setDescription(`${user.username} renamed their voice channel`)
                        .addFields(
                            { name: 'Owner', value: `<@${user.id}>`, inline: true },
                            { name: 'Old Name', value: details.oldName, inline: true },
                            { name: 'New Name', value: details.newName, inline: true }
                        );
                    break;

                case 'TRANSFER':
                    embed.setTitle('👑 Channel Ownership Transferred')
                        .setColor(0x9932CC)
                        .setDescription(`Channel ownership transferred from ${user.username} to ${details.newOwner.username}`)
                        .addFields(
                            { name: 'Previous Owner', value: `<@${user.id}>`, inline: true },
                            { name: 'New Owner', value: `<@${details.newOwner.id}>`, inline: true },
                            { name: 'Channel', value: details.channelMention, inline: true }
                        );
                    break;

                case 'KICK':
                    embed.setTitle('👢 User Kicked from Voice Channel')
                        .setColor(0xFF4500)
                        .setDescription(`${details.kickedUser.username} was kicked from voice channel`)
                        .addFields(
                            { name: 'Kicked User', value: `<@${details.kickedUser.id}>`, inline: true },
                            { name: 'Kicked By', value: `<@${user.id}>`, inline: true },
                            { name: 'Channel', value: details.channelMention, inline: true }
                        );
                    break;

                case 'BAN':
                    embed.setTitle('🚫 User Banned from Voice Channel')
                        .setColor(0x8B0000)
                        .setDescription(`${details.bannedUser.username} was banned from voice channel`)
                        .addFields(
                            { name: 'Banned User', value: `<@${details.bannedUser.id}>`, inline: true },
                            { name: 'Banned By', value: `<@${user.id}>`, inline: true },
                            { name: 'Channel', value: details.channelMention, inline: true }
                        );
                    break;

                case 'UNBAN':
                    embed.setTitle('✅ User Unbanned from Voice Channel')
                        .setColor(0x32CD32)
                        .setDescription(`${details.unbannedUser.username} was unbanned from voice channel`)
                        .addFields(
                            { name: 'Unbanned User', value: `<@${details.unbannedUser.id}>`, inline: true },
                            { name: 'Unbanned By', value: `<@${user.id}>`, inline: true },
                            { name: 'Channel', value: details.channelMention, inline: true }
                        );
                    break;

                case 'WHITELIST_ADD':
                    embed.setTitle('📝 User Added to Whitelist')
                        .setColor(0x98FB98)
                        .setDescription(`${details.whitelistedUser.username} was added to channel whitelist`)
                        .addFields(
                            { name: 'Whitelisted User', value: `<@${details.whitelistedUser.id}>`, inline: true },
                            { name: 'Added By', value: `<@${user.id}>`, inline: true },
                            { name: 'Channel', value: details.channelMention, inline: true }
                        );
                    break;

                case 'WHITELIST_REMOVE':
                    embed.setTitle('📄 User Removed from Whitelist')
                        .setColor(0xFFA07A)
                        .setDescription(`${details.whitelistedUser.username} was removed from channel whitelist`)
                        .addFields(
                            { name: 'User', value: `<@${details.whitelistedUser.id}>`, inline: true },
                            { name: 'Removed By', value: `<@${user.id}>`, inline: true },
                            { name: 'Channel', value: details.channelMention, inline: true }
                        );
                    break;

                case 'SETTINGS':
                    embed.setTitle('⚙️ Channel Settings Modified')
                        .setColor(0x4169E1)
                        .setDescription(`${user.username} modified channel settings`)
                        .addFields(
                            { name: 'Modified By', value: `<@${user.id}>`, inline: true },
                            { name: 'Channel', value: details.channelMention, inline: true },
                            { name: 'Changes', value: details.changes, inline: false }
                        );
                    break;

                case 'AUTO_DELETE':
                    embed.setTitle('🕐 Channel Auto-Deleted')
                        .setColor(0x696969)
                        .setDescription(`Voice channel "${details.channelName}" was automatically deleted due to inactivity`)
                        .addFields(
                            { name: 'Last Owner', value: `<@${user.id}>`, inline: true },
                            { name: 'Reason', value: 'Owner left and no users remaining', inline: true }
                        );
                    break;

                default:
                    embed.setTitle('ℹ️ Voice Channel Activity')
                        .setColor(0x808080)
                        .setDescription(details.message || 'Unknown activity');
            }

            if (user.avatarURL) {
                embed.setThumbnail(user.avatarURL());
            }

            await activityChannel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error logging temp VC activity:', error);
        }
    }

    async userJoined(user, channelMention) {
        await this.logActivity('JOIN', user, { channelMention });
    }

    async userLeft(user, channelMention) {
        await this.logActivity('LEAVE', user, { channelMention });
    }

    async channelCreated(user, channelMention, channelName) {
        await this.logActivity('CREATE', user, { channelMention, channelName });
    }

    async channelDeleted(user, channelName, reason = null) {
        await this.logActivity('DELETE', user, { channelName, reason });
    }

    async channelRenamed(user, oldName, newName, channelMention) {
        await this.logActivity('RENAME', user, { oldName, newName, channelMention });
    }

    async ownershipTransferred(oldOwner, newOwner, channelMention) {
        await this.logActivity('TRANSFER', oldOwner, { newOwner, channelMention });
    }

    async userKicked(kicker, kickedUser, channelMention) {
        await this.logActivity('KICK', kicker, { kickedUser, channelMention });
    }

    async userBanned(banner, bannedUser, channelMention) {
        await this.logActivity('BAN', banner, { bannedUser, channelMention });
    }

    async userUnbanned(unbanner, unbannedUser, channelMention) {
        await this.logActivity('UNBAN', unbanner, { unbannedUser, channelMention });
    }

    async userWhitelisted(modifier, whitelistedUser, channelMention) {
        await this.logActivity('WHITELIST_ADD', modifier, { whitelistedUser, channelMention });
    }

    async userUnwhitelisted(modifier, whitelistedUser, channelMention) {
        await this.logActivity('WHITELIST_REMOVE', modifier, { whitelistedUser, channelMention });
    }

    async settingsChanged(user, channelMention, changes) {
        await this.logActivity('SETTINGS', user, { channelMention, changes });
    }

    async channelAutoDeleted(lastOwner, channelName) {
        await this.logActivity('AUTO_DELETE', lastOwner, { channelName });
    }
}

module.exports = TempVCActivityLogger;
