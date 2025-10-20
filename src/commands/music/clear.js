const { SlashCommandBuilder } = require('discord.js');
const CustomEmbedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear the entire music queue'),
    
    cooldown: 5,

    async execute(interaction) {
        const member = interaction.member;

        if (!member.voice.channel) {
            return interaction.reply({
                embeds: [CustomEmbedBuilder.error('Not in Voice Channel', 'You need to be in a voice channel to use this command!')],
                ephemeral: true
            });
        }

        const queue = interaction.client.player.nodes.get(interaction.guild.id);

        if (!queue || !queue.isPlaying()) {
            return interaction.reply({
                embeds: [CustomEmbedBuilder.error('Nothing Playing', 'There is no music playing right now.')],
                ephemeral: true
            });
        }

        const trackCount = queue.tracks.size;

        if (trackCount === 0) {
            return interaction.reply({
                embeds: [CustomEmbedBuilder.warning('Empty Queue', 'The queue is already empty.')],
                ephemeral: true
            });
        }

        queue.tracks.clear();

        await interaction.reply({
            embeds: [CustomEmbedBuilder.music('Queue Cleared', `🗑️ Removed **${trackCount}** songs from the queue.`)]
        });
    },
};
