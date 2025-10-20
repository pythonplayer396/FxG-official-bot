const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check the bot\'s latency and API response time'),
    
    cooldown: 5,

    async execute(interaction) {
        const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
        
        const embed = new EmbedBuilder()
            .setColor(config.botColor)
            .setTitle('🏓 Pong!')
            .addFields(
                { name: 'Latency', value: `${sent.createdTimestamp - interaction.createdTimestamp}ms`, inline: true },
                { name: 'API Latency', value: `${Math.round(interaction.client.ws.ping)}ms`, inline: true }
            )
            .setTimestamp();

        await interaction.editReply({ content: null, embeds: [embed] });
    },
};
