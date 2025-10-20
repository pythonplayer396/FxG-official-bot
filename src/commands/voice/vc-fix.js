const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { template_adminDeleteEmbed } = require('../../utils/tempvc-embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vc-fix')
        .setDescription('Fix voice chat rooms (Admin only)')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    async execute(interaction) {
        const config = require('../../config');
        
        if (!config.tempVC || !config.tempVC.enabled) {
            return interaction.reply({ content: 'Temporary voice channels are not enabled.', ephemeral: true });
        }

        await interaction.deferReply({ ephemeral: true });

        try {
            const { tempVCDB, cleanupTempVC } = interaction.client;
            
            if (!tempVCDB) {
                return interaction.editReply({ content: 'Temp VC database not initialized.', ephemeral: true });
            }

            await tempVCDB.del('tempHUBBans').catch(() => {});
            
            const guild = interaction.guild;
            const HUBVC = guild.channels.cache.get(config.tempVC.hubVoiceChannelId);
            
            if (HUBVC) {
                await HUBVC.permissionOverwrites.set([])
                    .then(() => console.log('[VC-FIX] Permission overwrites successfully cleared'))
                    .catch(error => console.error('[VC-FIX] Error clearing permission overwrites:', error));
            }

            for await (const key of tempVCDB.keys()) {
                if (key.startsWith('tempVcIdKey_')) {
                    const uid = key.replace('tempVcIdKey_', '');
                    const tempVcId = await tempVCDB.get(`tempVcIdKey_${uid}`).catch(() => null);
                    
                    if (!tempVcId) continue;
                    
                    const vc = guild.channels.cache.get(tempVcId);
                    
                    if (vc) {
                        let adminDeleteEmbed = template_adminDeleteEmbed;
                        adminDeleteEmbed.data.description = adminDeleteEmbed.data.description.replace(
                            '$timeLeft',
                            `<t:${Math.floor(Date.now() / 1000) + 10}:R>`
                        );

                        await vc.send({ content: `<@${uid}>`, embeds: [adminDeleteEmbed] });
                        
                        setTimeout(async () => {
                            if (cleanupTempVC) {
                                await cleanupTempVC(uid, tempVcId);
                            }
                        }, 10000);
                    }
                }
            }

            return interaction.editReply({ content: 'OK. Cleared database and scheduled cleanup.', ephemeral: true });
        } catch (error) {
            console.error('[VC-FIX] Error:', error);
            return interaction.editReply({ content: 'An error occurred while fixing voice channels.', ephemeral: true });
        }
    },
};
