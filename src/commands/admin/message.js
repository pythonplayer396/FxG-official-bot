const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Messages = require('../../utils/messages');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('message')
        .setDescription('Send a direct message to a user anonymously from the server')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to message')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message to send')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    
    cooldown: 10,

    async execute(interaction) {
        const targetUser = interaction.options.getUser('user');
        const message = interaction.options.getString('message');

        if (targetUser.bot) {
            return interaction.reply({
                content: Messages.error(`You cannot send messages to bots.`),
                ephemeral: true
            });
        }

        try {
            await targetUser.send({
                embeds: [CustomEmbedBuilder.info(
                    `Message from ${interaction.guild.name}`,
                    message
                )]
            });

            await interaction.reply({
                embeds: [CustomEmbedBuilder.success(
                    'Message Sent',
                    `Successfully sent a message to ${targetUser.tag}.`
                )],
                ephemeral: true
            });

        } catch (error) {
            console.error('[MESSAGE] Error:', error);
            await interaction.reply({
                content: Messages.error(`Could not send message. The user might have DMs disabled.`),
                ephemeral: true
            });
        }
    },
};
