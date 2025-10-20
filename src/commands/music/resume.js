const { SlashCommandBuilder } = require('discord.js');
const CustomEmbedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resume the paused song'),
    
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

        if (!queue) {
            return interaction.reply({
                embeds: [CustomEmbedBuilder.error('Nothing Playing', 'There is no music in the queue.')],
                ephemeral: true
            });
        }

        if (!queue.node.isPaused()) {
            return interaction.reply({
                embeds: [CustomEmbedBuilder.warning('Not Paused', 'The music is not paused.')],
                ephemeral: true
            });
        }

        queue.node.resume();

        await interaction.reply({
            embeds: [CustomEmbedBuilder.music('Resumed', 'Music has been resumed.')]
        });
    },
};
