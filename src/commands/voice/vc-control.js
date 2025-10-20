const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vc-control')
        .setDescription('Call control panel for your temporary voice channel'),
    
    async execute(interaction) {
        const config = require('../../config');
        
        if (!config.tempVC || !config.tempVC.enabled) {
            return interaction.reply({ content: 'Temporary voice channels are not enabled.', ephemeral: true });
        }

        const { tempVCDB, createControlMsg } = interaction.client;
        const user = interaction.user;
        const textchannel = interaction.channel;

        if (!tempVCDB || !createControlMsg) {
            return interaction.reply({ content: 'Temp VC system not initialized.', ephemeral: true });
        }

        try {
            const tempVcId = await tempVCDB.get(`tempVcIdKey_${user.id}`).catch(() => null);

            if (!tempVcId) {
                return interaction.reply({ content: 'You do not own a temporary voice channel.', ephemeral: true });
            }

            if (tempVcId !== textchannel.id) {
                return interaction.reply({ content: 'Uhhhhh... This is not your VC.', ephemeral: true });
            }

            await interaction.deferReply({ ephemeral: true });

            const VC = await interaction.guild.channels.fetch(tempVcId);
            const VCPermissions = await VC.permissionsFor(config.tempVC.defaultRoleId).serialize();

            const controlMsg = await createControlMsg(user.id, user.username, VCPermissions);
            return interaction.editReply(controlMsg);
        } catch (error) {
            console.error('[VC-CONTROL] Error:', error);
            return interaction.reply({ content: 'An error occurred while fetching the control panel.', ephemeral: true });
        }
    },
};
