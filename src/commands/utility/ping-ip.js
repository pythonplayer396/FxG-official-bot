const { SlashCommandBuilder } = require('discord.js');
const { exec } = require('child_process');
const { promisify } = require('util');
const Messages = require('../../utils/messages');

const execAsync = promisify(exec);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping-ip')
        .setDescription('Ping a host to check its status (use cautiously)')
        .addStringOption(option =>
            option.setName('host')
                .setDescription('The host or IP address to ping')
                .setRequired(true)),
    
    cooldown: 30,

    async execute(interaction) {
        const host = interaction.options.getString('host');

        // Basic validation to prevent command injection
        if (!/^[a-zA-Z0-9.-]+$/.test(host)) {
            return interaction.reply({
                content: Messages.error(`Please provide a valid hostname or IP address.`),
                ephemeral: true
            });
        }

        await interaction.deferReply();

        try {
            // Ping with 4 packets and 5 second timeout
            const { stdout, stderr } = await execAsync(`ping -c 4 -W 5 ${host}`);

            if (stderr) {
                return interaction.editReply({
                    content: Messages.error(`Could not ping ${host}.`)
                });
            }

            // Extract average ping time
            const match = stdout.match(/avg = ([\d.]+)/);
            const avgPing = match ? match[1] : 'N/A';

            // Truncate output if too long
            const output = stdout.length > 1900 ? stdout.substring(0, 1900) + '...' : stdout;

            await interaction.editReply({
                embeds: [CustomEmbedBuilder.success(
                    `Ping Results for ${host}`,
                    `\`\`\`\n${output}\n\`\`\`\n**Average:** ${avgPing}ms`
                )]
            });

        } catch (error) {
            console.error('[PING-IP] Error:', error);
            await interaction.editReply({
                content: Messages.error(`Could not reach ${host}. The host might be down or unreachable.`)
            });
        }
    },
};
