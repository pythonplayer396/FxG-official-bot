const { SlashCommandBuilder } = require('discord.js');
const CustomEmbedBuilder = require('../../utils/embedBuilder');
const MusicEmbedBuilder = require('../../utils/musicEmbedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('equalizer')
        .setDescription('Apply equalizer presets to the music')
        .addStringOption(option =>
            option.setName('preset')
                .setDescription('Equalizer preset')
                .setRequired(true)
                .addChoices(
                    { name: 'Flat (Default)', value: 'flat' },
                    { name: 'Bass Boost', value: 'bass' },
                    { name: 'Treble Boost', value: 'treble' },
                    { name: 'Pop', value: 'pop' },
                    { name: 'Rock', value: 'rock' },
                    { name: 'Classical', value: 'classical' },
                    { name: 'Jazz', value: 'jazz' },
                    { name: 'Electronic', value: 'electronic' },
                    { name: 'Full Bass', value: 'fullbass' },
                    { name: 'Soft', value: 'soft' }
                )),
    
    cooldown: 5,

    async execute(interaction) {
        const member = interaction.member;
        const preset = interaction.options.getString('preset');

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
            // Define equalizer presets (values are in dB)
            const presets = {
                flat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                bass: [0.6, 0.4, 0.3, 0.2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                treble: [0, 0, 0, 0, 0, 0, 0, 0, 0.2, 0.3, 0.4, 0.5, 0.6, 0.6],
                pop: [0.2, 0.3, 0.4, 0.3, 0.2, 0, -0.1, -0.1, 0, 0.1, 0.2, 0.3, 0.3, 0.2],
                rock: [0.4, 0.3, 0.2, 0.1, -0.1, -0.2, -0.1, 0, 0.2, 0.3, 0.3, 0.4, 0.4, 0.4],
                classical: [0, 0, 0, 0, 0, 0, -0.2, -0.2, -0.2, -0.1, 0, 0.1, 0.2, 0.3],
                jazz: [0.3, 0.2, 0.1, 0.2, -0.1, -0.1, 0, 0.1, 0.1, 0.2, 0.2, 0.3, 0.3, 0.2],
                electronic: [0.5, 0.4, 0.2, 0, -0.1, 0.2, 0.4, 0.5, 0.4, 0.3, 0.2, 0.3, 0.4, 0.5],
                fullbass: [0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0, 0, 0, 0, 0, 0, 0, 0],
                soft: [-0.1, -0.1, 0, 0, 0.1, 0.2, 0.2, 0.2, 0.1, 0.1, 0, -0.1, -0.1, -0.1]
            };

            const eqValues = presets[preset] || presets.flat;

            // Apply equalizer
            await queue.filters.equalizer.setEQ(
                eqValues.map((gain, band) => ({ band, gain }))
            );

            // Create detailed equalizer embed
            const embed = MusicEmbedBuilder.equalizerApplied(preset, queue);
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('[EQUALIZER] Error:', error);
            await interaction.editReply({
                embeds: [CustomEmbedBuilder.error('Equalizer Error', 'Failed to apply the equalizer preset.')]
            });
        }
    },
};
