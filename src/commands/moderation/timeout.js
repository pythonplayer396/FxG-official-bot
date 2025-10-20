const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Logger = require('../../utils/logger');
const PermissionHandler = require('../../utils/permissions');
const TimeParser = require('../../utils/timeParser');
const Messages = require('../../utils/messages');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Temporarily mute a user in text & voice')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to timeout')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('duration')
                .setDescription('Duration (e.g., 10m, 2h, 1d)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the timeout')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    
    cooldown: 3,

    async execute(interaction) {
        const targetUser = interaction.options.getUser('user');
        const durationString = interaction.options.getString('duration');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        // Parse duration
        const duration = TimeParser.parse(durationString);
        if (!duration || duration > 28 * 24 * 60 * 60 * 1000) {
            return interaction.reply({
                content: Messages.error(`Please provide a valid duration (max 28 days). Examples: 10m, 2h, 1d`),
                ephemeral: true
            });
        }

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
                content: Messages.error(`You cannot timeout this user due to role hierarchy.`),
                ephemeral: true
            });
        }

        // Check bot permissions
        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return interaction.reply({
                content: Messages.error(`I do not have permission to timeout members.`),
                ephemeral: true
            });
        }

        try {
            // Try to DM the user
            try {
                await targetUser.send({
                    embeds: [CustomEmbedBuilder.warning(
                        'You have been timed out',
                        `**Server:** ${interaction.guild.name}\n**Duration:** ${TimeParser.format(duration)}\n**Reason:** ${reason}\n**Moderator:** ${interaction.user.tag}`
                    )]
                });
            } catch (error) {
                console.log(`Could not DM ${targetUser.tag}`);
            }

            // Timeout the user
            await targetMember.timeout(duration, `${reason} | By ${interaction.user.tag}`);

            // Log the action
            await Logger.log(interaction.guild, 'timeout', {
                targetId: targetUser.id,
                moderatorId: interaction.user.id,
                reason: reason,
                additionalInfo: { duration: TimeParser.format(duration) }
            });

            // Send confirmation
            await interaction.reply({
                embeds: [CustomEmbedBuilder.success(
                    'User Timed Out',
                    `**User:** ${targetUser.tag} (${targetUser.id})\n**Duration:** ${TimeParser.format(duration)}\n**Reason:** ${reason}`
                )]
            });

        } catch (error) {
            console.error('[TIMEOUT] Error:', error);
            await interaction.reply({
                content: Messages.error(`An error occurred while trying to timeout the user.`),
                ephemeral: true
            });
        }
    },
};
