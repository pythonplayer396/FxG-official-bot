const { SlashCommandBuilder } = require('discord.js');
const { QueryType } = require('discord-player');
const CustomEmbedBuilder = require('../../utils/embedBuilder');
const MusicEmbedBuilder = require('../../utils/musicEmbedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playnext')
        .setDescription('Add a song to play next in the queue')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Song name or URL')
                .setRequired(true)),
    
    cooldown: 3,

    async execute(interaction) {
        const query = interaction.options.getString('query');
        const member = interaction.member;

        if (!member.voice.channel) {
            return interaction.reply({
                embeds: [CustomEmbedBuilder.error('Not in Voice Channel', 'You need to be in a voice channel to play music!')],
                ephemeral: true
            });
        }

        await interaction.deferReply();

        try {
            const player = interaction.client.player;
            
            const searchResult = await player.search(query, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            });

            if (!searchResult || !searchResult.tracks.length) {
                return interaction.editReply({
                    embeds: [CustomEmbedBuilder.error('No Results', 'No results found for your query.')]
                });
            }

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

            try {
                if (!queue.connection) await queue.connect(member.voice.channel);
            } catch {
                player.nodes.delete(interaction.guild.id);
                return interaction.editReply({
                    embeds: [CustomEmbedBuilder.error('Connection Error', 'Could not join your voice channel!')]
                });
            }

            // Insert at the beginning of the queue (position 0)
            if (searchResult.playlist) {
                searchResult.tracks.reverse().forEach(track => {
                    queue.node.insert(track, 0);
                });
            } else {
                queue.node.insert(searchResult.tracks[0], 0);
            }

            const wasPlaying = queue.isPlaying();
            if (!wasPlaying) await queue.node.play();

            // Create detailed embed
            if (searchResult.playlist) {
                const embed = MusicEmbedBuilder.playlistAdded(
                    searchResult.playlist,
                    searchResult.tracks,
                    queue,
                    interaction.user
                );
                await interaction.editReply({ embeds: [embed] });
            } else {
                const track = searchResult.tracks[0];
                const embed = MusicEmbedBuilder.songAdded(track, queue, 1);
                await interaction.editReply({ embeds: [embed] });
            }

        } catch (error) {
            console.error('[PLAYNEXT] Error:', error);
            await interaction.editReply({
                embeds: [CustomEmbedBuilder.error('Error', 'An error occurred while adding the song.')]
            });
        }
    },
};
