const config = require('../config');

class Messages {
    static success(message) {
        return `${config.emojis.success} ${message}`;
    }

    static error(message) {
        return `${config.emojis.error} ${message}`;
    }

    static warning(message) {
        return `${config.emojis.warning} ${message}`;
    }

    static info(message) {
        return `${config.emojis.info} ${message}`;
    }
}

module.exports = Messages;
