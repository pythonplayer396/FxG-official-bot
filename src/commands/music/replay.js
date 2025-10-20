const { SlashCommandBuilder } = require('discord.js');
const CustomEmbedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('replay')
        .setDescription('Replay the current song from the beginning'),
    
    cooldown: 3,

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

        try {
            const currentTrack = queue.currentTrack;
            await queue.node.seek(0);

            await interaction.reply({
                embeds: [CustomEmbedBuilder.music('Replaying', `🔁 Replaying **${currentTrack.title}** from the beginning`)]
            });
        } catch (error) {
            console.error('[REPLAY] Error:', error);
            await interaction.reply({
                embeds: [CustomEmbedBuilder.error('Error', 'Failed to replay the song.')],
                ephemeral: true
            });
        }
    },
};
