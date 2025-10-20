const mysql = require('mysql2/promise');

// Create MySQL connection pool
// Support both Railway (MYSQL*) and legacy (DB_*) environment variable names
const pool = mysql.createPool({
    host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
    port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
    user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
    database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'fxg_modbot',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
async function connectDatabase() {
    try {
        const connection = await pool.getConnection();
        console.log('[DATABASE] Successfully connected to MySQL');
        
        // Create tables if they don't exist
        await initializeTables(connection);
        
        connection.release();
        return true;
    } catch (error) {
        console.error('[DATABASE] Connection error:', error);
        return false;
    }
}

// Initialize database tables
async function initializeTables(connection) {
    try {
        // Guild Configuration Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS guild_configs (
                guild_id VARCHAR(20) PRIMARY KEY,
                prefix VARCHAR(10) DEFAULT '/',
                mod_log_channel VARCHAR(20),
                welcome_channel VARCHAR(20),
                leave_channel VARCHAR(20),
                auto_role VARCHAR(20),
                mute_role VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Moderation Logs Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS mod_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                guild_id VARCHAR(20) NOT NULL,
                case_id INT NOT NULL,
                action VARCHAR(20) NOT NULL,
                user_id VARCHAR(20) NOT NULL,
                moderator_id VARCHAR(20) NOT NULL,
                reason TEXT,
                duration VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_guild_case (guild_id, case_id)
            )
        `);

        // Absences Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS absences (
                id INT AUTO_INCREMENT PRIMARY KEY,
                guild_id VARCHAR(20) NOT NULL,
                user_id VARCHAR(20) NOT NULL,
                reason TEXT NOT NULL,
                start_date TIMESTAMP NOT NULL,
                end_date TIMESTAMP NOT NULL,
                status VARCHAR(20) DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Warnings Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS warnings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                guild_id VARCHAR(20) NOT NULL,
                user_id VARCHAR(20) NOT NULL,
                moderator_id VARCHAR(20) NOT NULL,
                reason TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('[DATABASE] Tables initialized successfully');
    } catch (error) {
        console.error('[DATABASE] Error initializing tables:', error);
        throw error;
    }
}

// Query helper function
async function query(text, params) {
    const start = Date.now();
    try {
        const [rows, fields] = await pool.execute(text, params);
        const duration = Date.now() - start;
        console.log('[DATABASE] Query executed', { text, duration, rows: rows.length });
        return { rows, fields, rowCount: rows.length, affectedRows: rows.affectedRows };
    } catch (error) {
        console.error('[DATABASE] Query error:', error);
        throw error;
    }
}

// Get connection from pool
async function getClient() {
    return await pool.getConnection();
}

module.exports = {
    pool,
    connectDatabase,
    query,
    getClient
};
