const config = require('electron-json-config');

const HypixelColors = {
    "AQUA": "#55FFFF",
    "BLACK": "#000000",
    "BLUE": "#5555FF",
    "DARK_AQUA": "#00AAAA",
    "DARK_BLUE": "#0000AA",
    "DARK_GRAY": "#555555",
    "DARK_GREEN": "#00AA00",
    "DARK_PURPLE": "#AA00AA",
    "DARK_RED": "#AA0000",
    "GOLD": "#FFAA00",
    "GRAY": "#AAAAAA",
    "GREEN": "#55FF55",
    "LIGHT_PURPLE": "#FF55FF",
    "RED": "#FF5555",
    "WHITE": "#FFFFFF",
    "YELLOW": "#FFFF55"
};

function formatStars(level, star, ...colors){
    let span = (color, string) => `<span style="color: ${color}">${string}</span>`;
    let template = ``;
    let levelString = level.toString();

    if (colors.length === levelString.length + 3) {
        let digits = levelString.split('');
        
        template += span(colors[0], "[");
        for (let i = 0; i < digits.length; i++) {
            template += span(colors[i + 1], digits[i]);
        }
        template += span(colors[colors.length - 2], star);
        template += span(colors[colors.length - 1], "]");
    } else {
        template += span(colors.length == 1 ? colors[0] : "#AAAAAA", `[${level}${star}]`);
    }

    return template;
}

function starColor(stars){
    let { AQUA, BLACK, BLUE, DARK_AQUA, DARK_BLUE, DARK_GRAY, DARK_GREEN, DARK_PURPLE, DARK_RED, GOLD, GRAY, GREEN, LIGHT_PURPLE, RED, WHITE, YELLOW } = HypixelColors;
    let gamemode = config.get('settings.gamemode', 0);

    if (gamemode === 0){
        if (stars < 100) return formatStars(stars, '✫', GRAY);
        else if (stars < 200) return formatStars(stars, '✫', WHITE);
        else if (stars < 300) return formatStars(stars, '✫', GOLD);
        else if (stars < 400) return formatStars(stars, '✫', AQUA);
        else if (stars < 500) return formatStars(stars, '✫', DARK_GREEN);
        else if (stars < 600) return formatStars(stars, '✫', DARK_AQUA);
        else if (stars < 700) return formatStars(stars, '✫', DARK_RED);
        else if (stars < 800) return formatStars(stars, '✫', LIGHT_PURPLE);
        else if (stars < 900) return formatStars(stars, '✫', BLUE);
        else if (stars < 1000) return formatStars(stars, '✫', DARK_PURPLE);
        else if (stars < 1100) return formatStars(stars, '✫', RED, GOLD, YELLOW, GREEN, AQUA, LIGHT_PURPLE, DARK_PURPLE);
        else if (stars < 1200) return formatStars(stars, '✪', GRAY, WHITE, WHITE, WHITE, WHITE, GRAY, GRAY);
        else if (stars < 1300) return formatStars(stars, '✪', GRAY, YELLOW, YELLOW, YELLOW, YELLOW, GOLD, GRAY);
        else if (stars < 1400) return formatStars(stars, '✪', GRAY, AQUA, AQUA, AQUA, AQUA, DARK_AQUA, GRAY);
        else if (stars < 1500) return formatStars(stars, '✪', GRAY, GREEN, GREEN, GREEN, GREEN, DARK_GREEN, GRAY);
        else if (stars < 1600) return formatStars(stars, '✪', GRAY, DARK_AQUA, DARK_AQUA, DARK_AQUA, DARK_AQUA, BLUE, GRAY);
        else if (stars < 1700) return formatStars(stars, '✪', GRAY, RED, RED, RED, RED, DARK_RED, GRAY);
        else if (stars < 1800) return formatStars(stars, '✪', GRAY, LIGHT_PURPLE, LIGHT_PURPLE, LIGHT_PURPLE, LIGHT_PURPLE, DARK_PURPLE, GRAY);
        else if (stars < 1900) return formatStars(stars, '✪', GRAY, BLUE, BLUE, BLUE, BLUE, DARK_BLUE, GRAY);
        else if (stars < 2000) return formatStars(stars, '✪', GRAY, DARK_PURPLE, DARK_PURPLE, DARK_PURPLE, DARK_PURPLE, DARK_GRAY, GRAY);
        else if (stars < 2100) return formatStars(stars, '✪', DARK_GRAY, GRAY, WHITE, WHITE, GRAY, GRAY, DARK_GRAY);
        else if (stars < 2200) return formatStars(stars, '⚝', WHITE, WHITE, YELLOW, YELLOW, GOLD, GOLD, GOLD);
        else if (stars < 2300) return formatStars(stars, '⚝', GOLD, GOLD, WHITE, WHITE, AQUA, DARK_AQUA, DARK_AQUA);
        else if (stars < 2400) return formatStars(stars, '⚝', DARK_PURPLE, DARK_PURPLE, LIGHT_PURPLE, LIGHT_PURPLE, GOLD, YELLOW, YELLOW);
        else if (stars < 2500) return formatStars(stars, '⚝', AQUA, AQUA, WHITE, WHITE, GRAY, GRAY, DARK_GRAY);
        else if (stars < 2600) return formatStars(stars, '⚝', WHITE, WHITE, GREEN, GREEN, DARK_GRAY, DARK_GRAY, DARK_GRAY);
        else if (stars < 2700) return formatStars(stars, '⚝', DARK_RED, DARK_RED, RED, RED, LIGHT_PURPLE, LIGHT_PURPLE, DARK_PURPLE);
        else if (stars < 2800) return formatStars(stars, '⚝', YELLOW, YELLOW, WHITE, WHITE, DARK_GRAY, DARK_GRAY, DARK_GRAY);
        else if (stars < 2900) return formatStars(stars, '⚝', GREEN, GREEN, DARK_GREEN, DARK_GREEN, GOLD, GOLD, YELLOW);
        else if (stars < 3000) return formatStars(stars, '⚝', AQUA, AQUA, DARK_AQUA, DARK_AQUA, BLUE, BLUE, DARK_BLUE);
        else if (stars < 3100) return formatStars(stars, '⚝', YELLOW, YELLOW, GOLD, GOLD, RED, RED, DARK_RED);
        else if (stars < 3200) return formatStars(stars, '✥', BLUE, BLUE, AQUA, AQUA, GOLD, GOLD, YELLOW);
        else if (stars < 3300) return formatStars(stars, '✥', RED, DARK_RED, GRAY, GRAY, DARK_RED, RED, RED);
        else if (stars < 3400) return formatStars(stars, '✥', BLUE, BLUE, BLUE, LIGHT_PURPLE, RED, RED, DARK_RED);
        else if (stars < 3500) return formatStars(stars, '✥', DARK_GREEN, GREEN, LIGHT_PURPLE, LIGHT_PURPLE, DARK_PURPLE, DARK_PURPLE, DARK_GREEN);
        else if (stars < 3600) return formatStars(stars, '✥', RED, RED, DARK_RED, DARK_RED, DARK_GREEN, GREEN, GREEN);
        else if (stars < 3700) return formatStars(stars, '✥', GREEN, GREEN, GREEN, AQUA, BLUE, BLUE, DARK_BLUE);
        else if (stars < 3800) return formatStars(stars, '✥', DARK_RED, DARK_RED, RED, RED, AQUA, DARK_AQUA, DARK_AQUA);
        else if (stars < 3900) return formatStars(stars, '✥', DARK_BLUE, DARK_BLUE, BLUE, DARK_PURPLE, DARK_PURPLE, LIGHT_PURPLE, DARK_BLUE);
        else if (stars < 4000) return formatStars(stars, '✥', RED, RED, GREEN, GREEN, AQUA, BLUE, BLUE);
        else if (stars < 4100) return formatStars(stars, '✥', DARK_PURPLE, DARK_PURPLE, RED, RED, GOLD, GOLD, YELLOW);
        else if (stars < 4200) return formatStars(stars, '✥', YELLOW, YELLOW, GOLD, RED, LIGHT_PURPLE, LIGHT_PURPLE, DARK_PURPLE);
        else if (stars < 4300) return formatStars(stars, '✥', DARK_BLUE, BLUE, DARK_AQUA, AQUA, WHITE, GRAY, GRAY);
        else if (stars < 4400) return formatStars(stars, '✥', BLACK, DARK_PURPLE, DARK_GRAY, DARK_GRAY, DARK_PURPLE, DARK_PURPLE, BLACK);
        else if (stars < 4500) return formatStars(stars, '✥', DARK_GREEN, DARK_GREEN, GREEN, YELLOW, GOLD, DARK_PURPLE, LIGHT_PURPLE);
        else if (stars < 4600) return formatStars(stars, '✥', WHITE, WHITE, AQUA, AQUA, DARK_AQUA, DARK_AQUA, DARK_AQUA);
        else if (stars < 4700) return formatStars(stars, '✥', DARK_AQUA, AQUA, YELLOW, YELLOW, GOLD, LIGHT_PURPLE, DARK_PURPLE);
        else if (stars < 4800) return formatStars(stars, '✥', WHITE, DARK_RED, RED, RED, BLUE, DARK_BLUE, BLUE);
        else if (stars < 4900) return formatStars(stars, '✥', DARK_PURPLE, DARK_PURPLE, RED, GOLD, YELLOW, AQUA, DARK_AQUA);
        else if (stars < 5000) return formatStars(stars, '✥', DARK_GREEN, GREEN, WHITE, WHITE, GREEN, GREEN, DARK_GREEN);
        else return formatStars(stars, '✥', DARK_RED, DARK_RED, DARK_PURPLE, BLUE, BLUE, DARK_BLUE, BLACK);
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
        plus = HypixelColors[plus];
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
    try{temp = tagslist.find(o => o.uuid === api.uuid).tag}
    catch{temp = false;}
    try{
        if (api.inParty) return '<li style="color: #03C800">P</li>';
        else if (api.call) return '<li style="color: #00C2A2">CALL</li>';
        else if (api.partyReq) return '<li style="color: #37B836">PREQ</li>';
        else if (api.friendReq) return '<li style="color: #D6D600">FREQ</li>';
        else if (api.guildList) return '<li style="color: #36C700">GLD</li>';
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
    starColor, nameColor, wsColor, fkdrColor, wlrColor, bblrColor, finalsColor, winsColor, getTag, NWL, swLVL, HypixelColors
}
