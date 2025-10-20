const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const CustomEmbedBuilder = require('../../utils/embedBuilder');
const MusicEmbedBuilder = require('../../utils/musicEmbedBuilder');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Display the current music queue')
        .addIntegerOption(option =>
            option.setName('page')
                .setDescription('Page number to view')
                .setMinValue(1)
                .setRequired(false)),
    
    cooldown: 5,

    async execute(interaction) {
        const queue = interaction.client.player.nodes.get(interaction.guild.id);

        if (!queue || !queue.isPlaying()) {
            return interaction.reply({
                embeds: [CustomEmbedBuilder.error('Nothing Playing', 'There is no music playing right now.')],
                ephemeral: true
            });
        }

        const tracks = queue.tracks.toArray();
        const currentTrack = queue.currentTrack;
        const pageSize = 10;
        const totalPages = Math.ceil(tracks.length / pageSize) || 1;
        let page = interaction.options.getInteger('page') || 1;

        if (page > totalPages) page = totalPages;
        if (page < 1) page = 1;

        // Create advanced detailed queue embed
        const embed = MusicEmbedBuilder.queueDisplay(
            queue,
            currentTrack,
            tracks,
            page,
            totalPages,
            interaction.guild
        );

        // Add pagination buttons if needed
        if (totalPages > 1) {
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('queue_first')
                        .setLabel('⏮️ First')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === 1),
                    new ButtonBuilder()
                        .setCustomId('queue_prev')
                        .setLabel('◀️ Previous')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === 1),
                    new ButtonBuilder()
                        .setCustomId('queue_next')
                        .setLabel('Next ▶️')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === totalPages),
                    new ButtonBuilder()
                        .setCustomId('queue_last')
                        .setLabel('Last ⏭️')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === totalPages)
                );

            await interaction.reply({ embeds: [embed], components: [row] });
        } else {
            await interaction.reply({ embeds: [embed] });
        }
    },
};
