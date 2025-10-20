const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const CustomEmbedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('history')
        .setDescription('View the song history'),
    
    cooldown: 5,

    async execute(interaction) {
        const queue = interaction.client.player.nodes.get(interaction.guild.id);

        if (!queue || !queue.isPlaying()) {
            return interaction.reply({
                embeds: [CustomEmbedBuilder.error('Nothing Playing', 'There is no music playing right now.')],
                ephemeral: true
            });
        }

        const history = queue.history.tracks.toArray();

        if (history.length === 0) {
            return interaction.reply({
                embeds: [CustomEmbedBuilder.warning('No History', 'No songs have been played yet.')],
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setColor('#9B59B6')
            .setTitle('📜 Song History')
            .setDescription('Recently played songs:')
            .setTimestamp();

        const historyList = history.slice(0, 10).reverse().map((track, i) => 
            `**${i + 1}.** [${track.title}](${track.url})\n${track.author} • ${track.duration}`
        ).join('\n\n');

        embed.addFields({ name: `Last ${Math.min(history.length, 10)} Songs`, value: historyList });

        if (history.length > 10) {
            embed.setFooter({ text: `And ${history.length - 10} more...` });
        }

        await interaction.reply({ embeds: [embed] });
    },
};
