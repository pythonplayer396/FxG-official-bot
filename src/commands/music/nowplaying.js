const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const CustomEmbedBuilder = require('../../utils/embedBuilder');
const MusicEmbedBuilder = require('../../utils/musicEmbedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Display information about the current song'),
    
    cooldown: 5,

    async execute(interaction) {
        const queue = interaction.client.player.nodes.get(interaction.guild.id);

        if (!queue || !queue.isPlaying()) {
            return interaction.reply({
                embeds: [CustomEmbedBuilder.error('Nothing Playing', 'There is no music playing right now.')],
                ephemeral: true
            });
        }

        const track = queue.currentTrack;
        
        // Create advanced detailed embed
        const embed = MusicEmbedBuilder.nowPlaying(track, queue, interaction);
        const buttons = MusicEmbedBuilder.createControlButtons(queue);

        await interaction.reply({ embeds: [embed], components: [buttons] });
    },
};
