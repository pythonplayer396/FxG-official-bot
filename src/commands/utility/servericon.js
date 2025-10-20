const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');
const Messages = require('../../utils/messages');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('servericon')
        .setDescription('Display the server\'s icon'),
    
    cooldown: 5,

    async execute(interaction) {
        const guild = interaction.guild;

        if (!guild.iconURL()) {
            return interaction.reply({
                content: Messages.error(`This server does not have an icon.`),
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setColor(config.botColor)
            .setTitle(`${guild.name}'s Icon`)
            .setImage(guild.iconURL({ dynamic: true, size: 1024 }))
            .setDescription(`[Download](${guild.iconURL({ dynamic: true, size: 1024 })})`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
