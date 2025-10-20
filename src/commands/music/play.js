const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { QueryType } = require('discord-player');
const CustomEmbedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song from YouTube, Spotify, SoundCloud, or other sources')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Song name or URL (YouTube, Spotify, SoundCloud, etc.)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('source')
                .setDescription('Preferred search source')
                .setRequired(false)
                .addChoices(
                    { name: 'Auto (Recommended)', value: 'auto' },
                    { name: 'YouTube', value: 'youtube' },
                    { name: 'Spotify', value: 'spotify' },
                    { name: 'SoundCloud', value: 'soundcloud' }
                )),
    
    cooldown: 3,

    async execute(interaction) {
        const query = interaction.options.getString('query');
        const source = interaction.options.getString('source') || 'auto';
        const member = interaction.member;

        // Check if user is in a voice channel
        if (!member.voice.channel) {
            return interaction.reply({
                embeds: [CustomEmbedBuilder.error('Not in Voice Channel', 'You need to be in a voice channel to play music!')],
                ephemeral: true
            });
        }

        await interaction.deferReply();

        try {
            const player = interaction.client.player;
            
            // Determine search engine
            let searchEngine = QueryType.AUTO;
            if (source === 'youtube') searchEngine = QueryType.YOUTUBE_SEARCH;
            else if (source === 'spotify') searchEngine = QueryType.SPOTIFY_SEARCH;
            else if (source === 'soundcloud') searchEngine = QueryType.SOUNDCLOUD_SEARCH;
            
            // Search for the song
            const searchResult = await player.search(query, {
                requestedBy: interaction.user,
                searchEngine: searchEngine
            });

            if (!searchResult || !searchResult.tracks.length) {
                return interaction.editReply({
                    embeds: [CustomEmbedBuilder.error('No Results', 'No results found for your query. Try a different search term or source.')]
                });
            }

            // Create or get queue
            const queue = player.nodes.create(interaction.guild, {
                metadata: {
                    channel: interaction.channel,
                    client: interaction.guild.members.me,
                    requestedBy: interaction.user
                },
                selfDeaf: true,
                volume: 50,
                leaveOnEmpty: true,
                leaveOnEmptyCooldown: 300000,
                leaveOnEnd: true,
                leaveOnEndCooldown: 300000
            });

            // Connect to voice channel
            try {
                if (!queue.connection) await queue.connect(member.voice.channel);
            } catch {
                player.nodes.delete(interaction.guild.id);
                return interaction.editReply({
                    embeds: [CustomEmbedBuilder.error('Connection Error', 'Could not join your voice channel!')]
                });
            }

            // Add track(s) to queue
            const wasPlaying = queue.isPlaying();
            searchResult.playlist ? queue.addTrack(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);

            // Play if not already playing
            if (!queue.isPlaying()) await queue.node.play();

            // Create enhanced embed
            if (searchResult.playlist) {
                const embed = new EmbedBuilder()
                    .setColor('#9B59B6')
                    .setTitle('📋 Playlist Added to Queue')
                    .setDescription(`**${searchResult.playlist.title}**`)
                    .addFields(
                        { name: '🎵 Songs Added', value: `${searchResult.tracks.length}`, inline: true },
                        { name: '👤 Requested By', value: interaction.user.tag, inline: true },
                        { name: '📊 Queue Position', value: wasPlaying ? `${queue.tracks.size - searchResult.tracks.length + 1}-${queue.tracks.size}` : 'Now Playing', inline: true }
                    )
                    .setThumbnail(searchResult.playlist.thumbnail || searchResult.tracks[0].thumbnail)
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
            } else {
                const track = searchResult.tracks[0];
                const embed = new EmbedBuilder()
                    .setColor('#9B59B6')
                    .setTitle(wasPlaying ? '🎵 Song Added to Queue' : '🎵 Now Playing')
                    .setDescription(`**[${track.title}](${track.url})**\n${track.author}`)
                    .addFields(
                        { name: '⏱️ Duration', value: track.duration, inline: true },
                        { name: '👤 Requested By', value: interaction.user.tag, inline: true },
                        { name: '📊 Position', value: wasPlaying ? `#${queue.tracks.size}` : 'Now Playing', inline: true }
                    )
                    .setThumbnail(track.thumbnail)
                    .setFooter({ text: `Source: ${track.source || 'Unknown'}` })
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
            }

        } catch (error) {
            console.error('[PLAY] Error:', error);
            await interaction.editReply({
                embeds: [CustomEmbedBuilder.error('Playback Error', `An error occurred while trying to play the song.\n\n**Error:** ${error.message || 'Unknown error'}`)]
            });
        }
    },
};
