const { SlashCommandBuilder } = require('discord.js');
const CustomEmbedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('back')
        .setDescription('Play the previous song'),
    
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

        const history = queue.history;

        if (!history || history.tracks.toArray().length === 0) {
            return interaction.reply({
                embeds: [CustomEmbedBuilder.warning('No History', 'There are no previous songs to go back to.')],
                ephemeral: true
            });
        }

        try {
            await queue.history.back();
            
            await interaction.reply({
                embeds: [CustomEmbedBuilder.music('Playing Previous', `⏮️ Playing the previous song`)]
            });
        } catch (error) {
            console.error('[BACK] Error:', error);
            await interaction.reply({
                embeds: [CustomEmbedBuilder.error('Error', 'Failed to go back to the previous song.')],
                ephemeral: true
            });
        }
    },
};
