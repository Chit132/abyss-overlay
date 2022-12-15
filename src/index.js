const { shell, remote, ipcRenderer, clipboard } = require('electron');
const { app, BrowserWindow, Notification, dialog } = remote;
const fs = require('fs');
const con = remote.getGlobal('console');
const homedir = app.getPath('home').replaceAll('\\', '/');
window.$ = window.jQuery = require('jquery');
const Tail = require('tail').Tail;
const path = require('path');
const Pickr = require('@simonwep/pickr');
const DiscordRPC = require('discord-rpc');
const rpc = new DiscordRPC.Client({transport: 'ipc'});
const AutoGitUpdate = require('auto-git-update');
const packageJSON = require('../package.json');
const electron_log = require('electron-log'); electron_log.catchErrors({ showDialog: true }); Object.assign(console, electron_log.functions);
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

try{require('electron-json-config');}
catch{
    if (process.platform !== 'darwin'){
        fs.writeFileSync(`${homedir}/AppData/Roaming/Abyss Overlay/config.json`, JSON.stringify({}));
    }
    else{
        fs.writeFileSync(`${homedir}/Library/Application Support/Abyss Overlay/config.json`, JSON.stringify({}));
    }
}
const config = require('electron-json-config');
const { starColor, nameColor, wsColor, fkdrColor, wlrColor, bblrColor, finalsColor, winsColor, getTag, NWL, swLVL, HypixelColors } = require('./helpers.js');
const { ModalWindow } = require('./modalWindow.js');
const { PopupStats } = require('./popupStats.js');


config.delete('players');
const tagsIP = process.env.TAGS_IP, musicIP = process.env.MUSIC_IP, mojang = 'https://api.mojang.com/users/profiles/minecraft/';
var players = [], numplayers = 0, key = config.get('key', '1'), apilink = `https://api.hypixel.net/player?key=${key}&uuid=`, goodkey = true, keyThrottle = false, apiDown = false, overlayAPIdown = false, logpath = '', goodfile = true, currentWindow = '', user = undefined, useruuid = undefined, sent = false, usernick = undefined, winheight = 600, inlobby = true, zoom = 1, gamemode = config.get('settings.gamemode', 0), gmode = config.get('settings.bwgmode', ''), guildlist = false, tagslist = [], guildtag = config.get('settings.gtag', true), startapi = null, starttime = new Date(), music = {session: false, playing: false, looping: false, queue: [], updatetimer: 0, timeratio: [0, 0], songtimer: 0, locked: false, lockwarned: false};
var rpcActivity = {details: 'Vibing', state: "Kickin' some butt", assets: {large_image: 'overlay_logo', large_text: 'Abyss Overlay', small_image: 'hypixel', small_text: 'Playing on Hypixel'}, buttons: [{label: 'Get Overlay', 'url': 'https://github.com/Chit132/abyss-overlay/releases/latest'}, {label: 'Join the Discord', 'url': 'https://discord.gg/7dexcJTyCJ'}], timestamps: {start: Date.now()}, instance: true};


function updateTags(){
    $.ajax({type: 'GET', async: true, url: `${tagsIP}/gimmeusers`, success: (data) => {
        tagslist = JSON.parse(data);
        overlayAPIdown = false;
    }, error: () => {
        overlayAPIdown = true;
    }});
}
updateTags();
setInterval(updateTags, 900000);

const updater = new AutoGitUpdate({repository: 'https://github.com/Chit132/abyss-overlay', tempLocation: homedir});
async function versionCompare(){
    try{
        const versions = await updater.compareVersions();
        return versions.upToDate;
    }
    catch{return false;}
}
versionCompare().then((uptodate) => {
    if (!uptodate){
        $('#update').css('display', 'inline-block');
        const updatenotif = new Notification({
            title: 'UPDATE AVAILABLE!',
            body: 'To update, join the Discord, click on the update button, or click on this notification!',
            icon: path.join(__dirname, '../assets/logo.ico')
        });
        updatenotif.on('click', () => {shell.openExternal('https://discord.gg/7dexcJTyCJ'); shell.openExternal('https://github.com/Chit132/abyss-overlay/releases/latest');});
        if (app.isPackaged) updatenotif.show();
    }
});

function verifyKey($apiElement = false) {
    $.ajax({type: 'GET', async: false, url: 'https://api.hypixel.net/key?key='+key, success: (data) => {
        if (data.success === true) {
            goodkey = true;
            apilink = `https://api.hypixel.net/player?key=${key}&uuid=`;
            config.set('key', key);
            useruuid = data.record.owner.replaceAll('-', '');
            $.ajax({type: 'GET', async: false, url: 'https://sessionserver.mojang.com/session/minecraft/profile/' + data.record.owner, success: (profile) => {user = profile.name;}});
            $.ajax({type: 'GET', async: false, url: apilink+useruuid, success: (data) => {
                if (data.success === true && data.player !== null){
                    startapi = data.player;
                    starttime = new Date();
                }
            }});
            $('#api_key').val(key);
            if ($apiElement) {
                ModalWindow.open({ title: 'API Key Accepted!', type: 1 });
                $apiElement.css( { 'border-color': '#b9b9b9', 'text-shadow': '0 0 6px white', 'color': 'transparent'} );
            }
        } else goodkey = false;
    }, error: (jqXHR) => {
        if (jqXHR.status === 0) apiDown = true;
        goodkey = false;
        if ($apiElement) {
            $apiElement.val('');
            $apiElement.css({ 'border-color': '#8f0000', 'text-shadow': 'none', 'color': 'white' });
            if (jqXHR.status !== 0) ModalWindow.open({ title: 'Invalid API Key', content: 'The entered API key is either invalid or it expired! Generate a new one using command "<b>/api new</b>" on Hypixel.', type: -1 });
        }
        updateArray();
    }});
    updateHTML();
}

function updateHTML(){
    let namehtml = '', taghtml = ''; wshtml = '', fkdrhtml = '', wlrhtml = '', bblrhtml = '', finalshtml = '', winshtml = '';
    //con.log('changing 1');
    if (!goodfile) {namehtml += '<li style="color: #FF0000">NO CLIENT PATH FOUND</li>'; taghtml += '<li style="color: #FF0000">ERROR</li>'; wshtml += '<li style="color: #FF0000">X</li>'; fkdrhtml += '<li style="color: #FF0000">X</li>'; wlrhtml += '<li style="color: #FF0000">X</li>'; bblrhtml += '<li style="color: #FF0000">X</li>'; finalshtml += '<li style="color: #FF0000">X</li>'; winshtml += '<li style="color: #FF0000">X</li>'; namehtml += `<li style="color: #FF0000">MISSING CLIENT LOGS FILE</li>`; taghtml += '<li style="color: #FF0000">ERROR</li>'; wshtml += '<li style="color: #FF0000">X</li>'; fkdrhtml += '<li style="color: #FF0000">X</li>'; wlrhtml += '<li style="color: #FF0000">X</li>'; bblrhtml += '<li style="color: #FF0000">X</li>'; finalshtml += '<li style="color: #FF0000">X</li>'; winshtml += '<li style="color: #FF0000">X</li>';}
    else if (apiDown) {
        ModalWindow.open({
            title: 'Hypixel API Down',
            content: 'The Hypixel API is currently unreachable! It may be down or under maintainence. Stats will not show up until the API is back, but the overlay can still show some nicked players',
            type: -1,
            class: -2
        });
    }
    else if (!goodkey) {namehtml += '<li style="color: #FF0000">MISSING/INVALID API KEY</li>'; taghtml += '<li style="color: #FF0000">ERROR</li>'; wshtml += '<li style="color: #FF0000">X</li>'; fkdrhtml += '<li style="color: #FF0000">X</li>'; wlrhtml += '<li style="color: #FF0000">X</li>'; bblrhtml += '<li style="color: #FF0000">X</li>'; finalshtml += '<li style="color: #FF0000">X</li>'; winshtml += '<li style="color: #FF0000">X</li>'; namehtml += `<li style="color: #FF0000">RUN COMMAND "/api new"</li>`; taghtml += '<li style="color: #FF0000">ERROR</li>'; wshtml += '<li style="color: #FF0000">X</li>'; fkdrhtml += '<li style="color: #FF0000">X</li>'; wlrhtml += '<li style="color: #FF0000">X</li>'; bblrhtml += '<li style="color: #FF0000">X</li>'; finalshtml += '<li style="color: #FF0000">X</li>'; winshtml += '<li style="color: #FF0000">X</li>'; namehtml += `<li style="color: #FF0000">OR ENTER IT IN SETTINGS</li>`; taghtml += '<li style="color: #FF0000">ERROR</li>'; wshtml += '<li style="color: #FF0000">X</li>'; fkdrhtml += '<li style="color: #FF0000">X</li>'; wlrhtml += '<li style="color: #FF0000">X</li>'; bblrhtml += '<li style="color: #FF0000">X</li>'; finalshtml += '<li style="color: #FF0000">X</li>'; winshtml += '<li style="color: #FF0000">X</li>';}
    else if (keyThrottle) {
        ModalWindow.open({
            title: 'Hypixel API Key Throttle',
            content: 'You are looking up too many players too quickly! Hypixel has ratelimited your API key for around 1 minute. Try not to search for too many players too quickly: ~60 players per minute max',
            type: -1,
            class: -1
        });
    }
    for (let i = 0; i < players.length; i++){
        //con.log(players[i].name);
        let stars = '', starsColor = '#AAAAAA'; avatar = 'https://crafatar.com/avatars/ec561538f3fd461daff5086b22154bce?size=48&default=MHF_Steve&overlay';//tagColor = '#AAAAAA';
        if (players[i].api === undefined){
            //con.log(players[i].api.stats.Bedwars.winstreak).catch;
            taghtml += '<li>-</li>'; wshtml += '<li>-</li>'; fkdrhtml += '<li>-</li>'; wlrhtml += '<li>-</li>'; bblrhtml += '<li>-</li>'; finalshtml += '<li>-</li>'; winshtml += '<li>-</li>';
            namehtml += `<li style="background: url(${avatar}) no-repeat left center; background-size: 20px; padding-left: 25px;">${players[i].namehtml}</li>`;
        }
        else if (!players[i].api){
            avatar = '../assets/questionmark.png';
            namehtml += `<li style="background: url(${avatar}) no-repeat left center; background-size: 20px; padding-left: 25px;">${players[i].name}</li>`; taghtml += '<li style="color: #F3FF00">NICK</li>'; wshtml += '<li>-</li>'; fkdrhtml += '<li>-</li>'; wlrhtml += '<li>-</li>'; bblrhtml += '<li>-</li>'; finalshtml += '<li>-</li>'; winshtml += '<li>-</li>';
        }
        else{
            if (players[i].avatar !== undefined){namehtml += players[i].namehtml; taghtml += players[i].taghtml; wshtml += players[i].wshtml; fkdrhtml += players[i].fkdrhtml; wlrhtml += players[i].wlrhtml; bblrhtml += players[i].bblrhtml; finalshtml += players[i].finalshtml; winshtml += players[i].winshtml;}
            else{
                stars = '[0✫] '; ttaghtml = '<li>-</li>'; twshtml = '<li>0</li>'; tfkdrhtml = '<li>0</li>'; twlrhtml = '<li>0</li>'; tbblrhtml = '<li>0</li>'; tfinalshtml = '<li>0</li>'; twinshtml = '<li>0</li>';
                if (players[i].api.stats === undefined){}
                else if (players[i].api.stats.Bedwars === undefined){}
                else{
                    let tfkdr = 0, twlr = 0, tbblr = 0;
                    if (players[i].api.achievements !== undefined && players[i].api.achievements.bedwars_level !== undefined){stars = `[${players[i].api.achievements.bedwars_level}✫] `; starsColor = starColor(players[i].api.achievements.bedwars_level);}
                    if (players[i].api.uuid !== undefined) avatar = `https://crafatar.com/avatars/${players[i].api.uuid}?size=48&default=MHF_Steve&overlay`;
                    if (players[i].api.stats.Bedwars.winstreak !== undefined) twshtml = `<li style="color: ${wsColor(players[i].api.stats.Bedwars.winstreak)}">${players[i].api.stats.Bedwars.winstreak}</li>`;
                    if (players[i].api.stats.Bedwars.final_kills_bedwars !== undefined && players[i].api.stats.Bedwars.final_deaths_bedwars !== undefined) tfkdr = parseFloat(players[i].api.stats.Bedwars.final_kills_bedwars/players[i].api.stats.Bedwars.final_deaths_bedwars).toFixed(2); tfkdrhtml = `<li style="color: ${fkdrColor(tfkdr)}">${tfkdr}</li>`;
                    //players[i].api.achievements.bedwars_level*Math.pow(players[i].api.stats.Bedwars.final_kills_bedwars/players[i].api.stats.Bedwars.final_deaths_bedwars, 2);
                    if (players[i].api.stats.Bedwars.wins_bedwars !== undefined && players[i].api.stats.Bedwars.losses_bedwars !== undefined) twlr = parseFloat(players[i].api.stats.Bedwars.wins_bedwars/players[i].api.stats.Bedwars.losses_bedwars).toFixed(2); twlrhtml = `<li style="color: ${wlrColor(twlr)}">${twlr}</li>`;
                    if (players[i].api.stats.Bedwars.beds_broken_bedwars !== undefined && players[i].api.stats.Bedwars.beds_lost_bedwars !== undefined) tbblr = parseFloat(players[i].api.stats.Bedwars.beds_broken_bedwars/players[i].api.stats.Bedwars.beds_lost_bedwars).toFixed(2); tbblrhtml = `<li style="color: ${bblrColor(tbblr)}">${tbblr}</li>`;
                    if (players[i].api.stats.Bedwars.final_kills_bedwars !== undefined) tfinalshtml = `<li style="color: ${finalsColor(players[i].api.stats.Bedwars.final_kills_bedwars)}">${players[i].api.stats.Bedwars.final_kills_bedwars}</li>`;
                    if (players[i].api.stats.Bedwars.wins_bedwars !== undefined) twinshtml = `<li style="color: ${winsColor(players[i].api.stats.Bedwars.wins_bedwars)}">${players[i].api.stats.Bedwars.wins_bedwars}</li>`;
                }
                let tag = getTag(players[i].api, tagslist); ttaghtml = `<li style="color: ${tag[1]}">${tag[0]}</li>`;
                namehtml += `<li style="background: url(${avatar}) no-repeat left center; background-size: 20px; padding-left: 25px;">${stars}${players[i].namehtml}</li>`; taghtml += ttaghtml; wshtml += twshtml; fkdrhtml += tfkdrhtml; wlrhtml += twlrhtml; bblrhtml += tbblrhtml; finalshtml += tfinalshtml; winshtml += twinshtml;
            }
        }
    }
    //con.log('changing 2');
    if (players.length === 0) PopupStats.reset();
    if (numplayers === 0){
        $('#playertitle').html('PLAYERS');
        $('#playertitle').css('color', 'var(--primaryColor)');
    }
    else if (players.length < numplayers){
        let tplength = players.length;
        namehtml += '<li style="color: #FF0000">MISSING PLAYERS</li><li style="color: #FF0000">RUN COMMAND "/who"</li>';
        $('#playertitle').html(`${tplength} PLAYERS`);
        $('#playertitle').css('color', '#D60000');
    }
    else if (players.length >= numplayers){
        let tplength = players.length;
        $('#playertitle').html(`${tplength} PLAYERS`);
        $('#playertitle').css('color', '#12C300');
    }
    else{
        $('#playertitle').html('PLAYERS');
        $('#playertitle').css('color', 'var(--primaryColor)');
    }
    $('#ign').html(namehtml); $('#tag').html(taghtml); $('#ws').html(wshtml); $('#fkdr').html(fkdrhtml); $('#wlr').html(wlrhtml); $('#bblr').html(bblrhtml); $('#finals').html(finalshtml); $('#wins').html(winshtml);
    //con.log('changing 3 ', Math.random());
}

function updateArray(){
    let obj = {};
    for (let i = 0; i < players.length; i++)
        obj[players[i]['name']] = players[i];
    let tplayers = new Array();
    for (let key in obj)
        tplayers.push(obj[key]);
    players = tplayers;
    if (players.length === 0) return updateHTML();
    if (gamemode === 0){
        for (let i = 0; i < players.length; i++){
            if (players[i].index === undefined){
                try{
                    if (!players[i].api) players[i].index = Number.MAX_VALUE;
                    else{
                        players[i].index = players[i].api.achievements.bedwars_level*Math.pow(players[i].api.stats.Bedwars[`${gmode}final_kills_bedwars`]/players[i].api.stats.Bedwars[`${gmode}final_deaths_bedwars`], 2);
                        if (isNaN(players[i].index)) players[i].index = 0;
                    }
                }
                catch (e){
                    players[i].index = 0;
                }
            }
        }
        players.sort((a, b) => ((a.index < b.index) ? 1 : -1));
    }
    else if (gamemode === 1){
        for (let i = 0; i < players.length; i++){
            if (players[i].swlvl === undefined){
                try{
                    if (!players[i].api) players[i].swlvl = -1;
                    else players[i].swlvl = 0;
                }
                catch (e){
                    players[i].swlvl = 0;
                }
            }
        }
        players.sort((a, b) => (b.swlvl - a.swlvl));
    }
    else if (gamemode === 2){
        for (let i = 0; i < players.length; i++){
            if (players[i].dwins === undefined){
                try{
                    if (!players[i].api) players[i].dwins = -1;
                    else players[i].dwins = 0;
                }
                catch (e){
                    players[i].dwins = 0;
                }
            }
        }
        players.sort((a, b) => (b.dwins - a.dwins));
    }
    updateHTML(players);
    /*let  temp = '';
    for (let i = 0; i < players.length; i++) temp += players[i].index + ' ';
    con.log(temp);*/
}

function playerAJAX(uuid, ign, e, guild = ''){
    let api = '', got = false;
    $.ajax({type: 'GET', async: true, url: apilink+uuid, success: (data) => {
        keyThrottle = false; apiDown = false; ModalWindow.keyThrottle = false; ModalWindow.APIdown = false;
        if (data.success === true && data.player !== null){
            let tswlvl = -1, tdwins = -1;
            if (data.player.displayname === ign){
                api = data.player; api.id = uuid; got = true;
                if (gamemode === 0){
                    let stars = '<span>[0✫]</span>', ttaghtml = '<li>-</li>', twshtml = '<li style="color: red">?</li>', tfkdrhtml = '<li>0</li>', twlrhtml = '<li>0</li>', tfinalshtml = '<li>0</li>', twinshtml = '<li>0</li>';
                    let avatar = `https://crafatar.com/avatars/${api.id}?size=48&default=MHF_Steve&overlay`;
                    if (api.stats === undefined){}
                    else if (api.stats.Bedwars === undefined){}
                    else{
                        let tfkdr = 0, twlr = 0;//tbblr = 0;
                        if (api.achievements !== undefined && api.achievements.bedwars_level !== undefined){stars = starColor(api.achievements.bedwars_level);}
                        if (api.stats.Bedwars[`${gmode}winstreak`] !== undefined) twshtml = `<li style="color: ${wsColor(api.stats.Bedwars[`${gmode}winstreak`])}">${api.stats.Bedwars[`${gmode}winstreak`]}</li>`;
                        if (api.stats.Bedwars[`${gmode}final_kills_bedwars`] !== undefined && api.stats.Bedwars[`${gmode}final_deaths_bedwars`] !== undefined){tfkdr = parseFloat(api.stats.Bedwars[`${gmode}final_kills_bedwars`]/api.stats.Bedwars[`${gmode}final_deaths_bedwars`]).toFixed(2); tfkdrhtml = `<li style="color: ${fkdrColor(tfkdr)}">${tfkdr}</li>`;}
                        else if (api.stats.Bedwars[`${gmode}final_kills_bedwars`] !== undefined){tfkdr = api.stats.Bedwars[`${gmode}final_kills_bedwars`]; tfkdrhtml = `<li style="color: ${fkdrColor(tfkdr)}">${tfkdr}</li>`;}
                        if (api.stats.Bedwars[`${gmode}wins_bedwars`] !== undefined && api.stats.Bedwars[`${gmode}losses_bedwars`] !== undefined){twlr = parseFloat(api.stats.Bedwars[`${gmode}wins_bedwars`]/api.stats.Bedwars[`${gmode}losses_bedwars`]).toFixed(2); twlrhtml = `<li style="color: ${wlrColor(twlr)}">${twlr}</li>`;}
                        else if (api.stats.Bedwars[`${gmode}wins_bedwars`] !== undefined){twlr = api.stats.Bedwars[`${gmode}wins_bedwars`]; twlrhtml = `<li style="color: ${wlrColor(twlr)}">${twlr}</li>`;}
                        //if (api.stats.Bedwars.beds_broken_bedwars !== undefined && api.stats.Bedwars.beds_lost_bedwars !== undefined) tbblr = parseFloat(api.stats.Bedwars.beds_broken_bedwars/api.stats.Bedwars.beds_lost_bedwars).toFixed(2); tbblrhtml = `<li style="color: ${bblrColor(tbblr)}">${tbblr}</li>`;
                        if (api.stats.Bedwars[`${gmode}final_kills_bedwars`] !== undefined) tfinalshtml = `<li style="color: ${finalsColor(api.stats.Bedwars[`${gmode}final_kills_bedwars`])}">${api.stats.Bedwars[`${gmode}final_kills_bedwars`]}</li>`;
                        if (api.stats.Bedwars[`${gmode}wins_bedwars`] !== undefined) twinshtml = `<li style="color: ${winsColor(api.stats.Bedwars[`${gmode}wins_bedwars`])}">${api.stats.Bedwars[`${gmode}wins_bedwars`]}</li>`;
                    }
                    if (e === 1) api.inParty = true;
                    else if (e === 2) api.call = true;
                    else if (e === 3) api.partyReq = true;
                    else if (e === 4) api.friendReq = true;
                    else if (e === 5) api.guildList = true;
                    ttaghtml = getTag(api, tagslist);
                    let tnamehtml = `<li style="background: url(${avatar}) no-repeat left center; background-size: 20px; padding-left: 25px;" class="player_ign ${ign}">${stars} ${nameColor(api)}${guild}</li>`;
                    players.push({name: ign, api: api, namehtml: tnamehtml, avatar: avatar, taghtml: ttaghtml, wshtml: twshtml, fkdrhtml: tfkdrhtml, wlrhtml: twlrhtml, finalshtml: tfinalshtml, winshtml: twinshtml});
                }
                else if (gamemode === 1){
                    let level = '<span>[0⚔]</span>', ttaghtml = '<li>-</li>', tnwlhtml = '<li>0</li>', tkdrhtml = '<li>0</li>', twlrhtml = '<li>0</li>', tkillshtml = '<li>0</li>', twinshtml = '<li>0</li>';
                    let avatar = `https://crafatar.com/avatars/${api.id}?size=48&default=MHF_Steve&overlay`;
                    tswlvl = 0;
                    if (api.stats === undefined){}
                    else if (api.stats.SkyWars === undefined){}
                    else{
                        let tkdr = 0, twlr = 0;
                        if (api.stats.SkyWars.skywars_experience !== undefined){
                            let lvl = swLVL(api.stats.SkyWars.skywars_experience);
                            level = starColor(lvl); tswlvl = lvl;
                        }
                        if (api.networkExp !== undefined){let tnwl = NWL(api.networkExp); tnwlhtml = `<li style="color: ${wsColor(tnwl)}">${tnwl}</li>`;}
                        if (api.stats.SkyWars.kills !== undefined && api.stats.SkyWars.deaths !== undefined){tkdr = parseFloat(api.stats.SkyWars.kills/api.stats.SkyWars.deaths).toFixed(2); tkdrhtml = `<li style="color: ${fkdrColor(tkdr)}">${tkdr}</li>`;}
                        else if (api.stats.SkyWars.kills !== undefined){tkdr = api.stats.SkyWars.kills; tkdrhtml = `<li style="color: ${fkdrColor(tkdr)}">${tkdr}</li>`;}
                        if (api.stats.SkyWars.wins !== undefined && api.stats.SkyWars.losses !== undefined){twlr = parseFloat(api.stats.SkyWars.wins/api.stats.SkyWars.losses).toFixed(2); twlrhtml = `<li style="color: ${wlrColor(twlr)}">${twlr}</li>`;}
                        else if (api.stats.SkyWars.wins !== undefined){twlr = api.stats.SkyWars.wins; twlrhtml = `<li style="color: ${wlrColor(twlr)}">${twlr}</li>`;}
                        if (api.stats.SkyWars.kills !== undefined) tkillshtml = `<li style="color: ${finalsColor(api.stats.SkyWars.kills)}">${api.stats.SkyWars.kills}</li>`;
                        if (api.stats.SkyWars.wins !== undefined) twinshtml = `<li style="color: ${winsColor(api.stats.SkyWars.wins)}">${api.stats.SkyWars.wins}</li>`;
                    }
                    if (e === 1) api.inParty = true;
                    else if (e === 2) api.call = true;
                    else if (e === 3) api.partyReq = true;
                    else if (e === 4) api.friendReq = true;
                    else if (e === 5) api.guildList = true;
                    ttaghtml = getTag(api, tagslist);
                    let tnamehtml = `<li style="background: url(${avatar}) no-repeat left center; background-size: 20px; padding-left: 25px;" class="player_ign ${ign}">${level} ${nameColor(api)}${guild}</li>`;
                    players.push({name: ign, api: api, swlvl: tswlvl, namehtml: tnamehtml, avatar: avatar, taghtml: ttaghtml, wshtml: tnwlhtml, fkdrhtml: tkdrhtml, wlrhtml: twlrhtml, finalshtml: tkillshtml, winshtml: twinshtml});
                }
                else if (gamemode === 2){
                    let level = '<span>[I]</span>', ttaghtml = '<li>-</li>', twshtml = '<li style="color: red">?</li>', tkdrhtml = '<li>0</li>', twlrhtml = '<li>0</li>', tkillshtml = '<li>0</li>', twinshtml = '<li>0</li>';
                    let avatar = `https://crafatar.com/avatars/${api.id}?size=48&default=MHF_Steve&overlay`;
                    tdwins = 0;
                    if (api.stats === undefined){}
                    else if (api.stats.Duels === undefined){}
                    else{
                        let tkdr = 0, twlr = 0;
                        if (api.stats.Duels.wins !== undefined){level = starColor(api.stats.Duels.wins); twinshtml = `<li style="color: ${winsColor(api.stats.Duels.wins)}">${api.stats.Duels.wins}</li>`; tdwins = api.stats.Duels.wins;}
                        if (api.stats.Duels.current_winstreak !== undefined) twshtml = `<li style="color: ${wsColor(api.stats.Duels.current_winstreak)}">${api.stats.Duels.current_winstreak}</li>`;
                        if (api.stats.Duels.kills !== undefined && api.stats.Duels.deaths !== undefined){tkdr = parseFloat(api.stats.Duels.kills/api.stats.Duels.deaths).toFixed(2); tkdrhtml = `<li style="color: ${fkdrColor(tkdr)}">${tkdr}</li>`;}
                        else if (api.stats.Duels.kills !== undefined){tkdr = api.stats.Duels.kills; tkdrhtml = `<li style="color: ${fkdrColor(tkdr)}">${tkdr}</li>`;}
                        if (api.stats.Duels.wins !== undefined && api.stats.Duels.losses !== undefined){twlr = parseFloat(api.stats.Duels.wins/api.stats.Duels.losses).toFixed(2); twlrhtml = `<li style="color: ${wlrColor(twlr)}">${twlr}</li>`;}
                        else if (api.stats.Duels.wins !== undefined){twlr = api.stats.Duels.wins; twlrhtml = `<li style="color: ${wlrColor(twlr)}">${twlr}</li>`;}
                        if (api.stats.Duels.kills !== undefined) tkillshtml = `<li style="color: ${finalsColor(api.stats.Duels.kills)}">${api.stats.Duels.kills}</li>`;
                    }
                    if (e === 1) api.inParty = true;
                    else if (e === 2) api.call = true;
                    else if (e === 3) api.partyReq = true;
                    else if (e === 4) api.friendReq = true;
                    else if (e === 5) api.guildList = true;
                    ttaghtml = getTag(api, tagslist);
                    let tnamehtml = `<li style="background: url(${avatar}) no-repeat left center; background-size: 20px; padding-left: 25px;" class="player_ign ${ign}">${level} ${nameColor(api)}${guild}</li>`;
                    players.push({name: ign, api: api, dwins: tdwins, namehtml: tnamehtml, avatar: avatar, taghtml: ttaghtml, wshtml: twshtml, fkdrhtml: tkdrhtml, wlrhtml: twlrhtml, finalshtml: tkillshtml, winshtml: twinshtml});
                }
            }
            else{got = true; players.push({name: ign, namehtml: ign, api: null});}
            updateArray();
        }
        else if (api.player == null){got = true; players.push({name: ign, namehtml: ign, api: null}); updateArray();}
    }, error: (jqXHR) => {
        got = false;
        if (jqXHR.status === 0) apiDown = true; 
        else if (jqXHR.status === 403) goodkey = false;
        else if (jqXHR.status === 429) keyThrottle = true;
        else {apiDown = true; players.push({name: ign, namehtml: ign, api: null})};
        updateArray();
    }});
}

function addPlayer(ign = '', e = 0){
    let uuid = '';
    console.log(`Adding player: ${ign}`);
    $.ajax({type: 'GET', async: true, url: mojang+ign, success: (data, status) => {
        if (status === 'success'){
            uuid = data.id; ign = data.name;
            if (guildtag){
                let guild = '';
                $.ajax({type: 'GET', async: true, url: `https://api.hypixel.net/findGuild?key=${key}&byUuid=${uuid}`, success: (data) => {
                    if (data.success === true && data.guild){
                        $.ajax({type: 'GET', async: true, url: `https://api.hypixel.net/guild?key=${key}&id=${data.guild}`, success: (data) => {
                            if (data.success === true && data.guild){
                                if (data.guild.tag) guild = ` <span style="color: ${HypixelColors[data.guild.tagColor]}">[${data.guild.tag}]</span>`;
                            }
                            playerAJAX(uuid, ign, e, guild);
                        }, error: () => {
                            playerAJAX(uuid, ign, e, guild);
                        }});
                    }
                    else playerAJAX(uuid, ign, e, guild);
                }, error: () => {
                    playerAJAX(uuid, ign, e, guild);
                }});
            }
            else{
                playerAJAX(uuid, ign, e);
            }
        } else {
            players.push({name: ign, namehtml: ign, api: null});
            updateArray();
        }
    }, error: () => {
        players.push({name: ign, namehtml: ign, api: null});
        updateArray();
        console.error('error with mojang api GET uuid');
    }});
}

function showRotation(matrix){
    let values = matrix.split('(')[1]; values = values.split(')')[0]; values = values.split(',');
    return Math.round(Math.asin(values[1])*(180/Math.PI));
}

function gameStartNotif(){
    if (config.get('settings.notifs', true)){
        const notification = {
            title: 'Game Started!',
            body: 'Your Hypixel game has started!',
            icon: path.join(__dirname, '../assets/logo.ico')
        };
        new Notification(notification).show();
    }
}


function checkMusicLock(){
    if (music.locked){
        if (music.lockwarned === false){music.lockwarned = true; dialog.showMessageBox(currentWindow, {title: 'SPAM ERROR!', detail: 'Woah there! You are spamming music commands too fast. There is a 1 second cooldown between each music interaction. This warning will not bother you again :) Thanks for your patience <3', type: 'error'});}
        return false;
    }
    else{
        music.locked = true;
        setTimeout(() => {music.locked = false}, 1000);
        return true;
    }
}
function clearMusic(e = 0, err = false){
    clearInterval(music.updatetimer); clearInterval(music.songtimer);
    music = {session: false, playing: false, looping: false, queue: [], timeratio: [0, 0]};
    $('.musicplaying').css('display', 'none'); $('.musicbutton').css('display', 'inline-block'); $('.musicintro').css('display', 'block'); $('#startmusic').css('display', 'inline-block'); $('#unlinked').css('display', 'none'); $('#nomusicbots').css('display', 'none'); $('#musicvisualizer').css('display', 'none');
    if (e === 1){
        $.ajax({type: 'GET', async: true, dataType: 'json', url: `${musicIP}/requestClearMusicSession?uuid=${useruuid}`, success: (data) => {
            if (data.success === true){
                if (err) dialog.showMessageBox(currentWindow, {title: 'Music Session Stopped!', detail: 'Check the Abyss Overlay Discord server to find out why your session stopped!', type: 'error'});
                else dialog.showMessageBox(currentWindow, {title: 'Music Session Ended!', detail: 'Your music session should have ended and the bot should have left your VC. If not, then disconnect the bot manually. Feel free to stay in your VC though!'});
            }
            else{
                if (err) dialog.showMessageBox(currentWindow, {title: 'Music Session Stopped!', detail: 'Check the Abyss Overlay Discord server to find out why your session stopped!', type: 'error'});
                else dialog.showMessageBox(currentWindow, {title: 'UNKNOWN ERROR!', detail: 'Unknown eror with ending your music session! Disconnect the music bot manually please! Sorry for the inconvenience', type: 'error'});
            }
        }, error: () => {
            dialog.showMessageBox(currentWindow, {title: 'API ERROR!', detail: 'Music API could be down for the moment :( Contact the devs in the Abyss Overlay Discord server please! Disconnect the bot from your VC', type: 'error'});
        }});
    }
    else{
        if (err) dialog.showMessageBox(currentWindow, {title: 'Music Session Stopped!', detail: 'Check the Abyss Overlay Discord server to find out why your session stopped!', type: 'error'});
        else dialog.showMessageBox(currentWindow, {title: 'Music Session Ended!', detail: 'Your music session should have ended and the bot should have left your VC. If not, then disconnect the bot manually. Feel free to stay in your VC though!'});
    }
}
function playMusic(){
    $('#playmusic').css('background-image', 'url(../assets/m_pause.png)'); $('#musicvisualizer').css('display', 'inline-block');
    clearInterval(music.songtimer);
    music.songtimer = setInterval(() => {
        if (music.timeratio[0] === 0) return;
        music.playing = true;
        music.timeratio[1]++;
        let hrs, mins, secs, tsecs = music.timeratio[1], tstr = '', hr = false;
        hrs = Math.floor(tsecs/3600);
        tsecs %= 3600;
        mins = Math.floor(tsecs/60);
        secs = tsecs % 60;
        if (hrs !== 0){hr = true; tstr += `${hrs}:`;};
        if (mins !== 0){
            if (hr) tstr += `${mins}:`.padStart(3, '0');
            else tstr += `${mins}:`;
        } else tstr += `${mins}:`;
        tstr += `${secs}`.padStart(2, '0');

        //con.log(tstr);
        $('#currentsongtime').html(tstr); $('#musicprogress').css('width', `${((music.timeratio[1]/music.timeratio[0])*100).toString()+'%'}`);

        if (music.timeratio[0] === music.timeratio[1]){
            clearInterval(music.songtimer);
            music.playing = false;
            setTimeout(updateMusic, 500);
        }
    }, 1000);
}
function pauseMusic(){
    clearInterval(music.songtimer);
    $('#playmusic').css('background-image', 'url(../assets/m_play.png)'); $('#musicvisualizer').css('display', 'none');
    music.playing = false;
}
function updateMusic(){
    $.ajax({type: 'GET', async: true, dataType: 'json', url: `${musicIP}/getMusicSession?uuid=${useruuid}`, success: (data) => {
        //con.log('updateMusic');
        if (data.botnumber){
            if (data.nowplaying){
                let nowplaying = data.nowplaying.split(' [!?] ');
                //con.log(nowplaying);
                for (let i = 1; i < 3; i++){
                    let temp = nowplaying[i].split(':'), temp2, timestr = '', hr = false, timeratio = [0, 0];
                    if (temp[0] !== '00'){
                        temp2 = parseInt(temp[0]);//con.log(temp2);
                        timestr += `${temp2}:`; timeratio[i-1] += temp2*3600;
                        hr = true;
                    }
                    if (temp[1] !== '00'){
                        temp2 = parseInt(temp[1]);//con.log(temp2);
                        if (hr) timestr += `${temp2}:`.padStart(3, '0');
                        else timestr += `${temp2}:`;
                        timeratio[i-1] += temp2*60;
                    } else timestr += '0:';
                    if (temp[2] !== '00'){
                        temp2 = parseInt(temp[2]);//con.log(temp2);
                        timestr += temp2.toString().padStart(2, '0'); timeratio[i-1] += temp2;
                    } else timestr += '00';
                    nowplaying[i] = timestr; music.timeratio[i-1] = timeratio[i-1];
                }
                $('#songname').html(nowplaying[0]); $('#fullsongtime').html(nowplaying[1]); $('#currentsongtime').html(nowplaying[2]);
                //con.log(nowplaying); con.log(music.timeratio[0], music.timeratio[1]);
                if (data.paused === false && music.playing === false) playMusic();
                else if (data.paused === true && music.playing === true) pauseMusic();
            }
            else{
                music.timeratio = [0, 0]; clearInterval(music.songtimer);
                $('#songname').html('//'); $('#fullsongtime').html('0:00'); $('#currentsongtime').html('0:00'); $('#musicprogress').css('width', '0%');
            }

            if (data.queue){
                let tqueuehtml = '';
                let tqueue = data.queue;
                let len = tqueue.length;
                for (let i = 0; i < len; i++){
                    let tsong = tqueue[i].split(' [!?] ');
                    let temp = tsong[1].split(':'), temp2, timestr = '', hr = false;
                    if (temp[0] !== '00'){
                        temp2 = parseInt(temp[0]);
                        timestr += `${temp2}:`; hr = true;
                    }
                    if (temp[1] !== '00'){
                        temp2 = parseInt(temp[1]);
                        if (hr) timestr += `${temp2}:`.padStart(3, '0');
                        else timestr += `${temp2}:`;
                    } else timestr += '0:';
                    if (temp[2] !== '00'){
                        temp2 = parseInt(temp[2]);
                        timestr += temp2.toString().padStart(2, '0');
                    } else timestr += '00';
                    tqueuehtml += `<li><span>${i+1}</span><span>${tsong[0]}</span><span>${timestr}</span></li>`;
                }
                $('#queuediv').html(tqueuehtml); $('#queuenum').html(len);
            } else{$('#queuediv').html(''); $('#queuenum').html('0');}

            if (data.looping === true) $('#loopmusic').css('filter', 'drop-shadow(3px 3px 0 var(--primaryColor)) drop-shadow(-3px -3px 0 var(--primaryColor))');
            else $('#loopmusic').css('filter', 'none');

            if (data.paused === true) $('#playmusic').css('background-image', 'url(../assets/m_play.png)');
            else $('#playmusic').css('background-image', 'url(../assets/m_pause.png)');
        }
        else{
            clearMusic(0, true);
        }
    }, error: () => {
        clearMusic(1, -1);main
        console.log('API ERROR with getMusicSession'); $('#startmusic').css('display', 'none'); dialog.showMessageBox(currentWindow, {title: 'API ERROR!', detail: 'Music API could be down for the moment :( Contact the devs in the Abyss Overlay Discord server please!', type: 'error'});
    }});
}

function autowho(){
    if (config.get('settings.autowho', false)) ipcRenderer.send('autowho');
}
ipcRenderer.on('autowho-err', () => {
    config.set('settings.autowho', false);
    new Notification({
        title: 'Autowho error',
        body: 'Autowho was turned off because it could not be run on your PC. Java v8 or above is required! Check logs for more info',
        icon: path.join(__dirname, '../assets/logo.ico')
    }).show();
});

function main(event){
    currentWindow = remote.BrowserWindow.getAllWindows(); currentWindow = currentWindow[0];
    $('.clientbutton').css('display', 'none'); $('.startup').css('display', 'none'); $('#titles').css('display', 'block'); $('#indexdiv').css('display', 'block'); $('.tabsbuttons').css('display', 'inline-block'); $('#show').css('display', 'inline-block');

    if (event.data.client === 'lunar'){
        $('#clientimg').attr('src', 'https://img.icons8.com/nolan/2x/lunar-client.png'); $('#clientimg').css({'height': '34px', 'top': '0px'});
        logpath = config.get('lunarlog', -1);
        if (logpath === -1) {
            let log_18 = { path: `${homedir}/.lunarclient/offline/1.8/logs/latest.log`, modified: 0 };
            let log_189 = { path: `${homedir}/.lunarclient/offline/1.8.9/logs/latest.log`, modified: 0 };
            let log_multiver = { path: `${homedir}/.lunarclient/offline/multiver/logs/latest.log`, modified: 0 };
            if (fs.existsSync(log_18.path)) log_18.modified = fs.statSync(log_18.path).mtime;
            if (fs.existsSync(log_189.path)) log_189.modified = fs.statSync(log_189.path).mtime;
            if (fs.existsSync(log_multiver.path)) log_multiver.modified = fs.statSync(log_multiver.path).mtime;
            const modifiedLogs = [ log_18, log_189, log_multiver ];
            modifiedLogs.sort((a, b) => { return b.modified - a.modified });
            logpath = modifiedLogs[0].path;
        }
    }
    else if (process.platform === 'darwin'){
        if (event.data.client === 'badlion'){logpath = config.get('badlionlog', `${homedir}/Library/Application Support/minecraft/logs/blclient/minecraft/latest.log`); $('#clientimg').attr('src', 'https://www.badlion.net/static/assets/images/logos/badlion-logo.png');}
        else if (event.data.client === 'vanilla'){logpath = config.get('vanillalog', `${homedir}/Library/Application Support/minecraft/logs/latest.log`); $('#clientimg').attr('src', 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/2/2d/Plains_Grass_Block.png/revision/latest?cb=20190525093706');}
        else if (event.data.client === 'pvplounge'){logpath = config.get('pvploungelog', `${homedir}/Library/Application Support/.pvplounge/logs/latest.log`); $('#clientimg').attr('src', 'https://www.saashub.com/images/app/service_logos/158/4d406mrxxaj7/large.png?1601167229');}
        else if (event.data.client === 'labymod'){logpath = config.get('labymodlog', `${homedir}/Library/Application Support/minecraft/logs/fml-client-latest.log`); $('#clientimg').attr('src', 'https://www.labymod.net/page/tpl/assets/images/logo_web.png');}
        else if (event.data.client === 'feather'){logpath = config.get('featherlog', `${homedir}/Library/Application Support/minecraft/logs/latest.log`); $('#clientimg').attr('src', 'https://i.imgur.com/9ZfHrCw.png');}
    }
    else{
        if (event.data.client === 'badlion'){logpath = config.get('badlionlog', `${homedir}/AppData/Roaming/.minecraft/logs/blclient/minecraft/latest.log`); $('#clientimg').attr('src', 'https://www.badlion.net/static/assets/images/logos/badlion-logo.png');}
        else if (event.data.client === 'vanilla'){logpath = config.get('vanillalog', `${homedir}/AppData/Roaming/.minecraft/logs/latest.log`); $('#clientimg').attr('src', 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/2/2d/Plains_Grass_Block.png/revision/latest?cb=20190525093706');}
        else if (event.data.client === 'pvplounge'){logpath = config.get('pvploungelog', `${homedir}/AppData/Roaming/.pvplounge/logs/latest.log`); $('#clientimg').attr('src', 'https://www.saashub.com/images/app/service_logos/158/4d406mrxxaj7/large.png?1601167229');}
        else if (event.data.client === 'labymod'){logpath = config.get('labymodlog', `${homedir}/AppData/Roaming/.minecraft/logs/fml-client-latest.log`); $('#clientimg').attr('src', 'https://www.labymod.net/page/tpl/assets/images/logo_web.png');}
        else if (event.data.client === 'feather'){logpath = config.get('featherlog', `${homedir}/AppData/Roaming/.minecraft/logs/latest.log`); $('#clientimg').attr('src', 'https://i.imgur.com/9ZfHrCw.png');}
    }
    //con.log(logpath);

    if (!fs.existsSync(logpath)) {
        goodfile = false;
        return ModalWindow.open({ title: 'Client chat logs file not found', content: 'The chat logs file for your selected client was not found! You can set it manually if you know where it is using the "Select log file" button in settings. Overlay will not work unless the correct chat logs file is found.', type: -1 })
    }

    verifyKey();

    const tail = new Tail(logpath, {/*logger: con, */useWatchFile: true, nLines: 1, fsWatchOptions: {interval: 100}});
    tail.on('line', (data) => {
        const k = data.indexOf('[CHAT]');
        if (k !== -1){
            const msg = data.substring(k+7).replace(/(§|�)([0-9]|a|b|e|d|f|k|l|m|n|o|r|c)/gm, '');
            //console.log(msg);
            let changed = false;
            if (msg.indexOf('ONLINE:') !== -1 && msg.indexOf(',') !== -1){
                if (inlobby){players = [];} inlobby = false;
                let who = msg.substring(8).split(', ');
                if (config.get('settings.shrink', true)){currentWindow.setSize(currentWindow.webContents.getOwnerBrowserWindow().getBounds().width, winheight, true); $('#show').css('transform', 'rotate(0deg)');}
                if ($('#infodiv').css('display') === 'none' && $('#settingsdiv').css('display') === 'none'){$('#titles').css('display', 'block'); $('#indexdiv').css('display', 'block');}
                //con.log(who);
                for (let i = 0; i < who.length; i++){
                    if (who[i].indexOf('[') !== -1) who[i] = who[i].substring(0, who[i].indexOf('[')-1);
                    let contains = false;
                    for (let j = 0; j < players.length; j++){
                        if (players[j].name === who[i]) contains = true;
                    }
                    if (!contains) addPlayer(who[i]);
                }
                for (let i = 0; i < players.length; i++){
                    if (!who.includes(players[i].name)){players.splice(i, 1); changed = true; updateArray();}
                }
            }
            else if (msg.indexOf('has joined') !== -1 && msg.indexOf(':') === -1){
                //con.log(msg);
                if (inlobby){players = []; sent = true; autowho();} inlobby = false;
                if (config.get('settings.shrink', true)){currentWindow.setSize(currentWindow.webContents.getOwnerBrowserWindow().getBounds().width, winheight, true); $('#show').css('transform', 'rotate(0deg)');}
                if ($('#infodiv').css('display') === 'none' && $('#settingsdiv').css('display') === 'none'){$('#titles').css('display', 'block'); $('#indexdiv').css('display', 'block');}
                if (msg.indexOf('/') !== -1) numplayers = Number(msg.substring(msg.indexOf('(')+1, msg.indexOf('/')));
                let join = msg.split(' ')[0];
                let contains = false;
                for (let i = 0; i < players.length; i++){if (join === players[i].name){contains = true;}}
                if (!contains) addPlayer(join);
            }
            else if (msg.indexOf('has quit') !== -1 && msg.indexOf(':') === -1){
                if (inlobby){players = [];} inlobby = false;
                let left = msg.split(' ')[0];
                numplayers--; inlobby = false;
                if (config.get('settings.shrink', true)){currentWindow.setSize(currentWindow.webContents.getOwnerBrowserWindow().getBounds().width, winheight, true); $('#show').css('transform', 'rotate(0deg)');}
                if ($('#infodiv').css('display') === 'none' && $('#settingsdiv').css('display') === 'none'){$('#titles').css('display', 'block'); $('#indexdiv').css('display', 'block');}
                for (let i = 0; i < players.length; i++){
                    if (left === players[i].name){players.splice(i, 1); changed = true; updateArray();}
                }
            }
            else if (msg.indexOf('Sending you') !== -1 && msg.indexOf(':') === -1){players = []; numplayers = 0; changed = true; sent = true; updateArray(); currentWindow.moveTop(); autowho(); inlobby = false;}
            else if ((msg.indexOf('joined the lobby!') !== -1 || msg.indexOf('rewards!') !== -1) && msg.indexOf(':') === -1) {if (!inlobby){players = [];} inlobby = true; numplayers = 0; changed = true; updateArray(); if (msg.indexOf(user) !== -1 && config.get('settings.shrink', true)){players = []; currentWindow.setSize(currentWindow.webContents.getOwnerBrowserWindow().getBounds().width, Math.round(zoom*35), true); $('#show').css('transform', 'rotate(90deg)'); $('#titles').css('display', 'none'); $('#indexdiv').css('display', 'none');}}
            else if (msg.indexOf('joined the party') !== -1 && msg.indexOf(':') === -1 && inlobby){
                let pjoin = msg.split(' ')[0];
                if (pjoin.indexOf('[') !== -1) pjoin = msg.split(' ')[1];
                if (config.get('settings.shrink', true)){currentWindow.setSize(currentWindow.webContents.getOwnerBrowserWindow().getBounds().width, winheight, true); $('#show').css('transform', 'rotate(0deg)');}
                if ($('#infodiv').css('display') === 'none' && $('#settingsdiv').css('display') === 'none'){$('#titles').css('display', 'block'); $('#indexdiv').css('display', 'block');}
                let contains = false;
                for (let i = 0; i < players.length; i++){if (user === players[i].name){contains = true;}}
                if (!contains) addPlayer(user, 1);
                contains = false;
                for (let i = 0; i < players.length; i++){if (pjoin === players[i].name){contains = true;}}
                if (!contains) addPlayer(pjoin, 1);
            }
            else if (msg.indexOf('You left the party') !== -1 && msg.indexOf(':') === -1 && inlobby){players = []; updateArray();}
            else if (msg.indexOf('left the party') !== -1 && msg.indexOf(':') === -1 && inlobby){
                let pleft = msg.split(' ')[0];
                if (pleft.indexOf('[') !== -1) pleft = msg.split(' ')[1];
                if (config.get('settings.shrink', true)){currentWindow.setSize(currentWindow.webContents.getOwnerBrowserWindow().getBounds().width, winheight, true); $('#show').css('transform', 'rotate(0deg)');}
                if ($('#infodiv').css('display') === 'none' && $('#settingsdiv').css('display') === 'none'){$('#titles').css('display', 'block'); $('#indexdiv').css('display', 'block');}
                for (let i = 0; i < players.length; i++){
                    if (pleft === players[i].name){players.splice(i, 1); changed = true; updateArray();}
                }
            }
            else if (inlobby && (msg.indexOf('Party Leader:') === 0 || msg.indexOf('Party Moderators:') === 0 || msg.indexOf('Party Members:') === 0)){
                if (config.get('settings.shrink', true)){currentWindow.setSize(currentWindow.webContents.getOwnerBrowserWindow().getBounds().width, winheight, true); $('#show').css('transform', 'rotate(0deg)');}
                if ($('#infodiv').css('display') === 'none' && $('#settingsdiv').css('display') === 'none'){$('#titles').css('display', 'block'); $('#indexdiv').css('display', 'block');}
                let tmsg = msg.substring(msg.indexOf(':')+2);
                let who = tmsg.split(' ');
                let tplayers = [];
                for (let i = 0; i < who.length; i++){
                    if (/^[a-zA-Z]+$/.test(who[i])) tplayers.push(who[i]);
                }
                //con.log(tplayers);
                for (let i = 0; i < tplayers.length; i++){
                    let contains = false;
                    for (let j = 0; j < players.length; j++){
                        if (players[j].name === tplayers[i]) contains = true;
                    }
                    if (!contains) addPlayer(tplayers[i], 1);
                }
                for (let i = 0; i < players.length; i++){
                    if (!tplayers.includes(players[i].name)){players.splice(i, 1); changed = true; updateArray();}
                }
            }
            else if ((msg.indexOf('FINAL KILL') !== -1 || msg.indexOf('disconnected') !== -1) && msg.indexOf(':') === -1){
                let left = msg.split(' ')[0];
                numplayers--;
                for (let i = 0; i < players.length; i++){
                    if (left === players[i].name){players.splice(i, 1); changed = true; updateArray();}
                }
            }
            else if (config.get('settings.call', true) && inlobby && msg.indexOf(':') !== -1 && msg.substring(msg.indexOf(':')+2).toLowerCase().indexOf(user.toLowerCase()) !== -1 && msg.indexOf('Guild >') === -1 && msg.indexOf('Party >') === -1 && msg.indexOf('To') === -1 && msg.indexOf('From') === -1){
                let tmsg = msg.substring(0, msg.indexOf(':')+1), tmsgarray = tmsg.split(' ');
                for (let i = 0; i < tmsgarray.length; i++){
                    if (tmsgarray[i].indexOf(':') !== -1){
                        tmsgarray[i] = tmsgarray[i].substring(0, tmsgarray[i].length-1);
                        if (tmsgarray[i][1] === '7') tmsgarray[i] = tmsgarray[i].substring(2);
                        if (tmsgarray[i] !== user){
                            let contains = false;
                            for (let i = 0; i < players.length; i++){if (players[i].name === tmsgarray[i]){contains = true;}}
                            if (!contains){
                                addPlayer(tmsgarray[i], 2);
                                if (config.get('settings.shrink', true)){currentWindow.setSize(currentWindow.webContents.getOwnerBrowserWindow().getBounds().width, winheight, true); $('#show').css('transform', 'rotate(0deg)');}
                                if ($('#infodiv').css('display') === 'none' && $('#settingsdiv').css('display') === 'none'){$('#titles').css('display', 'block'); $('#indexdiv').css('display', 'block');}
                            }
                        }
                    }
                }
            }
            else if (msg.indexOf('Can\'t find a') !== -1 && msg.indexOf('\'!') !== -1 && msg.indexOf(':') === -1){
                let wsearch = msg.substring(37, msg.lastIndexOf("'"));
                let contains = false;
                if ((wsearch.toLowerCase() === 'me') || (wsearch.toLowerCase() === "i")) wsearch = user;
                for (let i = 0; i < players.length; i++){if (wsearch.toLowerCase() === players[i].name.toLowerCase()){contains = true;}}
                if (!contains){
                    addPlayer(wsearch);
                    if (config.get('settings.shrink', true)){currentWindow.setSize(currentWindow.webContents.getOwnerBrowserWindow().getBounds().width, winheight, true); $('#show').css('transform', 'rotate(0deg)');}
                    if ($('#infodiv').css('display') === 'none' && $('#settingsdiv').css('display') === 'none'){$('#titles').css('display', 'block'); $('#indexdiv').css('display', 'block');}
                }
            }
            else if (msg.indexOf('Can\'t find a') !== -1 && msg.indexOf('\'') !== -1 && msg.indexOf(':') === -1){
                let typed = msg.substring(36, msg.lastIndexOf("'"));
                if (typed === 'c' || typed === 'cl'){players = []; updateArray();}
            }
            else if ((msg.indexOf('reconnected') !== -1) && msg.indexOf(':') === -1) sent = false;
            else if (msg.indexOf('The game starts in 1 second!') !== -1 && msg.indexOf(':') === -1){if (config.get('settings.shrink', true)){currentWindow.setSize(currentWindow.webContents.getOwnerBrowserWindow().getBounds().width, Math.round(zoom*35), true); $('#show').css('transform', 'rotate(90deg)'); $('#titles').css('display', 'none'); $('#indexdiv').css('display', 'none');} gameStartNotif();}
            else if (msg.indexOf('new API key') !== -1 && msg.indexOf(':') === -1){key = msg.substring(msg.indexOf('is ')+3); config.set('key', key); apilink = `https://api.hypixel.net/player?key=${key}&uuid=`; goodkey = true; verifyKey($('#api_key')); updateHTML();}
            else if (msg.indexOf('Guild Name: ') === 0 && inlobby){
                guildlist = true; guildtag = false;
                if (config.get('settings.shrink', true)){currentWindow.setSize(currentWindow.webContents.getOwnerBrowserWindow().getBounds().width, winheight, true); $('#show').css('transform', 'rotate(0deg)');}
                if ($('#infodiv').css('display') === 'none' && $('#settingsdiv').css('display') === 'none'){$('#titles').css('display', 'block'); $('#indexdiv').css('display', 'block');}
            }
            else if (guildlist && inlobby && (msg.indexOf(' ?  ') !== -1 || msg.indexOf(' ●  ') !== -1)){
                let tmsgarray = '';
                if (msg.indexOf(' ●  ') !== -1) tmsgarray = msg.split(' ●  ');
                else tmsgarray = msg.split(' ?  ');
                for (let i = 0; i < tmsgarray.length; i++){
                    //con.log(tmsgarray[i]);
                    if (tmsgarray[i][0] === '[') addPlayer(tmsgarray[i].substring(tmsgarray[i].indexOf(' ')+1), 5);
                    else addPlayer(tmsgarray[i], 5);
                }
            }
            else if (guildlist && msg.indexOf('Total Members:') === 0){guildlist = false; setTimeout(() => {guildtag = config.get('settings.gtag', true)}, 10000);}
            else if (music.session === true && msg.indexOf('Party') !== -1 && msg.indexOf('>') !== -1 && msg.indexOf(':') !== -1){
                // let tign = msg.substring(0, msg.indexOf(':')); tign = tign.substring(tign.lastIndexOf(' ')+1); tign = tign.replace(/[^\w]/g,''); if (tign.substring(tign.length-1) === 'f') tign = tign.substring(0, tign.length-1);
                // con.log(tign);
                let command = msg.substring(msg.indexOf(': ')+2);
                if (command[0] === '!'){
                    let i = command.indexOf(' ');
                    if (i === -1) command = [command.substring(1)];
                    else command = [command.substring(1, i), command.substring(i+1)];
                    command[0].toLowerCase();
                    
                    if (command[0] === 'play'){
                        if (checkMusicLock() === false) return;
                        if (command[1]){
                            $.ajax({type: 'GET', async: true, dataType: 'json', url: `${musicIP}/playSong?uuid=${useruuid}&song=${command[1].replaceAll('#', '[SYM1]').replaceAll('?', '[SYM2]').replaceAll('=', '[SYM3]').replaceAll('&', '[SYM4]').replaceAll('%', '[SYM5]').replaceAll(' ', '+')}`, success: (data) => {
                                if (data.success === true) setTimeout(updateMusic, 2000);
                                else dialog.showMessageBox(currentWindow, {title: 'ERROR!', detail: 'Error playing this song. Contact the devs in the Abyss Overlay Discord server please!', type: 'error'});
                            }, error: () => {
                                dialog.showMessageBox(currentWindow, {title: 'API ERROR!', detail: 'Music API could be down for the moment :( Contact the devs in the Abyss Overlay Discord server please!', type: 'error'});
                            }});
                        }
                    }
                    else if (command[0] === 'remove'){
                        if (checkMusicLock() === false) return;
                        if (command[1]){
                            let ri = parseInt(command[1][0]);
                            if (!isNaN(ri)){
                                $.ajax({type: 'GET', async: true, dataType: 'json', url: `${musicIP}/removeSong?uuid=${useruuid}&index=${ri-1}`, success: (data) => {
                                    if (data.success === true) setTimeout(updateMusic, 500);
                                    else dialog.showMessageBox(currentWindow, {title: 'ERROR!', detail: `Error removing this song. Check if song #${ri} exists in your queue in the first place -_- Otherwise contact the devs on the Discord server please <3`, type: 'error'});
                                }, error: () => {
                                    dialog.showMessageBox(currentWindow, {title: 'API ERROR!', detail: 'Music API could be down for the moment :( Contact the devs in the Abyss Overlay Discord server please!', type: 'error'});
                                }});
                            }
                        }
                    }
                    else if (command[0] === 'skip'){
                        if (checkMusicLock() === false) return;
                        $.ajax({type: 'GET', async: true, dataType: 'json', url: `${musicIP}/skipSong?uuid=${useruuid}`, success: (data) => {
                            if (data.success === true){setTimeout(updateMusic, 500); music.playing = false;}
                            else dialog.showMessageBox(currentWindow, {title: 'ERROR!', detail: 'Error skipping this song. Contact the devs in the Abyss Overlay Discord server please!', type: 'error'});
                        }, error: () => {
                            dialog.showMessageBox(currentWindow, {title: 'API ERROR!', detail: 'Music API could be down for the moment :( Contact the devs in the Abyss Overlay Discord server please!', type: 'error'});
                        }});
                    }
                    else if (command[0] === 'clear'){
                        if (checkMusicLock() === false) return;
                        $.ajax({type: 'GET', async: true, dataType: 'json', url: `${musicIP}/clearQueue?uuid=${useruuid}`, success: (data) => {
                            if (data.success === true) setTimeout(updateMusic, 500);
                            else dialog.showMessageBox(currentWindow, {title: 'ERROR!', detail: 'Error clearing queue. Contact the devs in the Abyss Overlay Discord server please!', type: 'error'});
                        }, error: () => {
                            dialog.showMessageBox(currentWindow, {title: 'API ERROR!', detail: 'Music API could be down for the moment :( Contact the devs in the Abyss Overlay Discord server please!', type: 'error'});
                        }});
                    }
                    else if (command[0] === 'loop'){
                        if (checkMusicLock() === false) return;
                        $.ajax({type: 'GET', async: true, dataType: 'json', url: `${musicIP}/toggleLoopPlaylist?uuid=${useruuid}`, success: (data) => {
                            if (data.success === true){
                                if (data.status === true) $('#loopmusic').css('filter', 'drop-shadow(3px 3px 0 var(--primaryColor)) drop-shadow(-3px -3px 0 var(--primaryColor))');
                                else $('#loopmusic').css('filter', 'none');
                                setTimeout(updateMusic, 1000);
                            }
                            else dialog.showMessageBox(currentWindow, {title: 'ERROR!', detail: 'Error toggling loop. Contact the devs in the Abyss Overlay Discord server please!', type: 'error'});
                        }, error: () => {
                            dialog.showMessageBox(currentWindow, {title: 'API ERROR!', detail: 'Music API could be down for the moment :( Contact the devs in the Abyss Overlay Discord server please!', type: 'error'});
                        }});
                    }
                }
            }
            //con.log(msg);
            /*con.log(msg);
            let temp = '';
            for (let i = 0; i < players.length; i++) temp += players[i].name + ' ';
            con.log(temp);*/
        }
        else{
            let msg = data;
            if (config.get('settings.call', true) && inlobby && msg.indexOf('to join their party!') !== -1 && msg.indexOf(':') === -1){
                let tmsg = msg.substring(0, msg.indexOf('has')-1), tmsgarray = tmsg.split(' ');
                if (tmsgarray[0].indexOf('[') !== -1) addPlayer(tmsgarray[1], 3);
                else addPlayer(tmsgarray[0], 3);
            }
            else if (config.get('settings.call', true) && inlobby && msg.indexOf('Friend request from') === 0 && msg.indexOf(':') === -1){
                //con.log('hi');
                let tmsgarray = msg.split(' ');
                addPlayer(tmsgarray[tmsgarray.length-1], 4);
            }
        }
    });
    tail.on('error', (err) => {con.log('error', err); goodfile = false; updateHTML();});
}

$(() => {
    ModalWindow.initialize(); PopupStats.initialize();
    if (overlayAPIdown) {
        ModalWindow.open({
            title: 'Abyss Overlay API Down',
            content: 'The Abyss Overlay API is currently unreachable! It is likely under maintainence and will be back up soon. Tags and/or music might not function properly right now',
            type: -2,
            class: -3
        });
    }

    if (config.get('settings.client', -1) !== -1){
        let tevent = {data: {client: config.get('settings.client')}};
        main(tevent);
    }
    if (config.get('changelog', undefined) !== packageJSON.version){$('#changelogVersion').html(`Changelog v${packageJSON.version}`); $('#changelog').css('display', 'block');}

    currentWindow = remote.BrowserWindow.getAllWindows(); currentWindow = currentWindow[0];
    let winPos = config.get('settings.pos', [0, 0]); let winSize = config.get('settings.size', [800, 600]);
    if (winSize[1] < 315) winSize[1] = 315;
    //currentWindow.setPosition(winPos[0], winPos[1]);
    currentWindow.setSize(winSize[0], winSize[1]);
    currentWindow.on('resized', () => {
        let newheight = currentWindow.webContents.getOwnerBrowserWindow().getBounds().height;
        if (newheight > 65) winheight = newheight;
    });
    if (gamemode === 0){$('#ws_nwl').html('WS'); $('#kdr').html('FKDR'); $('#kills').html('FINALS');}
    if (gamemode === 1){$('#ws_nwl').html('NWL'); $('#kdr').html('KDR'); $('#kills').html('KILLS');}
    if (gamemode === 2){$('#ws_nwl').html('WS'); $('#kdr').html('KDR'); $('#kills').html('KILLS');}
    if (config.has('settings.color')){
        let bkcolor = config.get('settings.color', [2, 2, 2, 0.288]);
        $('#base').css('background', `rgba(${bkcolor[0]}, ${bkcolor[1]}, ${bkcolor[2]}, ${bkcolor[3]})`);
        $('h1').css({'background': `rgb(${bkcolor[0]}, ${bkcolor[1]}, ${bkcolor[2]})`, 'background-clip': 'text', '-webkit-background-clip': 'text', '-webkit-text-fill-color': 'transparent'});
        $('.tabsbuttons').css({'-webkit-filter': `opacity(.75) drop-shadow(0 0 0 rgb(${bkcolor[0]}, ${bkcolor[1]}, ${bkcolor[2]}))`, 'filter': `opacity(.75) drop-shadow(0 0 0 rgb(${bkcolor[0]}, ${bkcolor[1]}, ${bkcolor[2]}))`});
        $('#base').css("--primaryColor", `rgb(${bkcolor[0]}, ${bkcolor[1]}, ${bkcolor[2]})`);
    }
    else{
        $('#base').css('background', 'rgba(2, 2, 2, 0.288)');
        $('h1').css({'background': '-webkit-linear-gradient(rgb(153, 0, 255), rgb(212, 0, 255))', 'background-clip': 'text', '-webkit-background-clip': 'text', '-webkit-text-fill-color': 'transparent'});
        $('.tabsbuttons').css({'-webkit-filter': '', 'filter': ''});
    }
    $('#discord').on('click', () => {shell.openExternal('https://discord.gg/7dexcJTyCJ');});
    $('#info').on('click', () => {
        if ($('#infodiv').css('display') === 'none'){
            $('#info').css('background-image', 'url(../assets/info2.png)'); $('#session').css('background-image', 'url(../assets/session1.png)'); $('#music').css('background-image', 'url(../assets/music1.png)'); $('#settings').css('background-image', 'url(../assets/settings1.png)'); $('#titles').css('display', 'none'); $('#indexdiv').css('display', 'none'); $('#infodiv').css('display', 'inline-block'); $('#sessiondiv').css('display', 'none'); $('#musicdiv').css('display', 'none'); $('#settingsdiv').css('display', 'none');
        }
        else{
            $('#info').css('background-image', 'url(../assets/info1.png)'); $('#session').css('background-image', 'url(../assets/session1.png)'); $('#music').css('background-image', 'url(../assets/music1.png)'); $('#settings').css('background-image', 'url(../assets/settings1.png)'); $('#infodiv').css('display', 'none'); $('#titles').css('display', 'block'); $('#indexdiv').css('display', 'block'); $('#sessiondiv').css('display', 'none'); $('#musicdiv').css('display', 'none'); $('#settingsdiv').css('display', 'none');
        }
    });
    $('#music').on('click', () => {
        if ($('#musicdiv').css('display') === 'none'){
            $('#music').css('background-image', 'url(../assets/music2.png)'); $('#info').css('background-image', 'url(../assets/info1.png)'); $('#session').css('background-image', 'url(../assets/session1.png)'); $('#settings').css('background-image', 'url(../assets/settings1.png)'); $('#titles').css('display', 'none'); $('#indexdiv').css('display', 'none'); $('#musicdiv').css('display', 'inline-block'); $('#infodiv').css('display', 'none'); $('#sessiondiv').css('display', 'none'); $('#settingsdiv').css('display', 'none'); $('#startmusic').css('display', 'inline-block'); $('#unlinked').css('display', 'none'); $('#nomusicbots').css('display', 'none');
        }
        else{
            $('#music').css('background-image', 'url(../assets/music1.png)'); $('#info').css('background-image', 'url(../assets/info1.png)'); $('#session').css('background-image', 'url(../assets/session1.png)'); $('#settings').css('background-image', 'url(../assets/settings1.png)'); $('#infodiv').css('display', 'none'); $('#titles').css('display', 'block'); $('#indexdiv').css('display', 'block'); $('#sessiondiv').css('display', 'none'); $('#musicdiv').css('display', 'none'); $('#settingsdiv').css('display', 'none');
        }
    });
    $('#settings').on('click', () => {
        if ($('#settingsdiv').css('display') === 'none'){
            $('#settings').css('background-image', 'url(../assets/settings2.png)'); $('#info').css('background-image', 'url(../assets/info1.png)'); $('#session').css('background-image', 'url(../assets/session1.png)'); $('#music').css('background-image', 'url(../assets/music1.png)'); $('#titles').css('display', 'none'); $('#indexdiv').css('display', 'none'); $('#settingsdiv').css('display', 'inline-block'); $('#infodiv').css('display', 'none'); $('#sessiondiv').css('display', 'none'); $('#musicdiv').css('display', 'none'); $('#minimizeinfo').css('display', 'block'); $('#notifsbtn').prop('checked', config.get('settings.notifs', true)); $('#shrinkbtn').prop('checked', config.get('settings.shrink', true)); $('#gtagbtn').prop('checked', config.get('settings.gtag', true)); $('#callbtn').prop('checked', config.get('settings.call', true)); $('#rpcbtn').prop('checked', config.get('settings.rpc', true)); $('#whobtn').prop('checked', config.get('settings.autowho', false));
            let tgmode = config.get('settings.bwgmode', ''), tgamemode = config.get('settings.gamemode', 0), trpc = config.get('settings.rpc_stats', 1);
            if (tgmode === '' || tgmode === undefined){$('#overall').addClass('selected'); $('#gmbtn').find('.custom-select').find('.custom-select_trigger').find('span').html('Overall');}
            else if (tgmode === 'eight_one_'){$('#solos').addClass('selected'); $('#gmbtn').find('.custom-select').find('.custom-select_trigger').find('span').html('Solos');}
            else if (tgmode === 'eight_two_'){$('#doubles').addClass('selected'); $('#gmbtn').find('.custom-select').find('.custom-select_trigger').find('span').html('Doubles');}
            else if (tgmode === 'four_three_'){$('#threes').addClass('selected'); $('#gmbtn').find('.custom-select').find('.custom-select_trigger').find('span').html('Threes');}
            else if (tgmode === 'four_four_'){$('#fours').addClass('selected'); $('#gmbtn').find('.custom-select').find('.custom-select_trigger').find('span').html('Fours');}
            if (tgamemode === 0 || tgamemode === undefined){$('#bw').addClass('selected'); $('#gamemodebtn').find('.custom-select').find('.custom-select_trigger').find('span').html('Bedwars');}
            else if (tgamemode === 1){$('#sw').addClass('selected'); $('#gamemodebtn').find('.custom-select').find('.custom-select_trigger').find('span').html('Skywars');}
            else if (tgamemode === 2){$('#duels').addClass('selected'); $('#gamemodebtn').find('.custom-select').find('.custom-select_trigger').find('span').html('Duels');}
            if (trpc === 1 || trpc === undefined){$('#rpcSession').addClass('selected'); $('#rpcStats').find('.custom-select').find('.custom-select_trigger').find('span').html('Session Stats');}
            else if (trpc === 2){$('#rpcOverall').addClass('selected'); $('#rpcStats').find('.custom-select').find('.custom-select_trigger').find('span').html('Overall stats');}
            else if (trpc === 0){$('#rpcNo').addClass('selected'); $('#rpcStats').find('.custom-select').find('.custom-select_trigger').find('span').html('Hide Stats');}
            if (goodkey) {
                $('#api_key').css( { 'border-color': '#b9b9b9', 'text-shadow': '0 0 6px white', 'color': 'transparent'} );
                $('#api_key').val(key);
            } else {
                $('#api_key').css( {'border-color': '#8f0000', 'text-shadow': 'none', 'color': 'white' } );
                $('#api_key').val('');
            }
        }
        else{
            $('#settings').css('background-image', 'url(../assets/settings1.png)'); $('#info').css('background-image', 'url(../assets/info1.png)'); $('#session').css('background-image', 'url(../assets/session1.png)'); $('#music').css('background-image', 'url(../assets/music1.png)'); $('#infodiv').css('display', 'none'); $('#titles').css('display', 'block'); $('#settingsdiv').css('display', 'none'); $('#indexdiv').css('display', 'block'); $('#infodiv').css('display', 'none'); $('#sessiondiv').css('display', 'none'); $('#musicdiv').css('display', 'none');
        }
    });
    $('#update').on('click', () => {shell.openExternal('https://github.com/Chit132/abyss-overlay/releases/latest');});
    $('#info').on('mouseenter', () => {if ($('#infodiv').css('display') === 'none'){$('#info').css('background-image', 'url(../assets/info2.png)');}}).on('mouseleave', () => {if ($('#infodiv').css('display') === 'none'){$('#info').css('background-image', 'url(../assets/info1.png)');}});
    $('#session').on('mouseenter', () => {if ($('#sessiondiv').css('display') === 'none'){$('#session').css('background-image', 'url(../assets/session2.png)');}}).on('mouseleave', () => {if ($('#sessiondiv').css('display') === 'none'){$('#session').css('background-image', 'url(../assets/session1.png)');}});
    $('#music').on('mouseenter', () => {if ($('#musicdiv').css('display') === 'none'){$('#music').css('background-image', 'url(../assets/music2.png)');}}).on('mouseleave', () => {if ($('#musicdiv').css('display') === 'none'){$('#music').css('background-image', 'url(../assets/music1.png)');}});
    $('#settings').on('mouseenter', () => {if ($('#settingsdiv').css('display') === 'none'){$('#settings').css('background-image', 'url(../assets/settings2.png)');}}).on('mouseleave', () => {if ($('#settingsdiv').css('display') === 'none'){$('#settings').css('background-image', 'url(../assets/settings1.png)');}});
    $('#quit').on('click', () => {
        config.delete('players'); config.set('settings.pos', currentWindow.getPosition()); config.set('settings.size', [currentWindow.webContents.getOwnerBrowserWindow().getBounds().width, currentWindow.webContents.getOwnerBrowserWindow().getBounds().height]);
        if (music.session === true) $.ajax({type: 'GET', async: false, dataType: 'json', url: `${musicIP}/requestClearMusicSession?uuid=${useruuid}`});
        currentWindow.setSkipTaskbar(true); currentWindow.close(); app.quit();
    });
    $('#minimize').on('click', () => {currentWindow.minimize();});
    $('#show').on('click', () => {
        //con.log(showRotation($('#show').css('transform')));
        if (showRotation($('#show').css('transform')) === 0){
            currentWindow.setSize(currentWindow.webContents.getOwnerBrowserWindow().getBounds().width, Math.round(zoom*35), true);
            $('#show').css('transform', 'rotate(90deg)'); $('#titles').css('display', 'none'); $('#indexdiv').css('display', 'none');
        }
        else{
            currentWindow.setSize(currentWindow.webContents.getOwnerBrowserWindow().getBounds().width, winheight, true);
            $('#show').css('transform', 'rotate(0deg)'); if ($('#infodiv').css('display') === 'none' && $('#settingsdiv').css('display') === 'none'){$('#titles').css('display', 'block'); $('#indexdiv').css('display', 'block');}
        }
    });
    currentWindow.on('resized', () => {
        if (currentWindow.webContents.getOwnerBrowserWindow().getBounds().width < 710){zoom = (currentWindow.webContents.getOwnerBrowserWindow().getBounds().width)/710; currentWindow.webContents.setZoomFactor(zoom);}
        else{zoom = 1; currentWindow.webContents.setZoomFactor(1);}
    });
    $('#changelogClose').on('click', () => {$('#changelog').css('display', 'none'); config.set('changelog', packageJSON.version);});

    //TESTING AREA

    // $('#pp').on('click', () => {
    //     addPlayer('OhChit');
    // });

    // $('#pp').on('click', () => {
    //     let igns = ['OhChit', 'Brains', 'Manhal_IQ_', 'crystelia', 'Kqrso', 'hypixel', 'Acceqted', 'FunnyNick', 'mawuboo', '69i_love_kids69', 'Divinah', '86tops', 'ip_man', 'm_lly', 'Jamelius', 'Ribskitz'];
    //     //let igns = ['Manhal_IQ_', 'xLectroLiqhtnin', 'Opmine', 'ameeero', 'Feitii', 'tqrm', 'Lioness_Rising', 'TTTTTTIAmLAG_OMG', 'gamerboy80', 'cocoasann', 'SHADjust_', 'Beatr', 'Pairel', 'poopoosnake75', 'OhChit'];
    //     for (let i = 0, ln = igns.length; i < ln; i++) addPlayer(igns[i]);
    // });

    // $('#pp').on('click', () => {
    //     let thtml = '', tnhtml = '', twhtml = '';
    //     thtml += '<li class="tagli" style="color: rgb(0, 250, 0); font-size: 22px;">✔</li>';
    //     thtml += '<li class="tagli" style="color: rgb(255, 255, 255)">‹<span style="color: rgb(0, 250, 0); font-size: 22px;">✔</span>›</li>';
    //     thtml += '<li class="tagli" style="color: rgb(255, 170, 0)">‹<span style="color: rgb(0, 250, 0); font-size: 22px;">✔</span>›</li>';
    //     thtml += '<li class="tagli" style="color: rgb(0, 170, 170)">‹<span style="color: rgb(0, 250, 0); font-size: 22px;">✔</span>›</li>';
    //     thtml += '<li class="tagli" style="color: rgb(170, 0, 0)">‹<span style="color: rgb(0, 250, 0); font-size: 22px;">✔</span>›</li>';
    //     thtml += '<li class="tagli" style="color: rgb(116, 27, 71); font-size: 20px;"><span style="position: absolute; top: 5px; left: -1px;"><span  style="position: relative; top: -1.5px;">⦕</span><span style="color: rgb(170, 0, 0); font-size: 15px; font-family: Minecraftia; position: relative; right: -1px;">PP</span><span style="position: relative; top: -1.5px;">⦖</span></span></li>';
    //     thtml += '<li><img src="https://cdn.discordapp.com/attachments/901977103552102401/902230952460320829/Untitled83_20211025005627.png" width="25" height="25"></li>';
    //     thtml += '<li class="rainbow" style="font-size: 11px; line-height: 15px;">vape v4</li>';
    //     for (let i = 0; i < 8; i++){tnhtml += '<li>OhChit</li>'; twhtml += '<li>100</li>';}
    //     $('#tag').html(thtml); $('#ign').html(tnhtml); $('#ws').html(twhtml);
    // });

    ipcRenderer.on('test', (event, ...arg) => {
        console.log('test');
        let igns = ['OhChit', 'Brains', 'Manhal_IQ_', 'crystelia', 'Kqrso', 'hypixel', 'Acceqted', 'FunnyNick', 'mawuboo', 'KidsAreAnnoying', 'Divinah', '86tops', 'ip_man', 'm_lly', 'Jamelius', 'Ribskitz'];
        for (let i = 0, ln = igns.length; i < ln; i++) addPlayer(igns[i]);

        //ipcRenderer.send('autowho');

        $.ajax({type: 'GET', async: true, url: `http://tags.abyssoverlay.com:26598/gimmeusers`, success: (data) => {
            console.log('success');
            apiDown = false; keyThrottle = false;
        }, error: (jqXHR) => {
            console.log(jqXHR);
            if (jqXHR.status === 0) apiDown = true; 
            else if (jqXHR.status === 403) goodkey = false;
            else if (jqXHR.status === 429) keyThrottle = true;
            else players.push({name: ign, namehtml: ign, api: null});
            updateArray();
        }});

        // ModalWindow.open({
        //     title: 'Hello modal window',
        //     content: 'Please tell me this modal window actually worked dude. I tried something new with JS and am hoping this works first try', // optional
        //     type: 1 // 1 for success, -1 for error, -2 for warning, leave blank for general info
        // });
    });


    const dftcolor = config.get('settings.color', [2, 2, 2, 0.288]);
    const pickr = Pickr.create({
        el: '#color-picker',
        theme: 'nano',
        inline: true,
        position: 'top-middle',
        default: `rgba(${dftcolor[0]}, ${dftcolor[1]}, ${dftcolor[2]}, ${dftcolor[3]})`,
        defaultRepresentation: 'RGBA',
        components: {
            preview: false,
            opacity: true,
            hue: true,
            interaction: {save: true}
        }
    });
    pickr.on('change', (color) => {
        //con.log(color.toRGBA());
        color = color.toRGBA();
        $('#base').css('background', `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`);
        $('h1').css({'background': `rgb(${color[0]}, ${color[1]}, ${color[2]})`, 'background-clip': 'text', '-webkit-background-clip': 'text', '-webkit-text-fill-color': 'transparent'});
        $('.tabsbuttons').css({'-webkit-filter': `opacity(0.75) drop-shadow(0 0 0 rgb(${color[0]}, ${color[1]}, ${color[2]}))`, 'filter': `opacity(0.75) drop-shadow(0 0 0 rgb(${color[0]}, ${color[1]}, ${color[2]}))`});
        $('#base').css("--primaryColor", `rgb(${color[0]}, ${color[1]}, ${color[2]})`);
    });
    pickr.on('save', (color) => {
        color = color.toRGBA();
        $('#base').css('background', `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`);
        $('h1').css({'background': `rgb(${color[0]}, ${color[1]}, ${color[2]})`, 'background-clip': 'text', '-webkit-background-clip': 'text', '-webkit-text-fill-color': 'transparent'});
        $('.tabsbuttons').css({'-webkit-filter': `opacity(.75) drop-shadow(0 0 0 rgb(${color[0]}, ${color[1]}, ${color[2]}))`, 'filter': `opacity(.75) drop-shadow(0 0 0 rgb(${color[0]}, ${color[1]}, ${color[2]}))`});
        $('#base').css("--primaryColor", `rgb(${color[0]}, ${color[1]}, ${color[2]})`);
        config.set('settings.color', color);
        pickr.hide();
    });

    $('#gamemodebtn').on('click', () => {
        $('#gamemodebtn').find('.custom-select').toggleClass('open');
    });
    $('#bw').on('click', () => {
        $('#gamemodebtn').find('.custom-select').find('.custom-options').find('.custom-option').removeClass('selected'); $('#bw').addClass('selected'); $('#gamemodebtn').find('.custom-select').find('.custom-select_trigger').find('span').html('Bedwars');
        $('#ws_nwl').html('WS'); $('#kdr').html('FKDR'); $('#kills').html('FINALS');
        gamemode = 0; config.set('settings.gamemode', 0); let tplayers = players; players = []; updateArray(); for (let i = 0, len = tplayers.length; i < len; i++){addPlayer(tplayers[i].name);}
    });
    $('#sw').on('click', () => {
        $('#gamemodebtn').find('.custom-select').find('.custom-options').find('.custom-option').removeClass('selected'); $('#sw').addClass('selected'); $('#gamemodebtn').find('.custom-select').find('.custom-select_trigger').find('span').html('Skywars');
        $('#ws_nwl').html('NWL'); $('#kdr').html('KDR'); $('#kills').html('KILLS');
        gamemode = 1; config.set('settings.gamemode', 1); let tplayers = players; players = []; updateArray(); for (let i = 0, len = tplayers.length; i < len; i++){addPlayer(tplayers[i].name);}
    });
    $('#duels').on('click', () => {
        ModalWindow.open({
            title: 'IMPORTANT Duels Update',
            content: "Hypixel has PATCHED any legitimate form of being able to check the stats of your opponents in any duels gamemode! Therefore, to keep the overlay legal and prevent the you from getting banned, you will no longer be able to see the stats of your opponents in a duels lobby. However, you can still use this feature to check opponents's duels stats in any other gamemode. Thanks <3<br>TL;DR: you cannot see the stats of your opponents in duels to abide by the rules, but you can still see duels stats in other gamemodes.",
            type: -2
        });
        $('#gamemodebtn').find('.custom-select').find('.custom-options').find('.custom-option').removeClass('selected'); $('#duels').addClass('selected'); $('#gamemodebtn').find('.custom-select').find('.custom-select_trigger').find('span').html('Duels');
        $('#ws_nwl').html('WS'); $('#kdr').html('KDR'); $('#kills').html('KILLS');
        gamemode = 2; config.set('settings.gamemode', 2); let tplayers = players; players = []; updateArray(); for (let i = 0, len = tplayers.length; i < len; i++){addPlayer(tplayers[i].name);}
    });

    $('#gmbtn').on('click', () => {
        $('#gmbtn').find('.custom-select').toggleClass('open');
    });
    $('#overall').on('click', () => {
        $('#gmbtn').find('.custom-select').find('.custom-options').find('.custom-option').removeClass('selected'); $('#overall').addClass('selected'); $('#gmbtn').find('.custom-select').find('.custom-select_trigger').find('span').html('Overall');
        gmode = ''; config.set('settings.bwgmode', ''); let tplayers = players; players = []; updateArray(); for (let i = 0, len = tplayers.length; i < len; i++){addPlayer(tplayers[i].name);}
    });
    $('#solos').on('click', () => {
        $('#gmbtn').find('.custom-select').find('.custom-options').find('.custom-option').removeClass('selected'); $('#solos').addClass('selected'); $('#gmbtn').find('.custom-select').find('.custom-select_trigger').find('span').html('Solos');
        gmode = 'eight_one_'; config.set('settings.bwgmode', 'eight_one_'); let tplayers = players; players = []; updateArray(); for (let i = 0, len = tplayers.length; i < len; i++){addPlayer(tplayers[i].name);}
    });
    $('#doubles').on('click', () => {
        $('#gmbtn').find('.custom-select').find('.custom-options').find('.custom-option').removeClass('selected'); $('#doubles').addClass('selected'); $('#gmbtn').find('.custom-select').find('.custom-select_trigger').find('span').html('Doubles');
        gmode = 'eight_two_'; config.set('settings.bwgmode', 'eight_two_'); let tplayers = players; players = []; updateArray(); for (let i = 0, len = tplayers.length; i < len; i++){addPlayer(tplayers[i].name);}
    });
    $('#threes').on('click', () => {
        $('#gmbtn').find('.custom-select').find('.custom-options').find('.custom-option').removeClass('selected'); $('#threes').addClass('selected'); $('#gmbtn').find('.custom-select').find('.custom-select_trigger').find('span').html('Threes');
        gmode = 'four_three_'; config.set('settings.bwgmode', 'four_three_'); let tplayers = players; players = []; updateArray(); for (let i = 0, len = tplayers.length; i < len; i++){addPlayer(tplayers[i].name);}
    });
    $('#fours').on('click', () => {
        $('#gmbtn').find('.custom-select').find('.custom-options').find('.custom-option').removeClass('selected'); $('#fours').addClass('selected'); $('#gmbtn').find('.custom-select').find('.custom-select_trigger').find('span').html('Fours');
        gmode = 'four_four_'; config.set('settings.bwgmode', 'four_four_'); let tplayers = players; players = []; updateArray(); for (let i = 0, len = tplayers.length; i < len; i++){addPlayer(tplayers[i].name);}
    });

    $('#rpcStats').on('click', () => {
        $('#rpcStats').find('.custom-select').toggleClass('open');
    });
    $('#rpcSession').on('click', () => {
        $('#rpcStats').find('.custom-select').find('.custom-options').find('.custom-option').removeClass('selected'); $('#rpcSession').addClass('selected'); $('#rpcStats').find('.custom-select').find('.custom-select_trigger').find('span').html('Session Stats');
        config.set('settings.rpc_stats', 1); updateSession(startapi, 1);
    });
    $('#rpcOverall').on('click', () => {
        $('#rpcStats').find('.custom-select').find('.custom-options').find('.custom-option').removeClass('selected'); $('#rpcOverall').addClass('selected'); $('#rpcStats').find('.custom-select').find('.custom-select_trigger').find('span').html('Overall Stats');
        config.set('settings.rpc_stats', 2); updateSession(startapi, 1);
    });
    $('#rpcNo').on('click', () => {
        $('#rpcStats').find('.custom-select').find('.custom-options').find('.custom-option').removeClass('selected'); $('#rpcNo').addClass('selected'); $('#rpcStats').find('.custom-select').find('.custom-select_trigger').find('span').html('Hide Stats');
        config.set('settings.rpc_stats', 0); updateSession(startapi, 1);
    });

    $('#notifsbtn').on('click', () => {
        config.set('settings.notifs', $('#notifsbtn').prop('checked'));
    });
    $('#shrinkbtn').on('click', () => {
        config.set('settings.shrink', $('#shrinkbtn').prop('checked'));
    });
    $('#gtagbtn').on('click', () => {
        config.set('settings.gtag', $('#gtagbtn').prop('checked'));
        guildtag = $('#gtagbtn').prop('checked');
    });
    $('#callbtn').on('click', () => {
        config.set('settings.call', $('#callbtn').prop('checked'));
    });
    $('#rpcbtn').on('click', () => {
        config.set('settings.rpc', $('#rpcbtn').prop('checked'));
        setRPC();
    });
    $('#api_key').on('click', function() {
        if (goodkey && $(this).val().length === 36) {
            clipboard.writeText(key);
            return ModalWindow.open({ title: 'API Key Copied to Clipboard' });
        }
        let copied = clipboard.readText();
        if (copied) copied = copied.replace(/\s/g, '');
        if (copied.length !== 36) return ModalWindow.open({ title: 'Invalid API key', content: 'Make sure you have copied the correct Hypixel API key! Generate a new one using command "<b>/api new</b>" on Hypixel.', type: -1 });
        key = copied;
        verifyKey($(this));
    });
    $('#changeclient').on('click', () => {
        config.delete('players'); config.set('settings.pos', currentWindow.getPosition()); config.set('settings.size', [currentWindow.webContents.getOwnerBrowserWindow().getBounds().width, currentWindow.webContents.getOwnerBrowserWindow().getBounds().height]);
        config.set('settings.client', -1);
        app.relaunch(); app.exit(0); app.quit();
    });
    $('#changelogpath').on('click', () => {
        let temppath = dialog.showOpenDialogSync(currentWindow, {title: 'Select latest.log file', defaultPath: homedir, buttonLabel: 'Select log file', filters: [{name: 'Latest log', extensions: ['log']}]});
        if (temppath){
            config.set(`${config.get('settings.client')}log`, temppath[0].replaceAll('\\', '/'));
            app.relaunch(); app.exit(0); app.quit();
        }
    });
    $('#whobtn').on('click', () => {
        config.set('settings.autowho', $('#whobtn').prop('checked'));
    });
    $('#revertcolor').on('click', () => {
        pickr.setColor('rgba(2, 2, 2, 0.288)');
        $('h1').css({'background': '-webkit-linear-gradient(rgb(153, 0, 255), rgb(212, 0, 255))', 'background-clip': 'text', '-webkit-background-clip': 'text', '-webkit-text-fill-color': 'transparent'});
        $('.tabsbuttons').css({'-webkit-filter': '', 'filter': ''});
        $('#base').css("--primaryColor", 'rgb(174, 0, 255)');
        config.delete('settings.color');
    });

    $('#badlion').on('click', {client: 'badlion'}, main);
    $('#lunar').on('click', {client: 'lunar'}, main);
    $('#vanilla').on('click', {client: 'vanilla'}, main);
    $('#pvplounge').on('click', {client: 'pvplounge'}, main);
    $('#feather').on('click', {client: 'feather'}, main);
    $('#feather').on('click', {client: 'feather'}, main);
    $('#badlion').on('click', () => {config.set('settings.client', 'badlion')});
    $('#lunar').on('click', () => {config.set('settings.client', 'lunar')});
    $('#vanilla').on('click', () => {config.set('settings.client', 'vanilla')});
    $('#pvplounge').on('click', () => {config.set('settings.client', 'pvplounge')});
    $('#feather').on('click', () => {config.set('settings.client', 'feather')});
    $('#feather').on('click', () => {config.set('settings.client', 'feather')});

    let hoverTimer = -1;
    $('#ign').on('mouseenter', '.player_ign', function() {
        hoverTimer = setTimeout(() => {
            PopupStats.show($(this), players.find(e => $(this).hasClass(e.name)), gamemode, gmode);
            clearTimeout(hoverTimer);
        }, 250);
    }).on('mouseleave', '.player_ign', () => clearTimeout(hoverTimer));

    $(document.body).on('mouseenter', () => {
        PopupStats.reset();
    });

    function getBedWarsLevel(exp){
        var level = 100 * (Math.floor(exp / 487000));
        exp = exp % 487000;
        if(exp < 500) return level + exp / 500;
        level++;
        if(exp < 1500) return level + (exp - 500) / 1000;
        level++;
        if(exp < 3500) return level + (exp - 1500) / 2000;
        level++;
        if(exp < 7000) return level + (exp - 3500) / 3500;
        level++;
        exp -= 7000;
        return level + exp / 5000;
    }


    function sessionNumHTML(start = 0, now = 0, e = 0){
        if (start === undefined || now === undefined) return '<span style="color: red">?</span>';
        let diff = now - start, tempHTML = `<span style="color: #AAAAAA">${start}</span> <span style="color: #FFAC33">➜</span> ${now} `;
        if (Math.abs(diff%1) !== 0) diff = parseFloat(diff).toFixed(3);
        if (e === 0){
            if (diff > 0) return tempHTML + `<span style="color: #55FF55">[${diff}<span style="position: relative; top: -2px">▲</span>]</span>`;
            else if (diff < 0) return tempHTML + `<span style="color: #FF5555">[${Math.abs(diff)}▼]</span>`;
            else return tempHTML + `<span style="color: #AAAAAA">[-]</span>`;
        }
        else if (e === 1){
            if (diff > 0) return tempHTML + `<span style="color: #FF5555">[${diff}<span style="position: relative; top: -2px">▲</span>]</span>`;
            else if (diff < 0) return tempHTML + `<span style="color: #55FF55">[${Math.abs(diff)}▼]</span>`;
            else return tempHTML + `<span style="color: #AAAAAA">[-]</span>`;
        }
        else if (e === 'lvl'){
            tempHTML = `${starColor(start)} <span style="color: #FFAC33">➜</span> ${starColor(now)} `;
            if (diff > 0) return tempHTML + `<span style="color: #55FF55">[${diff}<span style="position: relative; top: -2px">▲</span>]</span>`;
            else return tempHTML + `<span style="color: #AAAAAA">[-]</span>`;
        }
    }

    function updateSession(startapi, e = 0){
        let sessionHTML = '', startplayer = startapi;
        $.ajax({type: 'GET', async: false, url: apilink+useruuid, success: (data) => {
            try{
                $('#sessionavatar').attr('src', `https://crafatar.com/avatars/${useruuid}?size=100&default=MHF_Steve&overlay`);
                if (data.success === true && data.player !== null){
                    let newplayer = data.player;
                    $('#sessionign').html(nameColor(newplayer));
                    if (gamemode === 0){
                        if (e === 1){
                            rpcActivity.details = 'Bedwars';
                            rpcActivity.assets.small_image = 'bedwars'; rpcActivity.assets.small_text = 'Playing Bedwars'; rpcActivity.state = "Just chillin'";
                            if (config.get('settings.rpc_stats', 1) === 1){
                                let tfinals = newplayer.stats.Bedwars.final_kills_bedwars-startplayer.stats.Bedwars.final_kills_bedwars, tbeds = newplayer.stats.Bedwars.beds_broken_bedwars-startplayer.stats.Bedwars.beds_broken_bedwars, twins = newplayer.stats.Bedwars.wins_bedwars-startplayer.stats.Bedwars.wins_bedwars;
                                if (tfinals+tbeds+twins !== 0) rpcActivity.state = `Finals: ${tfinals} | Beds: ${tbeds} | Wins: ${twins}`;
                                rpcActivity.details += ` [${newplayer.achievements.bedwars_level}✫]`;
                            }
                            else if (config.get('settings.rpc_stats', 1) === 2){
                                rpcActivity.state = `FKDR: ${parseFloat(newplayer.stats.Bedwars[`${gmode}final_kills_bedwars`]/newplayer.stats.Bedwars[`${gmode}final_deaths_bedwars`]).toFixed(2)} | WLR: ${parseFloat(newplayer.stats.Bedwars[`${gmode}wins_bedwars`]/newplayer.stats.Bedwars[`${gmode}losses_bedwars`]).toFixed(2)} | BBLR: ${parseFloat(newplayer.stats.Bedwars[`${gmode}beds_broken_bedwars`]/newplayer.stats.Bedwars[`${gmode}beds_lost_bedwars`]).toFixed(2)}`;
                                rpcActivity.details += ` [${newplayer.achievements.bedwars_level}✫]`;
                            }
                            return rpc.request('SET_ACTIVITY', {pid: process.pid, activity: rpcActivity}).catch(console.error);
                        }

                        let bwmode = 'Overall';
                        if (gmode.includes('_one')) bwmode = 'Solos';
                        else if (gmode.includes('_two')) bwmode = 'Doubles';
                        else if (gmode.includes('_three')) bwmode = 'Threes';
                        else if (gmode.includes('_four')) bwmode = 'Fours';
                        $('#sessiontitle').html(`Bedwars ${bwmode} Session Stats`);

                        sessionHTML += `<span class="greengradient">Stars:</span> &nbsp;${sessionNumHTML(parseFloat(getBedWarsLevel(startplayer.stats.Bedwars.Experience)).toFixed(2), parseFloat(getBedWarsLevel(newplayer.stats.Bedwars.Experience)).toFixed(2), 'lvl')}<br><br>`;
                        sessionHTML += `<span class="greengradient">Winstreak:</span> &nbsp;${sessionNumHTML(startplayer.stats.Bedwars[`${gmode}winstreak`], newplayer.stats.Bedwars[`${gmode}winstreak`])}<br><br>`;
                        sessionHTML += `<span class="greengradient">Final Kills:</span> &nbsp;${sessionNumHTML(startplayer.stats.Bedwars[`${gmode}final_kills_bedwars`], newplayer.stats.Bedwars[`${gmode}final_kills_bedwars`])}<br>`;
                        sessionHTML += `<span class="redgradient">Final Deaths:</span> &nbsp;${sessionNumHTML(startplayer.stats.Bedwars[`${gmode}final_deaths_bedwars`], newplayer.stats.Bedwars[`${gmode}final_deaths_bedwars`], 1)}<br>`;
                        sessionHTML += `<span class="yellowgradient">FKDR:</span> &nbsp;${sessionNumHTML(parseFloat(startplayer.stats.Bedwars[`${gmode}final_kills_bedwars`]/startplayer.stats.Bedwars[`${gmode}final_deaths_bedwars`]).toFixed(3), parseFloat(newplayer.stats.Bedwars[`${gmode}final_kills_bedwars`]/newplayer.stats.Bedwars[`${gmode}final_deaths_bedwars`]).toFixed(3))}<br><br>`;
                        sessionHTML += `<span class="greengradient">Wins:</span> &nbsp;${sessionNumHTML(startplayer.stats.Bedwars[`${gmode}wins_bedwars`], newplayer.stats.Bedwars[`${gmode}wins_bedwars`])}<br>`;
                        sessionHTML += `<span class="redgradient">Losses:</span> &nbsp;${sessionNumHTML(startplayer.stats.Bedwars[`${gmode}losses_bedwars`], newplayer.stats.Bedwars[`${gmode}losses_bedwars`], 1)}<br>`;
                        sessionHTML += `<span class="yellowgradient">WLR:</span> &nbsp;${sessionNumHTML(parseFloat(startplayer.stats.Bedwars[`${gmode}wins_bedwars`]/startplayer.stats.Bedwars[`${gmode}losses_bedwars`]).toFixed(3), parseFloat(newplayer.stats.Bedwars[`${gmode}wins_bedwars`]/newplayer.stats.Bedwars[`${gmode}losses_bedwars`]).toFixed(3))}<br><br>`;
                        sessionHTML += `<span class="greengradient">Beds Broken:</span> &nbsp;${sessionNumHTML(startplayer.stats.Bedwars[`${gmode}beds_broken_bedwars`], newplayer.stats.Bedwars[`${gmode}beds_broken_bedwars`])}<br>`;
                        sessionHTML += `<span class="redgradient">Beds Lost:</span> &nbsp;${sessionNumHTML(startplayer.stats.Bedwars[`${gmode}beds_lost_bedwars`], newplayer.stats.Bedwars[`${gmode}beds_lost_bedwars`], 1)}<br>`;
                        sessionHTML += `<span class="yellowgradient">BBLR:</span> &nbsp;${sessionNumHTML(parseFloat(startplayer.stats.Bedwars[`${gmode}beds_broken_bedwars`]/startplayer.stats.Bedwars[`${gmode}beds_lost_bedwars`]).toFixed(3), parseFloat(newplayer.stats.Bedwars[`${gmode}beds_broken_bedwars`]/newplayer.stats.Bedwars[`${gmode}beds_lost_bedwars`]).toFixed(3))}<br><br>`;
                    }
                    else if (gamemode === 1){
                        if (e === 1){
                            rpcActivity.details = 'Skywars';
                            rpcActivity.assets.small_image = 'skywars'; rpcActivity.assets.small_text = 'Playing Skywars'; rpcActivity.state = "Just chillin'";
                            if (config.get('settings.rpc_stats', 1) === 1){
                                let tkills = newplayer.stats.SkyWars.kills-startplayer.stats.SkyWars.kills, twins = newplayer.stats.SkyWars.wins-startplayer.stats.SkyWars.wins;
                                if (tkills+twins !== 0) rpcActivity.state = `Kills: ${tkills} | Wins: ${twins}`;
                                rpcActivity.details += ` [${swLVL(newplayer.stats.SkyWars.skywars_experience)}✬]`;
                            }
                            else if (config.get('settings.rpc_stats', 1) === 2){
                                rpcActivity.state = `KDR: ${parseFloat(newplayer.stats.SkyWars.kills/newplayer.stats.SkyWars.deaths).toFixed(2)} | WLR: ${parseFloat(newplayer.stats.SkyWars.wins/newplayer.stats.SkyWars.losses).toFixed(2)} | Kills: ${newplayer.stats.SkyWars.kills}`;
                                rpcActivity.details += ` [${swLVL(newplayer.stats.SkyWars.skywars_experience)}✬]`;
                            }
                            return rpc.request('SET_ACTIVITY', {pid: process.pid, activity: rpcActivity}).catch(console.error);
                        }

                        $('#sessiontitle').html(`Skywars Session Stats`);

                        sessionHTML += `<span class="greengradient">Level:</span> &nbsp;${sessionNumHTML(swLVL(startplayer.stats.SkyWars.skywars_experience), swLVL(newplayer.stats.SkyWars.skywars_experience), 'lvl')}<br><br>`;
                        sessionHTML += `<span class="greengradient">Kills:</span> &nbsp;${sessionNumHTML(startplayer.stats.SkyWars.kills, newplayer.stats.SkyWars.kills)}<br>`;
                        sessionHTML += `<span class="redgradient">Deaths:</span> &nbsp;${sessionNumHTML(startplayer.stats.SkyWars.deaths, newplayer.stats.SkyWars.deaths, 1)}<br>`;
                        sessionHTML += `<span class="yellowgradient">KDR:</span> &nbsp;${sessionNumHTML(parseFloat(startplayer.stats.SkyWars.kills/startplayer.stats.SkyWars.deaths).toFixed(3), parseFloat(newplayer.stats.SkyWars.kills/newplayer.stats.SkyWars.deaths).toFixed(3))}<br><br>`;
                        sessionHTML += `<span class="greengradient">Wins:</span> &nbsp;${sessionNumHTML(startplayer.stats.SkyWars.wins, newplayer.stats.SkyWars.wins)}<br>`;
                        sessionHTML += `<span class="redgradient">Losses:</span> &nbsp;${sessionNumHTML(startplayer.stats.SkyWars.losses, newplayer.stats.SkyWars.losses, 1)}<br>`;
                        sessionHTML += `<span class="yellowgradient">WLR:</span> &nbsp;${sessionNumHTML(parseFloat(startplayer.stats.SkyWars.wins/startplayer.stats.SkyWars.losses).toFixed(3), parseFloat(newplayer.stats.SkyWars.wins/newplayer.stats.SkyWars.losses).toFixed(3))}<br><br>`;
                        sessionHTML += `<span class="greengradient">Heads:</span> &nbsp;${sessionNumHTML(startplayer.stats.SkyWars.heads, newplayer.stats.SkyWars.heads)}<br>`;
                    }
                    else if (gamemode === 2){
                        if (e === 1){
                            rpcActivity.details = `Duels`;
                            rpcActivity.assets.small_image = 'duels'; rpcActivity.assets.small_text = 'Playing Duels'; rpcActivity.state = "Just chillin'";
                            if (config.get('settings.rpc_stats', 1) === 1){
                                let twins = newplayer.stats.Duels.wins-startplayer.stats.Duels.wins, tws = startplayer.stats.Duels.current_winstreak;
                                if (twins+tws !== 0) rpcActivity.state = `Wins: ${twins} | Winstreak: ${tws}`;
                            }
                            else if (config.get('settings.rpc_stats', 1) === 2){
                                rpcActivity.state = `Wins: ${newplayer.stats.Duels.wins} | Best Winstreak: ${newplayer.stats.Duels.best_overall_winstreak}`;
                            }
                            return rpc.request('SET_ACTIVITY', {pid: process.pid, activity: rpcActivity}).catch(console.error);
                        }

                        $('#sessiontitle').html(`Duels Overall Session Stats`);

                        sessionHTML += `<span class="greengradient">Winstreak:</span> &nbsp;${sessionNumHTML(startplayer.stats.Duels.current_winstreak, newplayer.stats.Duels.current_winstreak)}<br><br>`;
                        sessionHTML += `<span class="greengradient">Kills:</span> &nbsp;${sessionNumHTML(startplayer.stats.Duels.kills, newplayer.stats.Duels.kills)}<br>`;
                        sessionHTML += `<span class="redgradient">Deaths:</span> &nbsp;${sessionNumHTML(startplayer.stats.Duels.deaths, newplayer.stats.Duels.deaths, 1)}<br>`;
                        sessionHTML += `<span class="yellowgradient">KDR:</span> &nbsp;${sessionNumHTML(parseFloat(startplayer.stats.Duels.kills/startplayer.stats.Duels.deaths).toFixed(3), parseFloat(newplayer.stats.Duels.kills/newplayer.stats.Duels.deaths).toFixed(3))}<br><br>`;
                        sessionHTML += `<span class="greengradient">Wins:</span> &nbsp;${sessionNumHTML(startplayer.stats.Duels.wins, newplayer.stats.Duels.wins)}<br>`;
                        sessionHTML += `<span class="redgradient">Losses:</span> &nbsp;${sessionNumHTML(startplayer.stats.Duels.losses, newplayer.stats.Duels.losses, 1)}<br>`;
                        sessionHTML += `<span class="yellowgradient">WLR:</span> &nbsp;${sessionNumHTML(parseFloat(startplayer.stats.Duels.wins/startplayer.stats.Duels.losses).toFixed(3), parseFloat(newplayer.stats.Duels.wins/newplayer.stats.Duels.losses).toFixed(3))}<br><br>`;
                    }
                    $('#sessionhtml').html(sessionHTML);

                    let secschange = parseFloat((new Date() - starttime)/1000).toFixed(), timeHTML = 'Stats changes in the past ';
                    let minschange = parseFloat(secschange/60).toFixed(1);
                    if (minschange >= 60) timeHTML += `${parseFloat(minschange/60).toFixed()} hrs, `;
                    timeHTML += `${parseFloat(minschange%60).toFixed(1)} mins`;
                    $('#sessiontime').html(timeHTML);
                }
            }catch (e) {console.log(e); $('#sessionhtml').html(sessionHTML); rpc.request('SET_ACTIVITY', {pid: process.pid, activity: rpcActivity}).catch(console.error);}
        }});
    }

    $('#session').on('click', () => {
        if ($('#sessiondiv').css('display') === 'none'){
            updateSession(startapi);
            $('#session').css('background-image', 'url(../assets/session2.png)'); $('#info').css('background-image', 'url(../assets/info1.png)'); $('#music').css('background-image', 'url(../assets/music1.png)'); $('#settings').css('background-image', 'url(../assets/settings1.png)'); $('#titles').css('display', 'none'); $('#indexdiv').css('display', 'none'); $('#infodiv').css('display', 'none'); $('#sessiondiv').css('display', 'inline-block'); $('#settingsdiv').css('display', 'none');
        }
        else{
            $('#session').css('background-image', 'url(../assets/session1.png)'); $('#info').css('background-image', 'url(../assets/info1.png)'); $('#music').css('background-image', 'url(../assets/music1.png)'); $('#settings').css('background-image', 'url(../assets/settings1.png)'); $('#infodiv').css('display', 'none'); $('#titles').css('display', 'block'); $('#indexdiv').css('display', 'block'); $('#sessiondiv').css('display', 'none'); $('#settingsdiv').css('display', 'none');
        }
    });

    function setRPC(){
        if (!rpc || !config.get('settings.rpc', true)) return rpc.clearActivity().catch(console.error);
        updateSession(startapi, 1);
    }
    rpc.on('ready', () => {
        setRPC();
        setInterval(setRPC, 60000);
    });
    rpc.login({clientId: '835335003021639720'}).catch(console.error);


    $('#startmusic').on('click', () => {
        if (music.session === true) return;
        $.ajax({type: 'GET', async: true, dataType: 'json', url: `${musicIP}/requestMusicSession?uuid=${useruuid}`, success: (data) => {
            if (data.success === true){
                $('.musicintro').css('display', 'none'); $('.musicplaying').css('display', 'block'); $('.musicbutton').css('display', 'inline-block');
                ModalWindow.open({ title: 'Music Session Created', content: 'Check your ping in the Abyss Overlay Discord server to continue <3', type: 1 });
                music.session = true;
                music.updatetimer = setInterval(updateMusic, 5000);
            }
            else{
                if (data.error.includes('Discord ID')){$('#unlinked').css('display', 'block'); $('#startmusic').css('display', 'none'); dialog.showMessageBox(currentWindow, {title: 'ERROR!', detail: 'This Minecraft account is not linked using the overlay\'s bot in the Abyss Overlay Discord server. Use the ".link [IGN]" command to link it first!', type: 'error'});}
                else if (data.error.includes('No bots')){$('#nomusicbots').css('display', 'block'); $('#startmusic').css('display', 'none'); dialog.showMessageBox(currentWindow, {title: 'ERROR!', detail: 'All music bots in the overlay server are currently being used! Keep checking to see when one frees up', type: 'error'});}
                else{con.log('UNKNOWN API ERROR with requestMusicSession'); $('#startmusic').css('display', 'none'); dialog.showMessageBox(currentWindow, {title: 'ERROR!', detail: 'API error. Contact the devs in the Abyss Overlay Discord server please!', type: 'error'});}
            }
        }, error: () => {
            console.log('API ERROR with requestMusicSession'); $('#startmusic').css('display', 'none'); dialog.showMessageBox(currentWindow, {title: 'API ERROR!', detail: 'Music API could be down for the moment :( Contact the devs in the Abyss Overlay Discord server please!', type: 'error'});
        }});
    });
    
    $('#playmusic').on('click', () => {
        if (checkMusicLock() === false) return;
        $.ajax({type: 'GET', async: true, dataType: 'json', url: `${musicIP}/togglePlay?uuid=${useruuid}`, success: (data) => {
            if (data.success === true){
                if (data.paused === true) $('#playmusic').css('background-image', 'url(../assets/m_play.png)');
                else $('#playmusic').css('background-image', 'url(../assets/m_pause.png)');
                setTimeout(updateMusic, 1000);
            }
            else dialog.showMessageBox(currentWindow, {title: 'ERROR!', detail: 'Error playing/pausing this song. Contact the devs in the Abyss Overlay Discord server please!', type: 'error'});
        }, error: () => {
            dialog.showMessageBox(currentWindow, {title: 'API ERROR!', detail: 'Music API could be down for the moment :( Contact the devs in the Abyss Overlay Discord server please!', type: 'error'});
        }});
    });
    $('#loopmusic').on('click', () => {
        if (checkMusicLock() === false) return;
        $.ajax({type: 'GET', async: true, dataType: 'json', url: `${musicIP}/toggleLoopPlaylist?uuid=${useruuid}`, success: (data) => {
            if (data.success === true){
                if (data.status === true) $('#loopmusic').css('filter', 'drop-shadow(3px 3px 0 var(--primaryColor)) drop-shadow(-3px -3px 0 var(--primaryColor))');
                else $('#loopmusic').css('filter', 'none');
                setTimeout(updateMusic, 1000);
            }
            else dialog.showMessageBox(currentWindow, {title: 'ERROR!', detail: 'Error toggling loop. Contact the devs in the Abyss Overlay Discord server please!', type: 'error'});
        }, error: () => {
            dialog.showMessageBox(currentWindow, {title: 'API ERROR!', detail: 'Music API could be down for the moment :( Contact the devs in the Abyss Overlay Discord server please!', type: 'error'});
        }});
    });
    $('#skipmusic').on('click', () => {
        if (checkMusicLock() === false) return;
        $.ajax({type: 'GET', async: true, dataType: 'json', url: `${musicIP}/skipSong?uuid=${useruuid}`, success: (data) => {
            if (data.success === true){setTimeout(updateMusic, 500); music.playing = false;}
            else dialog.showMessageBox(currentWindow, {title: 'ERROR!', detail: 'Error skipping this song. Contact the devs in the Abyss Overlay Discord server please!', type: 'error'});
        }, error: () => {
            dialog.showMessageBox(currentWindow, {title: 'API ERROR!', detail: 'Music API could be down for the moment :( Contact the devs in the Abyss Overlay Discord server please!', type: 'error'});
        }});
    });

    $('#endmusic').on('click', () => {
        if (checkMusicLock() === false) return;
        clearMusic(1, false);
    });

});