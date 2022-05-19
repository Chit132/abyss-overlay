const config = require('electron-json-config');

function starColor(stars){
    let gamemode = config.get('settings.gamemode', 0);
    if (gamemode === 0){
        if (stars < 100) return `<span style="color: #AAAAAA;">[${stars}✫]</span>`;
        else if (stars < 200) return `<span style="color: #FFFFFF">[${stars}✫]</span>`;
        else if (stars < 300) return `<span style="color: #FFAA00">[${stars}✫]</span>`;
        else if (stars < 400) return `<span style="color: #55FFFF">[${stars}✫]</span>`;
        else if (stars < 500) return `<span style="color: #00AA00">[${stars}✫]</span>`;
        else if (stars < 600) return `<span style="color: #00AAAA">[${stars}✫]</span>`;
        else if (stars < 700) return `<span style="color: #AA0000">[${stars}✫]</span>`;
        else if (stars < 800) return `<span style="color: #FF55FF">[${stars}✫]</span>`;
        else if (stars < 900) return `<span style="color: #5555FF">[${stars}✫]</span>`;
        else if (stars < 1000) return `<span style="color: #AA00AA">[${stars}✫]</span>`;
        else if (stars < 1100) return `<span style="color: #FF5555">[<span style="color: #FFAA00">1</span><span style="color: #FFFF55">${Math.floor((stars%1000)/100)}</span><span style="color: #55FF55">${Math.floor((stars%100)/10)}</span><span style="color: #55FFFF">${stars%10}</span><span style="color: #FF55FF">✫</span><span style="color: #AA00AA">]</span>`;
        else if (stars < 1200) return `<span style="color: #AAAAAA">[</span><span style="color: #FFFFFF">1${stars%1000}</span><span style="color: #AAAAAA">✪</span><span style="color: #AAAAAA">]</span>`;
        else if (stars < 1300) return `<span style="color: #AAAAAA">[</span><span style="color: #FFFF55">1${stars%1000}</span><span style="color: #FFAA00">✪</span><span style="color: #AAAAAA">]</span>`;
        else if (stars < 1400) return `<span style="color: #AAAAAA">[</span><span style="color: #55FFFF">1${stars%1000}</span><span style="color: #00AAAA">✪</span><span style="color: #AAAAAA">]</span>`;
        else if (stars < 1500) return `<span style="color: #AAAAAA">[</span><span style="color: #55FF55">1${stars%1000}</span><span style="color: #00AA00">✪</span><span style="color: #AAAAAA">]</span>`;
        else if (stars < 1600) return `<span style="color: #AAAAAA">[</span><span style="color: #00AAAA">1${stars%1000}</span><span style="color: #5555FF">✪</span><span style="color: #AAAAAA">]</span>`;
        else if (stars < 1700) return `<span style="color: #AAAAAA">[</span><span style="color: #FF5555">1${stars%1000}</span><span style="color: #AA0000">✪</span><span style="color: #AAAAAA">]</span>`;
        else if (stars < 1800) return `<span style="color: #AAAAAA">[</span><span style="color: #FF55FF">1${stars%1000}</span><span style="color: #AA00AA">✪</span><span style="color: #AAAAAA">]</span>`;
        else if (stars < 1900) return `<span style="color: #AAAAAA">[</span><span style="color: #5555FF">1${stars%1000}</span><span style="color: #0000AA">✪</span><span style="color: #AAAAAA">]</span>`;
        else if (stars < 2000) return `<span style="color: #AAAAAA">[</span><span style="color: #AA00AA">1${stars%1000}</span><span style="color: #555555">✪</span><span style="color: #AAAAAA">]</span>`;
        else if (stars < 2100) return `<span style="color: #555555">[</span><span style="color: #AAAAAA">2</span><span style="color: #FFFFFF">0${Math.floor((stars%100)/10)}</span><span style="color: #AAAAAA">${stars%10}✪</span><span style="color: #555555">]</span>`
        else if (stars < 2200) return `<span style="color: #FFFFFF">[2</span><span style="color: #FFFF55">1${Math.floor((stars-2100)/10)}</span><span style="color: #FFAA00">${stars%10}⚝]</span>`;
        else if (stars < 2300) return `<span style="color: #FFAA00">[2</span><span style="color: #FFFFFF">2${Math.floor((stars-2200)/10)}</span><span style="color: #55FFFF">${stars%10}</span><span style="color: #00AAAA">⚝]</span>`;
        else if (stars < 2400) return `<span style="color: #AA00AA">[2</span><span style="color: #FF55FF">3${Math.floor((stars-2300)/10)}</span><span style="color: #FFAA00">${stars%10}</span><span style="color: #FFFF55">⚝]</span>`;
        else if (stars < 2500) return `<span style="color: #55FFFF">[2</span><span style="color: #FFFFFF">4${Math.floor((stars-2400)/10)}</span><span style="color: #AAAAAA">${stars%10}⚝</span><span style="color: #555555">]</span>`;
        else if (stars < 2600) return `<span style="color: #FFFFFF">[2</span><span style="color: #55FF55">5${Math.floor((stars-2500)/10)}</span><span style="color: #00AA00">${stars%10}⚝]</span>`;
        else if (stars < 2700) return `<span style="color: #AA0000">[2</span><span style="color: #FF5555">6${Math.floor((stars-2600)/10)}</span><span style="color: #FF55FF">${stars%10}⚝</span><span style="color: #AA00AA">]</span>`;
        else if (stars < 2800) return `<span style="color: #FFFF55">[2</span><span style="color: #FFFFFF">7${Math.floor((stars-2700)/10)}</span><span style="color: #555555">${stars%10}⚝]</span>`;
        else if (stars < 2900) return `<span style="color: #55FF55">[2</span><span style="color: #00AA00">8${Math.floor((stars-2800)/10)}</span><span style="color: #FFAA00">${stars%10}⚝</span><span style="color: #FF5555">]</span>`;
        else if (stars < 3000) return `<span style="color: #55FFFF">[2</span><span style="color: #00AAAA">9${Math.floor((stars-2900)/10)}</span><span style="color: #5555FF">${stars%10}⚝</span><span style="color: #0000AA">]</span>`;
        else return `<span style="color: #FFFF55">[3</span><span style="color: #FFAA00">${Math.floor((stars-3000)/10)}</span><span style="color: #FF5555">${stars%10}⚝</span><span style="color: #AA0000">]</span>`;
    }
    else if (gamemode === 1){
        if (stars < 5) return `<span style="color: #AAAAAA;">[${stars}⚔]</span>`;
        else if (stars < 10) return `<span style="color: #FFFFFF;">[${stars}✙]</span>`;
        else if (stars < 15) return `<span style="color: #FFAA00;">[${stars}❤]</span>`;
        else if (stars < 20) return `<span style="color: #55FFFF;">[${stars}☠]</span>`;
        else if (stars < 25) return `<span style="color: #00AA00;">[${stars}✦]</span>`;
        else if (stars < 30) return `<span style="color: #00AAAA;">[${stars}✌]</span>`;
        else if (stars < 35) return `<span style="color: #AA0000;">[${stars}❦]</span>`;
        else if (stars < 40) return `<span style="color: #FF55FF;">[${stars}✵]</span>`;
        else if (stars < 45) return `<span style="color: #5555FF;">[${stars}❣]</span>`;
        else if (stars < 50) return `<span style="color: #AA00AA;">[${stars}☯]</span>`;
        else if (stars < 60) return `<span style="color: #FF5555;">[${stars}✺]</span>`;
        else return `<span style="color: #FF5555;">[${stars}ಠ_ಠ]</span>`;
    }
    else if (gamemode === 2){//stars are wins for duels
        if (stars < 100) return '';
        else if (stars < 120) return `<span style="color: #AAAAAA;">[I]</span>`;
        else if (stars < 140) return `<span style="color: #AAAAAA;">[II]</span>`;
        else if (stars < 160) return `<span style="color: #AAAAAA;">[III]</span>`;
        else if (stars < 180) return `<span style="color: #AAAAAA;">[IV]</span>`;
        else if (stars < 200) return `<span style="color: #AAAAAA;">[V]</span>`;
        else if (stars < 260) return `<span style="color: #FFFFFF;">[I]</span>`;
        else if (stars < 320) return `<span style="color: #FFFFFF;">[II]</span>`;
        else if (stars < 380) return `<span style="color: #FFFFFF;">[III]</span>`;
        else if (stars < 440) return `<span style="color: #FFFFFF;">[IV]</span>`;
        else if (stars < 500) return `<span style="color: #FFFFFF;">[V]</span>`;
        else if (stars < 600) return `<span style="color: #FFAA00;">[I]</span>`;
        else if (stars < 700) return `<span style="color: #FFAA00;">[II]</span>`;
        else if (stars < 800) return `<span style="color: #FFAA00;">[III]</span>`;
        else if (stars < 900) return `<span style="color: #FFAA00;">[IV]</span>`;
        else if (stars < 1000) return `<span style="color: #FFAA00;">[V]</span>`;
        else if (stars < 1200) return `<span style="color: #00AAAA;">[I]</span>`;
        else if (stars < 1400) return `<span style="color: #00AAAA;">[II]</span>`;
        else if (stars < 1600) return `<span style="color: #00AAAA;">[III]</span>`;
        else if (stars < 1800) return `<span style="color: #00AAAA;">[IV]</span>`;
        else if (stars < 2000) return `<span style="color: #00AAAA;">[V]</span>`;
        else if (stars < 2400) return `<span style="color: #00AA00;">[I]</span>`;
        else if (stars < 2800) return `<span style="color: #00AA00;">[II]</span>`;
        else if (stars < 3200) return `<span style="color: #00AA00;">[III]</span>`;
        else if (stars < 3600) return `<span style="color: #00AA00;">[IV]</span>`;
        else if (stars < 4000) return `<span style="color: #00AA00;">[V]</span>`;
        else if (stars < 5200) return `<span style="color: #AA0000;">[I]</span>`;
        else if (stars < 6400) return `<span style="color: #AA0000;">[II]</span>`;
        else if (stars < 7600) return `<span style="color: #AA0000;">[III]</span>`;
        else if (stars < 8800) return `<span style="color: #AA0000;">[IV]</span>`;
        else if (stars < 10000) return `<span style="color: #AA0000;">[V]</span>`;
        else if (stars < 12000) return `<span style="color: #FFFF55;">[I]</span>`;
        else if (stars < 14000) return `<span style="color: #FFFF55;">[II]</span>`;
        else if (stars < 16000) return `<span style="color: #FFFF55;">[III]</span>`;
        else if (stars < 18000) return `<span style="color: #FFFF55;">[IV]</span>`;
        else if (stars < 20000) return `<span style="color: #FFFF55;">[V]</span>`;
        else if (stars < 24000) return `<span style="color: #AA00AA;">[I]</span>`;
        else if (stars < 28000) return `<span style="color: #AA00AA;">[II]</span>`;
        else if (stars < 32000) return `<span style="color: #AA00AA;">[III]</span>`;
        else if (stars < 36000) return `<span style="color: #AA00AA;">[IV]</span>`;
        else if (stars < 40000) return `<span style="color: #AA00AA;">[V]</span>`;
        else if (stars < 44000) return `<span style="color: #AA00AA;">[VI]</span>`;
        else if (stars < 48000) return `<span style="color: #AA00AA;">[VII]</span>`;
        else if (stars < 52000) return `<span style="color: #AA00AA;">[VIII]</span>`;
        else if (stars < 56000) return `<span style="color: #AA00AA;">[IX]</span>`;
        else return `<span style="color: #AA00AA;">[X]</span>`;
    }
}

function nameColor(api){
    let rank = api.newPackageRank;
    let plus = api.rankPlusColor;
    if (plus !== undefined){
        if (plus === 'RED') plus = '#FF5555';
        else if (plus === 'GOLD') plus = '#FFAA00';
        else if (plus === 'GREEN') plus = '#55FF55';
        else if (plus === 'YELLOW') plus = '#FFFF55';
        else if (plus === 'LIGHT_PURPLE') plus = '#FF55FF';
        else if (plus === 'WHITE') plus = '#FFFFFF';
        else if (plus === 'BLUE') plus = '#5555FF';
        else if (plus === 'DARK_GREEN') plus = '#00AA00';
        else if (plus === 'DARK_RED') plus = '#AA0000';
        else if (plus === 'DARK_AQUA') plus = '#00AAAA';
        else if (plus === 'DARK_PURPLE') plus = '#AA00AA';
        else if (plus === 'DARK_GRAY') plus = '#555555';
        else if (plus === 'BLACK') plus = '#000000';
        else if (plus === 'DARK_BLUE') plus = '#0000AA';
    }
    else plus = '#FF5555';
    if (api.rank !== undefined){
        if (api.rank === 'YOUTUBER') return `<span style="color: #FF5555;">[</span><span style="color: #FFFFFF;">YT</span><span style="color: #FF5555;">] ${api.displayname}</span>`;
        else if (api.rank === 'ADMIN') return `<span style="color: #AA0000">[ADMIN] ${api.displayname}</span>`;
        else if (api.rank === 'MODERATOR') return `<span style="color: #00AA00">[MOD] ${api.displayname}</span>`;
        else if (api.rank === 'GAME_MASTER') return `<span style="color: #00AA00">[GM] ${api.displayname}</span>`;
    }
    if (rank === 'MVP_PLUS'){
        if (api.monthlyPackageRank === 'NONE' || !api.hasOwnProperty('monthlyPackageRank')) return `<span style="color: #55FFFF;">[MVP</span><span style="color: ${plus}">+</span><span style="color: #55FFFF;">] ${api.displayname}</span>`;
        else return `<span style="color: #FFAA00;">[MVP</span><span style="color: ${plus}">++</span><span style="color: #FFAA00;">] ${api.displayname}</span>`;
    }
    else if (rank === 'MVP') return `<span style="color: #55FFFF;">[MVP] ${api.displayname}</span>`;
    else if (rank === 'VIP_PLUS') return `<span style="color: #55FF55;">[VIP</span><span style="color: #FFAA00;">+</span><span style="color: #55FF55;">] ${api.displayname}</span>`;
    else if (rank === 'VIP') return `<span style="color: #55FF55;">[VIP] ${api.displayname}</span>`;
    else return `<span style="color: #AAAAAA;">${api.displayname}</span>`;
}

function guildColor(color){
    if (color === 'GOLD') return '#FFAA00';
    else if (color === 'DARK_AQUA') return '#00AAAA';
    else if (color === 'DARK_GREEN') return '#00AA00';
    else if (color === 'YELLOW') return '#FFFF55';
    else return '#AAAAAA';
}

function wsColor(ws){
    let gamemode = config.get('settings.gamemode', 0);
    try{
        if (gamemode === 0){
            if (ws < 4) return '#AAAAAA';
            else if (ws < 10) return '#FFFFFF';//100 stars
            else if (ws < 25) return '#FFAA00';//200 stars
            else if (ws < 50) return '#00AAAA';//500 stars
            else if (ws < 100) return '#AA0000';//600 stars
            else return '#AA00AA';//900 stars
        }
        else if (gamemode === 1){
            let nwl = ws;
            if (nwl < 50) return '#AAAAAA';
            else if (nwl < 100) return '#FFFFFF';//100 stars
            else if (nwl < 150) return '#FFAA00';//200 stars
            else if (nwl < 200) return '#00AAAA';//500 stars
            else if (nwl < 250) return '#AA0000';//600 stars
            else return '#AA00AA';//900 stars
        }
        else if (gamemode === 2){
            if (ws < 4) return '#AAAAAA';
            else if (ws < 10) return '#FFFFFF';//100 stars
            else if (ws < 25) return '#FFAA00';//200 stars
            else if (ws < 50) return '#00AAAA';//500 stars
            else if (ws < 100) return '#AA0000';//600 stars
            else return '#AA00AA';//900 stars
        }
    }
    catch{return '#AAAAAA';}
}

function fkdrColor(fkdr){
    let gamemode = config.get('settings.gamemode', 0);
    try{
        if (gamemode === 0){
            if (fkdr < 1) return '#AAAAAA';
            else if (fkdr < 3) return '#FFFFFF';//100 stars
            else if (fkdr < 5) return '#FFAA00';//200 stars
            else if (fkdr < 10) return '#00AAAA';//500 stars
            else if (fkdr < 25) return '#AA0000';//600 stars
            else return '#AA00AA';//900 stars
        }
        else if (gamemode === 1){
            if (fkdr < 1) return '#AAAAAA';
            else if (fkdr < 2) return '#FFFFFF';//100 stars
            else if (fkdr < 3) return '#FFAA00';//200 stars
            else if (fkdr < 4) return '#00AAAA';//500 stars
            else if (fkdr < 5) return '#AA0000';//600 stars
            else return '#AA00AA';//900 stars
        }
        else if (gamemode === 2){
            if (fkdr < 1) return '#AAAAAA';
            else if (fkdr < 2) return '#FFFFFF';//100 stars
            else if (fkdr < 3) return '#FFAA00';//200 stars
            else if (fkdr < 5) return '#00AAAA';//500 stars
            else if (fkdr < 7.5) return '#AA0000';//600 stars
            else return '#AA00AA';//900 stars
        }
    }
    catch{return '#AAAAAA';}
}

function wlrColor(wlr){
    let gamemode = config.get('settings.gamemode', 0);
    try{
        if (gamemode === 0){
            if (wlr < 1) return '#AAAAAA';
            else if (wlr < 2) return '#FFFFFF';//100 stars
            else if (wlr < 5) return '#FFAA00';//200 stars
            else if (wlr < 7) return '#00AAAA';//500 stars
            else if (wlr < 10) return '#AA0000';//600 stars
            else return '#AA00AA';//900 stars
        }
        else if (gamemode === 1){
            if (wlr < 0.1) return '#AAAAAA';
            else if (wlr < 0.25) return '#FFFFFF';//100 stars
            else if (wlr < 0.5) return '#FFAA00';//200 stars
            else if (wlr < 0.75) return '#00AAAA';//500 stars
            else if (wlr < 1) return '#AA0000';//600 stars
            else return '#AA00AA';//900 stars
        }
        else if (gamemode === 2){
            if (wlr < 1) return '#AAAAAA';
            else if (wlr < 2) return '#FFFFFF';//100 stars
            else if (wlr < 3) return '#FFAA00';//200 stars
            else if (wlr < 5) return '#00AAAA';//500 stars
            else if (wlr < 7.5) return '#AA0000';//600 stars
            else return '#AA00AA';//900 stars
        }
    }
    catch{return '#AAAAAA';}
}

function bblrColor(bblr){
    try{
        if (bblr < 1) return '#AAAAAA';
        else if (bblr < 2) return '#FFFFFF';//100 stars
        else if (bblr < 3) return '#FFAA00';//200 stars
        else if (bblr < 5) return '#00AAAA';//500 stars
        else if (bblr < 7.5) return '#AA0000';//600 stars
        else return '#AA00AA';//900 stars
    }
    catch{return '#AAAAAA';}
}

function finalsColor(finals){
    let gamemode = config.get('settings.gamemode', 0);
    try{
        if (gamemode === 0){
            if (finals < 1000) return '#AAAAAA';
            else if (finals < 5000) return '#FFFFFF';//100 stars
            else if (finals < 10000) return '#FFAA00';//200 stars
            else if (finals < 20000) return '#00AAAA';//500 stars
            else if (finals < 30000) return '#AA0000';//600 stars
            else return '#AA00AA';//900 stars
        }
        else if (gamemode === 1){
            if (finals < 1000) return '#AAAAAA';
            else if (finals < 5000) return '#FFFFFF';//100 stars
            else if (finals < 15000) return '#FFAA00';//200 stars
            else if (finals < 30000) return '#00AAAA';//500 stars
            else if (finals < 75000) return '#AA0000';//600 stars
            else return '#AA00AA';//900 stars
        }
        else if (gamemode === 2){
            if (finals < 500) return '#AAAAAA';
            else if (finals < 1500) return '#FFFFFF';//100 stars
            else if (finals < 4000) return '#FFAA00';//200 stars
            else if (finals < 10000) return '#00AAAA';//500 stars
            else if (finals < 17500) return '#AA0000';//600 stars
            else return '#AA00AA';//900 stars
        }
    }
    catch{return '#AAAAAA';}
}

function winsColor(wins){
    let gamemode = config.get('settings.gamemode', 0);
    try{
        if (gamemode === 0){
            if (wins < 500) return '#AAAAAA';
            else if (wins < 1000) return '#FFFFFF';//100 stars
            else if (wins < 3000) return '#FFAA00';//200 stars
            else if (wins < 5000) return '#00AAAA';//500 stars
            else if (wins < 10000) return '#AA0000';//600 stars
            else return '#AA00AA';//900 stars
        }
        else if (gamemode === 1){
            if (wins < 100) return '#AAAAAA';
            else if (wins < 750) return '#FFFFFF';//100 stars
            else if (wins < 4000) return '#FFAA00';//200 stars
            else if (wins < 10000) return '#00AAAA';//500 stars
            else if (wins < 25000) return '#AA0000';//600 stars
            else return '#AA00AA';//900 stars
        }
        else if (gamemode === 2){
            if (wins < 500) return '#AAAAAA';
            else if (wins < 1500) return '#FFFFFF';//100 stars
            else if (wins < 4000) return '#FFAA00';//200 stars
            else if (wins < 10000) return '#00AAAA';//500 stars
            else if (wins < 17500) return '#AA0000';//600 stars
            else return '#AA00AA';//900 stars
        }
    }
    catch{return '#AAAAAA';}
}

function getTag(api, tagslist = []){
    let temp = false;
    try{temp = tagslist.find(o => o.uuid === api.id).tag}
    catch{temp = false;}
    try{
        if (api.inParty) return '<li style="color: #03C800">P</li>';
        else if (api.call) return '<li style="color: #00C2A2">CALL</li>';
        else if (api.partyReq) return '<li style="color: #37B836">PREQ</li>';
        else if (api.friendReq) return '<li style="color: #D6D600">FREQ</li>';
        else if (api.guildList) return '<li style="color: #36C700">GLD</li>';
        else if (api.id === 'df954981d7204b4d84e19d294f703868') return '<li style="color: #AA00AA">DEV</li>';
        else if (api.id === '6440f5d5cc30428c812deb892c5cd411') return '<li style="color: #FFB69D">QT♡</li>';
        else if (api.id === '2b034ebee1514b75a8a67c50d8c7fd29') return '<li style="color: #E998B7">✨</li>';
        else if (api.id === 'c2291b87d894461daca36be83fc51310' || api.id === '48ed8ffb95ec4647b7c1c5990d40a6f2' || api.id === '9b5aeb7e3d9b43b2b026b2e444da24ff' || api.id === '01f32cf78b1a4d2f8b15b477c65f7fb7' || api.id === '01c59560e6014b9aa84c24877c485f63' || api.id === 'a3cef65ded744b739f8e46db5d87d6a3' || api.id === '2f457183cca44a3ea923a03af37de287') return '<li style="color: #E998B7">QT</li>';
        else if (api.achievements.bedwars_level < 150 && api.stats.Bedwars.final_deaths_bedwars/api.stats.Bedwars.losses_bedwars < 0.75 && api.stats.Bedwars.final_kills_bedwars/api.stats.Bedwars.final_deaths_bedwars < 1.5) return '<li style="color: #FF5555">SNPR</li>';
        else if (temp) return temp.replaceAll('[', '<').replaceAll(']', '>').replaceAll("'", '"');
        else if ((api.achievements.bedwars_level < 15 && api.stats.Bedwars.final_kills_bedwars/api.stats.Bedwars.final_deaths_bedwars > 5) || (api.achievements.bedwars_level > 15 && api.achievements.bedwars_level < 100 && api.achievements.bedwars_level/(api.stats.Bedwars.final_kills_bedwars/api.stats.Bedwars.final_deaths_bedwars) <= 5)) return '<li style="color: #5555FF">ALT</li>';
        else if (api.channel === 'PARTY') return '<li style="color: #FFB900">PRTY</li>';
        else return '<li style="color: #AAAAAA">-</li>';
    }
    catch{return '<li style="color: #AAAAAA">-</li>';}
}

function NWL(exp){
    const base = 10000;
    const growth = 2500;
    const reversePqPrefix = -(base - 0.5 * growth) / growth;
    const reverseConst = reversePqPrefix ** 2;
    return exp < 0 ? 1 : parseFloat(Math.floor(1 + reversePqPrefix + Math.sqrt(reverseConst + (2/growth) * exp)));
}

function swLVL(xp){
    let xps = [0, 20, 70, 150, 250, 500, 1000, 2000, 3500, 6000, 10000, 15000], lvl = 0;
    if(xp >= 15000){
        lvl = parseFloat((xp - 15000) / 10000 + 12).toFixed(0);
    }
    else{
        for (let i = 0; i < xps.length; i++){
            if(xp < xps[i]) {
                lvl = parseFloat(Math.floor(1 + i + (xp - xps[i-1]) / (xps[i] - xps[i-1])));
                break;
            }
        }
    }
    return lvl;
}

module.exports = {
    starColor, nameColor, guildColor, wsColor, fkdrColor, wlrColor, bblrColor, finalsColor, winsColor, getTag, NWL, swLVL
}