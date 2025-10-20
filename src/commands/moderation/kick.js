const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Logger = require('../../utils/logger');
const PermissionHandler = require('../../utils/permissions');
const Messages = require('../../utils/messages');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Remove a user from the server')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to kick')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the kick')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    
    cooldown: 5,

    async execute(interaction) {
        const targetUser = interaction.options.getUser('user');
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
                content: Messages.error(`You cannot kick this user due to role hierarchy.`),
                ephemeral: true
            });
        }

        // Check bot permissions
        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.KickMembers)) {
            return interaction.reply({
                content: Messages.error(`I do not have permission to kick members.`),
                ephemeral: true
            });
        }

        try {
            // Try to DM the user before kicking
            try {
                await targetUser.send({
                    embeds: [CustomEmbedBuilder.warning(
                        'You have been kicked',
                        `**Server:** ${interaction.guild.name}\n**Reason:** ${reason}\n**Moderator:** ${interaction.user.tag}`
                    )]
                });
            } catch (error) {
                console.log(`Could not DM ${targetUser.tag}`);
            }

            // Kick the user
            await targetMember.kick(`${reason} | Kicked by ${interaction.user.tag}`);

            // Log the action
            await Logger.log(interaction.guild, 'kick', {
                targetId: targetUser.id,
                moderatorId: interaction.user.id,
                reason: reason
            });

            // Send confirmation
            await interaction.reply({
                embeds: [CustomEmbedBuilder.success(
                    'User Kicked',
                    `**User:** ${targetUser.tag} (${targetUser.id})\n**Reason:** ${reason}`
                )]
            });

        } catch (error) {
            console.error('[KICK] Error:', error);
            await interaction.reply({
                content: Messages.error(`An error occurred while trying to kick the user.`),
                ephemeral: true
            });
        }
    },
};
