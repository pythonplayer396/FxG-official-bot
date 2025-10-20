const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const TimeParser = require('../../utils/timeParser');
const Messages = require('../../utils/messages');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Set slowmode for the current channel')
        .addStringOption(option =>
            option.setName('duration')
                .setDescription('Slowmode duration (e.g., 5s, 10s, 1m) or "off" to disable')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    
    cooldown: 3,

    async execute(interaction) {
        const durationString = interaction.options.getString('duration').toLowerCase();

        // Check for "off" or "0"
        if (durationString === 'off' || durationString === '0' || durationString === '0s') {
            try {
                await interaction.channel.setRateLimitPerUser(0);
                return interaction.reply({
                    embeds: [CustomEmbedBuilder.success(
                        'Slowmode Disabled',
                        'Slowmode has been disabled for this channel.'
                    )]
                });
            } catch (error) {
                console.error('[SLOWMODE] Error:', error);
                return interaction.reply({
                    content: Messages.error(`Failed to disable slowmode.`),
                    ephemeral: true
                });
            }
        }

        // Parse duration
        const seconds = TimeParser.toSeconds(durationString);
        
        if (!seconds || seconds < 0 || seconds > 21600) {
            return interaction.reply({
                embeds: [CustomEmbedBuilder.error(
                    'Invalid Duration',
                    'Please provide a valid duration between 0s and 6h. Examples: 5s, 30s, 1m, 5m'
                )],
                ephemeral: true
            });
        }

        // Check bot permissions
        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({
                content: Messages.error(`I do not have permission to manage channels.`),
                ephemeral: true
            });
        }

        try {
            await interaction.channel.setRateLimitPerUser(seconds);

            await interaction.reply({
                embeds: [CustomEmbedBuilder.success(
                    'Slowmode Enabled',
                    `Slowmode set to **${TimeParser.format(seconds * 1000)}** for ${interaction.channel}.`
                )]
            });

        } catch (error) {
            console.error('[SLOWMODE] Error:', error);
            await interaction.reply({
                content: Messages.error(`An error occurred while setting slowmode.`),
                ephemeral: true
            });
        }
    },
};
