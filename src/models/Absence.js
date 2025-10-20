const { query } = require('../utils/database');

class Absence {
    /**
     * Create a new absence
     * @param {Object} absenceData - Absence data
     * @returns {Promise<Object>}
     */
    static async create(absenceData) {
        try {
            const { guildId, userId, reason, startDate, endDate } = absenceData;
            
            const result = await query(
                `INSERT INTO absences (guild_id, user_id, reason, start_date, end_date)
                 VALUES (?, ?, ?, ?, ?)`,
                [guildId, userId, reason, startDate, endDate]
            );
            
            // Fetch the created record
            const getResult = await query(
                'SELECT * FROM absences WHERE id = ?',
                [result.rows.insertId]
            );
            return getResult.rows[0];
        } catch (error) {
            console.error('[Absence] Error creating absence:', error);
            throw error;
        }
    }

    /**
     * Get all absences for a user
     * @param {string} guildId - Discord guild ID
     * @param {string} userId - Discord user ID
     * @returns {Promise<Array>}
     */
    static async getByUser(guildId, userId) {
        try {
            const result = await query(
                'SELECT * FROM absences WHERE guild_id = ? AND user_id = ? ORDER BY start_date DESC',
                [guildId, userId]
            );
            return result.rows;
        } catch (error) {
            console.error('[Absence] Error getting user absences:', error);
            throw error;
        }
    }

    /**
     * Get active absences for a guild
     * @param {string} guildId - Discord guild ID
     * @returns {Promise<Array>}
     */
    static async getActive(guildId) {
        try {
            const result = await query(
                `SELECT * FROM absences 
                 WHERE guild_id = ? 
                 AND status = 'active' 
                 AND start_date <= CURRENT_TIMESTAMP 
                 AND end_date >= CURRENT_TIMESTAMP
                 ORDER BY end_date ASC`,
                [guildId]
            );
            return result.rows;
        } catch (error) {
            console.error('[Absence] Error getting active absences:', error);
            throw error;
        }
    }

    /**
     * Get all absences for a guild
     * @param {string} guildId - Discord guild ID
     * @returns {Promise<Array>}
     */
    static async getAll(guildId) {
        try {
            const result = await query(
                'SELECT * FROM absences WHERE guild_id = ? ORDER BY start_date DESC',
                [guildId]
            );
            return result.rows;
        } catch (error) {
            console.error('[Absence] Error getting all absences:', error);
            throw error;
        }
    }

    /**
     * Update absence status
     * @param {number} id - Absence ID
     * @param {string} status - New status
     * @returns {Promise<Object>}
     */
    static async updateStatus(id, status) {
        try {
            await query(
                'UPDATE absences SET status = ? WHERE id = ?',
                [status, id]
            );
            const result = await query('SELECT * FROM absences WHERE id = ?', [id]);
            return result.rows[0];
        } catch (error) {
            console.error('[Absence] Error updating status:', error);
            throw error;
        }
    }

    /**
     * Delete absence
     * @param {number} id - Absence ID
     * @returns {Promise<boolean>}
     */
    static async delete(id) {
        try {
            await query('DELETE FROM absences WHERE id = ?', [id]);
            return true;
        } catch (error) {
            console.error('[Absence] Error deleting absence:', error);
            throw error;
        }
    }

    /**
     * Check and update expired absences
     * @param {string} guildId - Discord guild ID
     * @returns {Promise<number>} Number of absences updated
     */
    static async updateExpired(guildId) {
        try {
            const result = await query(
                `UPDATE absences 
                 SET status = 'expired' 
                 WHERE guild_id = ? 
                 AND status = 'active' 
                 AND end_date < CURRENT_TIMESTAMP`,
                [guildId]
            );
            return result.rowCount;
        } catch (error) {
            console.error('[Absence] Error updating expired absences:', error);
            throw error;
        }
    }
}

module.exports = Absence;
