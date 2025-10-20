const { EmbedBuilder } = require('discord.js');
const config = require('../config');

class CustomEmbedBuilder {
    static success(title, description) {
        return new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle(`${config.emojis.success} ${title}`)
            .setDescription(description)
            .setTimestamp();
    }

    static error(title, description) {
        return new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle(`${config.emojis.error} ${title}`)
            .setDescription(description)
            .setTimestamp();
    }

    static warning(title, description) {
        return new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle(`${config.emojis.warning} ${title}`)
            .setDescription(description)
            .setTimestamp();
    }

    static info(title, description) {
        return new EmbedBuilder()
            .setColor(config.botColor)
            .setTitle(`${config.emojis.info} ${title}`)
            .setDescription(description)
            .setTimestamp();
    }

    static music(title, description) {
        return new EmbedBuilder()
            .setColor('#9B59B6')
            .setTitle(`${config.emojis.music} ${title}`)
            .setDescription(description)
            .setTimestamp();
    }

    static moderation(title, description) {
        return new EmbedBuilder()
            .setColor('#E74C3C')
            .setTitle(`${config.emojis.hammer} ${title}`)
            .setDescription(description)
            .setTimestamp();
    }
}

module.exports = CustomEmbedBuilder;
