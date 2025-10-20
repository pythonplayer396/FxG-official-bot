const ms = require('ms');

class TimeParser {
    static parse(timeString) {
        try {
            const time = ms(timeString);
            if (!time || time < 0) return null;
            return time;
        } catch (error) {
            return null;
        }
    }

    static format(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ${hours % 24}h`;
        if (hours > 0) return `${hours}h ${minutes % 60}m`;
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    }

    static isValidDuration(timeString) {
        const parsed = this.parse(timeString);
        return parsed !== null && parsed > 0;
    }

    static toSeconds(timeString) {
        const ms = this.parse(timeString);
        return ms ? Math.floor(ms / 1000) : null;
    }
}

module.exports = TimeParser;
