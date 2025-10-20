const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const Logger = require('../../utils/logger');
const Messages = require('../../utils/messages');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('Unlock all channels after a lockdown')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    cooldown: 10,

    async execute(interaction) {
        await interaction.deferReply();

        try {
            const channels = interaction.guild.channels.cache.filter(
                channel => channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildVoice
            );

            let unlockedCount = 0;
            const everyoneRole = interaction.guild.roles.everyone;

            for (const [, channel] of channels) {
                try {
                    await channel.permissionOverwrites.edit(everyoneRole, {
                        SendMessages: null,
                        AddReactions: null,
                        Speak: null
                    });
                    unlockedCount++;
                } catch (error) {
                    console.error(`[UNLOCK] Failed to unlock ${channel.name}:`, error);
                }
            }

            // Log the action
            await Logger.log(interaction.guild, 'unlock', {
                targetId: interaction.guild.id,
                moderatorId: interaction.user.id,
                reason: 'Server unlocked',
                additionalInfo: { channelsUnlocked: unlockedCount }
            });

            // Send confirmation
            await interaction.editReply({
                embeds: [CustomEmbedBuilder.success(
                    'Server Unlocked',
                    `🔓 Unlocked **${unlockedCount}** channel(s). Normal operations resumed.`
                )]
            });

        } catch (error) {
            console.error('[UNLOCK] Error:', error);
            await interaction.editReply({
                content: Messages.error(`An error occurred while trying to unlock the server.`),
            });
        }
    },
};
