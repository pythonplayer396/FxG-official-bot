const { SlashCommandBuilder } = require('discord.js');
const CustomEmbedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('speed')
        .setDescription('Change the playback speed')
        .addNumberOption(option =>
            option.setName('rate')
                .setDescription('Playback speed (0.5 = half speed, 2.0 = double speed)')
                .setMinValue(0.5)
                .setMaxValue(3.0)
                .setRequired(true)),
    
    cooldown: 5,

    async execute(interaction) {
        const member = interaction.member;
        const speed = interaction.options.getNumber('rate');

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
            // Apply speed filter
            if (speed === 1.0) {
                // Remove speed filter
                await queue.filters.ffmpeg.setFilters(false);
                await interaction.editReply({
                    embeds: [CustomEmbedBuilder.music('Speed Reset', '⏩ Playback speed reset to normal (1.0x)')]
                });
            } else {
                // Apply custom speed
                await queue.filters.ffmpeg.setInputArgs([
                    '-af', `atempo=${speed}`
                ]);

                const speedText = speed < 1 ? `${speed}x (Slower)` : `${speed}x (Faster)`;
                await interaction.editReply({
                    embeds: [CustomEmbedBuilder.music('Speed Changed', `⏩ Playback speed set to **${speedText}**`)]
                });
            }
        } catch (error) {
            console.error('[SPEED] Error:', error);
            await interaction.editReply({
                embeds: [CustomEmbedBuilder.error('Speed Error', 'Failed to change playback speed. Try a different value.')]
            });
        }
    },
};
