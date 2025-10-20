const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const CustomEmbedBuilder = require('../../utils/embedBuilder');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lyrics-search')
        .setDescription('Search for lyrics by artist and song name')
        .addStringOption(option =>
            option.setName('artist')
                .setDescription('Artist name')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('song')
                .setDescription('Song title')
                .setRequired(true)),
    
    cooldown: 10,

    async execute(interaction) {
        await interaction.deferReply();

        const artist = interaction.options.getString('artist');
        const song = interaction.options.getString('song');

        try {
            const response = await axios.get(
                `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(song)}`,
                { timeout: 10000 }
            );

            if (response.data && response.data.lyrics) {
                const lyricsText = response.data.lyrics;
                const chunks = [];
                
                // Split lyrics if too long (Discord embed limit is 4096 characters)
                for (let i = 0; i < lyricsText.length; i += 4000) {
                    chunks.push(lyricsText.substring(i, i + 4000));
                }

                const embed = new EmbedBuilder()
                    .setColor(config.botColor)
                    .setTitle(`🎵 ${song} - ${artist}`)
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
        } catch (error) {
            console.error('[LYRICS-SEARCH] Error:', error);
            await interaction.editReply({
                embeds: [CustomEmbedBuilder.error(
                    'No Lyrics Found', 
                    `Could not find lyrics for "${song}" by "${artist}".\n\nMake sure the artist and song names are spelled correctly.`
                )]
            });
        }
    },
};
