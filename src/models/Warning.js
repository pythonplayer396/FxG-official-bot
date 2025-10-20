const { query } = require('../utils/database');

class Warning {
    /**
     * Create a new warning
     * @param {Object} warningData - Warning data
     * @returns {Promise<Object>}
     */
    static async create(warningData) {
        try {
            const { guildId, userId, moderatorId, reason } = warningData;
            
            const result = await query(
                `INSERT INTO warnings (guild_id, user_id, moderator_id, reason)
                 VALUES (?, ?, ?, ?)`,
                [guildId, userId, moderatorId, reason]
            );
            
            // Fetch the created record
            const getResult = await query(
                'SELECT * FROM warnings WHERE id = ?',
                [result.rows.insertId]
            );
            return getResult.rows[0];
        } catch (error) {
            console.error('[Warning] Error creating warning:', error);
            throw error;
        }
    }

    /**
     * Get all warnings for a user
     * @param {string} guildId - Discord guild ID
     * @param {string} userId - Discord user ID
     * @returns {Promise<Array>}
     */
    static async getByUser(guildId, userId) {
        try {
            const result = await query(
                'SELECT * FROM warnings WHERE guild_id = ? AND user_id = ? ORDER BY created_at DESC',
                [guildId, userId]
            );
            return result.rows;
        } catch (error) {
            console.error('[Warning] Error getting user warnings:', error);
            throw error;
        }
    }

    /**
     * Get warning count for a user
     * @param {string} guildId - Discord guild ID
     * @param {string} userId - Discord user ID
     * @returns {Promise<number>}
     */
    static async getCount(guildId, userId) {
        try {
            const result = await query(
                'SELECT COUNT(*) as count FROM warnings WHERE guild_id = ? AND user_id = ?',
                [guildId, userId]
            );
            return parseInt(result.rows[0].count);
        } catch (error) {
            console.error('[Warning] Error getting warning count:', error);
            throw error;
        }
    }

    /**
     * Delete a specific warning
     * @param {number} id - Warning ID
     * @returns {Promise<boolean>}
     */
    static async delete(id) {
        try {
            await query('DELETE FROM warnings WHERE id = ?', [id]);
            return true;
        } catch (error) {
            console.error('[Warning] Error deleting warning:', error);
            throw error;
        }
    }

    /**
     * Clear all warnings for a user
     * @param {string} guildId - Discord guild ID
     * @param {string} userId - Discord user ID
     * @returns {Promise<number>} Number of warnings deleted
     */
    static async clearUser(guildId, userId) {
        try {
            const result = await query(
                'DELETE FROM warnings WHERE guild_id = ? AND user_id = ?',
                [guildId, userId]
            );
            return result.rowCount;
        } catch (error) {
            console.error('[Warning] Error clearing user warnings:', error);
            throw error;
        }
    }
}

module.exports = Warning;
