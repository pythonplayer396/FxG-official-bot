const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const { QueryType } = require('discord-player');
const CustomEmbedBuilder = require('../../utils/embedBuilder');
const MusicEmbedBuilder = require('../../utils/musicEmbedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('search')
        .setDescription('Search for songs and choose which one to play')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Song name to search for')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('results')
                .setDescription('Number of results to show (1-10)')
                .setMinValue(1)
                .setMaxValue(10)
                .setRequired(false)),
    
    cooldown: 5,

    async execute(interaction) {
        const query = interaction.options.getString('query');
        const resultCount = interaction.options.getInteger('results') || 5;
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

            const tracks = searchResult.tracks.slice(0, resultCount);

            // Create advanced detailed search embed
            const embed = MusicEmbedBuilder.searchResults(query, tracks, interaction.user);

            // Create select menu
            const options = tracks.map((track, i) => 
                new StringSelectMenuOptionBuilder()
                    .setLabel(track.title.substring(0, 100))
                    .setDescription(`${track.author.substring(0, 50)} • ${track.duration}`)
                    .setValue(`search_${i}`)
                    .setEmoji('🎵')
            );

            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId(`search_select_${interaction.user.id}`)
                .setPlaceholder('Choose a song to play')
                .addOptions(options);

            const row = new ActionRowBuilder().addComponents(selectMenu);

            const response = await interaction.editReply({ 
                embeds: [embed], 
                components: [row] 
            });

            // Create collector for the select menu
            const collector = response.createMessageComponentCollector({
                filter: i => i.user.id === interaction.user.id,
                time: 60000
            });

            collector.on('collect', async i => {
                if (i.customId === `search_select_${interaction.user.id}`) {
                    const selectedIndex = parseInt(i.values[0].split('_')[1]);
                    const selectedTrack = tracks[selectedIndex];

                    await i.deferUpdate();

                    try {
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
                        if (!queue.connection) await queue.connect(member.voice.channel);

                        // Add track to queue
                        queue.addTrack(selectedTrack);

                        // Play if not already playing
                        const wasPlaying = queue.isPlaying();
                        if (!wasPlaying) await queue.node.play();

                        // Create detailed success embed
                        const successEmbed = wasPlaying 
                            ? MusicEmbedBuilder.songAdded(selectedTrack, queue)
                            : MusicEmbedBuilder.nowPlaying(selectedTrack, queue, interaction);

                        const components = wasPlaying ? [] : [MusicEmbedBuilder.createControlButtons(queue)];

                        await interaction.editReply({ 
                            embeds: [successEmbed], 
                            components: components
                        });

                        collector.stop();
                    } catch (error) {
                        console.error('[SEARCH] Error adding track:', error);
                        await interaction.editReply({
                            embeds: [CustomEmbedBuilder.error('Error', 'Failed to add the song to the queue.')],
                            components: []
                        });
                    }
                }
            });

            collector.on('end', (collected, reason) => {
                if (reason === 'time') {
                    interaction.editReply({ 
                        embeds: [CustomEmbedBuilder.warning('Search Expired', 'Search timed out. Please try again.')],
                        components: [] 
                    }).catch(() => {});
                }
            });

        } catch (error) {
            console.error('[SEARCH] Error:', error);
            await interaction.editReply({
                embeds: [CustomEmbedBuilder.error('Search Error', 'An error occurred while searching for songs.')]
            });
        }
    },
};
