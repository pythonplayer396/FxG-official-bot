const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Create a quick poll with reactions')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('The poll question')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('option1')
                .setDescription('First option')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('option2')
                .setDescription('Second option')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('option3')
                .setDescription('Third option')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('option4')
                .setDescription('Fourth option')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('option5')
                .setDescription('Fifth option')
                .setRequired(false)),
    
    cooldown: 10,

    async execute(interaction) {
        const question = interaction.options.getString('question');
        const options = [];
        
        for (let i = 1; i <= 5; i++) {
            const option = interaction.options.getString(`option${i}`);
            if (option) options.push(option);
        }

        const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];
        
        const embed = new EmbedBuilder()
            .setColor(config.botColor)
            .setTitle(`📊 ${question}`)
            .setDescription(options.map((opt, i) => `${emojis[i]} ${opt}`).join('\n\n'))
            .setFooter({ text: `Poll by ${interaction.user.tag}` })
            .setTimestamp();

        const message = await interaction.reply({ embeds: [embed], fetchReply: true });

        // Add reactions
        for (let i = 0; i < options.length; i++) {
            await message.react(emojis[i]);
        }
    },
};
