const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Display all available commands and features'),
    
    cooldown: 10,

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(config.botColor)
            .setTitle('🤖 FxG ModBot - Help')
            .setDescription('A comprehensive Discord moderation bot with music, security, and utility features.')
            .addFields(
                {
                    name: '🔨 Moderation Commands',
                    value: '`/ban` `/unban` `/kick` `/softban` `/timeout` `/warn` `/warnings` `/clear-warnings` `/purge` `/lockdown` `/unlock` `/slowmode`',
                    inline: false
                },
                {
                    name: '🛡️ Security & Auto-Moderation',
                    value: '`/anti-raid` `/anti-ghostping` `/filter` `/autowarn` `/role-permission`',
                    inline: false
                },
                {
                    name: '📊 Utility & Information',
                    value: '`/poll` `/inrole` `/active-staff` `/timer` `/ping` `/serverinfo` `/userinfo` `/avatar` `/servericon`',
                    inline: false
                },
                {
                    name: '🎵 Music Commands',
                    value: '`/play` `/skip` `/stop` `/queue` `/pause` `/resume` `/volume` `/nowplaying` `/lyrics`',
                    inline: false
                },
                {
                    name: '✉️ Messaging & Logging',
                    value: '`/message` `/logging` `/report` `/absence`',
                    inline: false
                },
                {
                    name: '🔗 Links',
                    value: '[Support Server](https://discord.gg/your-server) • [Documentation](https://github.com/your-repo) • [Invite Bot](https://discord.com/oauth2/authorize)',
                    inline: false
                }
            )
            .setFooter({ text: 'Use /command for more details on each command' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
