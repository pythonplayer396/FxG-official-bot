const { SlashCommandBuilder } = require('discord.js');
const CustomEmbedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffle the current queue'),
    
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

        const tracks = queue.tracks.toArray();
        
        if (tracks.length === 0) {
            return interaction.reply({
                embeds: [CustomEmbedBuilder.warning('Empty Queue', 'There are no songs in the queue to shuffle.')],
                ephemeral: true
            });
        }

        // Shuffle the queue
        queue.tracks.shuffle();

        await interaction.reply({
            embeds: [CustomEmbedBuilder.music('Queue Shuffled', `🔀 Shuffled **${tracks.length}** songs in the queue!`)]
        });
    },
};
