const { SlashCommandBuilder } = require('discord.js');
const CustomEmbedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('move')
        .setDescription('Move a song to a different position in the queue')
        .addIntegerOption(option =>
            option.setName('from')
                .setDescription('Current position of the song')
                .setMinValue(1)
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('to')
                .setDescription('New position for the song')
                .setMinValue(1)
                .setRequired(true)),
    
    cooldown: 3,

    async execute(interaction) {
        const member = interaction.member;
        const fromPos = interaction.options.getInteger('from');
        const toPos = interaction.options.getInteger('to');

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

        const tracks = queue.tracks.toArray();

        if (tracks.length === 0) {
            return interaction.reply({
                embeds: [CustomEmbedBuilder.warning('Empty Queue', 'There are no songs in the queue.')],
                ephemeral: true
            });
        }

        if (fromPos > tracks.length || toPos > tracks.length) {
            return interaction.reply({
                embeds: [CustomEmbedBuilder.error('Invalid Position', `There are only **${tracks.length}** songs in the queue.`)],
                ephemeral: true
            });
        }

        if (fromPos === toPos) {
            return interaction.reply({
                embeds: [CustomEmbedBuilder.warning('Same Position', 'The song is already at that position.')],
                ephemeral: true
            });
        }

        // Get the track to move
        const trackToMove = tracks[fromPos - 1];
        
        // Remove from old position
        queue.node.remove(fromPos - 1);
        
        // Insert at new position
        queue.node.insert(trackToMove, toPos - 1);

        await interaction.reply({
            embeds: [CustomEmbedBuilder.music(
                'Song Moved', 
                `🔀 Moved **${trackToMove.title}** from position **${fromPos}** to **${toPos}**`
            )]
        });
    },
};
