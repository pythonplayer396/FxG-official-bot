const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const CustomEmbedBuilder = require('../../utils/embedBuilder');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Display the current music queue')
        .addIntegerOption(option =>
            option.setName('page')
                .setDescription('Page number to view')
                .setMinValue(1)
                .setRequired(false)),
    
    cooldown: 5,

    async execute(interaction) {
        const queue = interaction.client.player.nodes.get(interaction.guild.id);

        if (!queue || !queue.isPlaying()) {
            return interaction.reply({
                embeds: [CustomEmbedBuilder.error('Nothing Playing', 'There is no music playing right now.')],
                ephemeral: true
            });
        }

        const tracks = queue.tracks.toArray();
        const currentTrack = queue.currentTrack;
        const pageSize = 10;
        const totalPages = Math.ceil(tracks.length / pageSize) || 1;
        let page = interaction.options.getInteger('page') || 1;

        if (page > totalPages) page = totalPages;
        if (page < 1) page = 1;

        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const pageTracks = tracks.slice(start, end);

        // Calculate total duration
        const totalDuration = tracks.reduce((acc, track) => acc + (track.durationMS || 0), 0);
        const hours = Math.floor(totalDuration / 3600000);
        const minutes = Math.floor((totalDuration % 3600000) / 60000);
        
        // Get loop mode
        const loopModes = ['Off', 'Track', 'Queue', 'Autoplay'];
        const loopMode = loopModes[queue.repeatMode] || 'Off';

        const embed = new EmbedBuilder()
            .setColor('#9B59B6')
            .setTitle('🎵 Music Queue')
            .setDescription(
                `**Now Playing:**\n` +
                `[${currentTrack.title}](${currentTrack.url})\n` +
                `${currentTrack.author} • ${currentTrack.duration}\n` +
                `Requested by: ${currentTrack.requestedBy.tag}\n\n` +
                `**Queue Info:**\n` +
                `🔊 Volume: ${queue.node.volume}% | 🔁 Loop: ${loopMode}\n` +
                `📊 Songs in queue: ${tracks.length} | ⏱️ Total duration: ${hours > 0 ? `${hours}h ` : ''}${minutes}m`
            )
            .setThumbnail(currentTrack.thumbnail)
            .setTimestamp();

        if (tracks.length === 0) {
            embed.addFields({ name: 'Up Next', value: 'No songs in queue' });
        } else {
            const queueList = pageTracks.map((track, i) => {
                const position = start + i + 1;
                return `**${position}.** [${track.title}](${track.url})\n${track.author} • ${track.duration}`;
            }).join('\n\n');

            embed.addFields({ name: `Up Next (Page ${page}/${totalPages})`, value: queueList || 'No songs on this page' });
        }

        // Add pagination buttons if needed
        if (totalPages > 1) {
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('queue_first')
                        .setLabel('⏮️ First')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === 1),
                    new ButtonBuilder()
                        .setCustomId('queue_prev')
                        .setLabel('◀️ Previous')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === 1),
                    new ButtonBuilder()
                        .setCustomId('queue_next')
                        .setLabel('Next ▶️')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === totalPages),
                    new ButtonBuilder()
                        .setCustomId('queue_last')
                        .setLabel('Last ⏭️')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === totalPages)
                );

            await interaction.reply({ embeds: [embed], components: [row] });
        } else {
            await interaction.reply({ embeds: [embed] });
        }
    },
};
