const { SlashCommandBuilder, PermissionFlagsBits, ActivityType } = require('discord.js');
const Messages = require('../../utils/messages');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Change the bot\'s status and activity')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('The type of activity')
                .setRequired(true)
                .addChoices(
                    { name: 'Playing', value: 'playing' },
                    { name: 'Watching', value: 'watching' },
                    { name: 'Listening', value: 'listening' },
                    { name: 'Competing', value: 'competing' },
                    { name: 'Streaming', value: 'streaming' }
                ))
        .addStringOption(option =>
            option.setName('text')
                .setDescription('The status text to display')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('url')
                .setDescription('The streaming URL (only for Streaming type)')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    cooldown: 5,

    async execute(interaction) {
        const activityType = interaction.options.getString('type');
        const statusText = interaction.options.getString('text');
        const streamUrl = interaction.options.getString('url');

        // Validate inputs
        if (!activityType || !statusText) {
            return interaction.reply({
                content: Messages.error('Missing required parameters.'),
                ephemeral: true
            });
        }

        try {
            let activityTypeEnum;
            
            switch(activityType) {
                case 'playing':
                    activityTypeEnum = ActivityType.Playing;
                    break;
                case 'watching':
                    activityTypeEnum = ActivityType.Watching;
                    break;
                case 'listening':
                    activityTypeEnum = ActivityType.Listening;
                    break;
                case 'competing':
                    activityTypeEnum = ActivityType.Competing;
                    break;
                case 'streaming':
                    activityTypeEnum = ActivityType.Streaming;
                    if (!streamUrl) {
                        return interaction.reply({
                            content: Messages.error('Streaming type requires a URL. Please provide a valid Twitch or YouTube URL.'),
                            ephemeral: true
                        });
                    }
                    break;
            }

            const activityOptions = {
                type: activityTypeEnum,
                name: statusText
            };

            if (activityType === 'streaming' && streamUrl) {
                activityOptions.url = streamUrl;
            }

            await interaction.client.user.setPresence({
                activities: [activityOptions],
                status: 'online'
            });

            const formattedType = activityType.charAt(0).toUpperCase() + activityType.slice(1);
            await interaction.reply({
                content: Messages.success(`Bot status updated to: **${formattedType}** ${statusText}`),
                ephemeral: true
            });

        } catch (error) {
            console.error('[STATUS] Error:', error);
            const replyOptions = {
                content: Messages.error('Failed to update bot status. Please try again.'),
                ephemeral: true
            };
            
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(replyOptions);
            } else {
                await interaction.reply(replyOptions);
            }
        }
    },
};
