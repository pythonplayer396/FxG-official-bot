const { query } = require('../utils/database');

class ModLog {
    /**
     * Create a new moderation log entry
     * @param {Object} logData - Log data
     * @returns {Promise<Object>}
     */
    static async create(logData) {
        try {
            const { guildId, action, userId, moderatorId, reason, duration } = logData;
            
            // Get next case ID for this guild
            const caseResult = await query(
                'SELECT COALESCE(MAX(case_id), 0) + 1 as next_case FROM mod_logs WHERE guild_id = ?',
                [guildId]
            );
            const caseId = caseResult.rows[0].next_case;
            
            const result = await query(
                `INSERT INTO mod_logs (guild_id, case_id, action, user_id, moderator_id, reason, duration)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [guildId, caseId, action, userId, moderatorId, reason, duration]
            );
            
            // Fetch the created record
            return await this.getByCase(guildId, caseId);
        } catch (error) {
            console.error('[ModLog] Error creating log:', error);
            throw error;
        }
    }

    /**
     * Get moderation log by case ID
     * @param {string} guildId - Discord guild ID
     * @param {number} caseId - Case ID
     * @returns {Promise<Object|null>}
     */
    static async getByCase(guildId, caseId) {
        try {
            const result = await query(
                'SELECT * FROM mod_logs WHERE guild_id = ? AND case_id = ?',
                [guildId, caseId]
            );
            return result.rows[0] || null;
        } catch (error) {
            console.error('[ModLog] Error getting log:', error);
            throw error;
        }
    }

    /**
     * Get all moderation logs for a user
     * @param {string} guildId - Discord guild ID
     * @param {string} userId - Discord user ID
     * @returns {Promise<Array>}
     */
    static async getByUser(guildId, userId) {
        try {
            const result = await query(
                'SELECT * FROM mod_logs WHERE guild_id = ? AND user_id = ? ORDER BY created_at DESC',
                [guildId, userId]
            );
            return result.rows;
        } catch (error) {
            console.error('[ModLog] Error getting user logs:', error);
            throw error;
        }
    }

    /**
     * Get recent moderation logs for a guild
     * @param {string} guildId - Discord guild ID
     * @param {number} limit - Number of logs to retrieve
     * @returns {Promise<Array>}
     */
    static async getRecent(guildId, limit = 10) {
        try {
            const result = await query(
                'SELECT * FROM mod_logs WHERE guild_id = ? ORDER BY created_at DESC LIMIT ?',
                [guildId, limit]
            );
            return result.rows;
        } catch (error) {
            console.error('[ModLog] Error getting recent logs:', error);
            throw error;
        }
    }

    /**
     * Update moderation log reason
     * @param {string} guildId - Discord guild ID
     * @param {number} caseId - Case ID
     * @param {string} reason - New reason
     * @returns {Promise<Object>}
     */
    static async updateReason(guildId, caseId, reason) {
        try {
            await query(
                'UPDATE mod_logs SET reason = ? WHERE guild_id = ? AND case_id = ?',
                [reason, guildId, caseId]
            );
            return await this.getByCase(guildId, caseId);
        } catch (error) {
            console.error('[ModLog] Error updating reason:', error);
            throw error;
        }
    }

    /**
     * Delete moderation log
     * @param {string} guildId - Discord guild ID
     * @param {number} caseId - Case ID
     * @returns {Promise<boolean>}
     */
    static async delete(guildId, caseId) {
        try {
            await query(
                'DELETE FROM mod_logs WHERE guild_id = ? AND case_id = ?',
                [guildId, caseId]
            );
            return true;
        } catch (error) {
            console.error('[ModLog] Error deleting log:', error);
            throw error;
        }
    }
}

module.exports = ModLog;
