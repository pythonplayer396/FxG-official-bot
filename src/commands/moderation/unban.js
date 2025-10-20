const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Logger = require('../../utils/logger');
const Messages = require('../../utils/messages');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban a user using their User ID')
        .addStringOption(option =>
            option.setName('user_id')
                .setDescription('The ID of the user to unban')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    
    cooldown: 5,

    async execute(interaction) {
        const userId = interaction.options.getString('user_id');

        // Validate user ID format
        if (!/^\d{17,19}$/.test(userId)) {
            return interaction.reply({
                content: Messages.error(`Please provide a valid Discord user ID.`),
                ephemeral: true
            });
        }

        // Check bot permissions
        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.reply({
                content: Messages.error(`I do not have permission to unban members.`),
                ephemeral: true
            });
        }

        try {
            // Check if user is actually banned
            const bans = await interaction.guild.bans.fetch();
            const bannedUser = bans.get(userId);

            if (!bannedUser) {
                return interaction.reply({
                    content: Messages.error(`This user is not currently banned from the server.`),
                    ephemeral: true
                });
            }

            // Unban the user
            await interaction.guild.members.unban(userId, `Unbanned by ${interaction.user.tag}`);

            // Log the action
            await Logger.log(interaction.guild, 'unban', {
                targetId: userId,
                moderatorId: interaction.user.id,
                reason: 'Unbanned'
            });

            // Send confirmation
            await interaction.reply({
                embeds: [CustomEmbedBuilder.success(
                    'User Unbanned',
                    `**User:** ${bannedUser.user.tag} (${userId})\n**Moderator:** ${interaction.user.tag}`
                )]
            });

        } catch (error) {
            console.error('[UNBAN] Error:', error);
            await interaction.reply({
                content: Messages.error(`An error occurred while trying to unban the user.`),
                ephemeral: true
            });
        }
    },
};
