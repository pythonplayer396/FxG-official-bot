const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const CustomEmbedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('grab')
        .setDescription('Save the current song to your DMs'),
    
    cooldown: 10,

    async execute(interaction) {
        const queue = interaction.client.player.nodes.get(interaction.guild.id);

        if (!queue || !queue.isPlaying()) {
            return interaction.reply({
                embeds: [CustomEmbedBuilder.error('Nothing Playing', 'There is no music playing right now.')],
                ephemeral: true
            });
        }

        const track = queue.currentTrack;

        try {
            const embed = new EmbedBuilder()
                .setColor('#9B59B6')
                .setTitle('🎵 Saved Song')
                .setDescription(`**[${track.title}](${track.url})**\n${track.author}`)
                .addFields(
                    { name: '⏱️ Duration', value: track.duration, inline: true },
                    { name: '📍 Server', value: interaction.guild.name, inline: true },
                    { name: '🔗 Link', value: `[Click here](${track.url})`, inline: false }
                )
                .setThumbnail(track.thumbnail)
                .setFooter({ text: `Saved from ${interaction.guild.name}` })
                .setTimestamp();

            await interaction.user.send({ embeds: [embed] });

            await interaction.reply({
                embeds: [CustomEmbedBuilder.music('Song Saved', `📥 **${track.title}** has been sent to your DMs!`)],
                ephemeral: true
            });
        } catch (error) {
            console.error('[GRAB] Error:', error);
            await interaction.reply({
                embeds: [CustomEmbedBuilder.error('DM Failed', 'Could not send you a DM. Make sure your DMs are open!')],
                ephemeral: true
            });
        }
    },
};
