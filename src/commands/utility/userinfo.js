const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Display information about a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to get info about')
                .setRequired(false)),
    
    cooldown: 5,

    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const member = await interaction.guild.members.fetch(user.id).catch(() => null);

        const embed = new EmbedBuilder()
            .setColor(member?.displayHexColor || config.botColor)
            .setTitle(`${user.tag} - User Information`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
            .addFields(
                { name: 'User ID', value: user.id, inline: true },
                { name: 'Account Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
                { name: 'Bot', value: user.bot ? 'Yes' : 'No', inline: true }
            )
            .setTimestamp();

        if (member) {
            const roles = member.roles.cache
                .filter(role => role.id !== interaction.guild.id)
                .sort((a, b) => b.position - a.position)
                .map(role => role.toString())
                .slice(0, 20);

            embed.addFields(
                { name: 'Joined Server', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
                { name: 'Nickname', value: member.nickname || 'None', inline: true },
                { name: 'Highest Role', value: member.roles.highest.toString(), inline: true },
                { name: `Roles [${member.roles.cache.size - 1}]`, value: roles.join(', ') || 'None', inline: false }
            );

            if (member.premiumSince) {
                embed.addFields({ 
                    name: 'Boosting Since', 
                    value: `<t:${Math.floor(member.premiumSinceTimestamp / 1000)}:R>`, 
                    inline: true 
                });
            }
        }

        await interaction.reply({ embeds: [embed] });
    },
};
