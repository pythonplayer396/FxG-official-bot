const { SlashCommandBuilder } = require('discord.js');
const CustomEmbedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('filters')
        .setDescription('Apply audio filters to the music')
        .addStringOption(option =>
            option.setName('filter')
                .setDescription('Filter to apply')
                .setRequired(true)
                .addChoices(
                    { name: 'None (Clear all filters)', value: 'none' },
                    { name: 'Bassboost', value: 'bassboost' },
                    { name: 'Nightcore', value: 'nightcore' },
                    { name: 'Vaporwave', value: 'vaporwave' },
                    { name: '8D Audio', value: '8d' },
                    { name: 'Karaoke', value: 'karaoke' },
                    { name: 'Tremolo', value: 'tremolo' },
                    { name: 'Vibrato', value: 'vibrato' },
                    { name: 'Reverse', value: 'reverse' },
                    { name: 'Treble', value: 'treble' },
                    { name: 'Normalizer', value: 'normalizer' },
                    { name: 'Surrounding', value: 'surrounding' }
                )),
    
    cooldown: 5,

    async execute(interaction) {
        const member = interaction.member;
        const filter = interaction.options.getString('filter');

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

        await interaction.deferReply();

        try {
            if (filter === 'none') {
                await queue.filters.ffmpeg.setFilters(false);
                return interaction.editReply({
                    embeds: [CustomEmbedBuilder.music('Filters Cleared', '🎚️ All audio filters have been removed.')]
                });
            }

            // Apply the selected filter
            const filterMap = {
                'bassboost': 'bassboost_high',
                'nightcore': 'nightcore',
                'vaporwave': 'vaporwave',
                '8d': 'surrounding',
                'karaoke': 'karaoke',
                'tremolo': 'tremolo',
                'vibrato': 'vibrato',
                'reverse': 'reverse',
                'treble': 'treble',
                'normalizer': 'normalizer',
                'surrounding': 'surrounding'
            };

            const filterName = filterMap[filter];
            
            if (filterName) {
                await queue.filters.ffmpeg.toggle([filterName]);
                
                const filterEmojis = {
                    'bassboost': '🔊',
                    'nightcore': '⚡',
                    'vaporwave': '🌊',
                    '8d': '🎧',
                    'karaoke': '🎤',
                    'tremolo': '〰️',
                    'vibrato': '📳',
                    'reverse': '⏪',
                    'treble': '🎵',
                    'normalizer': '📊',
                    'surrounding': '🔄'
                };

                const emoji = filterEmojis[filter] || '🎚️';
                const isEnabled = queue.filters.ffmpeg.filters.includes(filterName);

                await interaction.editReply({
                    embeds: [CustomEmbedBuilder.music(
                        'Filter Applied', 
                        `${emoji} **${filter.charAt(0).toUpperCase() + filter.slice(1)}** filter ${isEnabled ? 'enabled' : 'disabled'}!`
                    )]
                });
            }
        } catch (error) {
            console.error('[FILTERS] Error:', error);
            await interaction.editReply({
                embeds: [CustomEmbedBuilder.error('Filter Error', 'Failed to apply the filter. Some filters may not be compatible with this track.')]
            });
        }
    },
};
