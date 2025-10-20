const { SlashCommandBuilder } = require('discord.js');
const CustomEmbedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Remove a song from the queue')
        .addIntegerOption(option =>
            option.setName('position')
                .setDescription('Position of the song in the queue (1, 2, 3...)')
                .setMinValue(1)
                .setRequired(true)),
    
    cooldown: 3,

    async execute(interaction) {
        const member = interaction.member;
        const position = interaction.options.getInteger('position');

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

        const tracks = queue.tracks.toArray();

        if (tracks.length === 0) {
            return interaction.reply({
                embeds: [CustomEmbedBuilder.warning('Empty Queue', 'There are no songs in the queue.')],
                ephemeral: true
            });
        }

        if (position > tracks.length) {
            return interaction.reply({
                embeds: [CustomEmbedBuilder.error('Invalid Position', `There are only **${tracks.length}** songs in the queue.`)],
                ephemeral: true
            });
        }

        const removedTrack = tracks[position - 1];
        queue.node.remove(position - 1);

        await interaction.reply({
            embeds: [CustomEmbedBuilder.music('Song Removed', `🗑️ Removed **${removedTrack.title}** from the queue.`)]
        });
    },
};
