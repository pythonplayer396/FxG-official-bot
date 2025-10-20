const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const CustomEmbedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Display information about the current song'),
    
    cooldown: 5,

    async execute(interaction) {
        const queue = interaction.client.player.nodes.get(interaction.guild.id);

        if (!queue || !queue.isPlaying()) {
            return interaction.reply({
                embeds: [CustomEmbedBuilder.error('Nothing Playing', 'There is no music playing right now.')],
                ephemeral: true
            });
        }

        const track = queue.currentTrack;
        const progress = queue.node.createProgressBar();
        const timestamp = queue.node.getTimestamp();
        
        // Get loop mode
        const loopModes = ['🔁 Off', '🔂 Track', '🔁 Queue', '♾️ Autoplay'];
        const loopMode = loopModes[queue.repeatMode] || '🔁 Off';

        const embed = new EmbedBuilder()
            .setColor('#9B59B6')
            .setTitle('🎵 Now Playing')
            .setDescription(`**[${track.title}](${track.url})**\n${track.author}`)
            .addFields(
                { name: '⏱️ Duration', value: track.duration, inline: true },
                { name: '👤 Requested By', value: track.requestedBy.tag, inline: true },
                { name: '🔊 Volume', value: `${queue.node.volume}%`, inline: true },
                { name: '🔁 Loop Mode', value: loopMode, inline: true },
                { name: '📊 Queue Length', value: `${queue.tracks.size} songs`, inline: true },
                { name: '⏸️ Status', value: queue.node.isPaused() ? 'Paused' : 'Playing', inline: true },
                { name: '📈 Progress', value: progress, inline: false }
            )
            .setThumbnail(track.thumbnail)
            .setFooter({ text: `${timestamp.current.label} / ${timestamp.total.label}` })
            .setTimestamp();

        // Add control buttons
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('music_pause')
                    .setEmoji(queue.node.isPaused() ? '▶️' : '⏸️')
                    .setLabel(queue.node.isPaused() ? 'Resume' : 'Pause')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('music_skip')
                    .setEmoji('⏭️')
                    .setLabel('Skip')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('music_stop')
                    .setEmoji('⏹️')
                    .setLabel('Stop')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('music_shuffle')
                    .setEmoji('🔀')
                    .setLabel('Shuffle')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setLabel('Open in Browser')
                    .setStyle(ButtonStyle.Link)
                    .setURL(track.url)
            );

        await interaction.reply({ embeds: [embed], components: [row] });
    },
};
