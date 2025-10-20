const { PermissionFlagsBits } = require('discord.js');
const config = require('../config');

class PermissionHandler {
    static hasRole(member, roleId) {
        return member.roles.cache.has(roleId);
    }

    static hasAnyRole(member, roleIds) {
        return roleIds.some(roleId => member.roles.cache.has(roleId));
    }

    static canUseCommand(member, commandName) {
        // Bot owner and server owner always have permission
        if (member.id === member.client.application?.owner?.id) return true;
        if (member.id === member.guild.ownerId) return true;
        if (member.permissions.has(PermissionFlagsBits.Administrator)) return true;

        const roles = config.roles;

        // Admin role - can use everything
        if (this.hasRole(member, roles.admin)) return true;

        // Command-specific permissions
        const commandPermissions = {
            // Admin commands - only admin role
            'anti-raid': [roles.admin],
            'anti-ghostping': [roles.admin],
            'filter': [roles.admin],
            'autowarn': [roles.admin],
            'logging': [roles.admin],
            'role-permission': [roles.admin],
            'lockdown': [roles.admin],
            'unlock': [roles.admin],

            // Heavy punishment commands - moderator and above
            'ban': [roles.admin, roles.moderator],
            'unban': [roles.admin, roles.moderator],
            'kick': [roles.admin, roles.moderator],
            'softban': [roles.admin, roles.moderator],

            // Timeout/mute - support and above
            'timeout': [roles.admin, roles.moderator, roles.support],

            // Warn - helper and above
            'warn': [roles.admin, roles.moderator, roles.support, roles.helper],
            'warnings': [roles.admin, roles.moderator, roles.support, roles.helper],
            'clear-warnings': [roles.admin, roles.moderator],

            // Utility moderation - support and above
            'purge': [roles.admin, roles.moderator, roles.support],
            'slowmode': [roles.admin, roles.moderator, roles.support],

            // Management commands - management and above
            'absence': [roles.admin, roles.management],
            'message': [roles.admin, roles.management, roles.moderator],

            // Music commands - everyone can use
            'play': 'everyone',
            'skip': 'everyone',
            'stop': 'everyone',
            'queue': 'everyone',
            'pause': 'everyone',
            'resume': 'everyone',
            'volume': 'everyone',
            'nowplaying': 'everyone',
            'lyrics': 'everyone',

            // User commands - everyone
            'report': 'everyone',
            'poll': 'everyone',
            'ping': 'everyone',
            'help': 'everyone',
            'avatar': 'everyone',
            'servericon': 'everyone',
            'serverinfo': 'everyone',
            'userinfo': 'everyone',
            'inrole': 'everyone',
            'active-staff': 'everyone',
            'timer': 'everyone',
            'ping-ip': 'everyone'
        };

        const allowedRoles = commandPermissions[commandName];

        // If command allows everyone
        if (allowedRoles === 'everyone') return true;

        // If command not in list, deny by default
        if (!allowedRoles) return false;

        // Check if user has any of the allowed roles
        return this.hasAnyRole(member, allowedRoles);
    }

    static canModerate(moderator, target) {
        // Can't moderate yourself
        if (moderator.id === target.id) return false;

        // Can't moderate the guild owner
        if (target.id === moderator.guild.ownerId) return false;

        // Can't moderate someone with higher or equal role
        if (target.roles.highest.position >= moderator.roles.highest.position) return false;

        // Can't moderate someone with higher or equal role than the bot
        if (target.roles.highest.position >= moderator.guild.members.me.roles.highest.position) return false;

        return true;
    }
}

module.exports = PermissionHandler;
