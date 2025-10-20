const CustomEmbedBuilder = require('../utils/embedBuilder');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isButton()) return;

        const { customId, guild, member } = interaction;

        // Only handle music buttons
        if (!customId.startsWith('music_')) return;

        // Check if user is in a voice channel
        if (!member.voice.channel) {
            return interaction.reply({
                embeds: [CustomEmbedBuilder.error('Not in Voice Channel', 'You need to be in a voice channel to use music controls!')],
                ephemeral: true
            });
        }

        const queue = interaction.client.player.nodes.get(guild.id);

        if (!queue || !queue.isPlaying()) {
            return interaction.reply({
                embeds: [CustomEmbedBuilder.error('Nothing Playing', 'There is no music playing right now.')],
                ephemeral: true
            });
        }

        try {
            switch (customId) {
                case 'music_pause':
                    if (queue.node.isPaused()) {
                        queue.node.resume();
                        await interaction.reply({
                            embeds: [CustomEmbedBuilder.music('Resumed', '▶️ Music has been resumed.')],
                            ephemeral: true
                        });
                    } else {
                        queue.node.pause();
                        await interaction.reply({
                            embeds: [CustomEmbedBuilder.music('Paused', '⏸️ Music has been paused.')],
                            ephemeral: true
                        });
                    }
                    break;

                case 'music_skip':
                    const currentTrack = queue.currentTrack;
                    queue.node.skip();
                    await interaction.reply({
                        embeds: [CustomEmbedBuilder.music('Skipped', `⏭️ Skipped **${currentTrack.title}**`)],
                        ephemeral: true
                    });
                    break;

                case 'music_stop':
                    queue.delete();
                    await interaction.reply({
                        embeds: [CustomEmbedBuilder.music('Stopped', '⏹️ Music stopped and queue cleared.')],
                        ephemeral: true
                    });
                    break;

                case 'music_shuffle':
                    const tracks = queue.tracks.toArray();
                    if (tracks.length === 0) {
                        return interaction.reply({
                            embeds: [CustomEmbedBuilder.warning('Empty Queue', 'There are no songs in the queue to shuffle.')],
                            ephemeral: true
                        });
                    }
                    queue.tracks.shuffle();
                    await interaction.reply({
                        embeds: [CustomEmbedBuilder.music('Queue Shuffled', `🔀 Shuffled **${tracks.length}** songs!`)],
                        ephemeral: true
                    });
                    break;

                default:
                    break;
            }
        } catch (error) {
            console.error('[MUSIC BUTTONS] Error:', error);
            await interaction.reply({
                embeds: [CustomEmbedBuilder.error('Error', 'An error occurred while processing your request.')],
                ephemeral: true
            }).catch(() => {});
        }
    },
};
