const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');
const Messages = require('../../utils/messages');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('inrole')
        .setDescription('List all members who have a specific role')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role to check')
                .setRequired(true)),
    
    cooldown: 5,

    async execute(interaction) {
        const role = interaction.options.getRole('role');

        await interaction.deferReply();

        try {
            // Fetch all members to ensure cache is up to date
            await interaction.guild.members.fetch();

            const members = role.members;

            if (members.size === 0) {
                return interaction.editReply({
                    content: Messages.info(`No members have the ${role} role.`)
                });
            }

            const memberList = members.map(m => `• ${m.user.tag}`).join('\n');
            const chunks = [];
            
            // Split into chunks of 2000 characters
            for (let i = 0; i < memberList.length; i += 2000) {
                chunks.push(memberList.substring(i, i + 2000));
            }

            const embed = new EmbedBuilder()
                .setColor(role.color || config.botColor)
                .setTitle(`Members with ${role.name}`)
                .setDescription(chunks[0])
                .setFooter({ text: `Total: ${members.size} members` })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

            // Send additional chunks if needed
            for (let i = 1; i < chunks.length; i++) {
                const continueEmbed = new EmbedBuilder()
                    .setColor(role.color || config.botColor)
                    .setDescription(chunks[i]);
                
                await interaction.followUp({ embeds: [continueEmbed] });
            }

        } catch (error) {
            console.error('[INROLE] Error:', error);
            await interaction.editReply({
                content: Messages.error(`Failed to fetch role members.`)
            });
        }
    },
};
