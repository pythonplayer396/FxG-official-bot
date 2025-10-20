const { SlashCommandBuilder } = require('discord.js');
const CustomEmbedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause the current song'),
    
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

        if (queue.node.isPaused()) {
            return interaction.reply({
                embeds: [CustomEmbedBuilder.warning('Already Paused', 'The music is already paused.')],
                ephemeral: true
            });
        }

        queue.node.pause();

        await interaction.reply({
            embeds: [CustomEmbedBuilder.music('Paused', 'Music has been paused.')]
        });
    },
};
