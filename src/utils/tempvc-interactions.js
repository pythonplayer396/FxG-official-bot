const {
    UserSelectMenuBuilder,
    RoleSelectMenuBuilder,
    StringSelectMenuBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');
const {
    template_whitelist_Embed,
    template_banlist_Embed,
    template_CancelPreDelete_Embed,
    template_predelete_Embed,
    template_controlsEmbed
} = require('./tempvc-embeds');
const { 
    removeTimeouts, 
    removeTimeoutsMsg, 
    removeTimeouts2, 
    removeTimeoutsMsg2,
    removeTempVC,
    cleanupDatabase
} = require('../events/voiceStateUpdate');

async function handleTempVCInteraction(interaction) {
    const config = require('../config');
    
    if (!config.tempVC || !config.tempVC.enabled) return false;

    const { tempVCDB, tempVCActivityLogger, createControlMsg } = interaction.client;
    if (!tempVCDB) return false;

    const user = interaction.user;
    const guild = interaction.guild;
    const textchannel = interaction.channel;

    let tempVcId = await tempVCDB.get(`tempVcIdKey_${user.id}`).catch(() => null);
    let tempmsgid = await tempVCDB.get(`tempmsgIdKey_${user.id}`).catch(() => null);
    let tempTimestamp = await tempVCDB.get(`tempTimestampKey_${user.id}`).catch(() => null);

    if (!tempVcId) return false;

    let VC = await guild.channels.fetch(tempVcId).catch(() => null);

    if (!VC) {
        if (interaction.isButton() || interaction.isStringSelectMenu() || interaction.isUserSelectMenu() || interaction.isRoleSelectMenu()) {
            await interaction.reply({
                content: 'The voice channel associated with this interaction no longer exists or could not be found.',
                ephemeral: true
            });
            await cleanupDatabase(user.id, tempVCDB);
        }
        return true;
    }

    // Handle Role/User Select Menus
    if (interaction.isRoleSelectMenu() || interaction.isUserSelectMenu()) {
        if (interaction.customId === 'menu_whitelist_member' || interaction.customId === 'menu_whitelist_role') {
            return await handleWhitelistMenu(interaction, VC, tempVcId, tempVCDB, tempVCActivityLogger, config);
        } else if (interaction.customId === 'menu_banlist_member' || interaction.customId === 'menu_banlist_role') {
            return await handleBanlistMenu(interaction, VC, tempVcId, tempVCDB, tempVCActivityLogger, config);
        }
    }

    // Handle String Select Menus
    if (interaction.isStringSelectMenu()) {
        if (interaction.customId === 'select_kick') {
            return await handleKickSelect(interaction, VC, tempVcId, guild, tempVCActivityLogger);
        } else if (interaction.customId === 'select_changeowner') {
            return await handleChangeOwnerSelect(interaction, VC, tempVcId, tempmsgid, tempTimestamp, user, guild, tempVCDB, tempVCActivityLogger, config);
        } else if (interaction.customId === 'select_Region') {
            return await handleRegionSelect(interaction, VC);
        }
    }

    // Handle Modals
    if (interaction.isModalSubmit()) {
        if (interaction.customId === 'modal_limit') {
            return await handleLimitModal(interaction, VC);
        } else if (interaction.customId === 'modal_changename') {
            return await handleChangeNameModal(interaction, VC, tempVcId, user, tempVCActivityLogger);
        }
    }

    // Handle Buttons
    if (interaction.isButton()) {
        if (tempVcId !== textchannel.id) {
            await interaction.reply({ content: 'Uhhhhh... This is not your VC.', ephemeral: true });
            return true;
        }

        let VCPermissions = await VC.permissionsFor(config.tempVC.defaultRoleId).serialize();

        switch (interaction.customId) {
            case 'button_lock':
                return await handleLockButton(interaction, VC, tempmsgid, user, VCPermissions, config, tempVCActivityLogger, tempVcId);
            case 'button_hide':
                return await handleHideButton(interaction, VC, tempmsgid, user, VCPermissions, config, tempVCActivityLogger, tempVcId);
            case 'button_mute':
                return await handleMuteButton(interaction, VC, tempmsgid, user, VCPermissions, config, tempVCActivityLogger, tempVcId);
            case 'button_limit':
                return await showLimitModal(interaction);
            case 'button_ban':
                return await showBanMenu(interaction, VC);
            case 'button_kick':
                return await showKickMenu(interaction, VC);
            case 'button_changename':
                return await showChangeNameModal(interaction);
            case 'button_changeowner':
                return await showChangeOwnerMenu(interaction, VC);
            case 'button_delete':
                return await handleDeleteButton(interaction, VC, tempVcId, user, guild, tempVCDB);
            case 'button_Region':
                return await showRegionMenu(interaction, VC, interaction.client);
            case 'button_whitelist':
                return await showWhitelistMenu(interaction, VC);
            default:
                return false;
        }
    }

    return false;
}

// Whitelist menu handler
async function handleWhitelistMenu(interaction, VC, tempVcId, tempVCDB, tempVCActivityLogger, config) {
    let whitelist_Embed = template_whitelist_Embed;
    await interaction.update({ ephemeral: true, components: [], content: '', embeds: [whitelist_Embed] });

    if (interaction.customId === 'menu_whitelist_role') {
        let wrole = interaction.guild.roles.cache.get(interaction.values[0]);
        let VCPermissions = await VC.permissionsFor(wrole.id).serialize();
        
        if (!VCPermissions.ViewChannel) {
            await VC.permissionOverwrites.create(wrole.id, { ViewChannel: true, Connect: true });
        } else {
            await VC.permissionOverwrites.delete(wrole.id);
        }
    } else {
        let wUserid = interaction.guild.members.cache.get(interaction.values[0]);
        let VCPermissions = await VC.permissionsFor(wUserid.id).serialize();
        
        if (!VCPermissions.ViewChannel) {
            await VC.permissionOverwrites.create(wUserid.id, { ViewChannel: true, Connect: true });
            if (tempVCActivityLogger) {
                await tempVCActivityLogger.userWhitelisted(interaction.user, wUserid.user, `<#${tempVcId}>`);
            }
        } else {
            await VC.permissionOverwrites.delete(wUserid.id);
            if (tempVCActivityLogger) {
                await tempVCActivityLogger.userUnwhitelisted(interaction.user, wUserid.user, `<#${tempVcId}>`);
            }
        }
    }

    let str1_role = '', str1_member = '';
    VC.permissionOverwrites.cache.forEach((value) => {
        let VCperm = value.allow.serialize();
        if (!VCperm.ViewChannel) return;
        if (value.type === 0) str1_role += `<@&${value.id}>\n`;
        else if (value.type === 1) str1_member += `<@${value.id}>\n`;
    });

    whitelist_Embed.setFields([
        { name: 'Roles', value: `${str1_role !== '' ? str1_role : 'none'}`, inline: true },
        { name: 'Members', value: `${str1_member !== '' ? str1_member : 'none'}`, inline: true },
    ]);

    const userselectmenu = new UserSelectMenuBuilder()
        .setMaxValues(1)
        .setCustomId('menu_whitelist_member')
        .setPlaceholder('Pick one or more users');

    const roleselectmenu = new RoleSelectMenuBuilder()
        .setMaxValues(1)
        .setCustomId('menu_whitelist_role')
        .setPlaceholder('Pick one or more roles');

    const row1 = new ActionRowBuilder().addComponents(userselectmenu);
    const row2 = new ActionRowBuilder().addComponents(roleselectmenu);
    
    await interaction.editReply({ ephemeral: true, content: '', components: [row1, row2], embeds: [whitelist_Embed] });
    return true;
}

// Banlist menu handler
async function handleBanlistMenu(interaction, VC, tempVcId, tempVCDB, tempVCActivityLogger, config) {
    await interaction.update({ ephemeral: true, components: [], content: '' });

    if (interaction.customId === 'menu_banlist_role') {
        let banrole = interaction.guild.roles.cache.get(interaction.values[0]);
        let VCPermissions = VC.permissionOverwrites.cache.find(value => value.id === banrole.id);
        
        if (typeof VCPermissions === 'undefined' || !VCPermissions.deny.serialize().ViewChannel) {
            await VC.permissionOverwrites.create(banrole.id, { ViewChannel: false });
        } else {
            await VC.permissionOverwrites.delete(banrole.id);
        }
    } else {
        let banUserid = interaction.guild.members.cache.get(interaction.values[0]);
        if (banUserid.voice.channelId === VC.id) {
            await banUserid.voice.disconnect().catch(() => {});
        }

        let VCPermissions = VC.permissionOverwrites.cache.find(value => value.id === banUserid.id);
        
        if (typeof VCPermissions === 'undefined' || !VCPermissions.deny.serialize().ViewChannel) {
            await VC.permissionOverwrites.create(banUserid.id, { ViewChannel: false });
            if (tempVCActivityLogger) {
                await tempVCActivityLogger.userBanned(interaction.user, banUserid.user, `<#${tempVcId}>`);
            }
        } else {
            await VC.permissionOverwrites.delete(banUserid.id);
            if (tempVCActivityLogger) {
                await tempVCActivityLogger.userUnbanned(interaction.user, banUserid.user, `<#${tempVcId}>`);
            }
        }
    }

    let str1_role = '', str1_member = '';
    VC.permissionOverwrites.cache.forEach((value) => {
        let VCperm = value.allow.serialize();
        if (VCperm.ViewChannel || typeof value === 'undefined') return;
        if (value.type === 0) str1_role += `<@&${value.id}>\n`;
        else if (value.type === 1) str1_member += `<@${value.id}>\n`;
    });

    let banlist_Embed = template_banlist_Embed;
    banlist_Embed.setFields([
        { name: 'Roles', value: `${str1_role !== '' ? str1_role : 'none'}`, inline: true },
        { name: 'Members', value: `${str1_member !== '' ? str1_member : 'none'}`, inline: true },
    ]);

    const userselectmenu = new UserSelectMenuBuilder()
        .setMaxValues(1)
        .setCustomId('menu_banlist_member')
        .setPlaceholder('Pick one or more users');

    const roleselectmenu = new RoleSelectMenuBuilder()
        .setMaxValues(1)
        .setCustomId('menu_banlist_role')
        .setPlaceholder('Pick one or more roles');

    const row1 = new ActionRowBuilder().addComponents(userselectmenu);
    const row2 = new ActionRowBuilder().addComponents(roleselectmenu);
    
    await interaction.editReply({ ephemeral: true, components: [row1, row2], embeds: [banlist_Embed] });
    return true;
}

// Kick select handler
async function handleKickSelect(interaction, VC, tempVcId, guild, tempVCActivityLogger) {
    let kickUser = guild.members.cache.get(interaction.values[0]);
    await kickUser.voice.disconnect();
    
    if (tempVCActivityLogger) {
        await tempVCActivityLogger.userKicked(interaction.user, kickUser.user, `<#${tempVcId}>`);
    }
    
    await interaction.update({ content: `OK. GoodBye ${kickUser}.`, components: [] });
    return true;
}

// Change owner select handler
async function handleChangeOwnerSelect(interaction, VC, tempVcId, tempmsgid, tempTimestamp, oldUser, guild, tempVCDB, tempVCActivityLogger, config) {
    let newUser = guild.members.cache.get(interaction.values[0]);
    
    let Controlmsg = await VC.messages.fetch(`${tempmsgid}`);
    let VCPermissions = await VC.permissionsFor(config.tempVC.defaultRoleId).serialize();
    
    const controlMsg = await interaction.client.createControlMsg(newUser.id, newUser.user.username, VCPermissions);
    await Controlmsg.edit(controlMsg);

    if (removeTimeouts[oldUser.id]) {
        clearTimeout(removeTimeouts[oldUser.id]);
        delete removeTimeouts[oldUser.id];
        let Controlmsg2 = await VC.messages.fetch(`${removeTimeoutsMsg[oldUser.id]}`).catch(() => null);
        if (Controlmsg2) await Controlmsg2.delete().catch(() => {});
    }

    if (removeTimeouts2[oldUser.id]) {
        await interaction.update({ content: `No. VC is being deleted now.`, components: [] });
        return true;
    }

    await tempVCDB.del(`tempVcIdKey_${oldUser.id}`).catch(() => {});
    await tempVCDB.del(`tempmsgIdKey_${oldUser.id}`).catch(() => {});
    await tempVCDB.del(`tempTimestampKey_${oldUser.id}`).catch(() => {});

    await tempVCDB.put(`tempVcIdKey_${newUser.id}`, tempVcId).catch(() => {});
    await tempVCDB.put(`tempmsgIdKey_${newUser.id}`, tempmsgid).catch(() => {});
    await tempVCDB.put(`tempTimestampKey_${newUser.id}`, tempTimestamp).catch(() => {});

    await interaction.update({ content: `OK. GoodBye ${oldUser}.`, components: [] });

    if (tempVCActivityLogger) {
        await tempVCActivityLogger.ownershipTransferred(oldUser, newUser.user, `<#${tempVcId}>`);
    }

    await VC.setName(`${newUser.nickname ? newUser.nickname : newUser.user.username}'s VC`).catch(() => {});
    return true;
}

// Region select handler
async function handleRegionSelect(interaction, VC) {
    await VC.setRTCRegion(interaction.values[0] === 'null' ? null : interaction.values[0]);
    await interaction.update({ content: `OK. VC RTCRegion now is ${VC.rtcRegion ? VC.rtcRegion : 'Auto'}.`, components: [] });
    return true;
}

// Limit modal handler
async function handleLimitModal(interaction, VC) {
    let inputnum = interaction.fields.getTextInputValue('_value');
    
    if (isNaN(Number(inputnum)) || Number(inputnum) > 99 || Number(inputnum) < 0) {
        return interaction.reply({
            content: 'Please enter the correct value before pressing the button.',
            ephemeral: true
        });
    }

    await VC.setUserLimit(Number(inputnum));
    await interaction.reply({ content: `OK. The UserLimit is set to ${Number(inputnum)}.`, ephemeral: true });
    return true;
}

// Change name modal handler
async function handleChangeNameModal(interaction, VC, tempVcId, user, tempVCActivityLogger) {
    await interaction.deferReply({ ephemeral: true });
    let inputstr = interaction.fields.getTextInputValue('_value');

    const oldName = VC.name;
    await VC.setName(inputstr);
    
    if (tempVCActivityLogger) {
        await tempVCActivityLogger.channelRenamed(user, oldName, inputstr, `<#${tempVcId}>`);
    }
    
    await interaction.editReply({ content: `OK. VC name is changed to ${inputstr}.`, ephemeral: true });
    return true;
}

// Button handlers
async function handleLockButton(interaction, VC, tempmsgid, user, VCPermissions, config, tempVCActivityLogger, tempVcId) {
    await interaction.deferReply({ ephemeral: true });
    let Controlmsg = await VC.messages.fetch(`${tempmsgid}`);
    
    VCPermissions.Connect = !VCPermissions.Connect;
    await VC.permissionOverwrites.edit(user.id, { Connect: true });
    await VC.permissionOverwrites.edit(config.tempVC.defaultRoleId, { Connect: VCPermissions.Connect });

    const controlMsg = await interaction.client.createControlMsg(user.id, user.username, VCPermissions);
    await Controlmsg.edit(controlMsg);
    
    if (tempVCActivityLogger) {
        const change = VCPermissions.Connect ? 'Unlocked channel (everyone can connect)' : 'Locked channel (restricted access)';
        await tempVCActivityLogger.settingsChanged(user, `<#${tempVcId}>`, change);
    }
    
    await interaction.editReply({
        content: `Now everyone **can${!VCPermissions.Connect ? 'not** ' : '** '}connect to this channel.`,
        ephemeral: true
    });
    return true;
}

async function handleHideButton(interaction, VC, tempmsgid, user, VCPermissions, config, tempVCActivityLogger, tempVcId) {
    await interaction.deferReply({ ephemeral: true });
    
    VCPermissions.ViewChannel = !VCPermissions.ViewChannel;
    let Controlmsg = await VC.messages.fetch(`${tempmsgid}`);
    
    await VC.permissionOverwrites.edit(user.id, { ViewChannel: true });
    await VC.permissionOverwrites.edit(config.tempVC.defaultRoleId, { ViewChannel: VCPermissions.ViewChannel });

    const controlMsg = await interaction.client.createControlMsg(user.id, user.username, VCPermissions);
    await Controlmsg.edit(controlMsg);
    
    if (tempVCActivityLogger) {
        const change = VCPermissions.ViewChannel ? 'Made channel visible to everyone' : 'Made channel hidden (private)';
        await tempVCActivityLogger.settingsChanged(user, `<#${tempVcId}>`, change);
    }
    
    await interaction.editReply({
        content: `Now everyone **can${!VCPermissions.ViewChannel ? 'not** ' : '** '}see this channel.`,
        ephemeral: true
    });
    return true;
}

async function handleMuteButton(interaction, VC, tempmsgid, user, VCPermissions, config, tempVCActivityLogger, tempVcId) {
    await interaction.deferReply({ ephemeral: true });
    
    VCPermissions.Speak = !VCPermissions.Speak;
    let Controlmsg = await VC.messages.fetch(`${tempmsgid}`);
    
    await VC.permissionOverwrites.edit(user.id, { Speak: true });
    await VC.permissionOverwrites.edit(config.tempVC.defaultRoleId, { Speak: VCPermissions.Speak });

    const controlMsg = await interaction.client.createControlMsg(user.id, user.username, VCPermissions);
    await Controlmsg.edit(controlMsg);
    
    if (tempVCActivityLogger) {
        const change = VCPermissions.Speak ? 'Allowed everyone to speak' : 'Muted channel (only whitelisted can speak)';
        await tempVCActivityLogger.settingsChanged(user, `<#${tempVcId}>`, change);
    }
    
    await interaction.editReply({
        content: `Now new join user **can${VCPermissions.Speak ? '**' : 'not**'} Speak.`,
        ephemeral: true
    });
    return true;
}

async function handleDeleteButton(interaction, VC, tempVcId, user, guild, tempVCDB) {
    if (removeTimeouts[user.id]) return interaction.deferUpdate();
    
    if (removeTimeouts2[user.id]) {
        let cmsg = await VC.send({ embeds: [template_CancelPreDelete_Embed] });
        setTimeout(async (msg) => await msg.delete().catch(() => {}), 5000, cmsg);
        
        let Controlmsg = await VC.messages.fetch(`${removeTimeoutsMsg2[user.id]}`);
        clearTimeout(removeTimeouts2[user.id]);
        delete removeTimeouts2[user.id];
        await Controlmsg.delete().catch(() => {});
    } else {
        let predelete_Embed = template_predelete_Embed;
        predelete_Embed.data.description = predelete_Embed.data.description
            .replace('$tempVcId', `<#${tempVcId}>`)
            .replace('$timeLeft', `<t:${Math.floor(Date.now() / 1000) + 10}:R>`);

        let msg = await VC.send({ embeds: [predelete_Embed] });
        let tout = setTimeout(removeTempVC, 10000, user.id, tempVcId, guild, tempVCDB, interaction.client.tempVCActivityLogger, interaction.client);
        removeTimeouts2[user.id] = tout;
        removeTimeoutsMsg2[user.id] = msg.id;
    }

    return interaction.deferUpdate();
}

// Show modal/menu functions
async function showLimitModal(interaction) {
    const modal = new ModalBuilder()
        .setCustomId('modal_limit')
        .setTitle('Set User limit');
    
    const MessageInput = new TextInputBuilder()
        .setCustomId('_value')
        .setLabel('User limit')
        .setPlaceholder('Type number here')
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(2)
        .setStyle(TextInputStyle.Short);
    
    modal.addComponents(new ActionRowBuilder().addComponents(MessageInput));
    await interaction.showModal(modal);
    return true;
}

async function showChangeNameModal(interaction) {
    const modal = new ModalBuilder()
        .setCustomId('modal_changename')
        .setTitle('Change VC Name');
    
    const MessageInput = new TextInputBuilder()
        .setCustomId('_value')
        .setLabel('Name')
        .setPlaceholder('Type name here')
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(100)
        .setStyle(TextInputStyle.Short);
    
    modal.addComponents(new ActionRowBuilder().addComponents(MessageInput));
    await interaction.showModal(modal);
    return true;
}

async function showBanMenu(interaction, VC) {
    let str1_role = '', str1_member = '';
    VC.permissionOverwrites.cache.forEach((value) => {
        let VCperm = value.allow.serialize();
        if (!VCperm.ViewChannel) return;
        if (value.type === 0) str1_role += `<@&${value.id}>\n`;
        else if (value.type === 1) str1_member += `<@${value.id}>\n`;
    });

    let banlist_Embed = template_banlist_Embed;
    banlist_Embed.setFields([
        { name: 'Roles', value: `${str1_role !== '' ? str1_role : 'none'}`, inline: true },
        { name: 'Members', value: `${str1_member !== '' ? str1_member : 'none'}`, inline: true },
    ]);

    const userselectmenu = new UserSelectMenuBuilder()
        .setMaxValues(1)
        .setCustomId('menu_banlist_member')
        .setPlaceholder('Pick one or more users');

    const roleselectmenu = new RoleSelectMenuBuilder()
        .setMaxValues(1)
        .setCustomId('menu_banlist_role')
        .setPlaceholder('Pick one or more roles');

    const row1 = new ActionRowBuilder().addComponents(userselectmenu);
    const row2 = new ActionRowBuilder().addComponents(roleselectmenu);
    
    await interaction.reply({ ephemeral: true, components: [row1, row2], embeds: [banlist_Embed] });
    return true;
}

async function showWhitelistMenu(interaction, VC) {
    let str1_role = '', str1_member = '';
    VC.permissionOverwrites.cache.forEach((value) => {
        let VCperm = value.allow.serialize();
        if (!VCperm.ViewChannel) return;
        if (value.type === 0) str1_role += `<@&${value.id}>\n`;
        else if (value.type === 1) str1_member += `<@${value.id}>\n`;
    });

    let whitelist_Embed = template_whitelist_Embed;
    whitelist_Embed.setFields([
        { name: 'Roles', value: `${str1_role !== '' ? str1_role : 'none'}`, inline: true },
        { name: 'Members', value: `${str1_member !== '' ? str1_member : 'none'}`, inline: true },
    ]);

    const userselectmenu = new UserSelectMenuBuilder()
        .setMaxValues(1)
        .setCustomId('menu_whitelist_member')
        .setPlaceholder('Pick one or more users');

    const roleselectmenu = new RoleSelectMenuBuilder()
        .setMaxValues(1)
        .setCustomId('menu_whitelist_role')
        .setPlaceholder('Pick one or more roles');

    const row1 = new ActionRowBuilder().addComponents(userselectmenu);
    const row2 = new ActionRowBuilder().addComponents(roleselectmenu);
    
    await interaction.reply({ ephemeral: true, components: [row1, row2], embeds: [whitelist_Embed] });
    return true;
}

async function showKickMenu(interaction, VC) {
    await interaction.deferReply({ ephemeral: true });
    let kickUser = VC.members;

    if (kickUser.size <= 1) {
        return interaction.editReply({ content: `Error cannot find user.`, ephemeral: true });
    }

    const row = new ActionRowBuilder();
    let options = [];
    let index = 0;
    
    kickUser.forEach((user) => {
        if (user.id === interaction.user.id) return;
        index += 1;
        if (index <= 25) {
            options.push({
                label: user.user.username,
                description: user.nickname ? user.nickname : user.user.username,
                value: user.id,
            });
        }
    });

    if (options.length === 0) {
        return interaction.editReply({ content: `Error cannot find user.`, ephemeral: true });
    }

    let msmComponents = new StringSelectMenuBuilder()
        .setCustomId('select_kick')
        .setPlaceholder('Nothing selected')
        .addOptions(options);
    
    row.addComponents(msmComponents);
    await interaction.editReply({ content: 'Please select the one you want.', components: [row], ephemeral: true });
    return true;
}

async function showChangeOwnerMenu(interaction, VC) {
    await interaction.deferReply({ ephemeral: true });
    let finedUser = VC.members;

    if (finedUser.size <= 1) {
        return interaction.editReply({ content: `Error cannot find user.`, ephemeral: true });
    }

    const row = new ActionRowBuilder();
    let options = [];
    let index = 0;
    
    finedUser.forEach((user) => {
        index += 1;
        if (index <= 25) {
            options.push({
                label: user.user.username,
                description: user.nickname ? user.nickname : user.user.username,
                value: user.id,
                default: user.id === interaction.user.id,
            });
        }
    });

    let msmComponents = new StringSelectMenuBuilder()
        .setCustomId('select_changeowner')
        .setPlaceholder('Nothing selected')
        .addOptions(options);
    
    row.addComponents(msmComponents);
    await interaction.editReply({ content: 'Please select the one you want.', components: [row], ephemeral: true });
    return true;
}

async function showRegionMenu(interaction, VC, client) {
    await interaction.deferReply({ ephemeral: true });

    const RTCRegions = await client.fetchVoiceRegions();
    
    if (RTCRegions.size < 1) {
        return interaction.editReply({ content: `Error cannot find RTCRegions.`, ephemeral: true });
    }

    const row = new ActionRowBuilder();
    let options = [];
    
    options.push({
        label: 'Auto',
        value: 'null',
        default: !VC.rtcRegion,
    });
    
    RTCRegions.forEach((Region) => {
        options.push({
            label: Region.name,
            value: Region.id,
            default: VC.rtcRegion === Region.id,
        });
    });

    let msmComponents = new StringSelectMenuBuilder()
        .setCustomId('select_Region')
        .setPlaceholder('Nothing selected')
        .addOptions(options);
    
    row.addComponents(msmComponents);
    await interaction.editReply({ content: 'Please select a Region you want.', components: [row], ephemeral: true });
    return true;
}

module.exports = { handleTempVCInteraction };
