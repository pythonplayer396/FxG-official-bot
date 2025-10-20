const { query } = require('../utils/database');

class GuildConfig {
    /**
     * Get guild configuration
     * @param {string} guildId - Discord guild ID
     * @returns {Promise<Object|null>}
     */
    static async get(guildId) {
        try {
            const result = await query(
                'SELECT * FROM guild_configs WHERE guild_id = ?',
                [guildId]
            );
            return result.rows[0] || null;
        } catch (error) {
            console.error('[GuildConfig] Error getting config:', error);
            throw error;
        }
    }

    /**
     * Create or update guild configuration
     * @param {string} guildId - Discord guild ID
     * @param {Object} config - Configuration object
     * @returns {Promise<Object>}
     */
    static async upsert(guildId, config) {
        try {
            const fields = Object.keys(config);
            const values = Object.values(config);
            
            const setClause = fields.map(field => `${field} = ?`).join(', ');
            
            const result = await query(
                `INSERT INTO guild_configs (guild_id, ${fields.join(', ')})
                 VALUES (?, ${fields.map(() => '?').join(', ')})
                 ON DUPLICATE KEY UPDATE ${setClause}`,
                [guildId, ...values, ...values]
            );
            
            // Fetch the updated record
            return await this.get(guildId);
        } catch (error) {
            console.error('[GuildConfig] Error upserting config:', error);
            throw error;
        }
    }

    /**
     * Update specific field in guild configuration
     * @param {string} guildId - Discord guild ID
     * @param {string} field - Field to update
     * @param {any} value - New value
     * @returns {Promise<Object>}
     */
    static async updateField(guildId, field, value) {
        try {
            await query(
                `INSERT INTO guild_configs (guild_id, ${field})
                 VALUES (?, ?)
                 ON DUPLICATE KEY UPDATE ${field} = ?`,
                [guildId, value, value]
            );
            
            return await this.get(guildId);
        } catch (error) {
            console.error('[GuildConfig] Error updating field:', error);
            throw error;
        }
    }

    /**
     * Delete guild configuration
     * @param {string} guildId - Discord guild ID
     * @returns {Promise<boolean>}
     */
    static async delete(guildId) {
        try {
            await query('DELETE FROM guild_configs WHERE guild_id = ?', [guildId]);
            return true;
        } catch (error) {
            console.error('[GuildConfig] Error deleting config:', error);
            throw error;
        }
    }
}

module.exports = GuildConfig;
