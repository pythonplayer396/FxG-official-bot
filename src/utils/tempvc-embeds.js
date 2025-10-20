const { EmbedBuilder } = require('discord.js');

const flooter = {
    text: "FxG VC Control | ver 2024.10.18",
    iconURL: null
};

const Author = {
    name: "FxG VC Control Assistant",
    iconURL: null
};

const HubEmbed = new EmbedBuilder()
    .setTitle(`Temporary Private Voice Chat`)
    .setColor(0x00B9FF)
    .setDescription(`Join the HUB voice channel to create your own Temp VC, you will become the owner. Default is visible unless manually clicking buttons to open permissions!`)
    .setFooter(flooter);

const AdminForceDelete = new EmbedBuilder()
    .setTitle(`Administrator used fix command!`)
    .setDescription(`Channel will be deleted in $timeLeft.`)
    .setColor(0xe80000)
    .setFooter(flooter);

const consoleembed = new EmbedBuilder()
    .setTitle("Temporary Private Voice Chat Control")
    .setDescription("**Use the buttons below to quickly change some settings!**\n\nHere are the button descriptions:\n\n**Lock/Unlock** - Lock VC so only whitelisted users can connect.\n**Hide/Unhide** - Make VC private so only whitelisted users can see the VC.\n**Mute/Unmute** - Only allow whitelisted users to speak, only affects newly joined users.\n**Ban/Unban** - Ban specific users from joining VC.\n**Whitelist/Remove** - Whitelist management.\n**Limit** - Limit the number of users that can join.\n**Change Owner** - Transfer room ownership.\n**Change Name** - Change the VC name to whatever you want.\n**Get Mention** - Get voice invite URL, invite them to join the voice channel immediately!\n\nTransferring ownership will clear the original restricted permissions!")
    .setColor(0x00B9FF)
    .setFooter(flooter);

const Whitelisttembed = new EmbedBuilder()
    .setTitle('Whitelist')
    .setColor(0xaf40de)
    .setAuthor(Author);

const banliste = new EmbedBuilder()
    .setTitle('Ban List')
    .setColor(0xaf40de)
    .setAuthor(Author);

const predelete_Cancel = new EmbedBuilder()
    .setTitle("Deletion Cancelled!")
    .setDescription(`Scheduled deletion has been cancelled!`)
    .setColor(0x02cf21)
    .setAuthor(Author);

const predelete = new EmbedBuilder()
    .setTitle("Deletion Scheduled!")
    .setDescription(`Owner decided to delete $tempVcId.\nChannel will be deleted in $timeLeft.\nTo cancel, press the DeleteVC button again.`)
    .setColor(0xff0000)
    .setAuthor(Author);

const ownerLeave = new EmbedBuilder()
    .setTitle("Owner Left Voice Room")
    .setDescription(`Owner left $tempVcId.\nChannel will be deleted in $timeLeft.\nTo cancel, rejoin the voice channel.`)
    .setColor(0x00B9FF)
    .setFooter(flooter)
    .setAuthor(Author);

const ownerLeavegivenext = new EmbedBuilder()
    .setTitle("Owner Left Voice Room")
    .setDescription(`Owner left $tempVcId.\nOwnership will be given to next user in $timeLeft, if no one is present it will auto-delete.\nTo cancel, rejoin the voice channel.`)
    .setColor(0x00B9FF)
    .setFooter(flooter)
    .setAuthor(Author);

const NewOwner = new EmbedBuilder()
    .setTitle("New Owner!")
    .setDescription(`Previous owner left for 3 minutes.\nThis channel has automatically transferred ownership to: $user.\n\nIf you can't find the control panel, please use $command`)
    .setColor(0x00B9FF)
    .setFooter(flooter)
    .setAuthor(Author);

function updateEmbedAvatars(botAvatar) {
    const botFooter = {
        text: "FxG VC Control | ver 2024.10.18",
        iconURL: botAvatar,
    };
    const botAuthor = {
        name: "FxG VC Control Assistant",
        iconURL: botAvatar,
    };

    HubEmbed.setFooter(botFooter);
    AdminForceDelete.setFooter(botFooter);
    consoleembed.setFooter(botFooter);
    Whitelisttembed.setAuthor(botAuthor);
    banliste.setAuthor(botAuthor);
    predelete_Cancel.setAuthor(botAuthor);
    predelete.setAuthor(botAuthor);
    ownerLeave.setFooter(botFooter).setAuthor(botAuthor);
    ownerLeavegivenext.setFooter(botFooter).setAuthor(botAuthor);
    NewOwner.setFooter(botFooter).setAuthor(botAuthor);
}

module.exports = {
    embedFlooter: flooter,
    template_createHubEmbed: HubEmbed,
    template_adminDeleteEmbed: AdminForceDelete,
    template_controlsEmbed: consoleembed,
    template_whitelist_Embed: Whitelisttembed,
    template_banlist_Embed: banliste,
    template_CancelPreDelete_Embed: predelete_Cancel,
    template_predelete_Embed: predelete,
    template_ownerLeave_Embed: ownerLeave,
    template_ownerLeaveNext_Embed: ownerLeavegivenext,
    template_ownerNew_Embed: NewOwner,
    updateEmbedAvatars
};
