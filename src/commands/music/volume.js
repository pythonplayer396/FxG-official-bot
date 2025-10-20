const { SlashCommandBuilder } = require('discord.js');
const CustomEmbedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Adjust the playback volume')
        .addIntegerOption(option =>
            option.setName('level')
                .setDescription('Volume level (1-150)')
                .setMinValue(1)
                .setMaxValue(150)
                .setRequired(true)),
    
    cooldown: 3,

    async execute(interaction) {
        const member = interaction.member;
        const volume = interaction.options.getInteger('level');

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

        queue.node.setVolume(volume);

        await interaction.reply({
            embeds: [CustomEmbedBuilder.music('Volume Changed', `Volume set to **${volume}%**`)]
        });
    },
};
