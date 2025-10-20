const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Display detailed information about the server'),
    
    cooldown: 10,

    async execute(interaction) {
        const guild = interaction.guild;

        await guild.members.fetch();

        const embed = new EmbedBuilder()
            .setColor(config.botColor)
            .setTitle(`${guild.name} - Server Information`)
            .setThumbnail(guild.iconURL({ dynamic: true, size: 256 }))
            .addFields(
                { name: 'Server ID', value: guild.id, inline: true },
                { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
                { name: 'Created', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
                { name: 'Members', value: `${guild.memberCount}`, inline: true },
                { name: 'Roles', value: `${guild.roles.cache.size}`, inline: true },
                { name: 'Channels', value: `${guild.channels.cache.size}`, inline: true },
                { name: 'Boost Level', value: `Level ${guild.premiumTier}`, inline: true },
                { name: 'Boost Count', value: `${guild.premiumSubscriptionCount || 0}`, inline: true },
                { name: 'Verification Level', value: guild.verificationLevel.toString(), inline: true }
            )
            .setFooter({ text: `Server created` })
            .setTimestamp(guild.createdTimestamp);

        if (guild.description) {
            embed.setDescription(guild.description);
        }

        await interaction.reply({ embeds: [embed] });
    },
};
