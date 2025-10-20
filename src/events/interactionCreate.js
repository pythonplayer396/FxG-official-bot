const { Events, InteractionType } = require('discord.js');
const PermissionHandler = require('../utils/permissions');
const Messages = require('../utils/messages');
const { handleTempVCInteraction } = require('../utils/tempvc-interactions');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        // Handle temp VC interactions first
        if (interaction.isButton() || interaction.isStringSelectMenu() || 
            interaction.isUserSelectMenu() || interaction.isRoleSelectMenu() || 
            interaction.isModalSubmit()) {
            const handled = await handleTempVCInteraction(interaction);
            if (handled) return;
        }

        // Handle slash commands
        if (interaction.type === InteractionType.ApplicationCommand) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`[ERROR] No command matching ${interaction.commandName} was found.`);
                return;
            }

            // Check permissions using new system
            if (!PermissionHandler.canUseCommand(interaction.member, interaction.commandName)) {
                return interaction.reply({
                    content: Messages.error('You do not have permission to use this command.'),
                    ephemeral: true
                });
            }

            // Cooldown handling
            const { cooldowns } = interaction.client;
            if (!cooldowns.has(command.data.name)) {
                cooldowns.set(command.data.name, new Map());
            }

            const now = Date.now();
            const timestamps = cooldowns.get(command.data.name);
            const cooldownAmount = (command.cooldown || 3) * 1000;

            if (timestamps.has(interaction.user.id)) {
                const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    return interaction.reply({
                        content: Messages.warning(`Please wait ${timeLeft.toFixed(1)}s before using this command again.`),
                        ephemeral: true
                    });
                }
            }

            timestamps.set(interaction.user.id, now);
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

            // Execute command
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`[ERROR] Error executing ${interaction.commandName}:`, error);
                
                const errorMsg = Messages.error('There was an error executing this command.');
                
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: errorMsg, ephemeral: true });
                } else {
                    await interaction.reply({ content: errorMsg, ephemeral: true });
                }
            }
        }

        // Handle button interactions
        if (interaction.isButton()) {
            console.log(`[BUTTON] ${interaction.customId} pressed by ${interaction.user.tag}`);
        }

        // Handle select menu interactions
        if (interaction.isStringSelectMenu()) {
            console.log(`[SELECT] ${interaction.customId} used by ${interaction.user.tag}`);
        }
    },
};
