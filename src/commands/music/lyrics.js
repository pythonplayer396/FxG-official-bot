const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const CustomEmbedBuilder = require('../../utils/embedBuilder');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lyrics')
        .setDescription('Fetch lyrics for the current or a specified song')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('Song name to search for')
                .setRequired(false)),
    
    cooldown: 10,

    async execute(interaction) {
        await interaction.deferReply();

        let songName = interaction.options.getString('song');

        // If no song specified, get current playing song
        if (!songName) {
            const queue = interaction.client.player.nodes.get(interaction.guild.id);
            
            if (!queue || !queue.isPlaying()) {
                return interaction.editReply({
                    embeds: [CustomEmbedBuilder.error('No Song', 'Please specify a song name or play music first.')]
                });
            }

            songName = queue.currentTrack.title;
        }

        try {
            // Use a simple lyrics API (lyrics.ovh is free and doesn't require API key)
            const searchQuery = encodeURIComponent(songName);
            
            // Try to extract artist and title
            const parts = songName.split('-').map(p => p.trim());
            let artist = parts[0] || 'Unknown';
            let title = parts[1] || parts[0];

            try {
                const response = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`, {
                    timeout: 10000
                });

                if (response.data && response.data.lyrics) {
                    const lyricsText = response.data.lyrics;
                    const chunks = [];
                    
                    // Split lyrics if too long
                    for (let i = 0; i < lyricsText.length; i += 4000) {
                        chunks.push(lyricsText.substring(i, i + 4000));
                    }

                    const embed = new EmbedBuilder()
                        .setColor(config.botColor)
                        .setTitle(`🎵 ${title} - ${artist}`)
                        .setDescription(chunks[0])
                        .setTimestamp();

                    await interaction.editReply({ embeds: [embed] });

                    // Send additional chunks if needed
                    for (let i = 1; i < Math.min(chunks.length, 3); i++) {
                        const continueEmbed = new EmbedBuilder()
                            .setColor(config.botColor)
                            .setDescription(chunks[i]);
                        
                        await interaction.followUp({ embeds: [continueEmbed] });
                    }
                } else {
                    throw new Error('No lyrics found');
                }
            } catch (apiError) {
                return interaction.editReply({
                    embeds: [CustomEmbedBuilder.error('No Lyrics Found', `Could not find lyrics for "${songName}".\n\nTip: Try formatting as "Artist - Song Title"`)]
                });
            }

        } catch (error) {
            console.error('[LYRICS] Error:', error);
            await interaction.editReply({
                embeds: [CustomEmbedBuilder.error('Error', 'Failed to fetch lyrics. Please try again later.')]
            });
        }
    },
};
