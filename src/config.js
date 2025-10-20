module.exports = {
    // Bot configuration
    botColor: process.env.BOT_COLOR || '#5865F2',
    prefix: process.env.PREFIX || '!',
    
    // Role-based permissions
    roles: {
        // Admin - Full access to all commands
        admin: '1296065345424986183',
        
        // Management - Absence and utility commands
        management: '1308840318690394233',
        
        // Moderator - Ban, kick, and heavy punishment commands
        moderator: '1379147275346907297',
        
        // Helper - Warn command
        helper: '1246460406055178260',
        
        // Support - Timeout and mute commands
        support: '1268911588992225280'
    },
    
    // Moderation settings
    maxWarnings: 3,
    autoWarnActions: {
        1: 'Warning issued',
        2: 'Second warning issued',
        3: 'Auto-timeout for 1 hour',
        4: 'Auto-kick from server',
        5: 'Auto-ban from server'
    },
    
    // Anti-raid settings
    antiRaid: {
        enabled: false,
        joinThreshold: 5,
        timeWindow: 10000,
        action: 'kick'
    },
    
    // Music settings
    music: {
        maxQueueSize: 100,
        defaultVolume: 50,
        maxVolume: 150
    },
    
    // Logging categories
    logCategories: {
        moderation: true,
        messages: true,
        members: true,
        channels: true,
        roles: true,
        voice: true
    },
    
    // Emojis
    emojis: {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️',
        music: '🎵',
        shield: '🛡️',
        hammer: '🔨',
        lock: '🔒',
        unlock: '🔓'
    },
    
    // Temporary Voice Channel settings
    tempVC: {
        enabled: process.env.TEMP_VC_ENABLED === 'true' || false,
        hubVoiceChannelId: process.env.TEMP_VC_HUB_CHANNEL_ID || '',
        categoryId: process.env.TEMP_VC_CATEGORY_ID || '',
        defaultRoleId: process.env.TEMP_VC_DEFAULT_ROLE_ID || '',
        logChannelId: process.env.TEMP_VC_LOG_CHANNEL_ID || '',
        activityLogChannelId: process.env.TEMP_VC_ACTIVITY_LOG_CHANNEL_ID || '',
        deleteTimeout: 10000, // 10 seconds
    }
};
