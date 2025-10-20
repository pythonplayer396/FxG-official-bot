const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const Logger = require('../../utils/logger');
const TimeParser = require('../../utils/timeParser');
const Messages = require('../../utils/messages');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lockdown')
        .setDescription('Lock all channels to prevent messaging')
        .addStringOption(option =>
            option.setName('duration')
                .setDescription('Duration of lockdown (e.g., 10m, 1h) - leave empty for indefinite')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    cooldown: 10,

    async execute(interaction) {
        const durationString = interaction.options.getString('duration');
        let duration = null;

        if (durationString) {
            duration = TimeParser.parse(durationString);
            if (!duration) {
                return interaction.reply({
                    content: Messages.error(`Please provide a valid duration. Examples: 10m, 1h, 2d`),
                    ephemeral: true
                });
            }
        }

        await interaction.deferReply();

        try {
            const channels = interaction.guild.channels.cache.filter(
                channel => channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildVoice
            );

            let lockedCount = 0;
            const everyoneRole = interaction.guild.roles.everyone;

            for (const [, channel] of channels) {
                try {
                    await channel.permissionOverwrites.edit(everyoneRole, {
                        SendMessages: false,
                        AddReactions: false,
                        Speak: false
                    });
                    lockedCount++;
                } catch (error) {
                    console.error(`[LOCKDOWN] Failed to lock ${channel.name}:`, error);
                }
            }

            // Log the action
            await Logger.log(interaction.guild, 'lockdown', {
                targetId: interaction.guild.id,
                moderatorId: interaction.user.id,
                reason: 'Server lockdown initiated',
                additionalInfo: { 
                    duration: duration ? TimeParser.format(duration) : 'Indefinite',
                    channelsLocked: lockedCount
                }
            });

            // Send confirmation
            await interaction.editReply({
                embeds: [CustomEmbedBuilder.success(
                    'Server Locked Down',
                    `🔒 Locked **${lockedCount}** channel(s).\n**Duration:** ${duration ? TimeParser.format(duration) : 'Indefinite'}\n\nUse \`/unlock\` to unlock the server.`
                )]
            });

            // Auto-unlock after duration
            if (duration) {
                setTimeout(async () => {
                    try {
                        for (const [, channel] of channels) {
                            await channel.permissionOverwrites.edit(everyoneRole, {
                                SendMessages: null,
                                AddReactions: null,
                                Speak: null
                            });
                        }

                        await Logger.log(interaction.guild, 'unlock', {
                            targetId: interaction.guild.id,
                            moderatorId: interaction.client.user.id,
                            reason: 'Automatic unlock after lockdown duration'
                        });

                        const logChannel = interaction.channel;
                        if (logChannel) {
                            logChannel.send({
                                embeds: [CustomEmbedBuilder.success(
                                    'Server Unlocked',
                                    '🔓 Lockdown duration expired. All channels have been unlocked.'
                                )]
                            });
                        }
                    } catch (error) {
                        console.error('[LOCKDOWN] Auto-unlock error:', error);
                    }
                }, duration);
            }

        } catch (error) {
            console.error('[LOCKDOWN] Error:', error);
            await interaction.editReply({
                content: Messages.error(`An error occurred while trying to lock down the server.`),
            });
        }
    },
};
