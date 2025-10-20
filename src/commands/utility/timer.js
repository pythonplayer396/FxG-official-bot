const { SlashCommandBuilder } = require('discord.js');
const TimeParser = require('../../utils/timeParser');
const Messages = require('../../utils/messages');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timer')
        .setDescription('Set a timer')
        .addStringOption(option =>
            option.setName('duration')
                .setDescription('Timer duration (e.g., 10m, 1h)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('task')
                .setDescription('What the timer is for')
                .setRequired(true)),
    
    cooldown: 5,

    async execute(interaction) {
        const durationString = interaction.options.getString('duration');
        const task = interaction.options.getString('task');

        const duration = TimeParser.parse(durationString);
        
        if (!duration || duration > 24 * 60 * 60 * 1000) {
            return interaction.reply({
                content: Messages.error(`Please provide a valid duration (max 24 hours). Examples: 10m, 1h, 30m`),
                ephemeral: true
            });
        }

        await interaction.reply({
            embeds: [CustomEmbedBuilder.success(
                'Timer Set',
                `⏰ Timer set for **${TimeParser.format(duration)}**\n**Task:** ${task}\n\nI'll remind you when time's up!`
            )]
        });

        // Set timeout
        setTimeout(async () => {
            try {
                await interaction.followUp({
                    content: `${interaction.user}`,
                    embeds: [CustomEmbedBuilder.info(
                        'Timer Complete!',
                        `⏰ Your timer for **${task}** has finished!`
                    )]
                });
            } catch (error) {
                console.error('[TIMER] Error sending reminder:', error);
            }
        }, duration);
    },
};
