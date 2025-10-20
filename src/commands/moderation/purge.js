const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Logger = require('../../utils/logger');
const Messages = require('../../utils/messages');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Bulk delete a specified number of messages')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Number of messages to delete (1-100)')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true))
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Only delete messages from this user')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    
    cooldown: 5,

    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');
        const targetUser = interaction.options.getUser('user');

        // Check bot permissions
        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({
                content: Messages.error(`I do not have permission to manage messages.`),
                ephemeral: true
            });
        }

        await interaction.deferReply({ ephemeral: true });

        try {
            // Fetch messages
            const messages = await interaction.channel.messages.fetch({ limit: amount + 1 });
            
            // Filter messages if user specified
            let messagesToDelete = messages;
            if (targetUser) {
                messagesToDelete = messages.filter(msg => msg.author.id === targetUser.id);
            }

            // Filter out messages older than 14 days (Discord API limitation)
            const twoWeeksAgo = Date.now() - (14 * 24 * 60 * 60 * 1000);
            messagesToDelete = messagesToDelete.filter(msg => msg.createdTimestamp > twoWeeksAgo);

            if (messagesToDelete.size === 0) {
                return interaction.editReply({
                    content: Messages.error(`No messages found to delete (messages must be less than 14 days old).`),
                });
            }

            // Bulk delete messages
            const deleted = await interaction.channel.bulkDelete(messagesToDelete, true);

            // Log the action
            await Logger.log(interaction.guild, 'purge', {
                targetId: interaction.channel.id,
                moderatorId: interaction.user.id,
                reason: targetUser ? `Purged messages from ${targetUser.tag}` : 'Bulk message purge',
                additionalInfo: { amount: deleted.size }
            });

            // Send confirmation
            const confirmMsg = await interaction.editReply({
                embeds: [CustomEmbedBuilder.success(
                    'Messages Purged',
                    `Successfully deleted **${deleted.size}** message(s)${targetUser ? ` from ${targetUser.tag}` : ''}.`
                )]
            });

            // Delete confirmation after 5 seconds
            setTimeout(() => {
                confirmMsg.delete().catch(() => {});
            }, 5000);

        } catch (error) {
            console.error('[PURGE] Error:', error);
            await interaction.editReply({
                content: Messages.error(`An error occurred while trying to delete messages.`),
            });
        }
    },
};
