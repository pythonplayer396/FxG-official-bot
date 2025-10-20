const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Display a user\'s avatar')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to get avatar from')
                .setRequired(false)),
    
    cooldown: 3,

    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;

        const embed = new EmbedBuilder()
            .setColor(config.botColor)
            .setTitle(`${user.tag}'s Avatar`)
            .setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .setDescription(`[Download](${user.displayAvatarURL({ dynamic: true, size: 1024 })})`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
