const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Logger = require('../../utils/logger');
const PermissionHandler = require('../../utils/permissions');
const Messages = require('../../utils/messages');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('softban')
        .setDescription('Ban and immediately unban a user to delete their messages')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to softban')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('days')
                .setDescription('Number of days of messages to delete (1-7)')
                .setMinValue(1)
                .setMaxValue(7)
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the softban')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    
    cooldown: 5,

    async execute(interaction) {
        const targetUser = interaction.options.getUser('user');
        const days = interaction.options.getInteger('days');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        // Fetch member
        let targetMember;
        try {
            targetMember = await interaction.guild.members.fetch(targetUser.id);
        } catch (error) {
            return interaction.reply({
                content: Messages.error(`This user is not in the server.`),
                ephemeral: true
            });
        }

        // Check if we can moderate this user
        if (!PermissionHandler.canModerate(interaction.member, targetMember)) {
            return interaction.reply({
                content: Messages.error(`You cannot softban this user due to role hierarchy.`),
                ephemeral: true
            });
        }

        // Check bot permissions
        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.reply({
                content: Messages.error(`I do not have permission to ban members.`),
                ephemeral: true
            });
        }

        try {
            // Try to DM the user
            try {
                await targetUser.send({
                    embeds: [CustomEmbedBuilder.warning(
                        'You have been softbanned',
                        `**Server:** ${interaction.guild.name}\n**Reason:** ${reason}\n**Messages Deleted:** ${days} days\n**Moderator:** ${interaction.user.tag}\n\nYou can rejoin the server immediately.`
                    )]
                });
            } catch (error) {
                console.log(`Could not DM ${targetUser.tag}`);
            }

            // Ban the user
            await interaction.guild.members.ban(targetUser.id, {
                reason: `Softban: ${reason} | By ${interaction.user.tag}`,
                deleteMessageSeconds: days * 24 * 60 * 60
            });

            // Immediately unban
            await interaction.guild.members.unban(targetUser.id, `Softban unban | By ${interaction.user.tag}`);

            // Log the action
            await Logger.log(interaction.guild, 'softban', {
                targetId: targetUser.id,
                moderatorId: interaction.user.id,
                reason: reason,
                additionalInfo: { days }
            });

            // Send confirmation
            await interaction.reply({
                embeds: [CustomEmbedBuilder.success(
                    'User Softbanned',
                    `**User:** ${targetUser.tag} (${targetUser.id})\n**Messages Deleted:** ${days} days\n**Reason:** ${reason}\n\nThe user can now rejoin the server.`
                )]
            });

        } catch (error) {
            console.error('[SOFTBAN] Error:', error);
            await interaction.reply({
                content: Messages.error(`An error occurred while trying to softban the user.`),
                ephemeral: true
            });
        }
    },
};
