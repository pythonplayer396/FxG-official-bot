const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

/**
 * Advanced Music Embed Builder with detailed information
 */
class MusicEmbedBuilder {
    /**
     * Create a detailed now playing embed
     */
    static nowPlaying(track, queue, interaction) {
        const timestamp = queue.node.getTimestamp();
        const progress = queue.node.createProgressBar({
            timecodes: true,
            length: 20,
            indicator: '🔘',
            leftChar: '▬',
            rightChar: '▬'
        });

        const loopModes = ['🔁 Off', '🔂 Track', '🔁 Queue', '♾️ Autoplay'];
        const loopMode = loopModes[queue.repeatMode] || '🔁 Off';

        const filters = queue.filters.ffmpeg.filters;
        const activeFilters = filters.length > 0 ? filters.join(', ') : 'None';

        const embed = new EmbedBuilder()
            .setColor('#9B59B6')
            .setAuthor({ 
                name: '🎵 Now Playing',
                iconURL: interaction.guild.iconURL({ dynamic: true })
            })
            .setTitle(track.title)
            .setURL(track.url)
            .setDescription(
                `**Artist:** ${track.author}\n` +
                `**Duration:** ${track.duration}\n` +
                `**Source:** ${track.source || 'Unknown'}\n` +
                `**Requested by:** ${track.requestedBy}\n\n` +
                `${progress}`
            )
            .addFields(
                { 
                    name: '⏱️ Time', 
                    value: `${timestamp.current.label} / ${timestamp.total.label}`, 
                    inline: true 
                },
                { 
                    name: '🔊 Volume', 
                    value: `${queue.node.volume}%`, 
                    inline: true 
                },
                { 
                    name: '⏸️ Status', 
                    value: queue.node.isPaused() ? '⏸️ Paused' : '▶️ Playing', 
                    inline: true 
                },
                { 
                    name: '🔁 Loop Mode', 
                    value: loopMode, 
                    inline: true 
                },
                { 
                    name: '📊 Queue', 
                    value: `${queue.tracks.size} songs`, 
                    inline: true 
                },
                { 
                    name: '🎚️ Filters', 
                    value: activeFilters, 
                    inline: true 
                }
            )
            .setThumbnail(track.thumbnail)
            .setFooter({ 
                text: `Requested by ${track.requestedBy.tag}`,
                iconURL: track.requestedBy.displayAvatarURL({ dynamic: true })
            })
            .setTimestamp();

        return embed;
    }

    /**
     * Create a detailed song added embed
     */
    static songAdded(track, queue, position = null) {
        const embed = new EmbedBuilder()
            .setColor('#2ECC71')
            .setAuthor({ name: '✅ Song Added to Queue' })
            .setTitle(track.title)
            .setURL(track.url)
            .setDescription(
                `**Artist:** ${track.author}\n` +
                `**Duration:** ${track.duration}\n` +
                `**Source:** ${track.source || 'Unknown'}\n` +
                `**Requested by:** ${track.requestedBy}`
            )
            .addFields(
                { 
                    name: '📊 Queue Position', 
                    value: position ? `#${position}` : `#${queue.tracks.size}`, 
                    inline: true 
                },
                { 
                    name: '⏱️ Estimated Wait', 
                    value: this.calculateWaitTime(queue, position), 
                    inline: true 
                },
                { 
                    name: '🔊 Current Volume', 
                    value: `${queue.node.volume}%`, 
                    inline: true 
                }
            )
            .setThumbnail(track.thumbnail)
            .setFooter({ 
                text: `Total songs in queue: ${queue.tracks.size + 1}`,
                iconURL: track.requestedBy.displayAvatarURL({ dynamic: true })
            })
            .setTimestamp();

        return embed;
    }

    /**
     * Create a detailed playlist added embed
     */
    static playlistAdded(playlist, tracks, queue, requestedBy) {
        const totalDuration = tracks.reduce((acc, track) => acc + (track.durationMS || 0), 0);
        const hours = Math.floor(totalDuration / 3600000);
        const minutes = Math.floor((totalDuration % 3600000) / 60000);

        const embed = new EmbedBuilder()
            .setColor('#3498DB')
            .setAuthor({ name: '📋 Playlist Added to Queue' })
            .setTitle(playlist.title)
            .setURL(playlist.url || tracks[0].url)
            .setDescription(
                `**Total Songs:** ${tracks.length}\n` +
                `**Total Duration:** ${hours > 0 ? `${hours}h ` : ''}${minutes}m\n` +
                `**Source:** ${tracks[0].source || 'Unknown'}\n` +
                `**Requested by:** ${requestedBy}`
            )
            .addFields(
                { 
                    name: '🎵 First Song', 
                    value: tracks[0].title.substring(0, 100), 
                    inline: false 
                },
                { 
                    name: '📊 Queue Position', 
                    value: `${queue.tracks.size - tracks.length + 1} - ${queue.tracks.size}`, 
                    inline: true 
                },
                { 
                    name: '🔊 Volume', 
                    value: `${queue.node.volume}%`, 
                    inline: true 
                },
                { 
                    name: '⏱️ Total Queue Time', 
                    value: this.calculateTotalQueueTime(queue), 
                    inline: true 
                }
            )
            .setThumbnail(playlist.thumbnail || tracks[0].thumbnail)
            .setFooter({ 
                text: `Total songs in queue: ${queue.tracks.size}`,
                iconURL: requestedBy.displayAvatarURL({ dynamic: true })
            })
            .setTimestamp();

        return embed;
    }

    /**
     * Create a detailed queue embed
     */
    static queueDisplay(queue, currentTrack, tracks, page, totalPages, guild) {
        const totalDuration = tracks.reduce((acc, track) => acc + (track.durationMS || 0), 0);
        const hours = Math.floor(totalDuration / 3600000);
        const minutes = Math.floor((totalDuration % 3600000) / 60000);

        const loopModes = ['🔁 Off', '🔂 Track', '🔁 Queue', '♾️ Autoplay'];
        const loopMode = loopModes[queue.repeatMode] || '🔁 Off';

        const timestamp = queue.node.getTimestamp();
        const progress = queue.node.createProgressBar({
            timecodes: false,
            length: 15,
            indicator: '🔘',
            leftChar: '▬',
            rightChar: '▬'
        });

        const embed = new EmbedBuilder()
            .setColor('#9B59B6')
            .setAuthor({ 
                name: '🎵 Music Queue',
                iconURL: guild.iconURL({ dynamic: true })
            })
            .setDescription(
                `**Now Playing:**\n` +
                `[${currentTrack.title}](${currentTrack.url})\n` +
                `${currentTrack.author} • ${currentTrack.duration}\n` +
                `${progress} \`${timestamp.current.label} / ${timestamp.total.label}\`\n\n` +
                `**Queue Statistics:**\n` +
                `🎵 Songs: **${tracks.length}** | ⏱️ Duration: **${hours > 0 ? `${hours}h ` : ''}${minutes}m**\n` +
                `🔊 Volume: **${queue.node.volume}%** | ${loopMode}\n` +
                `⏸️ Status: **${queue.node.isPaused() ? 'Paused' : 'Playing'}**`
            )
            .setThumbnail(currentTrack.thumbnail)
            .setTimestamp();

        if (tracks.length > 0) {
            const pageSize = 10;
            const start = (page - 1) * pageSize;
            const end = start + pageSize;
            const pageTracks = tracks.slice(start, end);

            const queueList = pageTracks.map((track, i) => {
                const position = start + i + 1;
                return `**${position}.** [${track.title.substring(0, 60)}](${track.url})\n` +
                       `└ ${track.author.substring(0, 40)} • ${track.duration} • ${track.requestedBy.username}`;
            }).join('\n\n');

            embed.addFields({ 
                name: `📋 Up Next (Page ${page}/${totalPages})`, 
                value: queueList || 'No songs on this page' 
            });
        } else {
            embed.addFields({ 
                name: '📋 Up Next', 
                value: 'No songs in queue' 
            });
        }

        embed.setFooter({ 
            text: `Page ${page}/${totalPages} • Total: ${tracks.length} songs`,
            iconURL: guild.iconURL({ dynamic: true })
        });

        return embed;
    }

    /**
     * Create a detailed search results embed
     */
    static searchResults(query, tracks, requestedBy) {
        const embed = new EmbedBuilder()
            .setColor('#3498DB')
            .setAuthor({ name: '🔍 Search Results' })
            .setTitle(`Results for: "${query}"`)
            .setDescription(
                `Found **${tracks.length}** results. Select a song from the menu below.\n\n` +
                `**Preview:**`
            )
            .setFooter({ 
                text: `Requested by ${requestedBy.tag} • Selection expires in 60 seconds`,
                iconURL: requestedBy.displayAvatarURL({ dynamic: true })
            })
            .setTimestamp();

        const trackList = tracks.map((track, i) => 
            `**${i + 1}.** [${track.title.substring(0, 70)}](${track.url})\n` +
            `└ ${track.author.substring(0, 50)} • ${track.duration}`
        ).join('\n\n');

        embed.addFields({ name: '🎵 Top Results', value: trackList });

        if (tracks[0].thumbnail) {
            embed.setThumbnail(tracks[0].thumbnail);
        }

        return embed;
    }

    /**
     * Create a detailed filter applied embed
     */
    static filterApplied(filterName, isEnabled, queue) {
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
            'surrounding': '🔄',
            'none': '❌'
        };

        const emoji = filterEmojis[filterName.toLowerCase()] || '🎚️';
        const activeFilters = queue.filters.ffmpeg.filters;

        const embed = new EmbedBuilder()
            .setColor(isEnabled ? '#2ECC71' : '#E74C3C')
            .setAuthor({ name: '🎚️ Audio Filter' })
            .setTitle(`${emoji} ${filterName.charAt(0).toUpperCase() + filterName.slice(1)}`)
            .setDescription(
                `**Status:** ${isEnabled ? '✅ Enabled' : '❌ Disabled'}\n` +
                `**Current Track:** ${queue.currentTrack.title.substring(0, 60)}\n` +
                `**Active Filters:** ${activeFilters.length > 0 ? activeFilters.join(', ') : 'None'}`
            )
            .addFields(
                { 
                    name: '🔊 Volume', 
                    value: `${queue.node.volume}%`, 
                    inline: true 
                },
                { 
                    name: '⏱️ Duration', 
                    value: queue.currentTrack.duration, 
                    inline: true 
                },
                { 
                    name: '📊 Queue', 
                    value: `${queue.tracks.size} songs`, 
                    inline: true 
                }
            )
            .setThumbnail(queue.currentTrack.thumbnail)
            .setFooter({ text: 'Filters may take a few seconds to apply' })
            .setTimestamp();

        return embed;
    }

    /**
     * Create a detailed equalizer embed
     */
    static equalizerApplied(presetName, queue) {
        const presetEmojis = {
            'flat': '📊',
            'bass': '🔊',
            'treble': '🎵',
            'pop': '🎤',
            'rock': '🎸',
            'classical': '🎻',
            'jazz': '🎺',
            'electronic': '🎹',
            'fullbass': '💥',
            'soft': '🌙'
        };

        const emoji = presetEmojis[presetName.toLowerCase()] || '🎚️';

        const embed = new EmbedBuilder()
            .setColor('#9B59B6')
            .setAuthor({ name: '🎛️ Equalizer Preset Applied' })
            .setTitle(`${emoji} ${presetName.charAt(0).toUpperCase() + presetName.slice(1)} Preset`)
            .setDescription(
                `**Current Track:** ${queue.currentTrack.title.substring(0, 60)}\n` +
                `**Artist:** ${queue.currentTrack.author.substring(0, 50)}\n` +
                `**Preset:** ${presetName.toUpperCase()}`
            )
            .addFields(
                { 
                    name: '🔊 Volume', 
                    value: `${queue.node.volume}%`, 
                    inline: true 
                },
                { 
                    name: '⏱️ Duration', 
                    value: queue.currentTrack.duration, 
                    inline: true 
                },
                { 
                    name: '📊 Queue', 
                    value: `${queue.tracks.size} songs`, 
                    inline: true 
                }
            )
            .setThumbnail(queue.currentTrack.thumbnail)
            .setFooter({ text: 'EQ changes may take a moment to apply' })
            .setTimestamp();

        return embed;
    }

    /**
     * Create control buttons for now playing
     */
    static createControlButtons(queue) {
        return new ActionRowBuilder()
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
                    .setLabel('Open')
                    .setEmoji('🔗')
                    .setStyle(ButtonStyle.Link)
                    .setURL(queue.currentTrack.url)
            );
    }

    /**
     * Calculate estimated wait time
     */
    static calculateWaitTime(queue, position = null) {
        if (!queue.currentTrack) return 'Unknown';
        
        const currentRemaining = queue.currentTrack.durationMS - queue.node.getTimestamp().current.value;
        const pos = position || queue.tracks.size;
        
        if (pos === 1) {
            const mins = Math.floor(currentRemaining / 60000);
            return mins > 0 ? `~${mins}m` : 'Soon';
        }

        const tracks = queue.tracks.toArray();
        let totalTime = currentRemaining;
        
        for (let i = 0; i < Math.min(pos - 1, tracks.length); i++) {
            totalTime += tracks[i].durationMS || 0;
        }

        const hours = Math.floor(totalTime / 3600000);
        const minutes = Math.floor((totalTime % 3600000) / 60000);
        
        if (hours > 0) return `~${hours}h ${minutes}m`;
        if (minutes > 0) return `~${minutes}m`;
        return 'Soon';
    }

    /**
     * Calculate total queue time
     */
    static calculateTotalQueueTime(queue) {
        const tracks = queue.tracks.toArray();
        const totalDuration = tracks.reduce((acc, track) => acc + (track.durationMS || 0), 0);
        
        const hours = Math.floor(totalDuration / 3600000);
        const minutes = Math.floor((totalDuration % 3600000) / 60000);
        
        if (hours > 0) return `${hours}h ${minutes}m`;
        if (minutes > 0) return `${minutes}m`;
        return 'Less than 1m';
    }
}

module.exports = MusicEmbedBuilder;
