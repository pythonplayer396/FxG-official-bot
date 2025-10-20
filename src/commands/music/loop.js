const { SlashCommandBuilder } = require('discord.js');
const { QueueRepeatMode } = require('discord-player');
const CustomEmbedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Set loop/repeat mode for the queue')
        .addStringOption(option =>
            option.setName('mode')
                .setDescription('Loop mode')
                .setRequired(true)
                .addChoices(
                    { name: 'Off', value: 'off' },
                    { name: 'Track (Repeat current song)', value: 'track' },
                    { name: 'Queue (Repeat entire queue)', value: 'queue' },
                    { name: 'Autoplay (Play similar songs)', value: 'autoplay' }
                )),
    
    cooldown: 3,

    async execute(interaction) {
        const member = interaction.member;
        const mode = interaction.options.getString('mode');

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

        let repeatMode;
        let modeText;

        switch (mode) {
            case 'off':
                repeatMode = QueueRepeatMode.OFF;
                modeText = '🔁 Loop mode disabled';
                break;
            case 'track':
                repeatMode = QueueRepeatMode.TRACK;
                modeText = '🔂 Looping current track';
                break;
            case 'queue':
                repeatMode = QueueRepeatMode.QUEUE;
                modeText = '🔁 Looping entire queue';
                break;
            case 'autoplay':
                repeatMode = QueueRepeatMode.AUTOPLAY;
                modeText = '♾️ Autoplay enabled - Similar songs will play automatically';
                break;
        }

        queue.setRepeatMode(repeatMode);

        await interaction.reply({
            embeds: [CustomEmbedBuilder.music('Loop Mode Changed', modeText)]
        });
    },
};
