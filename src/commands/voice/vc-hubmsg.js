const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { template_createHubEmbed } = require('../../utils/tempvc-embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vc-hubmsg')
        .setDescription('Create HUB message for temporary voice channels (Admin only)')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    async execute(interaction) {
        const config = require('../../config');
        
        if (!config.tempVC || !config.tempVC.enabled) {
            return interaction.reply({ content: 'Temporary voice channels are not enabled.', ephemeral: true });
        }

        await interaction.deferReply();

        try {
            const hubEmbed = template_createHubEmbed;
            
            // Update embed with bot's avatar
            hubEmbed.setAuthor({
                name: interaction.client.user.displayName || interaction.client.user.username,
                iconURL: interaction.client.user.avatarURL(),
            });

            // Update description with actual hub channel ID
            const hubChannelId = config.tempVC.hubVoiceChannelId;
            hubEmbed.setDescription(
                `Join <#${hubChannelId}> to create your own Temp VC, you will become the owner. Default is visible unless manually clicking buttons to open permissions!`
            );

            return interaction.editReply({ embeds: [hubEmbed] });
        } catch (error) {
            console.error('[VC-HUBMSG] Error:', error);
            return interaction.editReply({ content: 'An error occurred while creating the hub message.', ephemeral: true });
        }
    },
};
