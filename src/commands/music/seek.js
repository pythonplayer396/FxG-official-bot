const { SlashCommandBuilder } = require('discord.js');
const CustomEmbedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('seek')
        .setDescription('Seek to a specific time in the current song')
        .addStringOption(option =>
            option.setName('time')
                .setDescription('Time to seek to (e.g., 1:30, 90, 2:15)')
                .setRequired(true)),
    
    cooldown: 3,

    async execute(interaction) {
        const member = interaction.member;
        const timeInput = interaction.options.getString('time');

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

        // Parse time input (supports formats like "1:30", "90", "2:15:30")
        let seconds = 0;
        
        if (timeInput.includes(':')) {
            const parts = timeInput.split(':').reverse();
            seconds = parseInt(parts[0]) || 0; // seconds
            seconds += (parseInt(parts[1]) || 0) * 60; // minutes
            seconds += (parseInt(parts[2]) || 0) * 3600; // hours
        } else {
            seconds = parseInt(timeInput);
        }

        if (isNaN(seconds) || seconds < 0) {
            return interaction.reply({
                embeds: [CustomEmbedBuilder.error('Invalid Time', 'Please provide a valid time (e.g., 1:30, 90, 2:15)')],
                ephemeral: true
            });
        }

        const duration = queue.currentTrack.durationMS / 1000;
        
        if (seconds > duration) {
            return interaction.reply({
                embeds: [CustomEmbedBuilder.error('Time Out of Range', `The song is only ${Math.floor(duration / 60)}:${String(Math.floor(duration % 60)).padStart(2, '0')} long.`)],
                ephemeral: true
            });
        }

        try {
            await queue.node.seek(seconds * 1000);
            
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            const timeString = `${minutes}:${String(secs).padStart(2, '0')}`;

            await interaction.reply({
                embeds: [CustomEmbedBuilder.music('Seeked', `⏩ Jumped to **${timeString}**`)]
            });
        } catch (error) {
            console.error('[SEEK] Error:', error);
            await interaction.reply({
                embeds: [CustomEmbedBuilder.error('Seek Failed', 'Unable to seek in this track.')],
                ephemeral: true
            });
        }
    },
};
