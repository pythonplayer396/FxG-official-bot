const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Logger = require('../../utils/logger');
const PermissionHandler = require('../../utils/permissions');
const Messages = require('../../utils/messages');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Permanently ban a user from the server')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to ban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the ban')
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName('delete_days')
                .setDescription('Number of days of messages to delete (0-7)')
                .setMinValue(0)
                .setMaxValue(7)
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    
    cooldown: 5,

    async execute(interaction) {
        const targetUser = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const deleteDays = interaction.options.getInteger('delete_days') || 0;

        // Check if target is in the guild
        let targetMember;
        try {
            targetMember = await interaction.guild.members.fetch(targetUser.id);
        } catch (error) {
            // User might not be in the guild, but we can still ban by ID
            targetMember = null;
        }

        // Check if we can moderate this user
        if (targetMember && !PermissionHandler.canModerate(interaction.member, targetMember)) {
            return interaction.reply({
                content: Messages.error('You cannot ban this user due to role hierarchy.'),
                ephemeral: true
            });
        }

        // Check bot permissions
        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.reply({
                content: Messages.error('I do not have permission to ban members.'),
                ephemeral: true
            });
        }

        try {
            // Try to DM the user before banning
            try {
                await targetUser.send(`You have been banned from **${interaction.guild.name}**\n**Reason:** ${reason}\n**Moderator:** ${interaction.user.tag}`);
            } catch (error) {
                console.log(`Could not DM ${targetUser.tag}`);
            }

            // Ban the user
            await interaction.guild.members.ban(targetUser.id, {
                reason: `${reason} | Banned by ${interaction.user.tag}`,
                deleteMessageSeconds: deleteDays * 24 * 60 * 60
            });

            // Log the action
            await Logger.log(interaction.guild, 'ban', {
                targetId: targetUser.id,
                moderatorId: interaction.user.id,
                reason: reason,
                additionalInfo: { deleteDays }
            });

            // Send confirmation
            await interaction.reply({
                content: Messages.success(`Banned ${targetUser.tag} (${targetUser.id})\n**Reason:** ${reason}\n**Messages Deleted:** ${deleteDays} days`)
            });

        } catch (error) {
            console.error('[BAN] Error:', error);
            await interaction.reply({
                content: Messages.error('An error occurred while trying to ban the user.'),
                ephemeral: true
            });
        }
    },
};
