const { 
    PermissionsBitField, 
    ChannelType, 
    ButtonBuilder, 
    ActionRowBuilder, 
    ButtonStyle,
    UserSelectMenuBuilder,
    RoleSelectMenuBuilder,
    StringSelectMenuBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} = require('discord.js');
const {
    template_ownerLeave_Embed,
    template_ownerNew_Embed,
    template_controlsEmbed,
    template_whitelist_Embed,
    template_banlist_Embed,
    template_CancelPreDelete_Embed,
    template_predelete_Embed
} = require('../utils/tempvc-embeds');

const removeTimeouts = {};
const removeTimeoutsMsg = {};
const removeTimeouts2 = {};
const removeTimeoutsMsg2 = {};

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldMember, newMember) {
        const config = require('../config');
        
        if (!config.tempVC || !config.tempVC.enabled) return;

        const { tempVCDB, tempVCLogger, tempVCActivityLogger } = newMember.client;
        if (!tempVCDB) return;

        const guild = newMember.guild;
        const newUserChannel = newMember.channelId;
        const oldUserChannel = oldMember.channelId;
        const userid = newMember.id;

        // Log voice state changes
        if (tempVCActivityLogger) {
            if (!oldUserChannel && newUserChannel) {
                const channel = guild.channels.cache.get(newUserChannel);
                if (channel) {
                    await tempVCActivityLogger.userJoined(newMember.member.user, `<#${newUserChannel}>`);
                }
            } else if (oldUserChannel && !newUserChannel) {
                const channel = guild.channels.cache.get(oldUserChannel);
                if (channel) {
                    await tempVCActivityLogger.userLeft(newMember.member.user, `<#${oldUserChannel}>`);
                }
            } else if (oldUserChannel && newUserChannel && oldUserChannel !== newUserChannel) {
                const oldChannel = guild.channels.cache.get(oldUserChannel);
                const newChannel = guild.channels.cache.get(newUserChannel);
                if (oldChannel) {
                    await tempVCActivityLogger.userLeft(newMember.member.user, `<#${oldUserChannel}>`);
                }
                if (newChannel) {
                    await tempVCActivityLogger.userJoined(newMember.member.user, `<#${newUserChannel}>`);
                }
            }
        }

        let tempVcId = await tempVCDB.get(`tempVcIdKey_${userid}`).catch(() => null);
        let tempTimestamp = await tempVCDB.get(`tempTimestampKey_${userid}`).catch(() => null);

        // User joined HUB channel - create new temp VC
        if (newUserChannel === config.tempVC.hubVoiceChannelId) {
            if (typeof tempVcId === 'undefined' || !tempVcId) {
                setTimeout(moveUser, 1000, userid, newMember, guild, tempVCDB, tempVCLogger, tempVCActivityLogger, config);
                return;
            }
        }

        if (typeof tempVcId === 'undefined' || !tempVcId) return;

        // Owner leaves - auto delete channel
        if (!newUserChannel || newUserChannel !== tempVcId) {
            if (removeTimeouts2[userid]) return;
            if (removeTimeouts[userid]) return;

            let vc = guild.channels.cache.get(tempVcId);
            if (!vc) {
                await cleanupDatabase(userid, tempVCDB);
                return;
            }

            let ownerLeave_Embed = template_ownerLeave_Embed;
            ownerLeave_Embed.data.description = template_ownerLeave_Embed.data.description
                .replace('$tempVcId', `<#${tempVcId}>`)
                .replace('$timeLeft', `<t:${Math.floor(Date.now() / 1000) + 10}:R>`);

            let msg = await vc.send({ content: `<@${newMember.id}>`, embeds: [ownerLeave_Embed] });
            let tout = setTimeout(removeTempVC, 10000, userid, tempVcId, guild, tempVCDB, tempVCActivityLogger, newMember.client);
            removeTimeouts[userid] = tout;
            removeTimeoutsMsg[userid] = msg.id;
        }

        // Owner rejoins - cancel deletion
        if (newUserChannel === tempVcId) {
            if (removeTimeouts[userid]) {
                clearTimeout(removeTimeouts[userid]);
                delete removeTimeouts[userid];
                let vc = guild.channels.cache.get(tempVcId);
                if (vc) {
                    let controlmsg = await vc.messages.fetch(`${removeTimeoutsMsg[userid]}`).catch(() => null);
                    if (controlmsg) await controlmsg.delete().catch(() => {});
                }
            }
        }
    },
};

async function moveUser(userid, member, guild, tempVCDB, tempVCLogger, tempVCActivityLogger, config) {
    const HUBVC = guild.channels.cache.get(config.tempVC.hubVoiceChannelId);
    if (!HUBVC) return;

    // Try to set permission overwrite, but continue if it fails (2FA issue)
    await HUBVC.permissionOverwrites.create(userid, { Connect: false }).catch(() => {
        console.log('[TEMP-VC] Could not set HUB permission (2FA required or missing permissions)');
    });

    let newVCid = await createTempVC(userid, guild, tempVCDB, tempVCLogger, tempVCActivityLogger, config, member.client);
    let VC = guild.channels.cache.get(newVCid);

    member.setChannel(newVCid)
        .then(async () => {
            await HUBVC.permissionOverwrites.delete(userid).catch(() => {});
        })
        .catch(async (err) => {
            await member.member.send(
                `The system cannot move you to a new voice channel! The reserved VC has been deleted! A new voice channel can be created again after 60 seconds.`
            ).catch(() => {});
            
            let UBBans = await tempVCDB.get('tempHUBBans').catch(async () => {
                await tempVCDB.put('tempHUBBans', {});
                return await tempVCDB.get('tempHUBBans');
            });
            
            if (Object.keys(UBBans).length === 0) {
                setTimeout(cleanHUBTimeban, 5000, guild, tempVCDB, config);
            }
            UBBans[`${userid}`] = Date.now();
            await tempVCDB.put('tempHUBBans', UBBans);

            if (VC) {
                VC.delete().catch(() => console.log('[TEMP-VC] VC delete error'));
            }
            await cleanupDatabase(userid, tempVCDB);
        });
}

async function cleanHUBTimeban(guild, tempVCDB, config) {
    let UBBans = await tempVCDB.get('tempHUBBans').catch(async () => {
        await tempVCDB.put('tempHUBBans', {});
        return await tempVCDB.get('tempHUBBans');
    });
    
    for (const key of Object.keys(UBBans)) {
        if (Date.now() - UBBans[key] > 60 * 1000) {
            delete UBBans[key];
            let HUBVC = guild.channels.cache.get(config.tempVC.hubVoiceChannelId);
            if (HUBVC) {
                await HUBVC.permissionOverwrites.delete(key).catch(() => {});
            }
        }
    }
    
    await tempVCDB.put('tempHUBBans', UBBans);
    if (Object.keys(UBBans).length > 0) {
        setTimeout(cleanHUBTimeban, 5000, guild, tempVCDB, config);
    }
}

async function createTempVC(userId, guild, tempVCDB, tempVCLogger, tempVCActivityLogger, config, client) {
    const user = client.users.cache.get(userId);
    if (!user) return null;

    const newTempVoiceChannel = await guild.channels.create({
        name: `${user.username}'s VC`,
        type: ChannelType.GuildVoice,
        parent: config.tempVC.categoryId,
        permissionOverwrites: [
            {
                id: config.tempVC.defaultRoleId,
                allow: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: userId,
                allow: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.Speak],
            },
        ],
    });

    await newTempVoiceChannel.lockPermissions().catch(() => {
        console.log('[TEMP-VC] Could not lock permissions (2FA required or missing permissions)');
    });
    await newTempVoiceChannel.permissionOverwrites.edit(userId, {
        Speak: true,
        Connect: true,
        ViewChannel: true,
    }).catch(() => {
        console.log('[TEMP-VC] Could not edit user permissions (2FA required or missing permissions)');
    });

    const cmsg = await createControlMsg(userId, user.username, client, config);
    const msg = await newTempVoiceChannel.send(cmsg);

    await tempVCDB.put(`tempVcIdKey_${userId}`, newTempVoiceChannel.id).catch(() => {});
    await tempVCDB.put(`tempmsgIdKey_${userId}`, msg.id).catch(() => {});
    await tempVCDB.put(`tempTimestampKey_${userId}`, Date.now() / 1000).catch(() => {});

    if (tempVCLogger) {
        await tempVCLogger.logUserAction('Created Temp VC', userId, newTempVoiceChannel.id, `Channel: ${newTempVoiceChannel.name}`);
    }

    if (tempVCActivityLogger) {
        await tempVCActivityLogger.channelCreated(user, `<#${newTempVoiceChannel.id}>`, newTempVoiceChannel.name);
    }

    return newTempVoiceChannel.id;
}

async function removeTempVC(userId, vcId, guild, tempVCDB, tempVCActivityLogger, client) {
    delete removeTimeouts2[userId];
    delete removeTimeouts[userId];
    
    let vc = guild.channels.cache.get(vcId);
    if (vc) {
        if (tempVCActivityLogger) {
            const user = await client.users.fetch(userId).catch(() => null);
            if (user) {
                await tempVCActivityLogger.channelDeleted(user, vc.name, 'Owner timeout/manual deletion');
            }
        }
        await vc.delete().catch(() => console.log('[TEMP-VC] VC delete error'));
    }
    await cleanupDatabase(userId, tempVCDB);
}

async function cleanupDatabase(userId, tempVCDB) {
    await tempVCDB.del(`tempVcIdKey_${userId}`).catch(() => {});
    await tempVCDB.del(`tempmsgIdKey_${userId}`).catch(() => {});
    await tempVCDB.del(`tempTimestampKey_${userId}`).catch(() => {});
}

async function createControlMsg(userId, userName, client, config) {
    const permissions = { ViewChannel: false, Connect: true, Speak: true };
    
    let button1 = new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setEmoji(`${permissions.Connect ? "🔒" : "🔓"}`)
        .setLabel(`${permissions.Connect ? "Lock" : "Unlock"}`)
        .setCustomId('button_lock');
    
    let button2 = new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setEmoji(`${permissions.ViewChannel ? "👤" : "👥"}`)
        .setLabel(`${permissions.ViewChannel ? "Hide" : "Show"}`)
        .setCustomId('button_hide');
    
    let button3 = new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setEmoji(`${permissions.Speak ? "🔇" : "🔊"}`)
        .setLabel(`${permissions.Speak ? "Mute" : "Unmute"}`)
        .setCustomId('button_mute');
    
    let button4 = new ButtonBuilder()
        .setStyle(ButtonStyle.Danger)
        .setEmoji('🚫')
        .setLabel('Ban/Unban')
        .setCustomId('button_ban');
    
    let button5 = new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setEmoji('🗒️')
        .setLabel('Whitelist/Remove')
        .setCustomId('button_whitelist');
    
    let button6 = new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setEmoji('⚠️')
        .setLabel('Limit')
        .setCustomId('button_limit');
    
    let button7 = new ButtonBuilder()
        .setStyle(ButtonStyle.Danger)
        .setEmoji('📲')
        .setLabel('Change Owner')
        .setCustomId('button_changeowner');
    
    let button8 = new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setEmoji('📝')
        .setLabel('Change Name')
        .setCustomId('button_changename');
    
    let button12 = new ButtonBuilder()
        .setStyle(ButtonStyle.Danger)
        .setEmoji('💢')
        .setLabel('Kick')
        .setCustomId('button_kick');
    
    let button13 = new ButtonBuilder()
        .setStyle(ButtonStyle.Danger)
        .setEmoji('🗑️')
        .setLabel('Delete VC')
        .setCustomId('button_delete');
    
    let button14 = new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setEmoji('🌎')
        .setLabel('Change Region')
        .setCustomId('button_Region');

    let buttonRow1 = new ActionRowBuilder().addComponents([button4, button12, button7, button13]);
    let buttonRow2 = new ActionRowBuilder().addComponents([button1, button2, button3, button6]);
    let buttonRow3 = new ActionRowBuilder().addComponents([button8, button5, button14]);

    let controlsEmbed = template_controlsEmbed;
    const user = client.users.cache.get(userId);
    controlsEmbed.setAuthor({
        name: `${userName}'s VoiceChannel`,
        iconURL: user ? user.avatarURL() : null,
    });

    return {
        content: `<@${userId}>`,
        embeds: [controlsEmbed],
        components: [buttonRow1, buttonRow2, buttonRow3],
    };
}

// Export helper functions for use in interaction handler
module.exports.createControlMsg = createControlMsg;
module.exports.removeTempVC = removeTempVC;
module.exports.cleanupDatabase = cleanupDatabase;
module.exports.removeTimeouts = removeTimeouts;
module.exports.removeTimeoutsMsg = removeTimeoutsMsg;
module.exports.removeTimeouts2 = removeTimeouts2;
module.exports.removeTimeoutsMsg2 = removeTimeoutsMsg2;
